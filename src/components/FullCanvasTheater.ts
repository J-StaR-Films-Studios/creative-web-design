import { telemetry } from '../core/telemetry';
import { soundEngine } from '../core/audio';

export interface ProjectMetadata {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tech: string;
  path: string;
  painBehindThis: {
    title: string;
    description: string;
    slainBug: string;
    code: string;
  };
}

export const PROVING_PROJECTS: ProjectMetadata[] = [
  {
    id: '01',
    slug: 'gemini-hyperthought',
    name: 'HYPERTHOUGHT',
    subtitle: 'High-Reasoning 3D Silicon Monolith & Tree-of-Thought DAG',
    tech: 'Three.js · PBR Shaders · DAG Cubic Beziers · Web Audio',
    path: '/gallery/gemini-hyperthought/index.html',
    painBehindThis: {
      title: 'The DAG Pulse Render Throttling & Garbage Collector Stutter',
      description: 'During initial node generation, pulsating bezier curves created new Float32Array buffers on every frame, producing 40ms GC pauses.',
      slainBug: 'SLAIN: Dynamically allocating SplineCurve buffers inside the RAF tick loop.',
      code: `// THE PRODUCTION INVARIANT:\nconst _nodeCurveBuffer = new Float32Array(MAX_NODES * 3);\nfunction updateDagPulse(t) {\n  // In-place mutation of static GPU attribute buffer\n  geometry.attributes.position.needsUpdate = true;\n}`,
    },
  },
  {
    id: '02',
    slug: 'the-horologist',
    name: 'THE HOROLOGIST',
    subtitle: 'CHRONOS Cal.8800 Swiss Mechanical Chronometer',
    tech: 'Three.js · 4Hz Escapement · Dual Shutter Portals · Telemetry HUD',
    path: '/gallery/the-horologist/index.html',
    painBehindThis: {
      title: 'Acoustic Phase Alignment & 28,800 VPH Tick Desynchronization',
      description: 'Browser audio clocks drift away from Three.js render frames. Synchronizing the pallet fork visual release with Web Audio required scheduling audio events ahead on the AudioContext timeline rather than inside requestAnimationFrame.',
      slainBug: 'SLAIN: Calling AudioContext.createOscillator() directly inside requestAnimationFrame.',
      code: `// THE PRODUCTION INVARIANT:\nconst tickInterval = 0.25; // 4Hz = 250ms\nlet nextTickTime = audioCtx.currentTime;\nfunction scheduleEscapementTicks() {\n  while (nextTickTime < audioCtx.currentTime + 0.1) {\n    triggerPhysicalPalletImpulse(nextTickTime);\n    nextTickTime += tickInterval;\n  }\n}`,
    },
  },
  {
    id: '03',
    slug: 'terra-archive',
    name: 'TERRA ARCHIVE',
    subtitle: 'Subterranean LIDAR & 3D Stratigraphic Cartography',
    tech: 'Canvas 2D · Simplex Contours · 2.4x Optical Loupes · Hooke Spring',
    path: '/gallery/terra-archive/index.html',
    painBehindThis: {
      title: 'Topographic Contour Line Triangulation & Canvas Fill Lag',
      description: 'Computing 50 concentric contour lines across 2000 points overwhelmed standard 2D canvas stroke routines. Shifting to marching squares with pre-allocated vector caches maintained 120 FPS on Apple ProMotion displays.',
      slainBug: 'SLAIN: ctx.save() / ctx.restore() inside nested loop of 50 contour rings.',
      code: `// THE PRODUCTION INVARIANT:\n// Eliminate ctx state matrix saves: compute direct coordinate offsets in memory\nfor (let r = 0; r < ringCount; r++) {\n  ctx.beginPath();\n  // single path stroke call per strata\n  ctx.stroke();\n}`,
    },
  },
  {
    id: '04',
    slug: 'void-form',
    name: 'VOID / FORM',
    subtitle: 'Brutalist Avant-Garde Studio & 4-Axiom Manifesto',
    tech: 'React 19 · Tailwind v4 · 4-Octave FBM Fluid · Dual Cursor Physics',
    path: '/gallery/void-form/index.html',
    painBehindThis: {
      title: 'Mouse-Velocity Chromatic Aberration GPU Overflow',
      description: 'Rapid mouse gestures pushed velocity uniforms beyond normalized limits, creating visual tearing and pixel artifacts on high-resolution displays.',
      slainBug: 'SLAIN: Unclamped velocity uniforms feeding raw delta coords into fragment shader.',
      code: `// THE PRODUCTION INVARIANT:\nconst maxVelocity = 50.0;\nconst clampedVx = Math.max(-maxVelocity, Math.min(maxVelocity, rawVx));\nuMouseVelocity.value.set(clampedVx / maxVelocity, clampedVy / maxVelocity);`,
    },
  },
  {
    id: '05',
    slug: 'the-living-archive',
    name: 'THE LIVING ARCHIVE',
    subtitle: 'Spatial Digital Museum Engine & Particle Velocity Coupling',
    tech: 'Next.js 16 · Three.js · Particle Swarms · Memory Ghost Counters',
    path: '/gallery/the-living-archive/index.html',
    painBehindThis: {
      title: 'Spatial Audio Bleed & Room Cosmos State Leaks',
      description: 'Switching between museum rooms left audio nodes and particle textures lingering in WebGL memory, causing memory bloat across multi-minute sessions.',
      slainBug: 'SLAIN: Un-disposed Three.js texture materials on Next.js route changes.',
      code: `// THE PRODUCTION INVARIANT:\nfunction disposeRoomCosmos(scene) {\n  scene.traverse((obj) => {\n    if (obj.geometry) obj.geometry.dispose();\n    if (obj.material) {\n      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());\n      else obj.material.dispose();\n    }\n  });\n}`,
    },
  },
];

