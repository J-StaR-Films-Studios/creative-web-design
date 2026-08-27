import { configureHighDPICanvas, HighDPIContext } from '../utils/HighDPICanvas';
import { SimplexNoise2D } from '../utils/PerlinNoise';
import { distanceSq } from '../utils/MathUtils';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  intensity: number;
  decay: number;
}

export class ContourCanvas {
  private canvas: HTMLCanvasElement;
  private ctxContext: HighDPIContext;
  private noise: SimplexNoise2D;
  private animId: number | null = null;
  private width = 0;
  private height = 0;
  private time = 0;

  // Interactive mouse state
  private mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, isOver: false };
  private ripples: Ripple[] = [];
  private lastRippleTime = 0;

  // Visual parameters
  private readonly numLevels = 18;
  private readonly gridStep = 12; // High fidelity sampling resolution
  private readonly noiseScale = 0.0028;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'contour-canvas';
    container.appendChild(this.canvas);

    this.noise = new SimplexNoise2D(108);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ctxContext = configureHighDPICanvas(this.canvas, this.width, this.height);

    this.bindEvents();
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseleave', this.onMouseLeave);
  }

  private onResize = (): void => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ctxContext = configureHighDPICanvas(this.canvas, this.width, this.height);
  };

  private onMouseMove = (e: MouseEvent): void => {
    this.mouse.targetX = e.clientX;
    this.mouse.targetY = e.clientY;
    this.mouse.isOver = true;

    // Trigger ripple pulse on movement with throttled cadence
    const now = performance.now();
    if (now - this.lastRippleTime > 80) {
      this.lastRippleTime = now;
      if (this.ripples.length < 12) {
        this.ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 10,
          maxRadius: 280,
          intensity: 1.0,
          decay: 0.02
        });
      }
    }
  };

  private onMouseLeave = (): void => {
    this.mouse.isOver = false;
  };

  public update(scrollProgress = 0): void {
    this.time += 0.006;

    // Smooth cursor interpolation
    if (this.mouse.isOver) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.12;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.12;
    }

    // Update active ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 3.8;
      r.intensity -= r.decay;
      if (r.intensity <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }

    this.render(scrollProgress);
  }

  private sampleElevation(x: number, y: number, time: number): number {
    // Multi-octave base elevation field
    let elevation = this.noise.fbm(x * this.noiseScale, y * this.noiseScale + time * 0.25, 4, 0.52, 2.1);

    // Cursor elevation displacement ripple
    if (this.mouse.isOver) {
      const dSq = distanceSq(x, y, this.mouse.x, this.mouse.y);
      const cursorRadius = 240;
      if (dSq < cursorRadius * cursorRadius) {
        const d = Math.sqrt(dSq);
        const wave = Math.sin(d * 0.08 - time * 6.0);
        const falloff = 1.0 - (d / cursorRadius);
        elevation += wave * falloff * 0.35;
      }
    }

    // Ripple wave disturbances
    for (let i = 0; i < this.ripples.length; i++) {
      const r = this.ripples[i];
      const d = Math.sqrt(distanceSq(x, y, r.x, r.y));
      const diff = Math.abs(d - r.radius);
      if (diff < 40) {
        const ring = Math.cos((diff / 40) * (Math.PI / 2));
        elevation += ring * r.intensity * 0.22;
      }
    }

    return elevation;
  }

  private render(scrollProgress: number): void {
    const { ctx } = this.ctxContext;
    const w = this.width;
    const h = this.height;

    // Clear with Raw Subterranean Umber
    ctx.fillStyle = '#141312';
    ctx.fillRect(0, 0, w, h);

    // Fade out canvas opacity as scroll travels beyond Shot 1 (0 to 0.3)
    const opacity = Math.max(0, 1 - scrollProgress * 2.8);
    if (opacity <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = opacity;

    // Draw background subtle cartographic coordinate grid
    this.drawCartographicGrid(ctx, w, h);

    // Generate elevation contours using scanlines & iso-sampling
    const cols = Math.ceil(w / this.gridStep) + 1;
    const rows = Math.ceil(h / this.gridStep) + 1;

    // 2D elevation buffer
    const elevations: number[][] = [];
    for (let r = 0; r < rows; r++) {
      elevations[r] = [];
      const y = r * this.gridStep;
      for (let c = 0; c < cols; c++) {
        const x = c * this.gridStep;
        elevations[r][c] = this.sampleElevation(x, y, this.time);
      }
    }

    // Render contour isolines across the discrete depth thresholds
    for (let level = 0; level < this.numLevels; level++) {
      const targetVal = -0.8 + (level / (this.numLevels - 1)) * 1.6;
      const isOchreAccent = level % 4 === 0;

      ctx.beginPath();
      ctx.strokeStyle = isOchreAccent
        ? 'rgba(200, 100, 50, 0.65)' // Terracotta Ochre major contour
        : 'rgba(237, 232, 222, 0.18)'; // Chalk Bone minor contour
      ctx.lineWidth = isOchreAccent ? 1.4 : 0.8;

      // Marching squares segment interpolation
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const x = c * this.gridStep;
          const y = r * this.gridStep;
          const v0 = elevations[r][c];
          const v1 = elevations[r][c + 1];
          const v2 = elevations[r + 1][c + 1];
          const v3 = elevations[r + 1][c];

          this.drawContourCell(ctx, x, y, this.gridStep, v0, v1, v2, v3, targetVal);
        }
      }
      ctx.stroke();
    }

    // Render LIDAR laser scan beam
    this.drawLidarScanBeam(ctx, w, h, this.time);

    // Render Elevation depth markings & crosshair annotations
    this.drawTelemetryAnnotations(ctx);

    ctx.restore();
  }

  private drawContourCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    step: number,
    v0: number,
    v1: number,
    v2: number,
    v3: number,
    t: number
  ): void {
    const getInterp = (va: number, vb: number, pa: number, pb: number) => {
      if (Math.abs(vb - va) < 0.00001) return (pa + pb) / 2;
      return pa + ((t - va) / (vb - va)) * (pb - pa);
    };

    let cellCase = 0;
    if (v0 >= t) cellCase |= 1;
    if (v1 >= t) cellCase |= 2;
    if (v2 >= t) cellCase |= 4;
    if (v3 >= t) cellCase |= 8;

    const topX = getInterp(v0, v1, x, x + step);
    const topY = y;
    const rightX = x + step;
    const rightY = getInterp(v1, v2, y, y + step);
    const botX = getInterp(v3, v2, x, x + step);
    const botY = y + step;
    const leftX = x;
    const leftY = getInterp(v0, v3, y, y + step);

    switch (cellCase) {
      case 1:
      case 14:
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(topX, topY);
        break;
      case 2:
      case 13:
        ctx.moveTo(topX, topY);
        ctx.lineTo(rightX, rightY);
        break;
      case 3:
      case 12:
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        break;
      case 4:
      case 11:
        ctx.moveTo(rightX, rightY);
        ctx.lineTo(botX, botY);
        break;
      case 5:
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(topX, topY);
        ctx.moveTo(rightX, rightY);
        ctx.lineTo(botX, botY);
        break;
      case 6:
      case 9:
        ctx.moveTo(topX, topY);
        ctx.lineTo(botX, botY);
        break;
      case 7:
      case 8:
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(botX, botY);
        break;
      case 10:
        ctx.moveTo(topX, topY);
        ctx.lineTo(rightX, rightY);
        ctx.moveTo(botX, botY);
        ctx.lineTo(leftX, leftY);
        break;
    }
  }

  private drawCartographicGrid(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.strokeStyle = 'rgba(237, 232, 222, 0.05)';
    ctx.lineWidth = 0.6;

    const spacing = 120;
    for (let x = spacing; x < w; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();

      // Coordinate tick
      ctx.fillStyle = 'rgba(237, 232, 222, 0.25)';
      ctx.font = '9px "Space Grotesk", monospace';
      ctx.fillText(`${(x * 0.12).toFixed(1)}°E`, x + 4, 18);
    }

    for (let y = spacing; y < h; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(237, 232, 222, 0.25)';
      ctx.font = '9px "Space Grotesk", monospace';
      ctx.fillText(`${(y * 0.08).toFixed(1)}°N`, 12, y - 4);
    }
  }

  private drawLidarScanBeam(ctx: CanvasRenderingContext2D, w: number, h: number, time: number): void {
    const beamY = ((time * 70) % (h + 200)) - 100;
    const gradient = ctx.createLinearGradient(0, beamY - 40, 0, beamY + 40);
    gradient.addColorStop(0, 'rgba(200, 100, 50, 0)');
    gradient.addColorStop(0.5, 'rgba(200, 100, 50, 0.12)');
    gradient.addColorStop(0.51, 'rgba(200, 100, 50, 0.45)');
    gradient.addColorStop(1, 'rgba(200, 100, 50, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, beamY - 40, w, 80);
  }

  private drawTelemetryAnnotations(ctx: CanvasRenderingContext2D): void {
    if (this.mouse.isOver) {
      const mx = this.mouse.x;
      const my = this.mouse.y;

      // Reticle circle
      ctx.strokeStyle = 'rgba(200, 100, 50, 0.7)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(mx, my, 32, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(mx - 44, my);
      ctx.lineTo(mx - 36, my);
      ctx.moveTo(mx + 36, my);
      ctx.lineTo(mx + 44, my);
      ctx.moveTo(mx, my - 44);
      ctx.lineTo(mx, my - 36);
      ctx.moveTo(mx, my + 36);
      ctx.lineTo(mx, my + 44);
      ctx.stroke();

      // Telemetry tag
      const elev = (this.noise.noise(mx * 0.005, my * 0.005) * 850 - 240).toFixed(1);
      ctx.fillStyle = '#EDE8DE';
      ctx.font = '10px "Space Grotesk", monospace';
      ctx.fillText(`LOC: [${mx.toFixed(0)}, ${my.toFixed(0)}]`, mx + 42, my - 12);
      ctx.fillStyle = '#C86432';
      ctx.fillText(`ELEV: ${elev}m // LIDAR ACTIVE`, mx + 42, my + 4);
    }
  }

  public destroy(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
  }
}
