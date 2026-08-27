/**
 * Offscreen Canvas 2D Text Particle Decomposition Engine with Hooke's Law Spring Returns
 */
interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export class SandDustEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: -1000, y: -1000, radius: 90 };
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.resize();
    this.initParticles();
    this.setupEvents();
  }

  public resize() {
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.initParticles();
  }

  private initParticles() {
    this.particles = [];
    if (this.width <= 0 || this.height <= 0) return;

    // Create offscreen canvas for crisp rasterization
    const offscreen = document.createElement('canvas');
    offscreen.width = this.width;
    offscreen.height = this.height;
    const offCtx = offscreen.getContext('2d')!;

    offCtx.fillStyle = '#FFFFFF';
    const fontSize = Math.min(this.width * 0.12, 72);
    offCtx.font = `800 ${fontSize}px "Cinzel", Georgia, serif`;
    offCtx.textBaseline = 'middle';
    offCtx.fillText('CHRONOMETRY', 0, this.height * 0.45);

    const imgData = offCtx.getImageData(0, 0, this.width, this.height);
    const data = imgData.data;
    const step = 4; // Particle grid density

    const goldShades = ['#D4AF37', '#FF4800', '#F4F2EB', '#E5E9EC'];

    for (let y = 0; y < this.height; y += step) {
      for (let x = 0; x < this.width; x += step) {
        const idx = (y * 4 * this.width) + (x * 4);
        const alpha = data[idx + 3];

        if (alpha > 128) {
          const color = goldShades[Math.floor(Math.random() * goldShades.length)];
          this.particles.push({
            x: x + (Math.random() - 0.5) * 2,
            y: y + (Math.random() - 0.5) * 2,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.6 + 0.8,
            color: color,
            alpha: Math.random() * 0.4 + 0.6
          });
        }
      }
    }
  }

  private setupEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  public update() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const springStiffness = 0.08;
    const damping = 0.88;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Proximity to cursor
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * 14;
        p.vy -= Math.sin(angle) * force * 14;
      }

      // Hooke's Law spring-back to immutable anchor
      const springX = (p.baseX - p.x) * springStiffness;
      const springY = (p.baseY - p.y) * springStiffness;

      p.vx = (p.vx + springX) * damping;
      p.vy = (p.vy + springY) * damping;

      p.x += p.vx;
      p.y += p.vy;

      // Render Particle
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
  }
}