export class FullCanvasTheaterEngine {
  private overlayEl!: HTMLElement;
  private iframeEl!: HTMLIFrameElement;
  private titleEl!: HTMLElement;
  private fpsValEl!: HTMLElement;
  private dprValEl!: HTMLElement;
  private drawerEl!: HTMLElement;
  private drawerTitleEl!: HTMLElement;
  private drawerDescEl!: HTMLElement;
  private drawerSlainBugEl!: HTMLElement;
  private drawerCodeEl!: HTMLElement;
  public activeProject: ProjectMetadata | null = null;
  private isDrawerOpen: boolean = false;
  private telemetryInterval: number | null = null;

  public getActiveProject(): ProjectMetadata | null {
    return this.activeProject;
  }

  constructor() {
    this.createDOM();
    this.setupEventListeners();
  }

  private createDOM(): void {
    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'theater-overlay';
    this.overlayEl.id = 'theater-overlay';

    this.overlayEl.innerHTML = `
      <!-- Ambient Exhibition HUD Top Bar -->
      <div class="theater-hud-header">
        <div class="theater-hud-left">
          <div class="theater-hud-title" id="theater-hud-title">HYPERTHOUGHT</div>
          <div class="theater-hud-tag">PROVING ENGINE</div>
        </div>

        <div class="theater-hud-center">
          <div class="theater-telemetry-item">
            <span>FPS:</span>
            <span class="theater-telemetry-val" id="theater-fps-val">60</span>
          </div>
          <div class="theater-telemetry-item">
            <span>DPR:</span>
            <span class="theater-telemetry-val" id="theater-dpr-val">2.0</span>
          </div>
          <div class="theater-telemetry-item">
            <span>MODE:</span>
            <span class="theater-telemetry-val">FULL-CANVAS</span>
          </div>
        </div>

        <div class="theater-hud-right">
          <button class="theater-action-btn" id="theater-pain-btn">
            <span>[ THE PAIN BEHIND THIS ]</span>
          </button>
          <button class="theater-action-btn primary" id="theater-close-btn">
            <span>[ ESC ] RETURN</span>
          </button>
        </div>
      </div>

      <!-- Sandbox Iframe Stage -->
      <div class="theater-stage-container">
        <iframe class="theater-sandbox-iframe" id="theater-iframe" src="about:blank"></iframe>
      </div>

      <!-- 1-Click Bottom Fast Dock -->
      <div class="theater-bottom-dock">
        ${PROVING_PROJECTS.map(
          (p) => `
          <button class="dock-item-btn" data-slug="${p.slug}">
            <span>${p.id}</span>
            <span>${p.name}</span>
          </button>
        `
        ).join('')}
      </div>

      <!-- "The Pain Behind This" Slide-Out Drawer -->
      <div class="theater-drawer" id="theater-drawer">
        <div class="drawer-header">
          <div class="drawer-title" id="drawer-project-title">Engineering Crucible</div>
          <button class="drawer-close-btn" id="drawer-close-btn">&times;</button>
        </div>

        <div class="drawer-section">
          <div class="drawer-section-title">The Engineering Challenge</div>
          <div class="drawer-section-body" id="drawer-challenge-body"></div>
        </div>

        <div class="drawer-section">
          <div class="drawer-section-title">Forensic Verdict</div>
          <div class="drawer-section-body" id="drawer-slain-bug" style="color: #FF5533; font-family: var(--font-mono); font-size: 11px;"></div>
        </div>

        <div class="drawer-section">
          <div class="drawer-section-title">Production Invariant</div>
          <pre class="drawer-code-block"><code id="drawer-code-block"></code></pre>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlayEl);

    this.iframeEl = this.overlayEl.querySelector('#theater-iframe')!;
    this.titleEl = this.overlayEl.querySelector('#theater-hud-title')!;
    this.fpsValEl = this.overlayEl.querySelector('#theater-fps-val')!;
    this.dprValEl = this.overlayEl.querySelector('#theater-dpr-val')!;
    this.drawerEl = this.overlayEl.querySelector('#theater-drawer')!;
    this.drawerTitleEl = this.overlayEl.querySelector('#drawer-project-title')!;
    this.drawerDescEl = this.overlayEl.querySelector('#drawer-challenge-body')!;
    this.drawerSlainBugEl = this.overlayEl.querySelector('#drawer-slain-bug')!;
    this.drawerCodeEl = this.overlayEl.querySelector('#drawer-code-block')!;
  }

  private setupEventListeners(): void {
    // Close button
    this.overlayEl.querySelector('#theater-close-btn')!.addEventListener('click', () => {
      this.close();
    });

    // Escape key listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlayEl.classList.contains('active')) {
        this.close();
      }
    });

    // Drawer toggle
    this.overlayEl.querySelector('#theater-pain-btn')!.addEventListener('click', () => {
      this.toggleDrawer();
    });

    this.overlayEl.querySelector('#drawer-close-btn')!.addEventListener('click', () => {
      this.closeDrawer();
    });

    // Fast Dock navigation
    const dockButtons = this.overlayEl.querySelectorAll('.dock-item-btn');
    dockButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        if (slug) {
          const target = PROVING_PROJECTS.find((p) => p.slug === slug);
          if (target) this.launch(target);
        }
      });
    });
  }

  public launch(project: ProjectMetadata): void {
    this.activeProject = project;
    this.titleEl.textContent = `${project.id} / ${project.name}`;
    this.iframeEl.src = project.path;

    // Update Drawer Content
    this.drawerTitleEl.textContent = `${project.name} · Crucible`;
    this.drawerDescEl.textContent = project.painBehindThis.description;
    this.drawerSlainBugEl.textContent = project.painBehindThis.slainBug;
    this.drawerCodeEl.textContent = project.painBehindThis.code;

    // Update Active Dock Item
    const dockButtons = this.overlayEl.querySelectorAll('.dock-item-btn');
    dockButtons.forEach((btn) => {
      if (btn.getAttribute('data-slug') === project.slug) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Open Overlay
    this.overlayEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    soundEngine.playHarmonicChord();

    // Start Telemetry HUD updates
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    this.telemetryInterval = window.setInterval(() => {
      this.fpsValEl.textContent = `${telemetry.fps} FPS`;
      this.dprValEl.textContent = `${telemetry.dpr.toFixed(1)}`;
    }, 400);
  }

  public close(): void {
    this.overlayEl.classList.remove('active');
    this.iframeEl.src = 'about:blank';
    this.closeDrawer();
    document.body.style.overflow = '';
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
  }

  public toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
    if (this.isDrawerOpen) {
      this.drawerEl.classList.add('open');
      soundEngine.playHoverChirp(880);
    } else {
      this.drawerEl.classList.remove('open');
    }
  }

  public closeDrawer(): void {
    this.isDrawerOpen = false;
    this.drawerEl.classList.remove('open');
  }
}

export const theaterEngine = new FullCanvasTheaterEngine();
