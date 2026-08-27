/**
 * Master Motion Orchestrator
 * Lenis + GSAP ScrollTrigger Unified Ticker Engine, Pinned Scrollytelling,
 * Circular Mask Reveal, 3D Spatial Flip Cards, and Kinetic Typography.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { soundEngine } from '../audio/Synthesizer';
import { ReasoningCore3D } from '../webgl/ReasoningCore3D';

gsap.registerPlugin(ScrollTrigger);

export class ScrollOrchestrator {
  public lenis: Lenis;
  private reasoningCore: ReasoningCore3D | null = null;
  private isCardSplit: boolean = false;
  private isCardFlipped: boolean = false;

  constructor(reasoningCore?: ReasoningCore3D) {
    this.reasoningCore = reasoningCore || null;

    // 1. Initialize Lenis Smooth Scroll
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // 2. Unify Lenis with GSAP Central Ticker
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 3. Initialize Scrollytelling Timelines
    document.fonts.ready.then(() => {
      this.initPinnedScrollytelling();
      this.initKineticTypography();
      this.initSpecCardsAnimation();
    });
  }

  public setReasoningCore(core: ReasoningCore3D): void {
    this.reasoningCore = core;
  }

  private initPinnedScrollytelling(): void {
    const scrollyTrack = document.querySelector('.scrolly-pinned-container');
    if (!scrollyTrack) return;

    ScrollTrigger.create({
      trigger: scrollyTrack,
      start: 'top top',
      end: () => `+=${window.innerHeight * 4}`,
      pin: true,
      pinSpacing: true,
      scrub: 1.1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // 1. Sync 3D Scene rotation & camera with master playhead
        if (this.reasoningCore) {
          this.reasoningCore.setScrollProgress(progress);
        }

        // 2. Stage 1: Hero Phase Exit (0.00 -> 0.22)
        const p1 = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.00, 0.22, 0, 1, progress));
        gsap.set('.stage-hero-content', {
          yPercent: -80 * p1,
          opacity: 1 - p1,
        });

        // 3. Stage 2: Circular Theme Mask Expansion (0.18 -> 0.45)
        const p2 = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.18, 0.45, 0, 100, progress));
        gsap.set('.circular-theme-mask', {
          clipPath: `circle(${p2}% at 50% 50%)`,
        });

        // Stage 2 Title entrance (0.20 -> 0.35)
        const p2Text = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.20, 0.35, 0, 1, progress));
        const p2TextExit = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.40, 0.48, 0, 1, progress));
        gsap.set('.stage-strata-title', {
          opacity: p2Text * (1 - p2TextExit),
          y: (1 - p2Text) * 40 - p2TextExit * 40,
        });

        // 4. Stage 3: Split-Card 3D Spatial Fanning (0.42 -> 0.85)
        const cardContainerP = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.42, 0.52, 0, 1, progress));
        const cardContainerExit = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.82, 0.88, 0, 1, progress));

        gsap.set('.cards-wrapper', {
          opacity: cardContainerP * (1 - cardContainerExit),
          scale: gsap.utils.mapRange(0.42, 0.55, 0.85, 1.0, progress),
        });

        // Split gap trigger (Threshold: 0.52)
        if (progress >= 0.52 && !this.isCardSplit) {
          gsap.to('.cards-wrapper', { gap: '24px', duration: 0.5, ease: 'power3.out' });
          gsap.to('.split-card', { borderRadius: '20px', duration: 0.5, ease: 'power3.out' });
          this.isCardSplit = true;
        } else if (progress < 0.52 && this.isCardSplit) {
          gsap.to('.cards-wrapper', { gap: '0px', duration: 0.5, ease: 'power3.out' });
          gsap.to('#card-1', { borderRadius: '20px 0 0 20px', duration: 0.5, ease: 'power3.out' });
          gsap.to('#card-2', { borderRadius: '0px', duration: 0.5, ease: 'power3.out' });
          gsap.to('#card-3', { borderRadius: '0 20px 20px 0', duration: 0.5, ease: 'power3.out' });
          this.isCardSplit = false;
        }

        // 3D Spatial Flip Trigger (Threshold: 0.65)
        if (progress >= 0.65 && !this.isCardFlipped) {
          gsap.to('.split-card', {
            rotationY: 180,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.inOut',
          });
          gsap.to('#card-1', { rotationZ: -6, y: 16, duration: 0.7, ease: 'power3.out' });
          gsap.to('#card-3', { rotationZ: 6, y: 16, duration: 0.7, ease: 'power3.out' });
          soundEngine.playSubPulse();
          this.isCardFlipped = true;
        } else if (progress < 0.65 && this.isCardFlipped) {
          gsap.to('.split-card', {
            rotationY: 0,
            duration: 0.75,
            stagger: -0.1,
            ease: 'power3.inOut',
          });
          gsap.to(['#card-1', '#card-3'], { rotationZ: 0, y: 0, duration: 0.7, ease: 'power3.out' });
          this.isCardFlipped = false;
        }

        // 5. Stage 4: Outro Singularity Pulse (0.85 -> 0.90)
        const p4 = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.85, 0.90, 0, 1, progress));
        gsap.set('.stage-singularity-content', {
          opacity: p4,
          scale: 0.9 + p4 * 0.1,
        });

        // 0.90 -> 1.00 is the 10% Unpin Rest Buffer zone
      },
    });
  }

  private initKineticTypography(): void {
    const headings = document.querySelectorAll('.kinetic-reveal');
    headings.forEach((heading) => {
      gsap.fromTo(
        heading,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  private initSpecCardsAnimation(): void {
    const specItems = document.querySelectorAll('.spec-metric-card');
    if (!specItems.length) return;

    gsap.fromTo(
      specItems,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.spec-metrics-grid',
          start: 'top 80%',
        },
      }
    );
  }

  public scrollTo(target: string | HTMLElement | number): void {
    this.lenis.scrollTo(target, { duration: 1.4 });
    soundEngine.playUiBlip(640);
  }

  public destroy(): void {
    this.lenis.destroy();
    ScrollTrigger.killAll();
  }
}
