import { masterTicker } from '../core/ticker';
import { soundEngine } from '../core/audio';

export class Act03_Extract {
  private containerEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private nodes: { label: string; x: number; y: number; vx: number; vy: number; origX: number; origY: number }[] = [];
  private width: number = 800;
  private height: number = 380;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);
  private isVisible: boolean = false;
  private observer!: IntersectionObserver;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ CHAPTER 03 ]</span>
          <span class="chapter-coordinates">[ 44 SOURCES → COMMONKADS COMPILER CORE ]</span>
        </div>
        <h2 class="chapter-title">EXTRACT</h2>
        <div class="chapter-subtitle">
          44 video tutorials and masterclasses ingested through Google AI Studio into a single CommonKADS knowledge compiler vector.
        </div>
      </div>

      <!-- Vector Flow Field Canvas -->
      <div class="extract-flow-canvas-container">
        <canvas id="extract-flow-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>

      <!-- CommonKADS P1–P6 Probes -->
      <div class="commonkads-probes-grid">
        <div class="probe-card active" data-probe="p1">
          <div class="probe-id">[ P1 ]</div>
          <div class="probe-name">Conditions</div>
          <div class="probe-desc">When should this technique be triggered vs standard DOM layout?</div>
        </div>

        <div class="probe-card" data-probe="p2">
          <div class="probe-id">[ P2 ]</div>
          <div class="probe-name">Prerequisites</div>
          <div class="probe-desc">DPR clamping, RAF ticker alignment, font metrics loaded.</div>
        </div>

        <div class="probe-card" data-probe="p3">
          <div class="probe-id">[ P3 ]</div>
          <div class="probe-name">Exceptions</div>
          <div class="probe-desc">Fallback 7px particle stride on mobile; prefers-reduced-motion.</div>
        </div>

        <div class="probe-card" data-probe="p4">
          <div class="probe-id">[ P4 ]</div>
          <div class="probe-name">Alternatives</div>
          <div class="probe-desc">Frame scrubbing vs video tag; instanced meshes vs individual draws.</div>
        </div>

        <div class="probe-card" data-probe="p5">
          <div class="probe-id">[ P5 ]</div>
          <div class="probe-name">Invariants</div>
          <div class="probe-desc">Zero allocations inside RAF; DPR ≤ 2.0; lagSmoothing(0).</div>
        </div>

        <div class="probe-card" data-probe="p6">
          <div class="probe-id">[ P6 ]</div>
          <div class="probe-name">Checks</div>
          <div class="probe-desc">Draw call budgets &lt; 50 mobile; 60 FPS frame time &lt; 16.6ms.</div>
        </div>
      </div>
    `;

    this.canvasEl = this.containerEl.querySelector('#extract-flow-canvas')!;
    this.ctx = this.canvasEl.getContext('2d')!;

    this.initCanvasParticles();
    this.setupListeners();

    // Viewport Culling
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    this.observer.observe(this.containerEl);

    masterTicker.register((time) => {
      if (this.isVisible) {
        this.updateAndRender(time);
      }
    });
  }

  private initCanvasParticles(): void {
    const rect = this.canvasEl.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = rect.height || 380;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    this.canvasEl.width = Math.floor(this.width * this.dpr);
    this.canvasEl.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const isMobile = window.innerWidth < 768;
    const allSkills = [
      'GSAP 3', 'Lenis', 'ScrollTrigger', 'WebGL', 'GLSL', 'Three.js', 'Simplex Noise',
      'FBM Shaders', 'Hooke Spring', 'SplitText', 'Canvas 2D', 'Byte Stride', 'BT.601 Lum',
      'Frame Scrubber', 'Barba.js', 'Web Audio', 'DPR Clamp', 'InstancedMesh', 'Cover UV',
      'Blender Bake', 'DRACO GLTF', 'Dual-DOM', 'Zero-GC RAF', 'LagSmoothing(0)', 'Pin Buffer',
      'Velocity Tracker', 'Chromatic Aberration', 'Optical Loupe', 'Stratigraphy', 'LIDAR',
      'Matrix4 Scratch', 'ACESFilmic', 'LinearRamp', 'Aperture Wipe', 'Escapement 4Hz',
      'CommonKADS P1', 'CommonKADS P2', 'CommonKADS P3', 'CommonKADS P4', 'CommonKADS P5',
      'CommonKADS P6', 'Certainty CF', 'Elicitation', 'Skill Compiler'
    ];

    // Mobile Stride: Use half the nodes on small screens
    const skills = isMobile ? allSkills.slice(0, 20) : allSkills;

    this.nodes = skills.map((label) => {
      const x = Math.random() * (this.width - 120) + 60;
      const y = Math.random() * (this.height - 60) + 30;
      return {
        label,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        origX: x,
        origY: y,
      };
    });
  }

  private setupListeners(): void {
    window.addEventListener('resize', () => {
      const rect = this.canvasEl.getBoundingClientRect();
      this.width = rect.width || 800;
      this.height = rect.height || 380;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      this.canvasEl.width = Math.floor(this.width * this.dpr);
      this.canvasEl.height = Math.floor(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    });

    const probeCards = this.containerEl.querySelectorAll('.probe-card');
    probeCards.forEach((card) => {
      const activateProbe = () => {
        probeCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        soundEngine.playHoverChirp(650);
      };

      card.addEventListener('mouseenter', activateProbe);
      card.addEventListener('click', activateProbe);
    });
  }

  private updateAndRender(time: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const sec = time * 0.001;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Central Compiler Core
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30 + Math.sin(sec * 3) * 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COMPILER', centerX, centerY - 6);
    ctx.fillText('CORE', centerX, centerY + 6);

    // Update and Draw Floating Skill Nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];

      const dx = centerX - n.x;
      const dy = centerY - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      n.vx += (dx / dist) * 0.015;
      n.vy += (dy / dist) * 0.015;

      n.vx *= 0.98;
      n.vy *= 0.98;

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 30) n.x = this.width - 30;
      if (n.x > this.width - 30) n.x = 30;
      if (n.y < 20) n.y = this.height - 20;
      if (n.y > this.height - 20) n.y = 20;

      if (dist < 160) {
        ctx.strokeStyle = `rgba(0, 229, 255, ${(1 - dist / 160) * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
      }

      ctx.fillStyle = '#181C24';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;

      const textWidth = ctx.measureText(n.label).width;
      const pw = textWidth + 10;
      const ph = 15;

      ctx.fillRect(n.x - pw / 2, n.y - ph / 2, pw, ph);
      ctx.strokeRect(n.x - pw / 2, n.y - ph / 2, pw, ph);

      ctx.fillStyle = '#A0AEC0';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(n.label, n.x, n.y);
    }
  }
}
