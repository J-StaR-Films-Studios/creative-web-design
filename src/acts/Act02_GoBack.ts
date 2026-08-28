import { soundEngine } from '../core/audio';

export class Act02_GoBack {
  private containerEl!: HTMLElement;
  private observer!: IntersectionObserver;

  public init(container: HTMLElement): void {
    this.containerEl = container;
    this.containerEl.innerHTML = `
      <div class="reg-mark reg-tl">+</div>
      <div class="reg-mark reg-tr">+</div>

      <div class="rewind-timeline-stamp">
        <span>[ REWIND TIMELINE ]</span>
        <span>2026 → 2000s → 1984 STANFORD UNIVERSITY</span>
      </div>

      <div class="chapter-header">
        <div class="chapter-badge-row">
          <span class="chapter-serial">[ CHAPTER 02 ]</span>
          <span class="chapter-coordinates">[ STANFORD HEURISTIC PROGRAMMING PROJECT / 1984 ]</span>
        </div>
        <h2 class="chapter-title">GO BACK</h2>
        <div class="chapter-subtitle">
          "Before we taught a machine to make websites, we needed to understand how humans taught machines to reason."
        </div>
      </div>

      <!-- 45 PDFs Narrative & Lanczos Pipeline Grid -->
      <div class="pdf-stack-pipeline-grid">
        <!-- 45-Card Cascade Stack -->
        <div class="pdf-cascade-container" id="pdf-cascade-container">
          <!-- Stack of archival 1984 MYCIN chapter cards -->
          ${Array.from({ length: 8 })
            .map((_, i) => {
              const rot = (i - 4) * 3;
              const top = 25 + i * 14;
              const left = Math.min(window.innerWidth < 600 ? 15 + i * 16 : 35 + i * 26, 240);
              return `
              <div class="pdf-cascade-card" data-card-idx="${i}" style="top: ${top}px; left: ${left}px; transform: rotate(${rot}deg); z-index: ${i + 1};">
                <div>
                  <strong style="color: var(--accent-terracotta);">CHAPTER 0${i + 1}</strong>
                  <div style="font-size: 8px; color: #7A6F62; margin-top: 4px;">Buchanan & Shortliffe (1984)</div>
                  <div style="margin-top: 8px; line-height: 1.3;">Rule-Based Expert Systems: The MYCIN Experiments</div>
                </div>
                <div style="font-size: 8px; color: #8C8070; border-top: 1px dashed #C8BDAC; padding-top: 4px;">
                  SCAN REF: STANFORD-CS-84-0${i + 1}
                </div>
              </div>
            `;
            })
            .join('')}
        </div>

        <!-- Python Lanczos Compression Telemetry -->
        <div class="lanczos-compression-box">
          <div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-terracotta); letter-spacing: 0.1em;">
              [ INGESTION PIPELINE: compress_mycin_pdf.py ]
            </div>
            <h3 style="font-family: var(--font-serif); font-size: 20px; color: #2A241C; margin: 8px 0 16px;">
              Automated 1-Bit Lanczos Compression
            </h3>
            <p style="font-family: var(--font-sans); font-size: 13px; color: #5A5045; line-height: 1.5;">
              Ingesting 752 pages across 45 fragmented chapter PDFs required an idempotent sequential collation and high-fidelity downsampling algorithm.
            </p>
          </div>

          <div class="compression-progress-track">
            <div class="compression-progress-fill"></div>
          </div>

          <div>
            <div class="compression-metric-row">
              <span>RAW STANFORD SCANS:</span>
              <span class="compression-metric-val">37.0 MB (45 PDFs)</span>
            </div>
            <div class="compression-metric-row">
              <span>COMPRESSED REPOSITORY:</span>
              <span class="compression-metric-val">21.8 MB (1 Unified PDF)</span>
            </div>
            <div class="compression-metric-row">
              <span>TOTAL REDUCTION:</span>
              <span class="compression-metric-val" style="color: #10B981;">-41% (100% Legibility)</span>
            </div>
          </div>

          <div class="marginal-note" style="border-color: var(--accent-terracotta);">
            "Real expertise is not naming libraries. Expertise is structured procedural knowledge, elicitation probes, and inference models extracted from ground truth."
          </div>
        </div>
      </div>
    `;

    this.setupListeners();
    this.setupScrollTrigger();
  }

  private setupListeners(): void {
    const cards = this.containerEl.querySelectorAll('.pdf-cascade-card');
    cards.forEach((card, index) => {
      const activateCard = () => {
        (card as HTMLElement).style.transform = `translateY(-16px) scale(1.04)`;
        soundEngine.playHoverChirp(500 + index * 35);
      };

      const resetCard = () => {
        const rot = (index - 4) * 3;
        (card as HTMLElement).style.transform = `rotate(${rot}deg)`;
      };

      card.addEventListener('mouseenter', activateCard);
      card.addEventListener('mouseleave', resetCard);
      card.addEventListener('click', activateCard);
    });
  }

  private setupScrollTrigger(): void {
    const cards = this.containerEl.querySelectorAll('.pdf-cascade-card');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Cascade card pop animation on scroll into view
            cards.forEach((card, idx) => {
              setTimeout(() => {
                (card as HTMLElement).style.transition = 'all 0.4s var(--ease-out-expo)';
                (card as HTMLElement).style.transform = `translateY(-10px) scale(1.02)`;
                setTimeout(() => {
                  const rot = (idx - 4) * 3;
                  (card as HTMLElement).style.transform = `rotate(${rot}deg)`;
                }, 300);
              }, idx * 80);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    this.observer.observe(this.containerEl);
  }
}
