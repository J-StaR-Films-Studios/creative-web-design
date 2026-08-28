/**
 * System DAG Visualization for Chapter 09: THE MACHINE
 * Renders an interactive animated node pipeline graph with energy pulses
 * contracting into a single registration line.
 */

interface DagNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface DagEdge {
  from: string;
  to: string;
}

export class SystemDAGRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodes: DagNode[] = [];
  private edges: DagEdge[] = [];
  private width: number = 800;
  private height: number = 500;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);
  private pulseProgress: number = 0;
  private contractionProgress: number = 0; // 0: fully expanded DAG, 1: collapsed single line

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.initLayout();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  private initLayout(): void {
    const isMobile = window.innerWidth < 768;
    const s = isMobile ? 0.7 : 1; // Scale factor for mobile

    this.nodes = [
      { id: 'curiosity', label: 'HUMAN CURIOSITY', sub: 'Existential Query', x: 0.5, y: 0.08, width: 160 * s, height: 40 * s, color: '#FFFFFF' },
      { id: 'raw', label: 'RAW KNOWLEDGE', sub: 'Literature & Videos', x: 0.5, y: 0.20, width: 160 * s, height: 40 * s, color: '#ECE7DE' },
      { id: 'kem', label: 'KEM / MYCIN', sub: 'CommonKADS P1–P6', x: 0.5, y: 0.32, width: 170 * s, height: 40 * s, color: '#C86432' },
      { id: 'extract', label: '44 MODULAR SKILLS', sub: 'Google AI Studio', x: 0.5, y: 0.44, width: 180 * s, height: 40 * s, color: '#00E5FF' },
      { id: 'tournament', label: 'TOURNAMENT', sub: 'Flash vs Pro', x: 0.5, y: 0.56, width: 180 * s, height: 40 * s, color: '#D4AF37' },
      { id: 'champion', label: 'CHAMPION AI SKILL', sub: 'creative-web-development', x: 0.5, y: 0.68, width: 200 * s, height: 42 * s, color: '#FF3B00' },
      { id: 'storyboard', label: 'STORYBOARD', sub: 'Phase 0 (4-Track)', x: 0.5, y: 0.80, width: 180 * s, height: 40 * s, color: '#FFFFFF' },
      { id: 'worlds', label: '5 CREATIVE WORLDS', sub: 'Hyperthought · Horologist...', x: 0.5, y: 0.92, width: 200 * s, height: 44 * s, color: '#10B981' },
    ];

    this.edges = [
      { from: 'curiosity', to: 'raw' },
      { from: 'raw', to: 'kem' },
      { from: 'kem', to: 'extract' },
      { from: 'extract', to: 'tournament' },
      { from: 'tournament', to: 'champion' },
      { from: 'champion', to: 'storyboard' },
      { from: 'storyboard', to: 'worlds' },
    ];
  }

  public handleResize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = rect.height || 500;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  public setContraction(progress: number): void {
    this.contractionProgress = Math.max(0, Math.min(1, progress));
  }

  public update(time: number): void {
    this.pulseProgress = (time * 0.001) % 1.0;
    this.render();
  }

  private render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.contractionProgress > 0.95) {
      // Contracted single glowing registration line
      const cy = this.height / 2;
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF3B00';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(this.width - 40, cy);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 14px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE SYSTEM WORKS.', this.width / 2, cy - 14);
      return;
    }

    const nodeMap = new Map<string, DagNode>();
    this.nodes.forEach((n) => nodeMap.set(n.id, n));

    // Draw Edges & Pulses
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;

    this.edges.forEach((edge) => {
      const fromNode = nodeMap.get(edge.from)!;
      const toNode = nodeMap.get(edge.to)!;

      const fromX = fromNode.x * this.width;
      const fromY = fromNode.y * this.height;
      const toX = toNode.x * this.width;
      const toY = toNode.y * this.height;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Energy Pulse Particle
      const pulseX = fromX + (toX - fromX) * this.pulseProgress;
      const pulseY = fromY + (toY - fromY) * this.pulseProgress;

      ctx.fillStyle = '#00E5FF';
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Nodes
    const isMobile = window.innerWidth < 768;
    const labelFont = isMobile ? '600 9px "Space Grotesk", sans-serif' : '600 11px "Space Grotesk", sans-serif';
    const subFont = isMobile ? '7px "JetBrains Mono", monospace' : '9px "JetBrains Mono", monospace';

    this.nodes.forEach((n) => {
      const px = n.x * this.width;
      const py = n.y * this.height;

      ctx.save();
      ctx.translate(px, py);

      // Node background box
      ctx.fillStyle = '#14171E';
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 1.2;
      ctx.fillRect(-n.width / 2, -n.height / 2, n.width, n.height);
      ctx.strokeRect(-n.width / 2, -n.height / 2, n.width, n.height);

      // Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = labelFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, 0, -5);

      // Subtitle
      ctx.fillStyle = '#8C92A0';
      ctx.font = subFont;
      ctx.fillText(n.sub, 0, 8);

      ctx.restore();
    });
  }
}
