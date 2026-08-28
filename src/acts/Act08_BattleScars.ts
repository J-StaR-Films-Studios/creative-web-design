import { soundEngine } from '../core/audio';

export class Act08_BattleScars {
  private containerEl!: HTMLElement;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ CHAPTER 08 ]</span>
          <span class="chapter-coordinates">[ FORENSIC ENGINEERING CRIME SCENE ]</span>
        </div>
        <h2 class="chapter-title">THE BATTLE SCARS</h2>
        <div class="chapter-subtitle">
          Real expertise is forged through slain bugs. Verbatim reproduction of the production traps eliminated during compilation.
        </div>
      </div>

      <!-- 3 Core Slain Bug Cards -->
      <div class="battle-scars-grid">
        <!-- Bug 1: The Scroll-Lock Container Trap -->
        <div class="scar-card">
          <div class="scar-badge">[ SLAIN BUG #1 / COMMIT f986881 ]</div>
          <h3 class="scar-title">The Scroll-Lock Container Trap</h3>
          <p style="font-size: 13px; color: var(--ink-secondary); line-height: 1.4;">
            Conventional <code>height: 100%</code> rules on html/body completely lock Lenis smooth scroll calculations, trapping the user at top of page.
          </p>
          <div class="scar-code-diff">
            <span class="slain-comment">/* DEADLY: Locks scroll calculations */</span><br>
            <span class="slain-comment">- html, body { height: 100%; overflow: hidden; }</span><br><br>
            <span class="fix-line">/* PRODUCTION INVARIANT: */</span><br>
            <span class="fix-line">+ html { min-height: 100%; }</span><br>
            <span class="fix-line">+ body { min-height: 100vh; overflow-x: hidden; }</span><br>
            <span class="fix-line">+ html.lenis, html.lenis body { height: auto; }</span>
          </div>
        </div>

        <!-- Bug 2: Zero-Allocation Render Loop -->
        <div class="scar-card">
          <div class="scar-badge">[ SLAIN BUG #2 / GC CHURN ]</div>
          <h3 class="scar-title">Zero-Allocation RAF Invariant</h3>
          <p style="font-size: 13px; color: var(--ink-secondary); line-height: 1.4;">
            Instantiating vectors or matrices inside animation frame callbacks triggers aggressive Garbage Collection pauses and 40ms frame drops.
          </p>
          <div class="scar-code-diff">
            <span class="slain-comment">/* DEADLY: Allocates heap inside 60 FPS loop */</span><br>
            <span class="slain-comment">- function onTick() { const v = new THREE.Vector3(); }</span><br><br>
            <span class="fix-line">/* PRODUCTION INVARIANT: Pre-allocated scratch */</span><br>
            <span class="fix-line">+ const _v1 = new THREE.Vector3(); // Module scope</span><br>
            <span class="fix-line">+ function onTick() { _v1.set(x, y, z); }</span>
          </div>
        </div>

        <!-- Bug 3: GPU Thermal DPR Overheating -->
        <div class="scar-card">
          <div class="scar-badge">[ SLAIN BUG #3 / THERMAL THROTTLING ]</div>
          <h3 class="scar-title">Device Pixel Ratio Clamping</h3>
          <p style="font-size: 13px; color: var(--ink-secondary); line-height: 1.4;">
            Unclamped Retina DPR (3.0x or 4.0x) increases GPU fragment fill-rate workload by 900% without perceptible visual gains on mobile viewports.
          </p>
          <div class="scar-code-diff">
            <span class="slain-comment">/* DEADLY: Overheats mobile GPUs */</span><br>
            <span class="slain-comment">- renderer.setPixelRatio(window.devicePixelRatio);</span><br><br>
            <span class="fix-line">/* PRODUCTION INVARIANT: Clamped ceiling */</span><br>
            <span class="fix-line">+ const dpr = Math.min(window.devicePixelRatio || 1, 2.0);</span><br>
            <span class="fix-line">+ renderer.setPixelRatio(dpr);</span>
          </div>
        </div>
      </div>

      <div class="marginal-note" style="margin-top: 32px;">
        All invariants codified in creative-web-development/SKILL.md and verified with automated test suites.
      </div>
    `;

    this.setupListeners();
  }

  private setupListeners(): void {
    const cards = this.containerEl.querySelectorAll('.scar-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        soundEngine.playHoverChirp(550);
      });
    });
  }
}
