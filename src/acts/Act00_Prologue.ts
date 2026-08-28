import { CardHeapSimulation } from '../components/CardHeapPhysics';
import { masterTicker } from '../core/ticker';
import { soundEngine } from '../core/audio';

export class Act00_Prologue {
  private containerEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private simulation!: CardHeapSimulation;
  private typewriterEl!: HTMLElement;
  private strikeEl!: HTMLElement;
  private hasExploded: boolean = false;
  private observer!: IntersectionObserver;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>
      <div class="reg-mark reg-bl">+</div>
      <div class="reg-mark reg-br">+</div>

      <canvas class="prologue-canvas-container" id="prologue-canvas"></canvas>

      <div class="prologue-content">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ PROLOGUE ]</span>
          <span class="chapter-coordinates">[ 05.2026 — PRESENT ]</span>
        </div>

        <h1 class="prologue-hero-title">RESILIENT DAVINCI</h1>
        <div class="prologue-subtitle">AN EXPERIMENT IN TEACHING MACHINES HOW TO CREATE.</div>

        <div class="prologue-typewriter-box" id="prologue-typewriter">
          <span id="typewriter-text"></span>
        </div>

        <div class="prologue-resolution-strike" id="prologue-strike">
          WE NEEDED TO TEACH IT DIFFERENTLY.
        </div>
      </div>
    `;

    this.canvasEl = this.containerEl.querySelector('#prologue-canvas')!;
    this.typewriterEl = this.containerEl.querySelector('#typewriter-text')!;
    this.strikeEl = this.containerEl.querySelector('#prologue-strike')!;

    this.simulation = new CardHeapSimulation(this.canvasEl);

    // Viewport Culling Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.simulation.isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            this.simulation.isSleeping = false;
          }
        });
      },
      { threshold: 0.05 }
    );
    this.observer.observe(this.containerEl);

    // Register render loop in master ticker
    masterTicker.register(() => {
      if (this.simulation.isVisible && !this.simulation.isSleeping) {
        this.simulation.update();
        this.simulation.render();
      }
    });

    this.startTypewriterSequence();
  }

  private startTypewriterSequence(): void {
    const text1 = 'The problem was never that AI couldn\'t write code.';
    const text2 = ' The problem was that it kept making ';
    const strikePhrase = 'THE SAME THING.';

    let index = 0;
    this.typewriterEl.textContent = '';

    const typeFirstPart = () => {
      if (index < text1.length) {
        this.typewriterEl.textContent += text1.charAt(index);
        index++;
        if (index % 4 === 0) soundEngine.playSubtleTick();
        setTimeout(typeFirstPart, 30);
      } else {
        setTimeout(() => {
          let index2 = 0;
          const typeSecondPart = () => {
            if (index2 < text2.length) {
              this.typewriterEl.textContent += text2.charAt(index2);
              index2++;
              if (index2 % 4 === 0) soundEngine.playSubtleTick();
              setTimeout(typeSecondPart, 30);
            } else {
              const span = document.createElement('span');
              span.className = 'strike-word';
              span.textContent = strikePhrase;
              this.typewriterEl.appendChild(span);

              setTimeout(() => {
                this.triggerExplosion();
              }, 400);
            }
          };
          typeSecondPart();
        }, 500);
      }
    };

    setTimeout(typeFirstPart, 300);
  }

  public triggerExplosion(): void {
    if (this.hasExploded) return;
    this.hasExploded = true;

    const strikeWord = this.containerEl.querySelector('.strike-word');
    if (strikeWord) {
      const rect = strikeWord.getBoundingClientRect();
      const canvasRect = this.canvasEl.getBoundingClientRect();
      const originX = rect.left + rect.width / 2 - canvasRect.left;
      const originY = rect.top + rect.height / 2 - canvasRect.top;
      this.simulation.triggerExplosion(originX, originY);
    } else {
      this.simulation.triggerExplosion();
    }

    soundEngine.playHarmonicChord();

    setTimeout(() => {
      this.strikeEl.classList.add('visible');
    }, 1000);
  }
}
