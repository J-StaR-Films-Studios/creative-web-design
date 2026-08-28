import { SystemDAGRenderer } from '../components/SystemDAG';
import { masterTicker } from '../core/ticker';
import { soundEngine } from '../core/audio';

export class Act09_TheMachine {
  private containerEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private dagRenderer!: SystemDAGRenderer;
  private isContracted: boolean = false;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial" style="color: #00E5FF;">[ CHAPTER 09 ]</span>
          <span class="chapter-coordinates">[ END-TO-END META-COMPILER DAG ]</span>
        </div>
        <h2 class="chapter-title">THE MACHINE</h2>
        <div class="chapter-subtitle" style="color: #9EA3AD;">
          The complete architectural pipeline: from raw human curiosity to knowledge engineering, multi-agent tournaments, and living creative worlds.
        </div>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 16px;">
        <button class="theater-action-btn" id="dag-contract-btn">
          <span>[ TOGGLE CONTRACTION ]</span>
        </button>
      </div>

      <!-- DAG Canvas Viewport -->
      <div class="dag-canvas-container">
        <canvas id="dag-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>

      <div class="marginal-note" style="border-color: #00E5FF; margin-top: 24px; color: #8C92A0;">
        "We didn't build a website. We built the system that could build one."
      </div>
    `;

    this.canvasEl = this.containerEl.querySelector('#dag-canvas')!;
    this.dagRenderer = new SystemDAGRenderer(this.canvasEl);

    masterTicker.register((time) => {
      this.dagRenderer.update(time);
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    const contractBtn = this.containerEl.querySelector('#dag-contract-btn')!;
    contractBtn.addEventListener('click', () => {
      this.isContracted = !this.isContracted;
      this.dagRenderer.setContraction(this.isContracted ? 1.0 : 0.0);
      soundEngine.playHarmonicChord();
    });
  }
}
