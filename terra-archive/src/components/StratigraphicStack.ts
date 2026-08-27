import { gsap } from 'gsap';

export interface StrataLayerData {
  id: string;
  name: string;
  depthRange: string;
  age: string;
  composition: string;
  density: string;
  contoursSvg: string;
  accentColor: string;
}

export class StratigraphicStack {
  private container: HTMLElement;
  private cardStackEl: HTMLElement;
  private layerEls: HTMLElement[] = [];
  private layersData: StrataLayerData[] = [
    {
      id: 'strata-1',
      name: '01 // EPIPELAGIC CRUST',
      depthRange: '0m — -150m',
      age: 'QUATERNARY [0.01 Ma]',
      composition: 'SILICATE ALLUVIUM & REGOLITH',
      density: '2.42 g/cm³',
      accentColor: '#EDE8DE',
      contoursSvg: `
        <svg viewBox="0 0 800 500" class="strata-svg">
          <path d="M 50,150 Q 200,80 400,160 T 750,120 L 750,450 L 50,450 Z" fill="rgba(237, 232, 222, 0.03)" stroke="rgba(237, 232, 222, 0.3)" stroke-width="1.2"/>
          <path d="M 80,180 Q 250,130 450,200 T 720,170" fill="none" stroke="rgba(200, 100, 50, 0.5)" stroke-width="1.5" stroke-dasharray="6,3"/>
          <path d="M 120,230 Q 300,180 500,250 T 680,220" fill="none" stroke="rgba(237, 232, 222, 0.2)" stroke-width="1"/>
          <circle cx="450" cy="200" r="6" fill="#C86432"/>
          <text x="465" y="204" fill="#C86432" font-family="'Space Grotesk', monospace" font-size="11">DRILL HOLE #A-01 [0.0m]</text>
          <line x1="100" y1="50" x2="100" y2="450" stroke="rgba(237, 232, 222, 0.08)" stroke-width="1"/>
          <line x1="400" y1="50" x2="400" y2="450" stroke="rgba(237, 232, 222, 0.08)" stroke-width="1"/>
          <line x1="700" y1="50" x2="700" y2="450" stroke="rgba(237, 232, 222, 0.08)" stroke-width="1"/>
        </svg>
      `
    },
    {
      id: 'strata-2',
      name: '02 // SEDIMENTARY KARST',
      depthRange: '-150m — -820m',
      age: 'MESOZOIC [145 Ma]',
      composition: 'CALCITE, DOLOMITIC VOIDS',
      density: '2.68 g/cm³',
      accentColor: '#C86432',
      contoursSvg: `
        <svg viewBox="0 0 800 500" class="strata-svg">
          <path d="M 50,120 C 180,220 320,80 500,190 C 650,280 720,140 750,180 L 750,450 L 50,450 Z" fill="rgba(200, 100, 50, 0.04)" stroke="rgba(200, 100, 50, 0.45)" stroke-width="1.4"/>
          <path d="M 70,160 C 220,260 360,120 530,230 C 660,300 700,200 730,220" fill="none" stroke="rgba(237, 232, 222, 0.25)" stroke-width="1"/>
          <path d="M 110,210 C 250,300 400,170 560,270 C 680,330 710,240 730,260" fill="none" stroke="rgba(200, 100, 50, 0.3)" stroke-width="1" stroke-dasharray="4,4"/>
          <rect x="320" y="240" width="140" height="60" fill="none" stroke="#C86432" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="330" y="275" fill="#EDE8DE" font-family="'Space Grotesk', monospace" font-size="10">SUB-CAVERN ANOMALY β</text>
        </svg>
      `
    },
    {
      id: 'strata-3',
      name: '03 // PLUTONIC BASALT',
      depthRange: '-820m — -2,150m',
      age: 'PALEOZOIC [380 Ma]',
      composition: 'OLIVINE-THOLEIITIC BASALT',
      density: '3.05 g/cm³',
      accentColor: '#EDE8DE',
      contoursSvg: `
        <svg viewBox="0 0 800 500" class="strata-svg">
          <path d="M 50,200 Q 200,310 380,180 T 750,250 L 750,450 L 50,450 Z" fill="rgba(237, 232, 222, 0.02)" stroke="rgba(237, 232, 222, 0.35)" stroke-width="1.2"/>
          <path d="M 60,250 Q 220,350 400,230 T 740,290" fill="none" stroke="rgba(200, 100, 50, 0.4)" stroke-width="1.2"/>
          <path d="M 90,300 Q 250,390 430,280 T 720,330" fill="none" stroke="rgba(237, 232, 222, 0.15)" stroke-width="1"/>
          <!-- Columnar joints -->
          <line x1="200" y1="200" x2="200" y2="420" stroke="rgba(200, 100, 50, 0.3)" stroke-width="1" stroke-dasharray="5,3"/>
          <line x1="260" y1="230" x2="260" y2="420" stroke="rgba(200, 100, 50, 0.3)" stroke-width="1" stroke-dasharray="5,3"/>
          <line x1="320" y1="210" x2="320" y2="420" stroke="rgba(200, 100, 50, 0.3)" stroke-width="1" stroke-dasharray="5,3"/>
          <text x="205" y="400" fill="#8C8275" font-family="'Space Grotesk', monospace" font-size="9">COLUMNAR BASALT MATRIX</text>
        </svg>
      `
    },
    {
      id: 'strata-4',
      name: '04 // ARCHAEAN CODEX BEDROCK',
      depthRange: '-2,150m — -3,500m',
      age: 'ARCHAEAN [3.4 Ga]',
      composition: 'CRYSTALLINE QUARTZITE & CODEX MATRIX',
      density: '3.38 g/cm³',
      accentColor: '#C86432',
      contoursSvg: `
        <svg viewBox="0 0 800 500" class="strata-svg">
          <path d="M 50,140 C 220,100 380,290 550,120 C 650,220 700,160 750,200 L 750,450 L 50,450 Z" fill="rgba(200, 100, 50, 0.08)" stroke="#C86432" stroke-width="1.8"/>
          <path d="M 70,190 C 240,150 400,320 570,170 C 660,250 710,200 740,240" fill="none" stroke="rgba(237, 232, 222, 0.4)" stroke-width="1.2"/>
          <!-- Archaeological glyph marker -->
          <circle cx="480" cy="260" r="30" fill="rgba(200, 100, 50, 0.15)" stroke="#C86432" stroke-width="1.5"/>
          <circle cx="480" cy="260" r="18" fill="none" stroke="#EDE8DE" stroke-width="1" stroke-dasharray="3,2"/>
          <circle cx="480" cy="260" r="4" fill="#C86432"/>
          <text x="480" y="310" text-anchor="middle" fill="#EDE8DE" font-family="'Space Grotesk', monospace" font-size="11" font-weight="700">PRIME ARCHAEAN ARTIFACT RECEPTACLE</text>
          <text x="480" y="325" text-anchor="middle" fill="#C86432" font-family="'Space Grotesk', monospace" font-size="9">DEPTH -3,410.8m // UNALTERED</text>
        </svg>
      `
    }
  ];

