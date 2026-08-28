/**
 * Canvas 2D Rigid-Body Simulation: Tumbling Obsidian Cards
 * Spawns identical obsidian purple-glow cards tumbling downward
 * with gravity, air resistance, bounce, rotation, touch and cursor kicks.
 * Performance-optimized: mobile particle scaling + sleep detection.
 */

interface CardPhysicsObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  width: number;
  height: number;
  color: string;
  glowColor: string;
  isResting: boolean;
}

export class CardHeapSimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cards: CardPhysicsObject[] = [];
  private isExploded: boolean = false;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private mouseVx: number = 0;
  private mouseVy: number = 0;
  private lastMouseX: number = -1000;
  private lastMouseY: number = -1000;
  public isSleeping: boolean = false;
  public isVisible: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.handleResize();
    this.setupListeners();
  }

  public handleResize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.isSleeping = false;
  }

  private setupListeners(): void {
    window.addEventListener('resize', () => this.handleResize());

    // Mouse Listeners
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (this.lastMouseX !== -1000) {
        this.mouseVx = currentX - this.lastMouseX;
        this.mouseVy = currentY - this.lastMouseY;
      }
      this.mouseX = currentX;
      this.mouseY = currentY;
      this.lastMouseX = currentX;
      this.lastMouseY = currentY;
      this.isSleeping = false;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.lastMouseX = -1000;
      this.lastMouseY = -1000;
    });

    // Touch Listeners for Mobile
    this.canvas.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 0) {
          const rect = this.canvas.getBoundingClientRect();
          const touch = e.touches[0];
          const currentX = touch.clientX - rect.left;
          const currentY = touch.clientY - rect.top;

          if (this.lastMouseX !== -1000) {
            this.mouseVx = currentX - this.lastMouseX;
            this.mouseVy = currentY - this.lastMouseY;
          }
          this.mouseX = currentX;
          this.mouseY = currentY;
          this.lastMouseX = currentX;
          this.lastMouseY = currentY;
          this.isSleeping = false;
        }
      },
      { passive: true }
    );

    this.canvas.addEventListener('touchend', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.lastMouseX = -1000;
      this.lastMouseY = -1000;
    });
  }

  public triggerExplosion(originX?: number, originY?: number): void {
    if (this.isExploded) return;
    this.isExploded = true;
    this.isSleeping = false;

    const startX = originX ?? this.width / 2;
    const startY = originY ?? this.height * 0.35;

    // Mobile Particle Stride Optimization: Scale down card count on mobile to preserve 60-120 FPS
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 80 : 220;

    this.cards = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      this.cards.push({
        x: startX + (Math.random() - 0.5) * 60,
        y: startY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (3 + Math.random() * 5),
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.16,
        width: (isMobile ? 24 : 32) + Math.random() * (isMobile ? 12 : 16),
        height: (isMobile ? 36 : 48) + Math.random() * (isMobile ? 18 : 24),
        color: '#0A0B0E',
        glowColor: 'rgba(157, 78, 221, 0.45)', // AI purple-glow cliché
        isResting: false,
      });
    }
  }

  public update(): void {
    if (!this.isExploded || this.isSleeping || !this.isVisible) return;

    const gravity = 0.30;
    const floorY = this.height - 35;
    const friction = 0.98;
    const restitution = 0.32;
    let allResting = true;

    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i];

      if (!c.isResting) {
        allResting = false;
        c.vy += gravity;
        c.vx *= friction;
        c.vy *= friction;
        c.x += c.vx;
        c.y += c.vy;
        c.angle += c.vAngle;

        // Floor collision
        const halfH = c.height / 2;
        if (c.y + halfH >= floorY) {
          c.y = floorY - halfH;
          c.vy = -c.vy * restitution;
          c.vAngle *= 0.6;
          c.vx *= 0.8;

          if (Math.abs(c.vy) < 0.25 && Math.abs(c.vx) < 0.25) {
            c.isResting = true;
          }
        }

        // Left/Right Walls
        if (c.x - c.width / 2 < 10) {
          c.x = 10 + c.width / 2;
          c.vx = -c.vx * restitution;
        } else if (c.x + c.width / 2 > this.width - 10) {
          c.x = this.width - 10 - c.width / 2;
          c.vx = -c.vx * restitution;
        }
      }

      // Cursor / Touch Kick
      if (this.mouseX > 0) {
        const dx = c.x - this.mouseX;
        const dy = c.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const force = (1 - dist / 90) * 10;
          c.vx += (dx / (dist || 1)) * force + this.mouseVx * 0.15;
          c.vy += (dy / (dist || 1)) * force + this.mouseVy * 0.15;
          c.vAngle += (Math.random() - 0.5) * 0.2;
          c.isResting = false;
          allResting = false;
        }
      }
    }

    if (allResting && this.mouseX < 0) {
      this.isSleeping = true;
    }
  }

  public render(): void {
    if (!this.isExploded || (this.isSleeping && !this.isVisible)) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i];

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.angle);

      // Card Obsidian Body
      this.ctx.fillStyle = c.color;
      this.ctx.shadowColor = c.glowColor;
      this.ctx.shadowBlur = 8;
      this.ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);

      // Purple Glow Rim Border
      this.ctx.strokeStyle = c.glowColor;
      this.ctx.lineWidth = 1.2;
      this.ctx.strokeRect(-c.width / 2, -c.height / 2, c.width, c.height);

      // Card Mock Header Lines
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.fillRect(-c.width / 2 + 3, -c.height / 2 + 5, c.width - 6, 2.5);
      this.ctx.fillRect(-c.width / 2 + 3, -c.height / 2 + 10, c.width - 10, 1.8);

      this.ctx.restore();
    }
  }
}
