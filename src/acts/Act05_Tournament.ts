import { soundEngine } from '../core/audio';

export class Act05_Tournament {
  private containerEl!: HTMLElement;
  private observer!: IntersectionObserver;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <style>
        .tournament-bracket-wrapper { position: relative; margin-top: 3rem; }
        .tournament-svg-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .tournament-line { fill: none; stroke: rgba(255, 255, 255, 0.15); stroke-width: 2; stroke-dasharray: 1000; stroke-dashoffset: 1000; transition: stroke-dashoffset 1.5s var(--ease-out-expo); }
        .tournament-line.active { stroke-dashoffset: 0; }
        
        .bracket-stages-row { position: relative; z-index: 1; display: flex; justify-content: space-between; gap: 2rem; }
        .bracket-stage-col { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        
        .candidate-card { background: rgba(24, 28, 36, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 6px; transition: all 0.3s; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 6px; cursor: pointer; }
        .candidate-card:hover { border-color: rgba(255, 255, 255, 0.3); transform: translateY(-2px); }
        
        .candidate-score-bar-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 4px; }
        .candidate-score-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease-out; width: 0%; }
        
        .tournament-eliminated { opacity: 0.5; text-decoration: line-through; }
        .tournament-eliminated .candidate-score-bar-fill { background: var(--accent-terracotta); }
        .tournament-advanced .candidate-score-bar-fill { background: var(--accent-cyan); }
        
        .tournament-verdict { font-family: var(--font-mono); font-size: 10px; font-weight: bold; }
        .verdict-advanced { color: var(--accent-cyan); }
        .verdict-eliminated { color: var(--accent-terracotta); }
        
        .stage-2-card { border-color: rgba(255, 255, 255, 0.25); margin: auto 0; }
        
        .champion-card { border: 2px solid #D4AF37; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); animation: champPulse 2s infinite alternate; margin: auto 0; }
        .champion-card .candidate-score-bar-fill { background: #D4AF37; }
        
        @keyframes champPulse {
          from { box-shadow: 0 0 10px rgba(212, 175, 55, 0.1); }
          to { box-shadow: 0 0 25px rgba(212, 175, 55, 0.4); }
        }
      </style>

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

      <div class="tournament-bracket-wrapper">
        <svg class="tournament-svg-overlay" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <path class="tournament-line line-stage-1" d="M 333,100 L 500,150" />
          <path class="tournament-line line-stage-1" d="M 333,200 L 500,150" />
          <path class="tournament-line line-stage-1" d="M 333,300 L 500,150" />
          
          <path class="tournament-line line-stage-1" d="M 333,400 L 500,450" />
          <path class="tournament-line line-stage-1" d="M 333,500 L 500,450" />
          
          <path class="tournament-line line-stage-2" d="M 666,150 L 833,300" />
          <path class="tournament-line line-stage-2" d="M 666,450 L 833,300" />
        </svg>

        <div class="bracket-stages-row">
          <!-- Stage 1 -->
          <div class="bracket-stage-col" data-stage="1">
            <div class="stage-header-title">STAGE 1: 5 BLIND CANDIDATES</div>
            
            <div class="candidate-card tournament-advanced" data-score="92">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between;">
                <span class="node-id">[ C1 ] Math Rigor</span>
                <span class="tournament-verdict verdict-advanced">ADVANCED: 92%</span>
              </div>
            </div>

            <div class="candidate-card tournament-advanced" data-score="88">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between;">
                <span class="node-id">[ C2 ] Terminology</span>
                <span class="tournament-verdict verdict-advanced">ADVANCED: 88%</span>
              </div>
            </div>

            <div class="candidate-card tournament-advanced" data-score="85">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between;">
                <span class="node-id">[ C3 ] Blender Bake</span>
                <span class="tournament-verdict verdict-advanced">ADVANCED: 85%</span>
              </div>
            </div>

            <div class="candidate-card tournament-eliminated" data-score="78">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between;">
                <span class="node-id">[ C4 ] Router</span>
                <span class="tournament-verdict verdict-eliminated">ELIMINATED: 78%</span>
              </div>
            </div>

            <div class="candidate-card tournament-eliminated" data-score="81">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between;">
                <span class="node-id">[ C5 ] Zero-GC</span>
                <span class="tournament-verdict verdict-eliminated">ELIMINATED: 81%</span>
              </div>
            </div>
          </div>

          <!-- Stage 2 -->
          <div class="bracket-stage-col" data-stage="2">
            <div class="stage-header-title">STAGE 2: CONSOLIDATION</div>
            
            <div class="candidate-card stage-2-card tournament-advanced" style="height: 120px; justify-content: center;" data-score="94">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span class="node-id">[ F1 ] Flash Fusion</span>
                <span class="tournament-verdict verdict-advanced">ADVANCED: 94%</span>
              </div>
              <span class="node-model">Grafted C1 + C2 + C3</span>
            </div>

            <div class="candidate-card stage-2-card tournament-eliminated" style="height: 120px; justify-content: center;" data-score="82">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span class="node-id">[ F2 ] Pro Fusion</span>
                <span class="tournament-verdict verdict-eliminated">ELIMINATED: 82%</span>
              </div>
              <span class="node-model">Grafted C4 + C5</span>
            </div>
          </div>

          <!-- Stage 3 -->
          <div class="bracket-stage-col" data-stage="3">
            <div class="stage-header-title">STAGE 3: CROWNED CHAMPION</div>
            
            <div class="candidate-card champion-card" style="height: 200px; justify-content: center;" data-score="97">
              <div class="candidate-score-bar-bg"><div class="candidate-score-bar-fill"></div></div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="node-id" style="color: #D4AF37; font-size: 14px;">★ GRAND CHAMPION ★</span>
                <span class="tournament-verdict" style="color: #D4AF37;">SCORE: 97%</span>
              </div>
              <span class="node-model" style="font-size: 13px; color: #FFF;">Gemini 3.7 Flash (High)</span>
              <span class="node-verdict" style="color: var(--accent-brass); font-size: 12px; margin-top: 8px;">creative-web-development</span>
              <div style="font-family: var(--font-mono); font-size: 10px; color: rgba(212, 175, 55, 0.8); margin-top: 12px; line-height: 1.4;">
                Decisive victory on algorithmic rigor, anti-synonyms, zero GC overhead, and camera optics.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="marginal-note" style="border-color: var(--accent-brass); margin-top: 32px; color: #A0A5B0;">
        Provenance: Verified in synthesis-report.md with complete cross-agent evaluation matrices.
      </div>
    `;

    this.setupListeners();
    this.setupScrollTrigger();
  }

  private setupListeners(): void {
    const cards = this.containerEl.querySelectorAll('.candidate-card');
    cards.forEach((card) => {
      const activate = () => {
        soundEngine.playHoverChirp(800);
      };
      card.addEventListener('mouseenter', activate);
      card.addEventListener('click', activate);
    });
  }

  private setupScrollTrigger(): void {
    const cards = this.containerEl.querySelectorAll('.candidate-card');
    const lines = this.containerEl.querySelectorAll('.tournament-line');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            
            cards.forEach((card, idx) => {
              setTimeout(() => {
                const fill = card.querySelector('.candidate-score-bar-fill') as HTMLElement;
                const score = card.getAttribute('data-score');
                if (fill && score) {
                  fill.style.width = `${score}%`;
                }
              }, idx * 100);
            });
            
            setTimeout(() => {
              lines.forEach(line => line.classList.add('active'));
            }, 300);

            this.observer.unobserve(this.containerEl);
          }
        });
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.containerEl);
  }
}
