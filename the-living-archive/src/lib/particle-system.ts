'use client';

export interface ParticleState {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  density: number;
  alpha: number;
  targetAlpha: number;
  color: string;
}

export type ParticleMorphShape = 'ARCHIVE' | 'MEMORY' | 'MATRIX' | 'CIRCLE' | 'DISPERSED';

export class ArchiveParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ParticleState[] = [];
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private mouse = { x: -1000, y: -1000, vx: 0, vy: 0, radius: 120, prevX: -1000, prevY: -1000 };
  private scrollVelocity: number = 0;
  private isRunning: boolean = false;
  private rafId: number = 0;
  private currentShape: ParticleMorphShape = 'ARCHIVE';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not obtain 2D rendering context');
    this.ctx = context;

    this.resize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private onResize = () => {
    this.resize();
    this.morphTo(this.currentShape);
  };

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    if (this.mouse.prevX !== -1000) {
      this.mouse.vx = (newX - this.mouse.prevX) * 0.4;
      this.mouse.vy = (newY - this.mouse.prevY) * 0.4;
    }

    this.mouse.x = newX;
    this.mouse.y = newY;
    this.mouse.prevX = newX;
    this.mouse.prevY = newY;
  };

  public resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  public morphTo(shape: ParticleMorphShape) {
    this.currentShape = shape;
    const points: { x: number; y: number; color?: string }[] = [];

    // Offscreen rendering to sample pixel anchors
    const offscreen = document.createElement('canvas');
    offscreen.width = this.width;
    offscreen.height = this.height;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    if (shape === 'ARCHIVE' || shape === 'MEMORY') {
      offCtx.fillStyle = '#e5e9ec';
      const fontSize = Math.min(this.width * 0.12, 140);
      offCtx.font = `900 ${fontSize}px var(--font-geist-sans), "Inter", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.letterSpacing = '-0.04em';
      offCtx.fillText(shape, this.width / 2, this.height / 2);

      const imgData = offCtx.getImageData(0, 0, this.width, this.height);
      const data = imgData.data;
      const stride = this.width <= 768 ? 8 : 5;

      for (let y = 0; y < this.height; y += stride) {
        for (let x = 0; x < this.width; x += stride) {
          const index = (y * 4 * this.width) + (x * 4);
          if (data[index + 3] > 120) {
            points.push({ x, y, color: '#e5e9ec' });
          }
        }
      }
    } else if (shape === 'CIRCLE') {
      const radius = Math.min(this.width, this.height) * 0.28;
      const count = 900;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const r = radius * Math.sqrt(Math.random());
        points.push({
          x: this.width / 2 + Math.cos(angle) * r,
          y: this.height / 2 + Math.sin(angle) * r,
          color: '#c86432',
        });
      }
    } else if (shape === 'MATRIX') {
      const cols = 40;
      const rows = 25;
      const stepX = this.width / cols;
      const stepY = this.height / rows;
      for (let c = 1; c < cols; c++) {
        for (let r = 1; r < rows; r++) {
          points.push({
            x: c * stepX,
            y: r * stepY,
            color: '#787d85',
          });
        }
      }
    } else {
      // Dispersed random constellation
      const count = 800;
      for (let i = 0; i < count; i++) {
        points.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          color: Math.random() > 0.85 ? '#c86432' : '#787d85',
        });
      }
    }

    // Match existing particles to new target anchor points
    const targetCount = points.length;
    while (this.particles.length < targetCount) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        baseX: this.width / 2,
        baseY: this.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 1.5 + 1.0,
        density: Math.random() * 20 + 8,
        alpha: 0,
        targetAlpha: Math.random() * 0.4 + 0.5,
        color: '#e5e9ec',
      });
    }

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (i < targetCount) {
        p.baseX = points[i].x;
        p.baseY = points[i].y;
        p.color = points[i].color || '#e5e9ec';
        p.targetAlpha = Math.random() * 0.4 + 0.5;
      } else {
        p.targetAlpha = 0; // Fade out excess
      }
    }
  }

  public triggerExplosion(forceMultiplier: number = 2.5) {
    for (const p of this.particles) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 20 + 10) * forceMultiplier;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
    }
  }

  public updateScrollVelocity(vel: number) {
    this.scrollVelocity = vel;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.morphTo('ARCHIVE');
    this.render();
  }

  public stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
  }

  private render = () => {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Decay mouse velocity
    this.mouse.vx *= 0.85;
    this.mouse.vy *= 0.85;

    const radiusSq = this.mouse.radius * this.mouse.radius;
    const scrollEffect = Math.min(Math.abs(this.scrollVelocity) * 0.05, 3);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Alpha transition
      p.alpha += (p.targetAlpha - p.alpha) * 0.08;
      if (p.alpha < 0.01) continue;

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distSq = dx * dx + dy * dy;

      // Cursor Repulsion Force Field
      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const nx = dx / dist;
        const ny = dy / dist;

        // Push away with cursor velocity momentum
        p.vx -= (nx * force * p.density) + (this.mouse.vx * 0.3);
        p.vy -= (ny * force * p.density) + (this.mouse.vy * 0.3);
      }

      // Scroll wave displacement
      if (scrollEffect > 0.1) {
        p.vy += (Math.sin(p.x * 0.01 + performance.now() * 0.003) * scrollEffect) * 0.2;
      }

      // Hooke's Law spring-back to Immutable Base Memory Anchor
      const springX = p.baseX - p.x;
      const springY = p.baseY - p.y;
      p.vx += springX * 0.06;
      p.vy += springY * 0.06;

      // Friction damping
      p.vx *= 0.88;
      p.vy *= 0.88;

      p.x += p.vx;
      p.y += p.vy;

      // Draw particle
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1.0;
    this.rafId = requestAnimationFrame(this.render);
  };

  public dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
  }
}
