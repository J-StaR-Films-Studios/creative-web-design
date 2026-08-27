import { configureHighDPICanvas, HighDPIContext } from '../utils/HighDPICanvas';
import { SimplexNoise2D } from '../utils/PerlinNoise';

export interface ParticleTarget {
  x: number;
  y: number;
  color: string;
}

export class SandParticle {
  // Current coordinates & velocity
  public x: number;
  public y: number;
  public vx = 0;
  public vy = 0;

  // Target anchors
  public targetX: number;
  public targetY: number;

  // Immutable anchor memory
  public baseX: number;
  public baseY: number;

  // Visuals
  public size: number;
  public color: string;
  public alpha: number;

  // Physical parameters
  public density: number;
  public friction: number;
  public springFactor: number;
  public jitter: number;

  constructor(x: number, y: number, color = '#EDE8DE', size = 1.6) {
    this.x = x + (Math.random() - 0.5) * 30;
    this.y = y + (Math.random() - 0.5) * 30;
    this.baseX = x;
    this.baseY = y;
    this.targetX = x;
    this.targetY = y;

    this.size = size;
    this.color = color;
    this.alpha = 0.85 + Math.random() * 0.15;

    this.density = Math.random() * 18 + 8;
    this.friction = 0.88 + Math.random() * 0.05;
    this.springFactor = 0.06 + Math.random() * 0.04;
    this.jitter = Math.random() * 0.4;
  }

