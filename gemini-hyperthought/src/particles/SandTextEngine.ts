/**
 * Apple Clean Typography & Delicate Particle Physics Engine
 * Monochromatic platinum sand grains, ITU-R BT.601 luminance mapping,
 * Hooke's Law elastic recovery, and subtle cursor interaction.
 */

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
  public friction: number = 0.92;
  public springFactor: number = 0.08;

  constructor(cfg: TextParticleConfig) {
    this.x = cfg.x + (Math.random() - 0.5) * 15;
    this.y = cfg.y + (Math.random() - 0.5) * 15;
    this.baseX = cfg.x;
    this.baseY = cfg.y;
    this.size = cfg.size;
    this.color = cfg.color;
    this.luminance = cfg.luminance;
    this.density = Math.random() * 18 + 8;
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
    const radius = mouse.isDown ? mouse.radius * 1.5 : mouse.radius;
    const radiusSq = radius * radius;
    let didScatter = false;

    // 1. Cursor Repulsion Force Field
    if (distSq < radiusSq && distSq > 0) {
      const dist = Math.sqrt(distSq);
      const force = (radius - dist) / radius;
      const normalX = dx / dist;
      const normalY = dy / dist;

      const power = mouse.isDown ? this.density * 1.4 : this.density;
      this.vx -= normalX * force * power;
      this.vy -= normalY * force * power;
      didScatter = true;
    }

    // 2. Hooke's Law Spring Recovery to Anchor Memory
    const springDx = this.baseX - this.x;
    const springDy = this.baseY - this.y;

    this.vx += springDx * this.springFactor;
    this.vy += springDy * this.springFactor;

    // 3. Friction & Position Integration
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
    'Gemini 3.7 Pro',
    'Thinking Core',
    'High Reasoning',
  ];
  private mouse = {
    x: -1000,
    y: -1000,
    radius: 110,
    isDown: false,
  };
  private rafId: number | null = null;

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
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isDown = false;
    });

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

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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
    return phrase;
  }

  public setPhrase(index: number): void {
    if (index >= 0 && index < this.phrases.length) {
      this.currentPhraseIndex = index;
      this.morphToText(this.phrases[this.currentPhraseIndex]);
    }
  }

  private extractTextAnchors(text: string): TextParticleConfig[] {
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return [];

    offscreen.width = this.canvas.width;
    offscreen.height = this.canvas.height;
    offCtx.scale(this.dpr, this.dpr);

    offCtx.clearRect(0, 0, this.width, this.height);
    offCtx.fillStyle = '#ffffff';

    // Apple SF Pro Display typography scale
    const fontSize = Math.min(Math.max(this.width * 0.08, 38), 105);
    offCtx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.letterSpacing = '-0.03em';

    offCtx.fillText(text, this.width / 2, this.height / 2);

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

        if (a > 130) {
          // Photometric relative luminance
          const lum = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / 100;
          
          // Pure Apple Monochromatic Platinum / Soft White
          const alphaNorm = (a / 255 * 0.9).toFixed(2);
          const color = `rgba(245, 245, 247, ${alphaNorm})`;

          configs.push({
            x: x / this.dpr,
            y: y / this.dpr,
            color,
            size: isMobile ? 1.4 : (Math.random() * 1.0 + 0.8),
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

    for (let i = 0; i < Math.min(existingCount, targetCount); i++) {
      const cfg = anchors[i];
      this.particles[i].setAnchor(cfg.x, cfg.y, cfg.color);
      this.particles[i].vx += (Math.random() - 0.5) * 12;
      this.particles[i].vy += (Math.random() - 0.5) * 12;
    }

    if (targetCount > existingCount) {
      for (let i = existingCount; i < targetCount; i++) {
        const p = new SandParticle(anchors[i]);
        p.x = this.width / 2 + (Math.random() - 0.5) * 60;
        p.y = this.height / 2 + (Math.random() - 0.5) * 60;
        this.particles.push(p);
      }
    } else if (existingCount > targetCount) {
      this.particles.length = targetCount;
    }
  }

  private animate(): void {
    // Pure clean clearing with subtle fade
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      this.particles[i].update(this.mouse);
      this.particles[i].draw(this.ctx);
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
