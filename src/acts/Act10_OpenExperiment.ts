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
      
      <!-- Primary Action CTA -->
      <div class="experiment-cta-row">
        <a class="experiment-primary-cta" href="https://github.com/J-StaR-Films-Studios/VibeCode-Protocol-Suite/tree/main/assets/.agent/skills/frontend-ui/creative-web-development" target="_blank" rel="noopener noreferrer">
          <span>TRY IT YOURSELF ↗</span>
        </a>
      </div>

      <!-- Video Documentaries Grid -->
      <div class="experiment-videos-container">
        <div class="video-card">
          <div class="video-embed-wrapper">
            <iframe src="https://www.youtube.com/embed/AUrc9VUKZLI" title="Watch: Creative Web Design" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="video-card-caption">
            <span class="video-tag">[ ESSAY ]</span>
            <span class="video-title">Why Most AI Web Designs Look Predictable</span>
          </div>
        </div>

        <div class="video-card">
          <div class="video-embed-wrapper">
            <iframe src="https://www.youtube.com/embed/GXUFMqxGalQ" title="Watch: Building AI Skills" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="video-card-caption">
            <span class="video-tag">[ ARCHITECTURE ]</span>
            <span class="video-title">Building 50+ Custom AI Skills & Knowledge Systems</span>
          </div>
        </div>
      </div>

      <!-- Navigational Reset Controls -->
      <div class="experiment-nav-controls">
        <button class="theater-quick-launch" id="btn-restart-exp">
          <span>↺ RESTART EXHIBITION</span>
        </button>
        <a class="theater-quick-launch" href="#prologue" style="text-decoration: none;">
          <span>↑ RETURN TO BEGINNING</span>
        </a>
      </div>

      <!-- Unified Exhibition Colophon & Studio Credits -->
      <footer class="exhibition-colophon-footer">
        <div class="colophon-institution-name">RESILIENT DAVINCI INTERACTIVE EXHIBITION</div>
        
        <div class="colophon-studio-row">
          <span>An original creative inquiry by</span>
          <a class="colophon-studio-link" href="https://jstarstudios.com" target="_blank" rel="noopener noreferrer">
            <strong>J StaR Films Studios</strong>
          </a>
        </div>

        <div class="colophon-channels-row">
          <a class="colophon-pill-link" href="https://jstarstudios.com" target="_blank" rel="noopener noreferrer">
            <span>[ JSTARSTUDIOS.COM ↗ ]</span>
          </a>
          <a class="colophon-pill-link" href="https://www.youtube.com/jstarfilms" target="_blank" rel="noopener noreferrer">
            <span>[ YOUTUBE @JSTARFILMS ↗ ]</span>
          </a>
          <a class="colophon-pill-link" href="https://github.com/J-StaR-Films-Studios/VibeCode-Protocol-Suite" target="_blank" rel="noopener noreferrer">
            <span>[ VIBECODE PROTOCOL ↗ ]</span>
          </a>
        </div>

        <div class="colophon-metadata">
          <div>Curated & Engineered with Gemini 3.7 Flash High Reasoning & Antigravity Systems Architecture</div>
          <div>Provenance: Rule-Based Expert Systems (1984) · CommonKADS · 44 Modular Skills · 5 Proving Worlds</div>
        </div>

        <div class="colophon-stamp-row">
          <span class="colophon-stamp">[ 05.2026 — LIVING INSTITUTION ]</span>
          <span class="colophon-dot">·</span>
          <a class="colophon-domain" href="https://design.jstarstudios.com">design.jstarstudios.com</a>
          <span class="colophon-dot">·</span>
          <span>© 2026 J StaR Films Studios. All rights reserved.</span>
        </div>
      </footer>
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
