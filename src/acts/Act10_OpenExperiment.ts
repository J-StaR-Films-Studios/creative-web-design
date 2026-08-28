import { soundEngine } from '../core/audio';
import { masterTicker } from '../core/ticker';

export class Act10_OpenExperiment {
  private containerEl!: HTMLElement;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>
      <div class="reg-mark reg-bl">+</div>
      <div class="reg-mark reg-br">+</div>

      <div class="chapter-badge-row" style="margin-bottom: 24px;">
        <span class="chapter-serial" style="color: var(--accent-terracotta);">[ FINAL ACT ]</span>
        <span class="chapter-coordinates">[ THE OPEN EXPERIMENT ]</span>
      </div>

      <h2 class="experiment-final-question">CAN A MACHINE LEARN TASTE?</h2>
      <div class="experiment-final-answer">WE DON'T KNOW YET.</div>
      <div class="experiment-final-epigraph">"BUT NOW WE HAVE A WAY TO FIND OUT."</div>

      <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 16px;">
        <button class="theater-quick-launch" id="btn-restart-exp">
          <span>↺ RESTART EXHIBITION</span>
        </button>
        <a class="theater-quick-launch" href="#prologue" style="text-decoration: none;">
          <span>↑ RETURN TO BEGINNING</span>
        </a>
      </div>

      <div class="experiment-credits-box">
        <div><strong>RESILIENT DAVINCI INTERACTIVE EXHIBITION</strong></div>
        <div>Curated & Engineered with Gemini 3.7 Flash High Reasoning & Antigravity Systems Architecture</div>
        <div>Provenance Ledger: Rule-Based Expert Systems (1984) · CommonKADS · 44 Modular Skills · 5 Proving Worlds</div>
        <div style="color: var(--accent-terracotta); margin-top: 8px;">[ 05.2026 — LIVING INSTITUTION ]</div>
      </div>
    `;

    this.setupListeners();
  }

  private setupListeners(): void {
    const restartBtn = this.containerEl.querySelector('#btn-restart-exp');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        masterTicker.lenis.scrollTo(0, { duration: 1.5 });
        soundEngine.playHarmonicChord();
      });
    }
  }
}