  public update(
    mouse: { x: number; y: number; radius: number; isOver: boolean },
    mode: 'TITLE' | 'CASCADE' | 'SUSPENDED' | 'CODEX',
    time: number,
    noise: SimplexNoise2D
  ): void {
    // 1. Cursor Repulsion Force Field (Active in TITLE and CODEX modes)
    if (mouse.isOver && (mode === 'CODEX' || mode === 'TITLE')) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx * dx + dy * dy;
      const radiusSq = mouse.radius * mouse.radius;

      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (mouse.radius - dist) / mouse.radius;
        const nx = dx / dist;
        const ny = dy / dist;

        this.vx -= nx * force * this.density * 1.5;
        this.vy -= ny * force * this.density * 1.5;
      }
    }

    // 2. Behavioral modes
    if (mode === 'CASCADE') {
      // Downward gravity cascade with subterranean noise turbulence
      const turb = noise.noise(this.x * 0.006, this.y * 0.006 + time * 0.5);
      this.vy += 0.45; // Downward gravity acceleration
      this.vx += turb * 0.6; // Wind turbulence
      this.friction = 0.94;
    } else if (mode === 'SUSPENDED') {
      // Ambient zero-gravity dust drift
      const angle = noise.noise(this.x * 0.003, this.y * 0.003 + time * 0.2) * Math.PI * 2;
      this.vx += Math.cos(angle) * 0.15;
      this.vy += Math.sin(angle) * 0.15;
      this.friction = 0.92;
    } else {
      // Hooke's Law Spring Restitution to target anchor
      const springDx = this.targetX - this.x;
      const springDy = this.targetY - this.y;

      this.vx += springDx * this.springFactor;
      this.vy += springDy * this.springFactor;
      this.friction = 0.88;
    }

    // 3. Velocity Integration & Damping
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class SandParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctxContext: HighDPIContext;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private particles: SandParticle[] = [];
  private noise: SimplexNoise2D;

  private width = 0;
  private height = 0;
  private time = 0;

  private titleTargets: ParticleTarget[] = [];
  private codexTargets: ParticleTarget[] = [];

  private currentMode: 'TITLE' | 'CASCADE' | 'SUSPENDED' | 'CODEX' = 'TITLE';
  private mouse = { x: -1000, y: -1000, radius: 140, isOver: false };

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'sand-particle-canvas';
    container.appendChild(this.canvas);

    this.offscreenCanvas = document.createElement('canvas');
    const offCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) throw new Error('Cannot acquire offscreen 2D context');
    this.offscreenCtx = offCtx;

    this.noise = new SimplexNoise2D(77);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ctxContext = configureHighDPICanvas(this.canvas, this.width, this.height);

    this.bindEvents();
    this.rasterizeAllTypography();
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
    this.rasterizeAllTypography();
  };

  private onMouseMove = (e: MouseEvent): void => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.isOver = true;
  };

  private onMouseLeave = (): void => {
    this.mouse.isOver = false;
  };

  /**
   * Rasterizes text buffers offscreen and extracts anchored pixel grids
   */
  public rasterizeAllTypography(): void {
    const w = this.width;
    const h = this.height;
    const isMobile = w <= 768;
    const step = isMobile ? 6 : 4; // Mobile stride optimization

    this.offscreenCanvas.width = w;
    this.offscreenCanvas.height = h;

    // 1. Sample Shot 2 Title: "STRATIGRAPHIC BREAKDOWN"
    this.titleTargets = this.sampleTextToTargets(
      [
        { text: 'STRATIGRAPHIC', font: `800 ${isMobile ? '38px' : '72px'} 'Playfair Display', serif`, color: '#EDE8DE', yOffset: -36 },
        { text: 'BREAKDOWN // Z-AXIS', font: `800 ${isMobile ? '34px' : '64px'} 'Playfair Display', serif`, color: '#C86432', yOffset: 40 },
        { text: 'CRUST // KARST // BASALT // ARCHAIC CODEX', font: `600 ${isMobile ? '11px' : '14px'} 'Space Grotesk', monospace`, color: '#EDE8DE', yOffset: 100 }
      ],
      step
    );

    // 2. Sample Shot 4 Codex: "WHAT LIES BENEATH SURVIVES ALL ERAS"
    this.codexTargets = this.sampleTextToTargets(
      [
        { text: 'WHAT LIES BENEATH', font: `900 ${isMobile ? '36px' : '76px'} 'Playfair Display', serif`, color: '#EDE8DE', yOffset: -50 },
        { text: 'SURVIVES ALL ERAS', font: `900 ${isMobile ? '36px' : '76px'} 'Playfair Display', serif`, color: '#C86432', yOffset: 34 },
        { text: '— SUBTERRANEAN CARTOGRAPHIC ARCHIVE // RECONSTRUCTED —', font: `600 ${isMobile ? '10px' : '13px'} 'Space Grotesk', monospace`, color: '#EDE8DE', yOffset: 105 }
      ],
      step
    );

    // Initialize or adjust particle capacity to match max target count
    const maxCount = Math.max(this.titleTargets.length, this.codexTargets.length);
    while (this.particles.length < maxCount) {
      this.particles.push(
        new SandParticle(
          Math.random() * w,
          Math.random() * h,
          '#EDE8DE',
          isMobile ? 1.8 : 1.4
        )
      );
    }

    // Assign initial title targets
    this.assignTargets(this.titleTargets);
  }

  private sampleTextToTargets(
    lines: { text: string; font: string; color: string; yOffset: number }[],
    step: number
  ): ParticleTarget[] {
    const w = this.width;
    const h = this.height;
    const ctx = this.offscreenCtx;

    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    lines.forEach((line) => {
      ctx.font = line.font;
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, w / 2, h / 2 + line.yOffset);
    });

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const targets: ParticleTarget[] = [];

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * 4 * w) + (x * 4);
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a > 140) {
          // Photometric luminance check
          const lum = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) / 100;
          if (lum > 0.3) {
            targets.push({
              x,
              y,
              color: r > 180 && g < 140 ? '#C86432' : '#EDE8DE'
            });
          }
        }
      }
    }

    return targets;
  }

  private assignTargets(targets: ParticleTarget[]): void {
    const w = this.width;
    const h = this.height;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (i < targets.length) {
        p.targetX = targets[i].x;
        p.targetY = targets[i].y;
        p.baseX = targets[i].x;
        p.baseY = targets[i].y;
        p.color = targets[i].color;
      } else {
        // Extra particles disperse into ambient perimeter dust
        p.targetX = (Math.random() * 0.4 + (i % 2 === 0 ? 0.05 : 0.55)) * w;
        p.targetY = (Math.random() * 0.3 + 0.65) * h;
        p.color = '#8C8275';
      }
    }
  }

  /**
   * Updates particle simulation driven by global scroll progress
   * Shot 1: 0.0 - 0.25 (Subtle rest)
   * Shot 2: 0.25 - 0.55 (Stratigraphic title -> Cascade downward)
   * Shot 3: 0.55 - 0.85 (Suspended drift across specimen gallery)
   * Shot 4: 0.85 - 1.00 (Codex reconstruction)
   */
  public update(globalScrollProgress: number): void {
    this.time += 0.012;

    if (globalScrollProgress < 0.25) {
      // Resting on Shot 1/2 Title
      if (this.currentMode !== 'TITLE') {
        this.currentMode = 'TITLE';
        this.assignTargets(this.titleTargets);
      }
    } else if (globalScrollProgress >= 0.25 && globalScrollProgress < 0.52) {
      // Cascading down into the subterranean strata
      this.currentMode = 'CASCADE';
    } else if (globalScrollProgress >= 0.52 && globalScrollProgress < 0.82) {
      // Suspended dust motes in archaeological specimen hall
      this.currentMode = 'SUSPENDED';
    } else {
      // Re-converging into the Codex statement
      if (this.currentMode !== 'CODEX') {
        this.currentMode = 'CODEX';
        this.assignTargets(this.codexTargets);
      }
    }

    this.render();
  }

  private render(): void {
    const { ctx } = this.ctxContext;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.update(this.mouse, this.currentMode, this.time, this.noise);
      p.draw(ctx);
    }
  }

  public destroy(): void {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
  }
}
