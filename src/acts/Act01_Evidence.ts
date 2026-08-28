import { calculateLuminance, getCoverDimensions } from '../core/math';
import { soundEngine } from '../core/audio';

export class Act01_Evidence {
  private containerEl!: HTMLElement;
  public currentTab: string = 'spring';
  private observer!: IntersectionObserver;
  private autoCycleIndex: number = 0;
  private autoCycleTimer: number | null = null;

  public getCurrentTab(): string {
    return this.currentTab;
  }

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ CHAPTER 01 ]</span>
          <span class="chapter-coordinates">[ REF. 01–05 / FORENSIC DECONSTRUCTION ]</span>
        </div>
        <h2 class="chapter-title">THE MACHINE DIDN'T KNOW</h2>
        <div class="chapter-subtitle">
          Prompts like "Make it look like Awwwards" failed because the models named libraries without understanding the underlying physics and computational pipelines.
        </div>
      </div>

      <!-- 5 Architectural Evidence Cards -->
      <div class="evidence-table-grid" id="evidence-cards-grid">
        <div class="evidence-card active" data-ref="huyml" data-tab-target="spring">
          <div>
            <div class="evidence-ref">[ REF. 01 / HUYML ]</div>
            <div class="evidence-name">Kinetic Typography</div>
            <div class="evidence-technique">SplitText glyph masks, char-level stagger delays, counter-rotating overflow clipping.</div>
          </div>
          <div class="evidence-math-preview">f(t) = rotX(sin(t) * 90deg)</div>
        </div>

        <div class="evidence-card" data-ref="bunq" data-tab-target="noise">
          <div>
            <div class="evidence-ref">[ REF. 02 / BUNQ LABS ]</div>
            <div class="evidence-name">Fluid GPU Distortion</div>
            <div class="evidence-technique">Fragment shader liquid distortion driven by mouse velocity uniforms with chromatic aberration.</div>
          </div>
          <div class="evidence-math-preview">uVelocity = (p_t - p_t-1) / dt</div>
        </div>

        <div class="evidence-card" data-ref="butter" data-tab-target="cover">
          <div>
            <div class="evidence-ref">[ REF. 03 / BUTTER ]</div>
            <div class="evidence-name">Frame Scrubbing</div>
            <div class="evidence-technique">In-memory Image[] buffer array scrubbing at deterministic 60 FPS on 2D canvas with cover UV.</div>
          </div>
          <div class="evidence-math-preview">frame = floor(p * totalFrames)</div>
        </div>

        <div class="evidence-card" data-ref="superlocal" data-tab-target="cover">
          <div>
            <div class="evidence-ref">[ REF. 04 / SUPERLOCAL ]</div>
            <div class="evidence-name">3D Spatial Tracking</div>
            <div class="evidence-technique">Blender camera sensor height matching with Three.js PerspectiveCamera vertical FOV.</div>
          </div>
          <div class="evidence-math-preview">FOV = 2*atan(Sensor/2F)*180/π</div>
        </div>

        <div class="evidence-card" data-ref="oryzo" data-tab-target="luminance">
          <div>
            <div class="evidence-ref">[ REF. 05 / ORYZO ]</div>
            <div class="evidence-name">Hybrid Baked Pipeline</div>
            <div class="evidence-technique">Offline Blender Cycles light baking to diffuse maps layered under real-time WebGL interactive meshes.</div>
          </div>
          <div class="evidence-math-preview">Material = MeshBasic + Lightmap</div>
        </div>
      </div>

      <!-- Deconstruction Mathematical Matrix -->
      <div class="math-dissection-matrix">
        <div class="dissection-tabs">
          <button class="dissection-tab-btn active" data-tab="spring">01 / CURSOR SPRING PHYSICS</button>
          <button class="dissection-tab-btn" data-tab="luminance">02 / TEXT PHOTOMETRIC LUMINANCE</button>
          <button class="dissection-tab-btn" data-tab="cover">03 / GLSL ASPECT COVER UV</button>
          <button class="dissection-tab-btn" data-tab="noise">04 / 3D FBM SIMPLEX NOISE</button>
        </div>

        <div class="dissection-display" id="dissection-display-content">
          <!-- Dynamic Content Rendered Here -->
        </div>

        <div class="marginal-note">
          "The beautiful thing wasn't magic. It was knowledge."
        </div>
      </div>
    `;

    this.setupListeners();
    this.renderTabContent('spring');
    this.setupScrollTrigger();
  }

  private setupListeners(): void {
    const tabButtons = this.containerEl.querySelectorAll('.dissection-tab-btn');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab') || 'spring';
        this.currentTab = tab;
        this.renderTabContent(tab);
        soundEngine.playHoverChirp(600);
      });
    });

    const cards = this.containerEl.querySelectorAll('.evidence-card');
    cards.forEach((card) => {
      // Hover and Mobile Tap Support
      const activateCard = () => {
        cards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        const targetTab = card.getAttribute('data-tab-target');
        if (targetTab && targetTab !== this.currentTab) {
          this.currentTab = targetTab;
          tabButtons.forEach((b) => {
            if (b.getAttribute('data-tab') === targetTab) b.classList.add('active');
            else b.classList.remove('active');
          });
          this.renderTabContent(targetTab);
        }
        soundEngine.playHoverChirp(720);
      };

      card.addEventListener('mouseenter', activateCard);
      card.addEventListener('click', activateCard);
    });
  }

  private setupScrollTrigger(): void {
    const cards = this.containerEl.querySelectorAll('.evidence-card');
    const tabs = ['spring', 'noise', 'cover', 'cover', 'luminance'];

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Auto-cycle through evidence cards gently on mobile view
            if (!this.autoCycleTimer && window.innerWidth < 768) {
              this.autoCycleTimer = window.setInterval(() => {
                this.autoCycleIndex = (this.autoCycleIndex + 1) % cards.length;
                cards.forEach((c, idx) => {
                  if (idx === this.autoCycleIndex) c.classList.add('active');
                  else c.classList.remove('active');
                });
                const tab = tabs[this.autoCycleIndex];
                if (tab && tab !== this.currentTab) {
                  this.currentTab = tab;
                  const tabButtons = this.containerEl.querySelectorAll('.dissection-tab-btn');
                  tabButtons.forEach((b) => {
                    if (b.getAttribute('data-tab') === tab) b.classList.add('active');
                    else b.classList.remove('active');
                  });
                  this.renderTabContent(tab);
                }
              }, 3200);
            }
          } else {
            if (this.autoCycleTimer) {
              clearInterval(this.autoCycleTimer);
              this.autoCycleTimer = null;
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.containerEl);
  }

  private renderTabContent(tab: string): void {
    const displayEl = this.containerEl.querySelector('#dissection-display-content')!;

    if (tab === 'spring') {
      displayEl.innerHTML = `
        <div>
          <div class="dissection-formula">
            <strong>Hooke's Law Spring Damping</strong><br>
            <code>F_spring = -k * (x - x_base) - d * v</code><br><br>
            <code>F_repel = -(Δx / r) * (1 - r / R_max) * F_factor</code>
          </div>
          <p style="margin-top: 14px; font-size: 13px; color: var(--ink-secondary); line-height: 1.5;">
            Particles and cursor followers must remember their immutable origin anchor <code>(baseX, baseY)</code>. Repelled by pointer velocity, they elastically reconstruct 100% legibility.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div><strong>INTERACTIVE SPRING TESTER</strong></div>
          <div class="dissection-sandbox-slider">
            <label>Stiffness (k):</label>
            <input type="range" id="slider-k" min="0.01" max="0.2" step="0.01" value="0.06">
            <span id="val-k">0.06</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label>Damping (d):</label>
            <input type="range" id="slider-d" min="0.5" max="0.98" step="0.02" value="0.88">
            <span id="val-d">0.88</span>
          </div>
          <div style="font-size: 11px; color: var(--accent-vermillion); margin-top: 8px;">
            Harmonic Period: <span id="spring-period">12.4 frames to settle</span>
          </div>
        </div>
      `;

      const kInput = displayEl.querySelector('#slider-k') as HTMLInputElement;
      const dInput = displayEl.querySelector('#slider-d') as HTMLInputElement;
      const kVal = displayEl.querySelector('#val-k')!;
      const dVal = displayEl.querySelector('#val-d')!;
      const periodVal = displayEl.querySelector('#spring-period')!;

      const updateValues = () => {
        kVal.textContent = kInput.value;
        dVal.textContent = dInput.value;
        const k = parseFloat(kInput.value);
        const d = parseFloat(dInput.value);
        const frames = Math.round((2 * Math.PI) / Math.sqrt(k) * (1 / d));
        periodVal.textContent = `${frames} frames to settle`;
      };

      kInput.addEventListener('input', updateValues);
      dInput.addEventListener('input', updateValues);
    } else if (tab === 'luminance') {
      const lum = calculateLuminance(255, 120, 40).toFixed(2);
      displayEl.innerHTML = `
        <div>
          <div class="dissection-formula">
            <strong>Photometric Luminance (ITU-R BT.601)</strong><br>
            <code>Luminance = √(0.299 R² + 0.587 G² + 0.114 B²) / 100</code><br><br>
            <code>Index = (y * 4 * width) + (x * 4)</code>
          </div>
          <p style="margin-top: 14px; font-size: 13px; color: var(--ink-secondary); line-height: 1.5;">
            Human eyes perceive green far more intensely than blue. Calculating true photometric luminance ensures text particles only spawn on readable letterforms.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div><strong>LUMINANCE SAMPLER</strong></div>
          <div class="dissection-sandbox-slider">
            <label>R (Red):</label>
            <input type="range" id="slider-r" min="0" max="255" value="255">
            <span id="val-r">255</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label>G (Green):</label>
            <input type="range" id="slider-g" min="0" max="255" value="120">
            <span id="val-g">120</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label>B (Blue):</label>
            <input type="range" id="slider-b" min="0" max="255" value="40">
            <span id="val-b">40</span>
          </div>
          <div style="font-size: 12px; color: var(--accent-vermillion); margin-top: 8px;">
            Perceived Luminance: <strong id="lum-result">${lum}</strong>
          </div>
        </div>
      `;

      const rIn = displayEl.querySelector('#slider-r') as HTMLInputElement;
      const gIn = displayEl.querySelector('#slider-g') as HTMLInputElement;
      const bIn = displayEl.querySelector('#slider-b') as HTMLInputElement;
      const lumRes = displayEl.querySelector('#lum-result')!;

      const updateLum = () => {
        const r = parseInt(rIn.value, 10);
        const g = parseInt(gIn.value, 10);
        const b = parseInt(bIn.value, 10);
        (displayEl.querySelector('#val-r') as HTMLElement).textContent = r.toString();
        (displayEl.querySelector('#val-g') as HTMLElement).textContent = g.toString();
        (displayEl.querySelector('#val-b') as HTMLElement).textContent = b.toString();
        lumRes.textContent = calculateLuminance(r, g, b).toFixed(2);
      };

      rIn.addEventListener('input', updateLum);
      gIn.addEventListener('input', updateLum);
      bIn.addEventListener('input', updateLum);
    } else if (tab === 'cover') {
      const dims = getCoverDimensions(1920, 1080, 1000, 1000);
      displayEl.innerHTML = `
        <div>
          <div class="dissection-formula">
            <strong>Aspect-Corrected Cover UV (GLSL & Canvas)</strong><br>
            <code>vec2 ratio = vec2(<br>
            &nbsp;&nbsp;min((planeRes.x/planeRes.y)/(mediaRes.x/mediaRes.y), 1.0),<br>
            &nbsp;&nbsp;min((planeRes.y/planeRes.x)/(mediaRes.y/mediaRes.x), 1.0)<br>
            );</code>
          </div>
          <p style="margin-top: 14px; font-size: 13px; color: var(--ink-secondary); line-height: 1.5;">
            Prevents texture stretching and aspect distortion when rendering full-bleed canvases or video frame sequences across varying viewport aspect ratios.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div><strong>CONTAINER COVER MATH</strong></div>
          <div style="padding: 10px; background: #FFF; border: 1px solid var(--ink-border);">
            <div>Viewport: 1920 × 1080 (16:9)</div>
            <div>Media Texture: 1000 × 1000 (1:1)</div>
            <div style="color: var(--accent-vermillion); margin-top: 6px;">
              Computed Render Size: <strong>${dims.width} × ${dims.height}px</strong><br>
              Centering Offset: <strong>(${dims.offsetX}px, ${dims.offsetY}px)</strong>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'noise') {
      displayEl.innerHTML = `
        <div>
          <div class="dissection-formula">
            <strong>4-Octave Fractional Brownian Motion (FBM)</strong><br>
            <code>float fbm(vec2 p) {<br>
            &nbsp;&nbsp;float v = 0.0; float a = 0.5;<br>
            &nbsp;&nbsp;for (int i = 0; i < 4; i++) {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;v += a * snoise(p); p *= 2.0; a *= 0.5;<br>
            &nbsp;&nbsp;}<br>
            &nbsp;&nbsp;return v;<br>
            }</code>
          </div>
          <p style="margin-top: 14px; font-size: 13px; color: var(--ink-secondary); line-height: 1.5;">
            By layering successive octaves of Simplex noise with doubling frequency and halving amplitude, continuous fluid membranes and organic surface ripples are generated.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div><strong>FBM ATTRIBUTES</strong></div>
          <div>Octaves: <strong>4</strong></div>
          <div>Lacunarity: <strong>2.0</strong></div>
          <div>Gain / Persistence: <strong>0.5</strong></div>
          <div style="color: var(--accent-vermillion); margin-top: 6px;">
            GPU Uniform: <code>uTime * 0.001</code>
          </div>
        </div>
      `;
    }
  }
}
