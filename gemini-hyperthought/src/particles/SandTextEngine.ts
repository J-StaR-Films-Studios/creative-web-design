/**
 * Sand / Dust Typography Particle Physics Engine
 * Canvas 2D High-DPI raster extraction, ITU-R BT.601 photometric luminance mapping,
 * Hooke's Law elastic anchor memory, cursor force repulsion, and O(N^2/2) constellation lines.
 */

import { soundEngine } from '../audio/Synthesizer';

export interface TextParticleConfig {
  x: number;
  y: number;
  color: string;
  size: number;
  luminance: number;
}

export class SandParticle {
  public x: number;
  public y: number;
  public baseX: number;
  public baseY: number;
  public vx: number = 0;
  public vy: number = 0;
  public size: number;
  public color: string;
  public luminance: number;
  public density: number;
  public friction: number = 0.91;
  public springFactor: number = 0.075;
  public life: number = 1.0;

  constructor(cfg: TextParticleConfig) {
    this.x = cfg.x + (Math.random() - 0.5) * 30;
    this.y = cfg.y + (Math.random() - 0.5) * 30;
    this.baseX = cfg.x;
    this.baseY = cfg.y;
    this.size = cfg.size;
    this.color = cfg.color;
    this.luminance = cfg.luminance;
    this.density = Math.random() * 22 + 8;
  }

  public setAnchor(newX: number, newY: number, newColor?: string): void {
    this.baseX = newX;
    this.baseY = newY;
    if (newColor) this.color = newColor;
  }

  public update(mouse: { x: number; y: number; radius: number; isDown: boolean }): boolean {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distSq = dx * dx + dy * dy;
    const radius = mouse.isDown ? mouse.radius * 1.6 : mouse.radius;
    const radiusSq = radius * radius;
    let didScatter = false;

    // 1. Cursor Repulsion Force Field
    if (distSq < radiusSq && distSq > 0) {
      const dist = Math.sqrt(distSq);
      const force = (radius - dist) / radius;
      const normalX = dx / dist;
      const normalY = dy / dist;

      const power = mouse.isDown ? this.density * 1.8 : this.density;
      this.vx -= normalX * force * power;
      this.vy -= normalY * force * power;
      didScatter = true;
    }

    // 2. Elastic Spring-Back Return to Anchor Memory (Hooke's Law)
    const springDx = this.baseX - this.x;
    const springDy = this.baseY - this.y;

    this.vx += springDx * this.springFactor;
    this.vy += springDy * this.springFactor;

    // 3. Friction & Integration
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    return didScatter;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class SandTextEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private particles: SandParticle[] = [];
  private currentPhraseIndex: number = 0;
  private phrases: string[] = [
    'GEMINI 3.7',
    'HIGH REASONING',
    'THOUGHT SYNTHESIS',
    'RECURSIVE LATENT',
  ];
  private mouse = {
    x: -1000,
    y: -1000,
    radius: 120,
    isDown: false,
  };
  private rafId: number | null = null;
  private enableConstellations: boolean = true;
  private scatterCountThisFrame: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to obtain 2D canvas context');
    this.ctx = context;

    this.initEvents();
    this.resize();
  }

  private initEvents(): void {
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mousedown', () => {
      this.mouse.isDown = true;
      soundEngine.playUiBlip(720);
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isDown = false;
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.touches[0].clientX - rect.left;
        this.mouse.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  public resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    this.ctx.scale(this.dpr, this.dpr);

    this.generateParticlesFromText(this.phrases[this.currentPhraseIndex]);
    if (!this.rafId) {
      this.animate();
    }
  }

  public nextPhrase(): string {
    this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
    const phrase = this.phrases[this.currentPhraseIndex];
    this.morphToText(phrase);
    soundEngine.playUiBlip(880 + this.currentPhraseIndex * 110);
    return phrase;
  }

  public setPhrase(index: number): void {
    if (index >= 0 && index < this.phrases.length) {
      this.currentPhraseIndex = index;
      this.morphToText(this.phrases[this.currentPhraseIndex]);
    }
  }

  public getCurrentPhrase(): string {
    return this.phrases[this.currentPhraseIndex];
  }

