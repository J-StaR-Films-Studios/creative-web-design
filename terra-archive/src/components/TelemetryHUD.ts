import { SubterraneanAudio } from './SubterraneanAudio';

export class TelemetryHUD {
  private container: HTMLElement;
  private hudEl!: HTMLElement;
  private depthValEl!: HTMLElement;
  private chapterEls: HTMLElement[] = [];
  private audio: SubterraneanAudio;
  private audioBtn!: HTMLElement;

  constructor(container: HTMLElement, audio: SubterraneanAudio) {
    this.container = container;
    this.audio = audio;
    this.renderDOM();
  }

  private renderDOM(): void {
    this.hudEl = document.createElement('div');
    this.hudEl.className = 'telemetry-hud-overlay';

    this.hudEl.innerHTML = `
      <!-- Top Navigation & Mission Dossier -->
      <header class="hud-header">
        <div class="hud-brand">
          <span class="brand-badge">ARCHAEAN SURVEY</span>
          <span class="brand-name">TERRA ARCHIVE</span>
          <span class="brand-sub">DOC // 2026.LIDAR.09</span>
        </div>
        <div class="hud-coords">
          <span class="coord-item">LAT: 36°14′22″ N</span>
          <span class="coord-item">LON: 112°12′08″ W</span>
          <span class="coord-item alert">SEISMIC: 7.83 Hz</span>
        </div>
      </header>

      <!-- Subterranean Depth Vertical Gauge (Left) -->
      <div class="hud-depth-gauge">
        <div class="depth-bar-track">
          <div class="depth-bar-fill" id="depth-bar-fill"></div>
        </div>
        <div class="depth-readout">
          <span class="depth-label">SUBTERRANEAN DEPTH</span>
          <span class="depth-value" id="hud-depth-val">0.0 m</span>
          <span class="depth-strata" id="hud-strata-val">SURFACE CRUST</span>
        </div>
      </div>

      <!-- Chapter Progress & Sound Toggle (Bottom) -->
      <footer class="hud-footer">
        <div class="hud-chapters">
          <div class="chapter-node active" data-shot="1">
            <span class="chap-num">01</span>
            <span class="chap-name">TOPOGRAPHY</span>
          </div>
          <div class="chap-divider"></div>
          <div class="chapter-node" data-shot="2">
            <span class="chap-num">02</span>
            <span class="chap-name">STRATIGRAPHY</span>
          </div>
          <div class="chap-divider"></div>
          <div class="chapter-node" data-shot="3">
            <span class="chap-num">03</span>
            <span class="chap-name">SPECIMENS</span>
          </div>
          <div class="chap-divider"></div>
          <div class="chapter-node" data-shot="4">
            <span class="chap-num">04</span>
            <span class="chap-name">CODEX</span>
          </div>
        </div>

        <div class="hud-audio-control">
          <button class="audio-toggle-btn" id="audio-toggle-btn" aria-label="Toggle Subterranean Ambient Audio">
            <span class="audio-icon">◈</span>
            <span class="audio-text">SOUND: MUTED</span>
          </button>
        </div>
      </footer>
    `;

    this.container.appendChild(this.hudEl);
    this.depthValEl = this.hudEl.querySelector('#hud-depth-val') as HTMLElement;
    this.chapterEls = Array.from(this.hudEl.querySelectorAll('.chapter-node'));
    this.audioBtn = this.hudEl.querySelector('#audio-toggle-btn') as HTMLElement;

    this.audioBtn.addEventListener('click', () => {
      const active = this.audio.toggle();
      const textEl = this.audioBtn.querySelector('.audio-text') as HTMLElement;
      const iconEl = this.audioBtn.querySelector('.audio-icon') as HTMLElement;

      if (active) {
        textEl.textContent = 'SOUND: ACTIVE';
        this.audioBtn.classList.add('active');
        iconEl.textContent = '◆';
      } else {
        textEl.textContent = 'SOUND: MUTED';
        this.audioBtn.classList.remove('active');
        iconEl.textContent = '◈';
      }
    });
  }

  public update(globalProgress: number): void {
    // Calculate simulated depth from 0m down to -3,500m
    const depth = (globalProgress * 3500.0).toFixed(1);
    this.depthValEl.textContent = `-${depth} m`;

    const fillEl = this.hudEl.querySelector('#depth-bar-fill') as HTMLElement;
    if (fillEl) {
      fillEl.style.height = `${(globalProgress * 100).toFixed(1)}%`;
    }

    const strataEl = this.hudEl.querySelector('#hud-strata-val') as HTMLElement;
    if (strataEl) {
      if (globalProgress < 0.25) strataEl.textContent = 'SURFACE CRUST';
      else if (globalProgress < 0.55) strataEl.textContent = 'SEDIMENTARY / BASALT';
      else if (globalProgress < 0.85) strataEl.textContent = 'ARCHAEOLOGICAL ZONE';
      else strataEl.textContent = 'PRIME ARCHAIC BEDROCK';
    }

    // Update active chapter node
    let activeIndex = 0;
    if (globalProgress >= 0.85) activeIndex = 3;
    else if (globalProgress >= 0.55) activeIndex = 2;
    else if (globalProgress >= 0.25) activeIndex = 1;

    this.chapterEls.forEach((el, index) => {
      if (index === activeIndex) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }
}
