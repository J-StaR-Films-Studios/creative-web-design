/**
 * Canvas 2D Rigid-Body Simulation: 250 Tumbling Obsidian Cards
 * Spawns 250 identical obsidian purple-glow cards tumbling downward
 * with gravity, air resistance, bounce, rotation, and interactive cursor kicks.
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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
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
  }

  private setupListeners(): void {
    window.addEventListener('resize', () => this.handleResize());

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
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.lastMouseX = -1000;
      this.lastMouseY = -1000;
    });
  }

  public triggerExplosion(originX?: number, originY?: number): void {
    if (this.isExploded) return;
    this.isExploded = true;

    const startX = originX ?? this.width / 2;
    const startY = originY ?? this.height * 0.35;
    const count = 250;

    this.cards = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 2 + Math.random() * 8;
      this.cards.push({
        x: startX + (Math.random() - 0.5) * 60,
        y: startY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (3 + Math.random() * 6), // Initial upward burst
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.18,
        width: 32 + Math.random() * 16,
        height: 48 + Math.random() * 24,
        color: '#0A0B0E',
        glowColor: 'rgba(157, 78, 221, 0.45)', // The generic AI purple-glow cliché
        isResting: false,
      });
    }
  }

  public update(): void {
    if (!this.isExploded) return;

    const gravity = 0.32;
    const floorY = this.height - 40;
    const friction = 0.98;
    const restitution = 0.35;

    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i];

      // Physics Integration
      c.vy += gravity;
      c.vx *= friction;
      c.vy *= friction;
      c.x += c.vx;
      c.y += c.vy;
      c.angle += c.vAngle;

      // Floor collision & stacking heap
      const halfH = c.height / 2;
      if (c.y + halfH >= floorY) {
        c.y = floorY - halfH;
        c.vy = -c.vy * restitution;
        c.vAngle *= 0.6;
        c.vx *= 0.8;

        if (Math.abs(c.vy) < 0.2 && Math.abs(c.vx) < 0.2) {
          c.isResting = true;
        }
      }

      // Walls
      if (c.x - c.width / 2 < 10) {
        c.x = 10 + c.width / 2;
        c.vx = -c.vx * restitution;
      } else if (c.x + c.width / 2 > this.width - 10) {
        c.x = this.width - 10 - c.width / 2;
        c.vx = -c.vx * restitution;
      }

      // Mouse kick / cursor interaction
      if (this.mouseX > 0) {
        const dx = c.x - this.mouseX;
        const dy = c.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (1 - dist / 80) * 12;
          c.vx += (dx / (dist || 1)) * force + this.mouseVx * 0.2;
          c.vy += (dy / (dist || 1)) * force + this.mouseVy * 0.2;
          c.vAngle += (Math.random() - 0.5) * 0.2;
          c.isResting = false;
        }
      }
    }
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.isExploded) return;

    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i];

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.angle);

      // Card Obsidian Body
      this.ctx.fillStyle = c.color;
      this.ctx.shadowColor = c.glowColor;
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);

      // Purple Glow Rim Border (The exact AI cliché being criticized)
      this.ctx.strokeStyle = c.glowColor;
      this.ctx.lineWidth = 1.2;
      this.ctx.strokeRect(-c.width / 2, -c.height / 2, c.width, c.height);

      // Card Mock Header & Bar Lines
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.fillRect(-c.width / 2 + 4, -c.height / 2 + 6, c.width - 8, 3);
      this.ctx.fillRect(-c.width / 2 + 4, -c.height / 2 + 12, c.width - 12, 2);

      this.ctx.restore();
    }
  }
}
