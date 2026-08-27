/**
 * Procedural Canvas 2D Kinetic Chronometer & Co-Axial Tourbillon Escapement
 */
export class TourbillonMechanics {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private angle: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.resize();
  }

  public resize() {
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  public update(timeDelta: number) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.42;

    this.angle += timeDelta * 0.8;

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // 1. Outer Calibration Ring
    this.ctx.strokeStyle = 'rgba(229, 233, 236, 0.15)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    // 2. 60-Second Graduation Ticks
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const isMajor = i % 5 === 0;
      const inner = radius - (isMajor ? 12 : 6);

      this.ctx.strokeStyle = isMajor ? '#FF4800' : 'rgba(229, 233, 236, 0.3)';
      this.ctx.lineWidth = isMajor ? 2 : 1;

      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      this.ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
      this.ctx.stroke();
    }

    // 3. Rotating Epicyclic Sun Gear
    this.ctx.save();
    this.ctx.rotate(this.angle * 0.5);
    this.drawGear(0, 0, radius * 0.65, 24, 'rgba(255, 72, 0, 0.4)');
    this.ctx.restore();

    // 4. Rotating Tourbillon Carriage
    this.ctx.save();
    this.ctx.rotate(-this.angle);

    // Titanium Cage Bridge
    this.ctx.strokeStyle = '#E5E9EC';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(-radius * 0.5, 0);
    this.ctx.lineTo(radius * 0.5, 0);
    this.ctx.stroke();

    // Central Balance Wheel with 4 Inertia Screws
    this.ctx.strokeStyle = '#D4AF37';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    this.ctx.stroke();

    // 4 Gold Screws
    for (let j = 0; j < 4; j++) {
      const sa = (j / 4) * Math.PI * 2;
      this.ctx.fillStyle = '#FF4800';
      this.ctx.beginPath();
      this.ctx.arc(Math.cos(sa) * radius * 0.35, Math.sin(sa) * radius * 0.35, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Central Ruby Jewel
    this.ctx.fillStyle = '#FF0044';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
    this.ctx.restore();
  }

  private drawGear(x: number, y: number, r: number, teeth: number, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();

    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const aNext = ((i + 0.5) / teeth) * Math.PI * 2;
      const rOuter = r + 6;

      this.ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      this.ctx.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
      this.ctx.lineTo(Math.cos(aNext) * rOuter, Math.sin(aNext) * rOuter);
      this.ctx.lineTo(Math.cos(aNext) * r, Math.sin(aNext) * r);
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
