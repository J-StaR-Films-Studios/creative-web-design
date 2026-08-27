import { configureHighDPICanvas, HighDPIContext } from '../utils/HighDPICanvas';

export class SpecimenLoupe {
  private canvas: HTMLCanvasElement;
  private ctxContext: HighDPIContext;
  private loupeRadius = 90;
  private zoom = 2.4;
  private activeSourceCanvas: HTMLCanvasElement | null = null;
  private isHovered = false;
  private mouse = { x: -1000, y: -1000, localX: 0, localY: 0 };

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'specimen-loupe-canvas';
    container.appendChild(this.canvas);

    const size = this.loupeRadius * 2 + 40;
    this.ctxContext = configureHighDPICanvas(this.canvas, size, size);
    this.hide();
  }

  public setSource(sourceCanvas: HTMLCanvasElement | null): void {
    this.activeSourceCanvas = sourceCanvas;
  }

  public updatePosition(clientX: number, clientY: number, localX: number, localY: number): void {
    this.mouse.x = clientX;
    this.mouse.y = clientY;
    this.mouse.localX = localX;
    this.mouse.localY = localY;

    this.canvas.style.transform = `translate3d(${clientX - this.loupeRadius - 20}px, ${clientY - this.loupeRadius - 20}px, 0)`;
  }

  public show(): void {
    this.isHovered = true;
    this.canvas.style.opacity = '1';
    this.canvas.style.pointerEvents = 'none';
  }

  public hide(): void {
    this.isHovered = false;
    this.canvas.style.opacity = '0';
  }

  public render(): void {
    if (!this.isHovered || !this.activeSourceCanvas) return;

    const { ctx } = this.ctxContext;
    const size = this.loupeRadius * 2 + 40;
    const center = size / 2;
    const r = this.loupeRadius;

    ctx.clearRect(0, 0, size, size);

    // 1. Clip circular lens aperture
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.clip();

    // Fill dark background
    ctx.fillStyle = '#141312';
    ctx.fillRect(0, 0, size, size);

    // 2. Render Chromatic Aberration Magnification
    const src = this.activeSourceCanvas;
    const srcX = this.mouse.localX;
    const srcY = this.mouse.localY;
    const sampleW = (r * 2) / this.zoom;
    const sampleH = (r * 2) / this.zoom;

    // Draw magnified image with RGB channel shift simulation
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // Red Channel Shift
    ctx.drawImage(
      src,
      srcX - sampleW / 2 - 4,
      srcY - sampleH / 2,
      sampleW,
      sampleH,
      center - r,
      center - r,
      r * 2,
      r * 2
    );

    // Cyan / Blue Channel Shift overlay
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(
      src,
      srcX - sampleW / 2 + 4,
      srcY - sampleH / 2 + 2,
      sampleW,
      sampleH,
      center - r,
      center - r,
      r * 2,
      r * 2
    );

    ctx.restore();

    // 3. Scanline grid inside lens
    ctx.strokeStyle = 'rgba(200, 100, 50, 0.15)';
    ctx.lineWidth = 1;
    for (let y = 0; y < size; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    // 4. Lens optical reflection sheen
    const grad = ctx.createLinearGradient(center - r, center - r, center + r, center + r);
    grad.addColorStop(0, 'rgba(237, 232, 222, 0.15)');
    grad.addColorStop(0.4, 'rgba(237, 232, 222, 0.02)');
    grad.addColorStop(1, 'rgba(200, 100, 50, 0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // 5. Reticle Crosshairs & Focal Rings
    ctx.strokeStyle = 'rgba(200, 100, 50, 0.85)';
    ctx.lineWidth = 1.2;

    // Concentric reticle rings
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(237, 232, 222, 0.4)';
    ctx.beginPath();
    ctx.arc(center, center, 48, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair ticks
    ctx.beginPath();
    ctx.moveTo(center - 16, center);
    ctx.lineTo(center - 4, center);
    ctx.moveTo(center + 4, center);
    ctx.lineTo(center + 16, center);
    ctx.moveTo(center, center - 16);
    ctx.lineTo(center, center - 4);
    ctx.moveTo(center, center + 4);
    ctx.lineTo(center, center + 16);
    ctx.stroke();

    ctx.restore(); // Restore unclipped state

    // 6. Brass Loupe Outer Rim & Calibration Ring
    ctx.strokeStyle = '#C86432';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(237, 232, 222, 0.3)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(center, center, r + 4, 0, Math.PI * 2);
    ctx.stroke();

    // HUD Telemetry tag on lens
    ctx.fillStyle = '#EDE8DE';
    ctx.font = '9px "Space Grotesk", monospace';
    ctx.fillText('LOUPE 2.4X // CHROMATIC', center - 52, center + r + 16);
  }
}
