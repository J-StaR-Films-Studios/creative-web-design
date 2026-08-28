import {
  HyperthoughtMicroEngine,
  HorologistMicroEngine,
  TerraMicroEngine,
  VoidMicroEngine,
  ArchiveMicroEngine,
} from '../components/MicroEngines';
import { masterTicker } from '../core/ticker';
import { soundEngine } from '../core/audio';
import { theaterEngine, PROVING_PROJECTS } from '../components/FullCanvasTheater';

export class Act04_FiveMachines {
  private containerEl!: HTMLElement;
  private hyperEngine?: HyperthoughtMicroEngine;
  private horoEngine?: HorologistMicroEngine;
  private terraEngine?: TerraMicroEngine;
  private voidEngine?: VoidMicroEngine;
  private archiveEngine?: ArchiveMicroEngine;
  private isVisible: boolean = false;
  private observer!: IntersectionObserver;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ CHAPTER 04 ]</span>
          <span class="chapter-coordinates">[ FIVE REAL-TIME PROVING ENGINES ]</span>
        </div>
        <h2 class="chapter-title">FIVE MACHINES</h2>
        <div class="chapter-subtitle">
          Five standalone digital architectures prompted and built with zero manual boilerplate—testing Three.js, Canvas 2D, WebGL Shaders, and Web Audio under live fire.
        </div>
      </div>

      <!-- 5 Doorway Portals -->
      <div class="doorway-portals-grid">
        <!-- 01 / HYPERTHOUGHT -->
        <div class="doorway-card" data-slug="gemini-hyperthought">
          <div class="doorway-canvas-wrapper">
            <canvas id="canvas-doorway-01"></canvas>
          </div>
          <div class="doorway-meta">
            <div class="doorway-index">[ DOORWAY 01 ]</div>
            <div class="doorway-title">HYPERTHOUGHT</div>
            <div class="doorway-tech">3D Silicon Monolith & DAG</div>
          </div>
        </div>

        <!-- 02 / THE HOROLOGIST -->
        <div class="doorway-card" data-slug="the-horologist">
          <div class="doorway-canvas-wrapper">
            <canvas id="canvas-doorway-02"></canvas>
          </div>
          <div class="doorway-meta">
            <div class="doorway-index">[ DOORWAY 02 ]</div>
            <div class="doorway-title">THE HOROLOGIST</div>
            <div class="doorway-tech">4Hz Mechanical Escapement</div>
          </div>
        </div>

        <!-- 03 / TERRA ARCHIVE -->
        <div class="doorway-card" data-slug="terra-archive">
          <div class="doorway-canvas-wrapper">
            <canvas id="canvas-doorway-03"></canvas>
          </div>
          <div class="doorway-meta">
            <div class="doorway-index">[ DOORWAY 03 ]</div>
            <div class="doorway-title">TERRA ARCHIVE</div>
            <div class="doorway-tech">Topographic LIDAR Contours</div>
          </div>
        </div>

        <!-- 04 / VOID / FORM -->
        <div class="doorway-card" data-slug="void-form">
          <div class="doorway-canvas-wrapper">
            <canvas id="canvas-doorway-04"></canvas>
          </div>
          <div class="doorway-meta">
            <div class="doorway-index">[ DOORWAY 04 ]</div>
            <div class="doorway-title">VOID / FORM</div>
            <div class="doorway-tech">Simplex Fluid Velocity Shader</div>
          </div>
        </div>

        <!-- 05 / THE LIVING ARCHIVE -->
        <div class="doorway-card" data-slug="the-living-archive">
          <div class="doorway-canvas-wrapper">
            <canvas id="canvas-doorway-05"></canvas>
          </div>
          <div class="doorway-meta">
            <div class="doorway-index">[ DOORWAY 05 ]</div>
            <div class="doorway-title">LIVING ARCHIVE</div>
            <div class="doorway-tech">Coupled Particle Swarm</div>
          </div>
        </div>
      </div>

      <div class="marginal-note" style="margin-top: 32px;">
        Click any doorway portal to enter the Full-Canvas Theater sandbox with live telemetry HUD.
      </div>
    `;

    this.initMicroEngines();
    this.setupListeners();

    // Viewport Culling Observer: Only compute and render when Act 04 is in view
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    this.observer.observe(this.containerEl);
  }

  private initMicroEngines(): void {
    const c1 = this.containerEl.querySelector('#canvas-doorway-01') as HTMLCanvasElement;
    const c2 = this.containerEl.querySelector('#canvas-doorway-02') as HTMLCanvasElement;
    const c3 = this.containerEl.querySelector('#canvas-doorway-03') as HTMLCanvasElement;
    const c4 = this.containerEl.querySelector('#canvas-doorway-04') as HTMLCanvasElement;
    const c5 = this.containerEl.querySelector('#canvas-doorway-05') as HTMLCanvasElement;

    if (c1) this.hyperEngine = new HyperthoughtMicroEngine(c1);
    if (c2) this.horoEngine = new HorologistMicroEngine(c2);
    if (c3) this.terraEngine = new TerraMicroEngine(c3);
    if (c4) this.voidEngine = new VoidMicroEngine(c4);
    if (c5) this.archiveEngine = new ArchiveMicroEngine(c5);

    masterTicker.register((time) => {
      if (!this.isVisible) return; // Zero GPU / CPU cycles when offscreen
      if (this.hyperEngine) this.hyperEngine.update(time);
      if (this.horoEngine) this.horoEngine.update(time);
      if (this.terraEngine) this.terraEngine.update(time);
      if (this.voidEngine) this.voidEngine.update(time);
      if (this.archiveEngine) this.archiveEngine.update();
    });
  }

  private setupListeners(): void {
    const cards = this.containerEl.querySelectorAll('.doorway-card');
    cards.forEach((card) => {
      const slug = card.getAttribute('data-slug');
      const project = PROVING_PROJECTS.find((p) => p.slug === slug);

      card.addEventListener('mouseenter', () => {
        soundEngine.playHoverChirp(700);
        if (slug === 'the-horologist') {
          soundEngine.startEscapementLoop();
        }
      });

      card.addEventListener('mouseleave', () => {
        if (slug === 'the-horologist') {
          soundEngine.stopEscapementLoop();
        }
      });

      card.addEventListener('click', () => {
        if (project) {
          theaterEngine.launch(project);
        }
      });
    });
  }
}