  private extractTextAnchors(text: string): TextParticleConfig[] {
    // Render text to offscreen buffer
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return [];

    offscreen.width = this.canvas.width;
    offscreen.height = this.canvas.height;
    offCtx.scale(this.dpr, this.dpr);

    offCtx.clearRect(0, 0, this.width, this.height);
    offCtx.fillStyle = '#ffffff';

    // Responsive font scaling
    const fontSize = Math.min(Math.max(this.width * 0.085, 36), 110);
    offCtx.font = `900 ${fontSize}px "Space Grotesk", "JetBrains Mono", system-ui, sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.letterSpacing = '0.08em';

    offCtx.fillText(text, this.width / 2, this.height / 2);

    // Extract raw Uint8ClampedArray
    const imgData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    const data = imgData.data;
    const configs: TextParticleConfig[] = [];

    const isMobile = this.width <= 768;
    const step = isMobile ? Math.floor(6 * this.dpr) : Math.floor(3.5 * this.dpr);

    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const index = (y * 4 * offscreen.width) + (x * 4);
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        if (a > 120) {
          // ITU-R BT.601 Photometric Luminance
          const lum = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / 100;
          
          // Color styling based on spatial position & subtle gradient
          const nx = x / offscreen.width;
          let color: string;
          if (nx < 0.35) {
            color = `rgba(0, 240, 255, ${(a / 255 * 0.9).toFixed(2)})`; // Cyan
          } else if (nx < 0.70) {
            color = `rgba(168, 85, 247, ${(a / 255 * 0.95).toFixed(2)})`; // Purple
          } else {
            color = `rgba(255, 255, 255, ${(a / 255 * 0.9).toFixed(2)})`; // Bright White
          }

          configs.push({
            x: x / this.dpr,
            y: y / this.dpr,
            color,
            size: isMobile ? 1.4 : (Math.random() * 1.2 + 0.9),
            luminance: lum,
          });
        }
      }
    }

    return configs;
  }

  private generateParticlesFromText(text: string): void {
    const anchors = this.extractTextAnchors(text);
    this.particles = anchors.map(cfg => new SandParticle(cfg));
  }

  public morphToText(text: string): void {
    const anchors = this.extractTextAnchors(text);
    const existingCount = this.particles.length;
    const targetCount = anchors.length;

    // Repurpose existing particles
    for (let i = 0; i < Math.min(existingCount, targetCount); i++) {
      const cfg = anchors[i];
      this.particles[i].setAnchor(cfg.x, cfg.y, cfg.color);
      // Give explosive jitter on morph
      this.particles[i].vx += (Math.random() - 0.5) * 16;
      this.particles[i].vy += (Math.random() - 0.5) * 16;
    }

    // Add extra particles if needed
    if (targetCount > existingCount) {
      for (let i = existingCount; i < targetCount; i++) {
        const p = new SandParticle(anchors[i]);
        p.x = this.width / 2 + (Math.random() - 0.5) * 100;
        p.y = this.height / 2 + (Math.random() - 0.5) * 100;
        this.particles.push(p);
      }
    } else if (existingCount > targetCount) {
      // Retain or prune excess
      this.particles.length = targetCount;
    }
  }

  /**
   * Upper-triangular constellation line rendering (O(N^2/2))
   */
  private drawConstellations(maxDistance: number = 42): void {
    const maxDistSq = maxDistance * maxDistance;
    const len = this.particles.length;
    // Limit subset of particles for line connection to conserve frame budget
    const stride = this.width <= 768 ? 6 : 3;

    this.ctx.lineWidth = 0.6;

    for (let i = 0; i < len; i += stride) {
      const pA = this.particles[i];

      for (let j = i + stride; j < len; j += stride) {
        const pB = this.particles[j];
        const dx = pA.x - pB.x;
        const dy = pA.y - pB.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1.0 - dist / maxDistance) * 0.35;
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity.toFixed(3)})`;
          this.ctx.beginPath();
          this.ctx.moveTo(pA.x, pA.y);
          this.ctx.lineTo(pB.x, pB.y);
          this.ctx.stroke();
        }
      }
    }
  }

  private animate(): void {
    // Subtle trail persistence
    this.ctx.fillStyle = 'rgba(5, 5, 8, 0.28)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.scatterCountThisFrame = 0;
    const len = this.particles.length;

    for (let i = 0; i < len; i++) {
      const scattered = this.particles[i].update(this.mouse);
      if (scattered) this.scatterCountThisFrame++;
      this.particles[i].draw(this.ctx);
    }

    if (this.enableConstellations && len > 0) {
      this.drawConstellations();
    }

    // Audio reactive chimes on particle interaction
    if (this.scatterCountThisFrame > 5) {
      soundEngine.playParticleChime(Math.min(this.scatterCountThisFrame / 40, 1.0));
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
