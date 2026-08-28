import { calculateLuminance, getCoverDimensions } from '../core/math';
import { soundEngine } from '../core/audio';

export class Act01_Evidence {
  private containerEl!: HTMLElement;
  public currentTab: string = 'spring';
  private observer!: IntersectionObserver;
  private autoCycleIndex: number = 0;
  private autoCycleTimer: number | null = null;
  private animFrameId: number | null = null;

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

  private cancelCurrentAnim(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private renderTabContent(tab: string): void {
    this.cancelCurrentAnim();
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
            Drag your mouse/finger across the canvas below or adjust sliders to test the harmonic oscillator live.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>LIVE SPRING OSCILLATOR</strong>
            <span style="font-size: 10px; color: var(--accent-terracotta);">DRAG CANVAS OR SLIDERS</span>
          </div>

          <canvas id="spring-canvas" width="280" height="110" style="width: 100%; height: 110px; background: #FAF8F4; border: 1px solid var(--ink-border); display: block; cursor: crosshair;"></canvas>

          <div class="dissection-sandbox-slider">
            <label>Stiffness (k):</label>
            <input type="range" id="slider-k" min="0.01" max="0.25" step="0.01" value="0.08">
            <span id="val-k">0.08</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label>Damping (d):</label>
            <input type="range" id="slider-d" min="0.60" max="0.98" step="0.01" value="0.88">
            <span id="val-d">0.88</span>
          </div>
          <div style="font-size: 11px; color: var(--accent-vermillion); display: flex; justify-content: space-between;">
            <span>Oscillation Settling: <strong id="spring-period">8.5 frames</strong></span>
            <span style="color: var(--ink-tertiary);">f(x) = e^(-dt) * cos(ωt)</span>
          </div>
        </div>
      `;

      const canvas = displayEl.querySelector('#spring-canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      const kInput = displayEl.querySelector('#slider-k') as HTMLInputElement;
      const dInput = displayEl.querySelector('#slider-d') as HTMLInputElement;
      const kVal = displayEl.querySelector('#val-k')!;
      const dVal = displayEl.querySelector('#val-d')!;
      const periodVal = displayEl.querySelector('#spring-period')!;

      let stiffness = parseFloat(kInput.value);
      let damping = parseFloat(dInput.value);

      const updateValues = () => {
        stiffness = parseFloat(kInput.value);
        damping = parseFloat(dInput.value);
        kVal.textContent = stiffness.toFixed(2);
        dVal.textContent = damping.toFixed(2);
        const frames = Math.round((2 * Math.PI) / Math.sqrt(stiffness) * (1 / damping));
        periodVal.textContent = `${frames} frames`;
      };

      kInput.addEventListener('input', updateValues);
      dInput.addEventListener('input', updateValues);

      // Interactive Spring Physics Loop
      let posX = canvas.width / 2;
      let posY = canvas.height / 2;
      const targetX = canvas.width / 2;
      const targetY = canvas.height / 2;
      let vx = 0;
      let vy = 0;
      let isDragging = false;

      const handlePointer = (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        posX = (clientX - rect.left) * scaleX;
        posY = (clientY - rect.top) * scaleY;
        vx = 0;
        vy = 0;
      };

      canvas.addEventListener('mousedown', (e) => { isDragging = true; handlePointer(e.clientX, e.clientY); });
      window.addEventListener('mousemove', (e) => { if (isDragging) handlePointer(e.clientX, e.clientY); });
      window.addEventListener('mouseup', () => { isDragging = false; });

      canvas.addEventListener('touchstart', (e) => { isDragging = true; if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      canvas.addEventListener('touchmove', (e) => { if (isDragging && e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      window.addEventListener('touchend', () => { isDragging = false; });

      // Initial kick impulse
      vx = 8;
      vy = -4;

      const renderSpring = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!isDragging) {
          const ax = -stiffness * (posX - targetX);
          const ay = -stiffness * (posY - targetY);
          vx = (vx + ax) * damping;
          vy = (vy + ay) * damping;
          posX += vx;
          posY += vy;
        }

        // Draw Anchor
        ctx.fillStyle = '#C86432';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw Spring Coils
        ctx.strokeStyle = '#FF3B00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);

        const segments = 8;
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const px = targetX + (posX - targetX) * t;
          const py = targetY + (posY - targetY) * t;
          const perpX = -(posY - targetY) * 0.15 * Math.sin(t * Math.PI * 4);
          const perpY = (posX - targetX) * 0.15 * Math.sin(t * Math.PI * 4);
          ctx.lineTo(px + perpX, py + perpY);
        }
        ctx.lineTo(posX, posY);
        ctx.stroke();

        // Draw Oscillating Mass Node
        ctx.fillStyle = '#121316';
        ctx.beginPath();
        ctx.arc(posX, posY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        this.animFrameId = requestAnimationFrame(renderSpring);
      };

      this.animFrameId = requestAnimationFrame(renderSpring);

    } else if (tab === 'luminance') {
      displayEl.innerHTML = `
        <div>
          <div class="dissection-formula">
            <strong>Photometric Luminance (ITU-R BT.601)</strong><br>
            <code>Luminance = √(0.299 R² + 0.587 G² + 0.114 B²) / 100</code><br><br>
            <code>Threshold = Perceived > 1.30 ? BLACK : WHITE</code>
          </div>
          <p style="margin-top: 14px; font-size: 13px; color: var(--ink-secondary); line-height: 1.5;">
            Human eyes perceive green far more intensely than blue. Calculating true photometric luminance ensures text particles dynamically shift contrast in real-time.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>LIVE LUMINANCE CONTRAST SAMPLER</strong>
          </div>

          <!-- Live Dynamic Color Swatch & Contrast Text Test -->
          <div id="lum-live-swatch" style="padding: 16px; border-radius: 4px; border: 1px solid var(--ink-border); transition: background-color 0.1s; text-align: center;">
            <div id="lum-contrast-text" style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; letter-spacing: 0.05em; transition: color 0.1s;">
              THE MACHINE DIDN'T KNOW
            </div>
            <div style="font-family: var(--font-mono); font-size: 10px; margin-top: 4px; opacity: 0.85;">
              Contrast Guard: <span id="lum-text-color-label">WHITE</span>
            </div>
          </div>

          <div class="dissection-sandbox-slider">
            <label style="color: #FF5533; font-weight: bold;">R (Red):</label>
            <input type="range" id="slider-r" min="0" max="255" value="255">
            <span id="val-r">255</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label style="color: #10B981; font-weight: bold;">G (Green):</label>
            <input type="range" id="slider-g" min="0" max="255" value="120">
            <span id="val-g">120</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label style="color: #00E5FF; font-weight: bold;">B (Blue):</label>
            <input type="range" id="slider-b" min="0" max="255" value="40">
            <span id="val-b">40</span>
          </div>
          
          <div style="font-size: 12px; color: var(--accent-vermillion); display: flex; justify-content: space-between; align-items: center; padding-top: 4px; border-top: 1px dashed var(--ink-border);">
            <span>BT.601 Metric: <strong id="lum-result">1.68</strong></span>
            <span id="lum-eval" style="font-family: var(--font-mono); font-size: 10px; color: var(--ink-primary); font-weight: bold;">LIGHT BACKGROUND</span>
          </div>
        </div>
      `;

      const rIn = displayEl.querySelector('#slider-r') as HTMLInputElement;
      const gIn = displayEl.querySelector('#slider-g') as HTMLInputElement;
      const bIn = displayEl.querySelector('#slider-b') as HTMLInputElement;
      const lumRes = displayEl.querySelector('#lum-result') as HTMLElement;
      const lumEval = displayEl.querySelector('#lum-eval') as HTMLElement;
      const liveSwatch = displayEl.querySelector('#lum-live-swatch') as HTMLElement;
      const contrastText = displayEl.querySelector('#lum-contrast-text') as HTMLElement;
      const colorLabel = displayEl.querySelector('#lum-text-color-label') as HTMLElement;

      const updateLum = () => {
        const r = parseInt(rIn.value, 10);
        const g = parseInt(gIn.value, 10);
        const b = parseInt(bIn.value, 10);
        (displayEl.querySelector('#val-r') as HTMLElement).textContent = r.toString();
        (displayEl.querySelector('#val-g') as HTMLElement).textContent = g.toString();
        (displayEl.querySelector('#val-b') as HTMLElement).textContent = b.toString();

        const lumVal = calculateLuminance(r, g, b);
        lumRes.textContent = lumVal.toFixed(2);

        // Update live background swatch
        liveSwatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        // Dynamic contrast inversion based on perceived luminance
        if (lumVal > 1.30) {
          contrastText.style.color = '#0A0B0D';
          contrastText.style.textShadow = 'none';
          colorLabel.textContent = 'BLACK (#0A0B0D)';
          colorLabel.style.color = '#0A0B0D';
          lumEval.textContent = 'HIGH LUMINANCE (LIGHT)';
          lumEval.style.color = '#C86432';
        } else {
          contrastText.style.color = '#FFFFFF';
          contrastText.style.textShadow = '0 1px 4px rgba(0,0,0,0.5)';
          colorLabel.textContent = 'WHITE (#FFFFFF)';
          colorLabel.style.color = '#FFFFFF';
          lumEval.textContent = 'LOW LUMINANCE (DARK)';
          lumEval.style.color = '#00E5FF';
        }
      };

      rIn.addEventListener('input', updateLum);
      gIn.addEventListener('input', updateLum);
      bIn.addEventListener('input', updateLum);
      updateLum();

    } else if (tab === 'cover') {
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
            Prevents texture stretching and aspect distortion by scaling media proportionally to fill any container aspect ratio. Drag the sliders to test.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>LIVE GLSL ASPECT COVER TESTER</strong>
          </div>

          <!-- Live Interactive Aspect Box -->
          <div style="position: relative; width: 100%; height: 110px; background: #0E1015; border: 1px solid var(--ink-border); display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <div id="aspect-live-container" style="position: relative; width: 220px; height: 90px; border: 2px dashed #00E5FF; overflow: hidden; display: flex; align-items: center; justify-content: center; background: rgba(0,229,255,0.05); transition: all 0.15s ease-out;">
              <div id="aspect-live-media" style="position: absolute; background: linear-gradient(135deg, #FF3B00, #C86432, #D4AF37); opacity: 0.85; border: 1px solid #FFF; display: flex; align-items: center; justify-content: center; color: #FFF; font-family: var(--font-mono); font-size: 9px; font-weight: bold; transition: all 0.15s ease-out;">
                COVER MEDIA
              </div>
            </div>
          </div>

          <div class="dissection-sandbox-slider">
            <label>Viewport Aspect:</label>
            <input type="range" id="slider-vp-w" min="100" max="250" value="220">
            <span id="val-vp">16:9</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label>Media Texture Aspect:</label>
            <input type="range" id="slider-media-w" min="60" max="200" value="120">
            <span id="val-media">1:1</span>
          </div>

          <div style="font-size: 11px; color: var(--accent-vermillion); border-top: 1px dashed var(--ink-border); padding-top: 6px;">
            Render Dimensions: <strong id="aspect-calc-size">220 × 220px</strong> | Offset: <strong id="aspect-calc-offset">(0px, -65px)</strong>
          </div>
        </div>
      `;

      const vpSlider = displayEl.querySelector('#slider-vp-w') as HTMLInputElement;
      const mediaSlider = displayEl.querySelector('#slider-media-w') as HTMLInputElement;
      const liveContainer = displayEl.querySelector('#aspect-live-container') as HTMLElement;
      const liveMedia = displayEl.querySelector('#aspect-live-media') as HTMLElement;
      const calcSize = displayEl.querySelector('#aspect-calc-size')!;
      const calcOffset = displayEl.querySelector('#aspect-calc-offset')!;
      const valVp = displayEl.querySelector('#val-vp')!;
      const valMedia = displayEl.querySelector('#val-media')!;

      const updateAspect = () => {
        const vpW = parseInt(vpSlider.value, 10);
        const vpH = 90;
        const mediaW = parseInt(mediaSlider.value, 10);
        const mediaH = 120;

        liveContainer.style.width = `${vpW}px`;
        valVp.textContent = `${(vpW / vpH).toFixed(2)}:1`;
        valMedia.textContent = `${(mediaW / mediaH).toFixed(2)}:1`;

        const dims = getCoverDimensions(vpW, vpH, mediaW, mediaH);
        liveMedia.style.width = `${dims.width}px`;
        liveMedia.style.height = `${dims.height}px`;
        liveMedia.style.left = `${dims.offsetX}px`;
        liveMedia.style.top = `${dims.offsetY}px`;

        calcSize.textContent = `${dims.width} × ${dims.height}px`;
        calcOffset.textContent = `(${dims.offsetX}px, ${dims.offsetY}px)`;
      };

      vpSlider.addEventListener('input', updateAspect);
      mediaSlider.addEventListener('input', updateAspect);
      updateAspect();

    } else if (tab === 'noise') {
      displayEl.innerHTML = `
        <div>
          <div class="dissection-formula">
            <strong>4-Octave Fractional Brownian Motion (FBM)</strong><br>
            <code>float fbm(vec2 p) {<br>
            &nbsp;&nbsp;float v = 0.0; float a = 0.5;<br>
            &nbsp;&nbsp;for (int i = 0; i < octaves; i++) {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;v += a * snoise(p); p *= lacunarity; a *= gain;<br>
            &nbsp;&nbsp;}<br>
            &nbsp;&nbsp;return v;<br>
            }</code>
          </div>
          <p style="margin-top: 14px; font-size: 13px; color: var(--ink-secondary); line-height: 1.5;">
            By layering successive octaves of Simplex noise, continuous fluid membranes and organic surface ripples are generated live on the canvas.
          </p>
        </div>
        <div class="dissection-interactive-sandbox">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>LIVE FBM SIMPLEX NOISE CANVAS</strong>
            <span style="font-size: 10px; color: var(--accent-cyan);">GPU SHADER SIMULATION</span>
          </div>

          <canvas id="noise-canvas" width="280" height="110" style="width: 100%; height: 110px; background: #0A0B0D; border: 1px solid var(--ink-border); display: block;"></canvas>

          <div class="dissection-sandbox-slider">
            <label>Octaves (Layers):</label>
            <input type="range" id="slider-octaves" min="1" max="6" step="1" value="4">
            <span id="val-octaves">4</span>
          </div>
          <div class="dissection-sandbox-slider">
            <label>Lacunarity (Freq):</label>
            <input type="range" id="slider-lacunarity" min="1.2" max="3.0" step="0.1" value="2.0">
            <span id="val-lacunarity">2.0</span>
          </div>
          <div style="font-size: 11px; color: var(--accent-cyan); display: flex; justify-content: space-between; border-top: 1px dashed var(--ink-border); padding-top: 6px;">
            <span>Frequency Multiplier: <strong id="val-freq">2.0x / Octave</strong></span>
            <span>Uniform: <code>uTime * 0.001</code></span>
          </div>
        </div>
      `;

      const canvas = displayEl.querySelector('#noise-canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      const octInput = displayEl.querySelector('#slider-octaves') as HTMLInputElement;
      const lacInput = displayEl.querySelector('#slider-lacunarity') as HTMLInputElement;
      const octVal = displayEl.querySelector('#val-octaves')!;
      const lacVal = displayEl.querySelector('#val-lacunarity')!;
      const freqVal = displayEl.querySelector('#val-freq')!;

      let octaves = parseInt(octInput.value, 10);
      let lacunarity = parseFloat(lacInput.value);

      const updateNoiseParams = () => {
        octaves = parseInt(octInput.value, 10);
        lacunarity = parseFloat(lacInput.value);
        octVal.textContent = octaves.toString();
        lacVal.textContent = lacunarity.toFixed(1);
        freqVal.textContent = `${lacunarity.toFixed(1)}x / Octave`;
      };

      octInput.addEventListener('input', updateNoiseParams);
      lacInput.addEventListener('input', updateNoiseParams);

      // Fast procedural FBM noise rendering in 2D canvas
      let noiseTime = 0;
      const renderNoise = () => {
        noiseTime += 0.03;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;
        const step = 8; // Step for high performance rendering

        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            let value = 0;
            let amp = 0.5;
            let freq = 0.02;

            for (let o = 0; o < octaves; o++) {
              const nx = x * freq + noiseTime * 0.3;
              const ny = y * freq + noiseTime * 0.2;
              value += Math.sin(nx) * Math.cos(ny) * amp;
              freq *= lacunarity;
              amp *= 0.5;
            }

            const intensity = Math.floor(((value + 1) * 0.5) * 255);
            const r = Math.floor(intensity * 0.1);
            const g = Math.floor(intensity * 0.9);
            const b = Math.floor(intensity * 1.0);

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, step, step);
          }
        }

        this.animFrameId = requestAnimationFrame(renderNoise);
      };

      this.animFrameId = requestAnimationFrame(renderNoise);
    }
  }
}
