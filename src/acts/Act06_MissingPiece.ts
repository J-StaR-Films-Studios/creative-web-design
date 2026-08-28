import { soundEngine } from '../core/audio';

export class Act06_MissingPiece {
  private containerEl!: HTMLElement;
  private observer!: IntersectionObserver;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ CHAPTER 06 ]</span>
          <span class="chapter-coordinates">[ PHASE 0 / THE CINEMATIC TIMELINE ]</span>
        </div>
        <h2 class="chapter-title">THE MISSING PIECE</h2>
        <div class="chapter-subtitle">
          "We had learned how to build effects. We hadn't learned how to build an experience. A website is not a collection of static web pages. It is a cinematic video unfolding shot-by-shot through time."
        </div>
      </div>

      <!-- 4-Track Master Timeline -->
      <div class="tracks-master-timeline">
        <!-- Track 1: Camera Track -->
        <div class="timeline-track-row" data-track="1">
          <div class="track-label-col">
            <span class="track-number">[ TRACK 01 ]</span>
            <span class="track-name">Camera & Sensor</span>
          </div>
          <div class="track-visual-bar">
            <div class="track-phase-segment">0% Wide Ambient</div>
            <div class="track-phase-segment">30% Dolly Macro Zoom</div>
            <div class="track-phase-segment">60% 90° Lateral Pan</div>
            <div class="track-phase-segment">90% Aperture Wipe</div>
          </div>
        </div>

        <!-- Track 2: Subject Action -->
        <div class="timeline-track-row" data-track="2">
          <div class="track-label-col">
            <span class="track-number">[ TRACK 02 ]</span>
            <span class="track-name">Subject Mechanism</span>
          </div>
          <div class="track-visual-bar">
            <div class="track-phase-segment">Resting State Float</div>
            <div class="track-phase-segment">PBR Layer Explosion</div>
            <div class="track-phase-segment">Morph to Wireframe</div>
            <div class="track-phase-segment">Elastic Snap Docking</div>
          </div>
        </div>

        <!-- Track 3: Typography Track -->
        <div class="timeline-track-row" data-track="3">
          <div class="track-label-col">
            <span class="track-number">[ TRACK 03 ]</span>
            <span class="track-name">Kinetic Typography</span>
          </div>
          <div class="track-visual-bar">
            <div class="track-phase-segment">Counter-Mask Clip</div>
            <div class="track-phase-segment">SplitText Stagger</div>
            <div class="track-phase-segment">Spatial Drift [ 3D ]</div>
            <div class="track-phase-segment">Thesis Re-convergence</div>
          </div>
        </div>

        <!-- Track 4: Sound & Interaction -->
        <div class="timeline-track-row" data-track="4">
          <div class="track-label-col">
            <span class="track-number">[ TRACK 04 ]</span>
            <span class="track-name">Sound & Physics</span>
          </div>
          <div class="track-visual-bar">
            <div class="track-phase-segment">Binaural Drone (52Hz)</div>
            <div class="track-phase-segment">Hooke Cursor Repel</div>
            <div class="track-phase-segment">4Hz Horological Tick</div>
            <div class="track-phase-segment">Harmonic Resolution</div>
          </div>
        </div>
      </div>

      <div class="marginal-note" style="margin-top: 28px;">
        Codified in docs/creative-web-development-spec.md as Mandatory Phase 0 Storyboarding.
      </div>
    `;

    this.setupListeners();
    this.setupScrollTrigger();
  }

  private setupListeners(): void {
    const rows = this.containerEl.querySelectorAll('.timeline-track-row');
    rows.forEach((row, idx) => {
      const activate = () => {
        soundEngine.playHoverChirp(440 + idx * 70);
      };
      row.addEventListener('mouseenter', activate);
      row.addEventListener('click', activate);
    });
  }

  private setupScrollTrigger(): void {
    const rows = this.containerEl.querySelectorAll('.timeline-track-row');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            rows.forEach((row, idx) => {
              setTimeout(() => {
                (row as HTMLElement).style.transform = 'translateX(8px)';
                (row as HTMLElement).style.borderColor = 'var(--accent-vermillion)';
                setTimeout(() => {
                  (row as HTMLElement).style.transform = 'translateX(0)';
                  (row as HTMLElement).style.borderColor = 'var(--ink-border)';
                }, 350);
              }, idx * 120);
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.containerEl);
  }
}
