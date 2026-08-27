import { configureHighDPICanvas } from '../utils/HighDPICanvas';
import { SpecimenLoupe } from './SpecimenLoupe';

export interface SpecimenData {
  id: string;
  catalogNumber: string;
  name: string;
  depth: string;
  site: string;
  age: string;
  composition: string;
  findings: string;
  drawArtifact: (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => void;
}

export class SpecimenGallery {
  private container: HTMLElement;
  private galleryTrackEl!: HTMLElement;
  private loupe: SpecimenLoupe;
  private canvases: { canvas: HTMLCanvasElement; data: SpecimenData; rect?: DOMRect }[] = [];
  private time = 0;

  private specimens: SpecimenData[] = [
    {
      id: 'specimen-01',
      catalogNumber: 'SPEC-1029-OBS',
      name: 'OBSIDIAN ANTIKYTHERA CORE',
      depth: '-1,240.4 METERS',
      site: 'MEDITERRANEAN TRENCH T-4',
      age: '150 BCE [LATE HELLENISTIC]',
      composition: 'VITREOUS OBSIDIAN & BRONZE GEAR MATRIX',
      findings: 'Epicyclic differential gear train embedded in volcanic obsidian. Correlates subterranean seismic resonance with lunar nodal precession.',
      drawArtifact: (ctx, w, h, time) => {
        const cx = w / 2;
        const cy = h / 2;

        // Background dark obsidian texture
        ctx.fillStyle = '#181716';
        ctx.fillRect(0, 0, w, h);

        // Grid coordinate crosshairs
        ctx.strokeStyle = 'rgba(237, 232, 222, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
        ctx.moveTo(0, cy); ctx.lineTo(w, cy);
        ctx.stroke();

        // Outer bronze gear ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.1);

        const gearRadius = Math.min(w, h) * 0.35;
        const numTeeth = 36;
        ctx.fillStyle = '#C86432';
        ctx.strokeStyle = '#EDE8DE';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        for (let i = 0; i < numTeeth; i++) {
          const angle = (i / numTeeth) * Math.PI * 2;
          const nextAngle = ((i + 0.5) / numTeeth) * Math.PI * 2;
          const toothR = gearRadius + 12;

          const x1 = Math.cos(angle) * gearRadius;
          const y1 = Math.sin(angle) * gearRadius;
          const x2 = Math.cos(angle) * toothR;
          const y2 = Math.sin(angle) * toothR;
          const x3 = Math.cos(nextAngle) * toothR;
          const y3 = Math.sin(nextAngle) * toothR;
          const x4 = Math.cos(nextAngle) * gearRadius;
          const y4 = Math.sin(nextAngle) * gearRadius;

          if (i === 0) ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.lineTo(x4, y4);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner volcanic glass core with concentric epicycles
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-time * 0.15);

        for (let r = gearRadius * 0.8; r > 20; r -= 24) {
          ctx.strokeStyle = r % 48 === 0 ? '#C86432' : 'rgba(237, 232, 222, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          // Epicycle planet markers
          const markerAngle = time * 0.5 + r;
          ctx.fillStyle = '#EDE8DE';
          ctx.beginPath();
          ctx.arc(Math.cos(markerAngle) * r, Math.sin(markerAngle) * r, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center jewel bearing
        ctx.fillStyle = '#C86432';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#EDE8DE';
        ctx.stroke();

        ctx.restore();
      }
    },
    {
      id: 'specimen-02',
      catalogNumber: 'SPEC-2044-BAS',
      name: 'PROTO-ELAMITE BASALT CYLINDER',
      depth: '-2,180.2 METERS',
      site: 'ZAGROS BASALT CHAMBER',
      age: '3100 BCE [PROTO-LITERATE]',
      composition: 'THOLEIITIC BASALT WITH MICRO-VEINS',
      findings: 'Cylindrical seal bearing hydro-cartographic cuneiform. Inscriptions describe deep pressurized subterranean aqueducts beneath ancient Mesopotamian alluvial fans.',
      drawArtifact: (ctx, w, h, time) => {
        const cx = w / 2;
        const cy = h / 2;

        ctx.fillStyle = '#161514';
        ctx.fillRect(0, 0, w, h);

        const cylW = Math.min(w, h) * 0.48;
        const cylH = Math.min(w, h) * 0.72;

        ctx.save();
        ctx.translate(cx, cy);

        // Cylinder Body
        ctx.fillStyle = '#22201E';
        ctx.strokeStyle = 'rgba(200, 100, 50, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-cylW / 2, -cylH / 2, cylW, cylH);
        ctx.strokeRect(-cylW / 2, -cylH / 2, cylW, cylH);

        // Cuneiform Seal Inscriptions (Procedural scrolling register)
        const scrollOffset = (time * 25) % cylW;
        ctx.fillStyle = '#EDE8DE';
        ctx.font = '11px monospace';

        for (let row = -cylH / 2 + 30; row < cylH / 2 - 20; row += 28) {
          ctx.strokeStyle = 'rgba(237, 232, 222, 0.15)';
          ctx.beginPath();
          ctx.moveTo(-cylW / 2, row + 14);
          ctx.lineTo(cylW / 2, row + 14);
          ctx.stroke();

          for (let col = -cylW / 2 - 40; col < cylW / 2 + 40; col += 36) {
            const x = ((col + scrollOffset + cylW) % cylW) - cylW / 2;
            ctx.save();
            ctx.translate(x, row);

            // Cuneiform wedge shapes
            ctx.strokeStyle = row % 56 === 0 ? '#C86432' : 'rgba(237, 232, 222, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(12, 0); ctx.lineTo(6, -6); ctx.closePath();
            ctx.moveTo(6, 0); ctx.lineTo(6, 12);
            ctx.stroke();

            ctx.restore();
          }
        }

        // Basalt fracture veins
        ctx.strokeStyle = 'rgba(200, 100, 50, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-cylW / 2 + 20, -cylH / 2);
        ctx.lineTo(-10, 0);
        ctx.lineTo(cylW / 2 - 30, cylH / 2);
        ctx.stroke();

        ctx.restore();
      }
    },
    {
      id: 'specimen-03',
      catalogNumber: 'SPEC-3081-QZT',
      name: 'CUNEIFORM GEODETIC MONOLITH',
      depth: '-3,410.8 METERS',
      site: 'ARCHAEAN CRATON // SECTOR 09',
      age: '3.4 Ga CRATON MATRIX',
      composition: 'CRYSTALLINE QUARTZITE CODEX BLOCK',
      findings: 'Monolithic stele with geodetic meridian benchmarks. Mathematical constants align with planetary geodesic curvature and crustal plate tectonic drift.',
      drawArtifact: (ctx, w, h, time) => {
        const cx = w / 2;
        const cy = h / 2;

        ctx.fillStyle = '#151413';
        ctx.fillRect(0, 0, w, h);

        const steleW = Math.min(w, h) * 0.44;
        const steleH = Math.min(w, h) * 0.76;

        ctx.save();
        ctx.translate(cx, cy);

        // Quartzite Stele Monolith
        ctx.fillStyle = '#262422';
        ctx.strokeStyle = '#C86432';
        ctx.lineWidth = 2.0;

        ctx.beginPath();
        ctx.moveTo(-steleW / 2, -steleH / 2 + 40);
        ctx.lineTo(0, -steleH / 2);
        ctx.lineTo(steleW / 2, -steleH / 2 + 40);
        ctx.lineTo(steleW / 2, steleH / 2);
        ctx.lineTo(-steleW / 2, steleH / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Meridian lines & astronomical angles
        ctx.strokeStyle = 'rgba(237, 232, 222, 0.3)';
        ctx.lineWidth = 1;
        for (let i = -4; i <= 4; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 18, -steleH / 2 + 50);
          ctx.lineTo(i * 24, steleH / 2 - 20);
          ctx.stroke();
        }

        // Central Geodetic Codex Symbol
        ctx.strokeStyle = '#EDE8DE';
        ctx.lineWidth = 1.5;
        const pulse = Math.sin(time * 2.0) * 4;

        ctx.beginPath();
        ctx.arc(0, 0, 36 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Inner polygon & rune
        ctx.strokeStyle = '#C86432';
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2 + time * 0.2;
          const px = Math.cos(a) * (26 + pulse);
          const py = Math.sin(a) * (26 + pulse);
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#EDE8DE';
        ctx.font = '10px "Space Grotesk", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GEO // 3.4 Ga', 0, 60);

        ctx.restore();
      }
    }
  ];

  constructor(container: HTMLElement, loupe: SpecimenLoupe) {
    this.container = container;
    this.loupe = loupe;
    this.renderDOM();
    this.initCanvases();
  }

  private renderDOM(): void {
    this.galleryTrackEl = document.createElement('div');
    this.galleryTrackEl.className = 'specimen-horizontal-track';

    this.galleryTrackEl.innerHTML = `
      <div class="specimen-gallery-intro">
        <div class="gallery-tag">SHOT 03 // ARTIFACT REGISTRY</div>
        <h2 class="gallery-heading">THE ARCHAEOLOGICAL SPECIMEN</h2>
        <p class="gallery-subtext">LIDAR-acquired high-density surface scans of anomalous subterranean relics recovered from depths between -1,240m and -3,410m.</p>
        <div class="gallery-instructions">
          <span class="instruction-icon">⊕</span> HOVER SPECIMEN TO ENGAGE CHROMATIC LOUPE
        </div>
      </div>

      <div class="specimen-cards-container">
        ${this.specimens
          .map(
            (spec) => `
          <div class="specimen-card" id="${spec.id}">
            <div class="specimen-canvas-wrapper">
              <canvas class="specimen-render-canvas" data-spec-id="${spec.id}"></canvas>
              <div class="specimen-canvas-hud">
                <span class="hud-tag">${spec.catalogNumber}</span>
                <span class="hud-depth">${spec.depth}</span>
              </div>
            </div>
            <div class="specimen-dossier">
              <div class="dossier-header">
                <span class="dossier-cat">${spec.catalogNumber}</span>
                <span class="dossier-depth">${spec.depth}</span>
              </div>
              <h3 class="specimen-title">${spec.name}</h3>
              <div class="dossier-grid">
                <div class="dossier-cell">
                  <span class="cell-label">DISCOVERY SITE</span>
                  <span class="cell-val">${spec.site}</span>
                </div>
                <div class="dossier-cell">
                  <span class="cell-label">DATING / ERA</span>
                  <span class="cell-val">${spec.age}</span>
                </div>
                <div class="dossier-cell full-width">
                  <span class="cell-label">PETROLOGY / COMPOSITION</span>
                  <span class="cell-val">${spec.composition}</span>
                </div>
                <div class="dossier-cell full-width">
                  <span class="cell-label">ANALYSIS / FINDINGS</span>
                  <span class="cell-val desc">${spec.findings}</span>
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    this.container.appendChild(this.galleryTrackEl);
  }

  private initCanvases(): void {
    const canvasEls = this.galleryTrackEl.querySelectorAll('.specimen-render-canvas');

    canvasEls.forEach((el, index) => {
      const canvas = el as HTMLCanvasElement;
      const data = this.specimens[index];

      const size = 360;
      configureHighDPICanvas(canvas, size, size);

      this.canvases.push({ canvas, data });

      // Attach Loupe interaction listeners
      canvas.addEventListener('mouseenter', () => {
        this.loupe.setSource(canvas);
        this.loupe.show();
      });

      canvas.addEventListener('mouseleave', () => {
        this.loupe.hide();
      });

      canvas.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        this.loupe.updatePosition(e.clientX, e.clientY, localX, localY);
      });
    });
  }

  public update(): void {
    this.time += 0.01;

    this.canvases.forEach(({ canvas, data }) => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        data.drawArtifact(ctx, 360, 360, this.time);
      }
    });

    this.loupe.render();
  }

  public getTrackElement(): HTMLElement {
    return this.galleryTrackEl;
  }
}
