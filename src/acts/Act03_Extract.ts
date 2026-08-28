import { masterTicker } from '../core/ticker';
import { soundEngine } from '../core/audio';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface NodeData {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  origX: number;
  origY: number;
  targetX: number;
  targetY: number;
  isInner: boolean;
  angle: number;
  relatedProbes: string[];
}

export class Act03_Extract {
  private containerEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private nodes: NodeData[] = [];
  private width: number = 800;
  private height: number = 420;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);
  private isVisible: boolean = false;
  private observer!: IntersectionObserver;
  private animProgress: number = 0;
  public activeProbe: string | null = 'p1';
  private hudNameEl: HTMLElement | null = null;
  private scrollTriggers: ScrollTrigger[] = [];

  private readonly probeNames: Record<string, string> = {
    'p1': 'P1 / CONDITIONS (KINETIC TRIGGER)',
    'p2': 'P2 / PREREQUISITES (DPR & RAF CLOCK)',
    'p3': 'P3 / EXCEPTIONS (MOBILE FALLBACKS)',
    'p4': 'P4 / ALTERNATIVES (INSTANCED MESHES)',
    'p5': 'P5 / INVARIANTS (ZERO GC RAF LOOPS)',
    'p6': 'P6 / CHECKS (DRAW CALL & FPS BUDGET)',
  };

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <!-- Chapter Header -->
      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ CHAPTER 03 ]</span>
          <span class="chapter-coordinates">[ 44 SOURCES → COMMONKADS COMPILER CORE ]</span>
        </div>
        <h2 class="chapter-title">EXTRACT</h2>
        <div class="chapter-subtitle">
          44 video tutorials and masterclasses ingested through Google AI Studio into a single CommonKADS knowledge compiler vector. Scroll to probe the compiler in real-time.
        </div>
      </div>

      <!-- Pinned Split Showcase -->
      <div class="extract-showcase-split">
        <!-- Sticky Pinned Illustration Column -->
        <div class="extract-canvas-sticky-col">
          <div class="extract-flow-canvas-container">
            <canvas id="extract-flow-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
            <div class="canvas-active-probe-hud" id="canvas-probe-hud">
              <span class="hud-pulse-dot"></span>
              <span id="hud-probe-name">P1 / CONDITIONS (KINETIC TRIGGER)</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Probes Column -->
        <div class="extract-probes-scroll-col" id="extract-probes-col">
          <div class="probe-card active" data-probe="p1">
            <div class="probe-header">
              <span class="probe-id">[ P1 ]</span>
              <span class="probe-category">RULE CONDITIONS</span>
            </div>
            <div class="probe-name">Activation Conditions</div>
            <div class="probe-desc">When should this technique be triggered vs standard DOM layout? Establishes strict conditions before initializing WebGL contexts.</div>
            <div class="probe-skills-tags">
              <span>GSAP 3</span><span>ScrollTrigger</span><span>Lenis</span>
            </div>
          </div>

          <div class="probe-card" data-probe="p2">
            <div class="probe-header">
              <span class="probe-id">[ P2 ]</span>
              <span class="probe-category">PRE-FLIGHT</span>
            </div>
            <div class="probe-name">Prerequisites</div>
            <div class="probe-desc">DPR clamping ceiling (≤ 2.0), unified RAF master ticker alignment, font metrics ready, and aspect-corrected cover UV textures.</div>
            <div class="probe-skills-tags">
              <span>DPR Clamp</span><span>RAF Clock</span><span>Cover UV</span>
            </div>
          </div>

          <div class="probe-card" data-probe="p3">
            <div class="probe-header">
              <span class="probe-id">[ P3 ]</span>
              <span class="probe-category">FALLBACKS</span>
            </div>
            <div class="probe-name">Exceptions & Degradation</div>
            <div class="probe-desc">Fallback 7px particle stride on mobile; prefers-reduced-motion CSS bypass; Canvas 2D image fallbacks for non-WebGL GPUs.</div>
            <div class="probe-skills-tags">
              <span>Canvas 2D</span><span>Particle Stride</span><span>Degradation</span>
            </div>
          </div>

          <div class="probe-card" data-probe="p4">
            <div class="probe-header">
              <span class="probe-id">[ P4 ]</span>
              <span class="probe-category">DESIGN PATTERNS</span>
            </div>
            <div class="probe-name">Alternatives & Trade-offs</div>
            <div class="probe-desc">In-memory Image[] buffer array frame scrubbing vs native video tags; THREE.InstancedMesh vs individual draw call batching.</div>
            <div class="probe-skills-tags">
              <span>Frame Scrubber</span><span>Video Tag</span><span>InstancedMesh</span>
            </div>
          </div>

          <div class="probe-card" data-probe="p5">
            <div class="probe-header">
              <span class="probe-id">[ P5 ]</span>
              <span class="probe-category">COMPILER LAWS</span>
            </div>
            <div class="probe-name">Execution Invariants</div>
            <div class="probe-desc">Zero memory allocations inside 60 FPS animation loops; lagSmoothing(0) playhead synchronization; static Matrix4 scratchpad vectors.</div>
            <div class="probe-skills-tags">
              <span>Zero-GC RAF</span><span>LagSmoothing(0)</span><span>Matrix4</span>
            </div>
          </div>

          <div class="probe-card" data-probe="p6">
            <div class="probe-header">
              <span class="probe-id">[ P6 ]</span>
              <span class="probe-category">PRODUCTION CRUCIBLE</span>
            </div>
            <div class="probe-name">Performance Checks</div>
            <div class="probe-desc">Draw call budgets &lt; 50 mobile / &lt; 100 desktop; 60 FPS frame time budgets &lt; 16.6ms; mouse velocity uniform clamping.</div>
            <div class="probe-skills-tags">
              <span>Draw Calls</span><span>16.6ms Budget</span><span>Velocity Clamp</span>
            </div>
          </div>
        </div>
      </div>

      <div class="marginal-note" style="border-color: var(--accent-cyan); margin-top: 32px; color: #8C92A0;">
        "A true AI skill is not text generation. It is an algorithmic compiler that maps design intent into rock-solid mathematical invariants."
      </div>
    `;

    this.canvasEl = this.containerEl.querySelector('#extract-flow-canvas')!;
    this.ctx = this.canvasEl.getContext('2d')!;
    this.hudNameEl = this.containerEl.querySelector('#hud-probe-name');

    this.initCanvasParticles();
    this.setupListeners();
    this.setupScrollPinning();

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
        if (this.animProgress < 1.0) {
          this.animProgress += 0.015;
          if (this.animProgress > 1.0) this.animProgress = 1.0;
        }
        this.updateAndRender(time);
      }
    });
  }

  public setActiveProbe(probeId: string | null): void {
    if (this.activeProbe === probeId) return;
    this.activeProbe = probeId;

    const cards = this.containerEl.querySelectorAll('.probe-card');
    cards.forEach((card) => {
      if (card.getAttribute('data-probe') === probeId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    if (this.hudNameEl && probeId && this.probeNames[probeId]) {
      this.hudNameEl.textContent = this.probeNames[probeId];
    }
  }

  private initCanvasParticles(): void {
    const rect = this.canvasEl.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 420;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    this.canvasEl.width = Math.floor(this.width * this.dpr);
    this.canvasEl.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const isMobile = window.innerWidth < 768;
    
    const innerLabels = ['GSAP 3', 'Three.js', 'WebGL', 'Canvas 2D', 'Web Audio', 'Lenis'];
    const outerLabels = [
      'ScrollTrigger', 'DPR Clamp', 'RAF Clock', 'Cover UV', 'Particle Stride', 'Degradation', 
      'Frame Scrubber', 'Video Tag', 'InstancedMesh', 'Zero-GC RAF', 'LagSmoothing(0)', 
      'Matrix4', 'Draw Calls', '16.6ms Budget', 'Velocity Clamp', 'GLSL', 'Simplex Noise'
    ];

    const probeMap: Record<string, string[]> = {
      'GSAP 3': ['p1'],
      'ScrollTrigger': ['p1'],
      'Lenis': ['p1'],
      'DPR Clamp': ['p2'],
      'RAF Clock': ['p2'],
      'Cover UV': ['p2'],
      'Canvas 2D': ['p3'],
      'Particle Stride': ['p3'],
      'Degradation': ['p3'],
      'Frame Scrubber': ['p4'],
      'Video Tag': ['p4'],
      'InstancedMesh': ['p4'],
      'Zero-GC RAF': ['p5'],
      'LagSmoothing(0)': ['p5'],
      'Matrix4': ['p5'],
      'Draw Calls': ['p6'],
      '16.6ms Budget': ['p6'],
      'Velocity Clamp': ['p6']
    };

    const finalInner = isMobile ? innerLabels.slice(0, 4) : innerLabels;
    const finalOuter = isMobile ? outerLabels.slice(0, 10) : outerLabels;
    
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.nodes = [];

    const innerRadius = isMobile ? 65 : 85;
    const outerRadius = isMobile ? 125 : 175;

    const createNodes = (labels: string[], isInner: boolean, radius: number) => {
      const step = (Math.PI * 2) / labels.length;
      labels.forEach((label, i) => {
        const angle = i * step;
        const targetX = centerX + Math.cos(angle) * radius;
        const targetY = centerY + Math.sin(angle) * radius;
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        this.nodes.push({
          label,
          x, y,
          origX: x, origY: y,
          targetX, targetY,
          vx: 0, vy: 0,
          isInner,
          angle,
          relatedProbes: probeMap[label] || []
        });
      });
    };

    createNodes(finalInner, true, innerRadius);
    createNodes(finalOuter, false, outerRadius);
  }

  private setupListeners(): void {
    window.addEventListener('resize', () => {
      const rect = this.canvasEl.getBoundingClientRect();
      this.width = rect.width || 600;
      this.height = rect.height || 420;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      this.canvasEl.width = Math.floor(this.width * this.dpr);
      this.canvasEl.height = Math.floor(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      
      const isMobile = window.innerWidth < 768;
      const innerRadius = isMobile ? 65 : 85;
      const outerRadius = isMobile ? 125 : 175;
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      this.nodes.forEach(n => {
        const radius = n.isInner ? innerRadius : outerRadius;
        n.targetX = centerX + Math.cos(n.angle) * radius;
        n.targetY = centerY + Math.sin(n.angle) * radius;
      });
    });

    // Direct click/tap on probe cards
    const probeCards = this.containerEl.querySelectorAll('.probe-card');
    probeCards.forEach((card, index) => {
      const probeId = card.getAttribute('data-probe');
      card.addEventListener('click', () => {
        if (probeId) {
          this.setActiveProbe(probeId);
          soundEngine.playHoverChirp(550 + index * 40);
        }
      });
    });
  }

  /**
   * Scroll-driven probe activation: as each probe card scrolls past the viewport center,
   * it triggers probe selection on the sticky canvas in real-time.
   */
  private setupScrollPinning(): void {
    const probeCards = this.containerEl.querySelectorAll('.probe-card');

    probeCards.forEach((card, index) => {
      const probeId = card.getAttribute('data-probe');
      if (!probeId) return;

      const trigger = ScrollTrigger.create({
        trigger: card as HTMLElement,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          this.setActiveProbe(probeId);
          soundEngine.playHoverChirp(550 + index * 40);
        },
        onEnterBack: () => {
          this.setActiveProbe(probeId);
          soundEngine.playHoverChirp(550 + index * 40);
        },
      });

      this.scrollTriggers.push(trigger);
    });
  }

  private updateAndRender(time: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const sec = time * 0.001;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Outer Orbit Ring
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, window.innerWidth < 768 ? 125 : 175, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Orbit Ring
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, window.innerWidth < 768 ? 65 : 85, 0, Math.PI * 2);
    ctx.stroke();

    // Central Rotating Rings
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(sec * 0.5);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 1.5);
    ctx.stroke();
    
    ctx.rotate(-sec * 0.9);
    ctx.strokeStyle = 'rgba(255, 59, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 1.2);
    ctx.stroke();
    ctx.restore();

    // Central Core Pulse
    const corePulse = Math.sin(sec * 3) * 2;
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28 + corePulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 229, 255, 0.18)';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COMPILER', centerX, centerY - 6);
    ctx.fillText('CORE', centerX, centerY + 7);

    const ease = 1 - Math.pow(1 - this.animProgress, 3);
    const isMobile = window.innerWidth < 768;
    const innerRadius = isMobile ? 65 : 85;
    const outerRadius = isMobile ? 125 : 175;

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];

      n.angle += n.isInner ? 0.0025 : -0.0012;
      const radius = n.isInner ? innerRadius : outerRadius;
      n.targetX = centerX + Math.cos(n.angle) * radius;
      n.targetY = centerY + Math.sin(n.angle) * radius;

      n.x = n.origX + (n.targetX - n.origX) * ease;
      n.y = n.origY + (n.targetY - n.origY) * ease;

      n.y += Math.sin(sec * 2 + i) * 2.5;

      const isRelated = this.activeProbe ? n.relatedProbes.includes(this.activeProbe) : false;
      const isDimmed = this.activeProbe ? !isRelated : false;

      // Connecting energy beams to center
      if (isRelated) {
        // Active pulsing beam
        const beamPulse = (Math.sin(sec * 6 + i) + 1) * 0.5;
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.7 + beamPulse * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();

        // Energy Particle traveling along beam
        const pProgress = (sec * 2 + i * 0.3) % 1.0;
        const px = n.x + (centerX - n.x) * pProgress;
        const py = n.y + (centerY - n.y) * pProgress;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Subtle ambient connection
        ctx.strokeStyle = `rgba(0, 229, 255, ${isDimmed ? 0.04 : 0.15})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
      }

      // Node Box
      ctx.fillStyle = isRelated ? '#0A192F' : '#14171E';
      ctx.strokeStyle = isRelated ? '#00E5FF' : (isDimmed ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.18)');
      ctx.lineWidth = isRelated ? 1.5 : 1;

      const textWidth = ctx.measureText(n.label).width;
      const pw = textWidth + (isMobile ? 10 : 14);
      const ph = isMobile ? 16 : 18;

      ctx.fillRect(n.x - pw / 2, n.y - ph / 2, pw, ph);
      ctx.strokeRect(n.x - pw / 2, n.y - ph / 2, pw, ph);

      ctx.fillStyle = isRelated ? '#00E5FF' : (isDimmed ? '#3B4354' : '#A0AEC0');
      ctx.font = (isRelated ? '600 ' : '400 ') + (isMobile ? '8px ' : '9px ') + '"JetBrains Mono", monospace';
      ctx.fillText(n.label, n.x, n.y + 1);
    }
  }
}
