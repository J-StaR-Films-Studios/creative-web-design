import { theaterEngine, PROVING_PROJECTS } from '../components/FullCanvasTheater';
import { soundEngine } from '../core/audio';

export class Act07_ProvingGround {
  private containerEl!: HTMLElement;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial" style="color: var(--accent-vermillion);">[ CHAPTER 07 ]</span>
          <span class="chapter-coordinates">[ THE PROVING GROUND / FULL-CANVAS THEATER ]</span>
        </div>
        <h2 class="chapter-title">THE PROVING GROUND</h2>
        <div class="chapter-subtitle" style="color: #9CA3AF;">
          Five complete, production-grade interactive sub-websites compiled directly inside the exhibition. Click any monolith to launch its live canvas sandbox.
        </div>
      </div>

      <!-- 5 Proving Monoliths -->
      <div class="proving-monoliths-grid">
        ${PROVING_PROJECTS.map(
          (p) => `
          <div class="monolith-card" data-slug="${p.slug}">
            <div>
              <div class="monolith-header">
                <span class="monolith-num">[ PROVING WORLD ${p.id} ]</span>
                <span class="monolith-status-dot"></span>
              </div>
              <h3 class="monolith-name">${p.name}</h3>
              <div class="monolith-desc">${p.subtitle}</div>
            </div>

            <div>
              <div style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-terracotta); margin-bottom: 12px;">
                ${p.tech}
              </div>
              <button class="monolith-launch-btn">
                <span>LAUNCH EXPERIENCE</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        `
        ).join('')}
      </div>

      <div class="marginal-note" style="border-color: var(--accent-vermillion); margin-top: 36px; color: #8C92A0;">
        Zero page reloads. Persistent HUD telemetry, draw call budget monitoring, and "The Pain Behind This" crucible drawer.
      </div>
    `;

    this.setupListeners();
  }

  private setupListeners(): void {
    const cards = this.containerEl.querySelectorAll('.monolith-card');
    cards.forEach((card) => {
      const slug = card.getAttribute('data-slug');
      const project = PROVING_PROJECTS.find((p) => p.slug === slug);

      card.addEventListener('mouseenter', () => {
        soundEngine.playHoverChirp(600);
      });

      card.addEventListener('click', () => {
        if (project) {
          theaterEngine.launch(project);
        }
      });
    });
  }
}
