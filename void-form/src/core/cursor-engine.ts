export type CursorState = 'default' | 'hover' | 'drag' | 'explore' | 'view' | 'enter' | 'send' | 'close' | 'hidden';

export interface CursorPosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  speed: number;
  angle: number;
  state: CursorState;
  textBadge: string;
}

type CursorListener = (pos: CursorPosition) => void;

class CursorEngine {
  public x = -100;
  public y = -100;
  public targetX = -100;
  public targetY = -100;
  public prevX = -100;
  public prevY = -100;
  public vx = 0;
  public vy = 0;
  public speed = 0;
  public angle = 0;
  public state: CursorState = 'default';
  public textBadge = '';
  public isVisible = false;

  private listeners: Set<CursorListener> = new Set();
  private isBound = false;

  public init() {
    if (this.isBound || typeof window === 'undefined') return;

    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('mouseenter', this.handleMouseEnter, { passive: true });
    window.addEventListener('mouseleave', this.handleMouseLeave, { passive: true });
    window.addEventListener('mousedown', this.handleMouseDown, { passive: true });
    window.addEventListener('mouseup', this.handleMouseUp, { passive: true });

    this.isBound = true;
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    if (!this.isVisible) {
      this.isVisible = true;
      this.x = e.clientX;
      this.y = e.clientY;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    }
  };

  private handleMouseEnter = () => {
    this.isVisible = true;
  };

  private handleMouseLeave = () => {
    this.isVisible = false;
    this.targetX = -100;
    this.targetY = -100;
  };

  private handleMouseDown = () => {
    if (this.state === 'default') {
      this.setState('drag');
    }
  };

  private handleMouseUp = () => {
    if (this.state === 'drag') {
      this.setState('default');
    }
  };

  public setState(state: CursorState, textBadge?: string) {
    this.state = state;
    this.textBadge = textBadge || (state !== 'default' && state !== 'hidden' ? state.toUpperCase() : '');
    this.notify();
  }

  public resetState() {
    this.state = 'default';
    this.textBadge = '';
    this.notify();
  }

  public update(deltaTime: number = 0.016) {
    // Spring-like interpolation toward target with physical mass
    const lerpFactor = 0.18;
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;

    // Velocity computation
    const dx = this.x - this.prevX;
    const dy = this.y - this.prevY;
    this.vx = dx / (deltaTime || 0.016);
    this.vy = dy / (deltaTime || 0.016);
    this.speed = Math.hypot(dx, dy);
    this.angle = Math.atan2(dy, dx);

    this.prevX = this.x;
    this.prevY = this.y;

    this.notify();
  }

  public subscribe(listener: CursorListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.getPosition());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const pos = this.getPosition();
    this.listeners.forEach((l) => l(pos));
  }

  public getPosition(): CursorPosition {
    return {
      x: this.x,
      y: this.y,
      targetX: this.targetX,
      targetY: this.targetY,
      vx: this.vx,
      vy: this.vy,
      speed: this.speed,
      angle: this.angle,
      state: this.state,
      textBadge: this.textBadge,
    };
  }

  public destroy() {
    if (!this.isBound || typeof window === 'undefined') return;
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseenter', this.handleMouseEnter);
    window.removeEventListener('mouseleave', this.handleMouseLeave);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.listeners.clear();
    this.isBound = false;
  }
}

export const cursorEngine = new CursorEngine();