  constructor(container: HTMLElement) {
    this.container = container;
    this.cardStackEl = document.createElement('div');
    this.cardStackEl.className = 'strata-3d-stack';
    this.renderDOM();
  }

  private renderDOM(): void {
    this.cardStackEl.innerHTML = `
      <div class="strata-perspective-wrapper">
        <div class="strata-layers-container">
          ${this.layersData
            .map(
              (layer, index) => `
            <div class="strata-layer-card" id="${layer.id}" data-index="${index}">
              <div class="layer-glass-panel">
                <div class="layer-header">
                  <span class="layer-depth">${layer.depthRange}</span>
                  <span class="layer-title">${layer.name}</span>
                  <span class="layer-density">${layer.density}</span>
                </div>
                <div class="layer-visual">
                  ${layer.contoursSvg}
                </div>
                <div class="layer-footer">
                  <div class="strata-meta-item">
                    <span class="meta-label">GEOLOGIC EPOCH</span>
                    <span class="meta-val">${layer.age}</span>
                  </div>
                  <div class="strata-meta-item">
                    <span class="meta-label">PETROLOGY</span>
                    <span class="meta-val">${layer.composition}</span>
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    this.container.appendChild(this.cardStackEl);
    this.layerEls = Array.from(this.cardStackEl.querySelectorAll('.strata-layer-card'));
  }

  /**
   * Updates 3D separation transforms based on normalized progress of Shot 2 (0.0 to 1.0)
   */
  public updateProgress(progress: number): void {
    // S-curve ease for smooth 3D unfolding
    const ease = gsap.parseEase('power2.out')(progress);

    // Z-axis separation distance
    const totalZSpread = 420 * ease;
    const rotateX = 45 * ease;
    const rotateZ = -10 * ease;
    const translateYSpread = 80 * ease;

    const container = this.cardStackEl.querySelector('.strata-layers-container') as HTMLElement;
    if (container) {
      container.style.transform = `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
    }

    this.layerEls.forEach((el, index) => {
      // Map index (0, 1, 2, 3) to centered offset (-1.5, -0.5, 0.5, 1.5)
      const offset = index - 1.5;
      const z = -offset * totalZSpread;
      const y = offset * translateYSpread;
      const opacity = gsap.utils.clamp(0.4, 1.0, 0.5 + ease * 0.5);

      el.style.transform = `translate3d(0px, ${y}px, ${z}px)`;
      el.style.opacity = `${opacity}`;

      // Border glow enhancement on full separation
      const glass = el.querySelector('.layer-glass-panel') as HTMLElement;
      if (glass) {
        glass.style.borderColor = index === 3 && ease > 0.6 
          ? 'rgba(200, 100, 50, 0.8)' 
          : 'rgba(237, 232, 222, 0.18)';
        glass.style.boxShadow = index === 3 && ease > 0.6
          ? '0 0 35px rgba(200, 100, 50, 0.25)'
          : '0 20px 40px rgba(0, 0, 0, 0.6)';
      }
    });
  }
}
