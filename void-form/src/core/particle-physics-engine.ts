/**
 * High-DPI Canvas 2D Particle Physics Engine
 * Decomposes text into physical sand/dust particles with Immutable Anchor Memory & Hooke's Law Restitution.
 */

export class SandParticle {
  public x: number;
  public y: number;
  public baseX: number;
  public baseY: number;
  public vx = 0;
  public vy = 0;
  public size: number;
  public density: number;
  public friction = 0.88;
  public springFactor = 0.07;
  public color: string;
  public alpha: number;
  public isDissolved = false;
  public noiseOffsetX: number;
  public noiseOffsetY: number;

  constructor(x: number, y: number, color = '#EDE8DE', size = 1.2) {
    this.x = x + (Math.random() - 0.5) * 12;
    this.y = y + (Math.random() - 0.5) * 12;
    this.baseX = x;
    this.baseY = y;
    this.size = size * (0.8 + Math.random() * 0.6);
    this.density = Math.random() * 22 + 8;
    this.color = color;
    this.alpha = 0.6 + Math.random() * 0.4;
    this.noiseOffsetX = Math.random() * 1000;
    this.noiseOffsetY = Math.random() * 1000;
  }

  public update(
    mouseX: number,
    mouseY: number,
    mouseRadius: number,
    mouseVx: number,
    mouseVy: number,
    time: number
  ) {
    if (this.isDissolved) {
      // Dissolved state: Brownian molecular drift with subtle gravity/wind
      this.vx += (Math.sin(time * 2 + this.noiseOffsetX) * 0.3) + mouseVx * 0.05;
      this.vy += (Math.cos(time * 2 + this.noiseOffsetY) * 0.3) - 0.1 + mouseVy * 0.05;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha = Math.max(0.1, this.alpha * 0.995);
      return;
    }

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distSq = dx * dx + dy * dy;
    const radiusSq = mouseRadius * mouseRadius;

    // 1. Proximity Repulsion Force Field
    if (distSq < radiusSq && distSq > 0.001) {
      const dist = Math.sqrt(distSq);
      const force = (mouseRadius - dist) / mouseRadius;
      const nx = dx / dist;
      const ny = dy / dist;

      // Inject cursor velocity force
      this.vx -= nx * force * this.density + mouseVx * 0.15;
      this.vy -= ny * force * this.density + mouseVy * 0.15;
    }

    // 2. Hooke's Law Elastic Spring Restitution toward Anchor Memory
    const springX = this.baseX - this.x;
    const springY = this.baseY - this.y;
    this.vx += springX * this.springFactor;
    this.vy += springY * this.springFactor;

    // 3. Friction Damping
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

export class ParticleTextSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: SandParticle[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private text: string;
  private fontSize: string;
  private fontFamily: string;

  constructor(canvas: HTMLCanvasElement, text = 'VOID/FORM', fontSize = 'clamp(40px, 8vw, 110px)', fontFamily = 'Syne, sans-serif') {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Failed to get 2D canvas context');
    this.ctx = context;
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
  }

  public resize(width: number, height: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.width = width;
    this.height = height;

    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    this.rasterizeText();
  }

  public setText(text: string) {
    this.text = text;
    this.rasterizeText();
  }

  public setDissolved(dissolved: boolean) {
    this.particles.forEach((p) => {
      p.isDissolved = dissolved;
      if (!dissolved) {
        p.alpha = 0.8;
      }
    });
  }

  public rasterizeText() {
    if (!this.width || !this.height) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#EDE8DE';
    this.ctx.font = `800 ${this.fontSize} ${this.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Support multiline text
    const lines = this.text.split('\n');
    const lineHeight = Math.min(this.height * 0.18, 90);
    const startY = this.height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, idx) => {
      this.ctx.fillText(line, this.width / 2, startY + idx * lineHeight);
    });

    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imgData.data;
    this.particles = [];

    // Stride calculation: 4px on desktop, 8px on mobile for performance optimization
    const isMobile = this.width <= 768;
    const stride = Math.floor((isMobile ? 7 : 4) * this.dpr);

    for (let y = 0; y < this.canvas.height; y += stride) {
      for (let x = 0; x < this.canvas.width; x += stride) {
        const index = y * 4 * this.canvas.width + x * 4;
        const alpha = data[index + 3];

        if (alpha > 120) {
          const logicalX = x / this.dpr;
          const logicalY = y / this.dpr;
          const particle = new SandParticle(logicalX, logicalY, '#EDE8DE', isMobile ? 1.8 : 1.4);
          this.particles.push(particle);
        }
      }
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public updateAndDraw(
    mouseX: number,
    mouseY: number,
    mouseRadius: number,
    mouseVx: number,
    mouseVy: number,
    time: number
  ) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.update(mouseX, mouseY, mouseRadius, mouseVx, mouseVy, time);
      p.draw(this.ctx);
    }
  }

  public getParticleCount(): number {
    return this.particles.length;
  }
}
