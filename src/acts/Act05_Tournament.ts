import { soundEngine } from '../core/audio';

export class Act05_Tournament {
  private containerEl!: HTMLElement;
  private observer!: IntersectionObserver;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial" style="color: var(--accent-brass);">[ CHAPTER 05 ]</span>
          <span class="chapter-coordinates">[ MULTI-AGENT SYNTHESIS TOURNAMENT ]</span>
        </div>
        <h2 class="chapter-title">THE TOURNAMENT</h2>
        <div class="chapter-subtitle">
          Instead of a single summarization pass, 5 AI sub-agents competed in a blind multi-stage synthesis tournament to extract the ultimate creative engineering framework.
        </div>
      </div>

      <!-- Tournament Bracket Diagram -->
      <div class="tournament-bracket-wrapper">
        <div class="bracket-stages-row">
          <!-- Stage 1: Blind Synthesis -->
          <div class="bracket-stage-col" data-stage="1">
            <div class="stage-header-title">STAGE 1: 5 BLIND CANDIDATES</div>

            <div class="candidate-node" data-cand="c1">
              <span class="node-id">[ CANDIDATE 01 ]</span>
              <span class="node-model">Gemini 3.7 Flash (High)</span>
              <span class="node-verdict">Math Rigor & BT.601 Luminance</span>
            </div>

            <div class="candidate-node" data-cand="c2">
              <span class="node-id">[ CANDIDATE 02 ]</span>
              <span class="node-model">Gemini 3.7 Flash (High)</span>
              <span class="node-verdict">Terminology & Anti-Synonyms</span>
            </div>

            <div class="candidate-node" data-cand="c3">
              <span class="node-id">[ CANDIDATE 03 ]</span>
              <span class="node-model">Gemini 3.7 Flash (High)</span>
              <span class="node-verdict">Blender Bake & Camera FOV</span>
            </div>

            <div class="candidate-node" data-cand="c4">
              <span class="node-id">[ CANDIDATE 04 ]</span>
              <span class="node-model">Gemini 3.1 Pro (High)</span>
              <span class="node-verdict">Router & Decision Matrix</span>
            </div>

            <div class="candidate-node" data-cand="c5">
              <span class="node-id">[ CANDIDATE 05 ]</span>
              <span class="node-model">Gemini 3.1 Pro (High)</span>
              <span class="node-verdict">Zero-GC Loops & DPR Clamp</span>
            </div>
          </div>

          <!-- Stage 2: Dual Consolidation -->
          <div class="bracket-stage-col" data-stage="2">
            <div class="stage-header-title">STAGE 2: CONSOLIDATION</div>

            <div class="candidate-node" style="margin-top: 40px;" data-cand="f1">
              <span class="node-id">[ FINALIST A ]</span>
              <span class="node-model">Flash Synthesis Fusion</span>
              <span class="node-verdict">Grafted C1 + C2 + C3</span>
            </div>

            <div class="candidate-node" style="margin-top: 60px;" data-cand="f2">
              <span class="node-id">[ FINALIST B ]</span>
              <span class="node-model">Pro Synthesis Fusion</span>
              <span class="node-verdict">Grafted C4 + C5</span>
            </div>
          </div>

          <!-- Stage 3: Grand Finals -->
          <div class="bracket-stage-col" data-stage="3">
            <div class="stage-header-title">STAGE 3: CROWNED CHAMPION</div>

            <div class="candidate-node champion" style="margin-top: 70px;" data-cand="champ">
              <span class="node-id" style="color: var(--accent-brass);">★ GRAND CHAMPION ★</span>
              <span class="node-model" style="font-size: 15px;">Gemini 3.7 Flash (High)</span>
              <span class="node-verdict" style="color: var(--accent-brass);">creative-web-development</span>
              <div style="font-family: var(--font-mono); font-size: 9px; color: #D4AF37; margin-top: 6px;">
                Decisive victory on algorithmic rigor, anti-synonyms, zero GC overhead, and camera optics.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="marginal-note" style="border-color: var(--accent-brass); margin-top: 24px; color: #A0A5B0;">
        Provenance: Verified in synthesis-report.md with complete cross-agent evaluation matrices.
      </div>
    `;

    this.setupListeners();
    this.setupScrollTrigger();
  }

  private setupListeners(): void {
    const nodes = this.containerEl.querySelectorAll('.candidate-node');
    nodes.forEach((node) => {
      const activate = () => {
        soundEngine.playHoverChirp(800);
      };
      node.addEventListener('mouseenter', activate);
      node.addEventListener('click', activate);
    });
  }

  private setupScrollTrigger(): void {
    const nodes = this.containerEl.querySelectorAll('.candidate-node');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nodes.forEach((node, idx) => {
              setTimeout(() => {
                (node as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.4)';
                setTimeout(() => {
                  if (!node.classList.contains('champion')) {
                    (node as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }
                }, 400);
              }, idx * 100);
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.containerEl);
  }
}
