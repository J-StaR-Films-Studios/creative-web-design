import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { ContourCanvas } from './components/ContourCanvas';
import { StratigraphicStack } from './components/StratigraphicStack';
import { SandParticleEngine } from './components/SandParticleEngine';
import { SpecimenGallery } from './components/SpecimenGallery';
import { SpecimenLoupe } from './components/SpecimenLoupe';
import { TelemetryHUD } from './components/TelemetryHUD';
import { SubterraneanAudio } from './components/SubterraneanAudio';

gsap.registerPlugin(ScrollTrigger);

class TerraArchiveApp {
  private lenis!: Lenis;
  private contourCanvas!: ContourCanvas;
  private sandEngine!: SandParticleEngine;
  private strataStack!: StratigraphicStack;
  private specimenGallery!: SpecimenGallery;
  private specimenLoupe!: SpecimenLoupe;
  private telemetryHud!: TelemetryHUD;
  private audio!: SubterraneanAudio;

  private globalScrollProgress = 0;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Wait for custom web fonts to be completely ready before measuring or splitting
    await document.fonts.ready;

    this.initAudio();
    this.initCanvasesAndComponents();
    this.initSmoothScroll();
    this.initMasterScrollTriggers();
    this.bindGlobalEvents();
  }

  private initAudio(): void {
    this.audio = new SubterraneanAudio();
  }

  private initCanvasesAndComponents(): void {
    const contourContainer = document.getElementById('contour-container') as HTMLElement;
    const sandContainer = document.getElementById('sand-container') as HTMLElement;
    const loupeContainer = document.getElementById('loupe-container') as HTMLElement;
    const strataAnchor = document.getElementById('strata-3d-anchor') as HTMLElement;
    const specimenAnchor = document.getElementById('specimen-gallery-anchor') as HTMLElement;
    const hudContainer = document.getElementById('hud-container') as HTMLElement;

    // 1. Fullscreen Topographic Contour Canvas (Shot 1)
    this.contourCanvas = new ContourCanvas(contourContainer);

    // 2. Optical Specimen Loupe (Shot 3)
    this.specimenLoupe = new SpecimenLoupe(loupeContainer);

    // 3. Sand / Dust Typography Particle Engine (Shot 2 & Shot 4)
    this.sandEngine = new SandParticleEngine(sandContainer);

    // 4. 3D Stratigraphic Strata Stack (Shot 2)
    this.strataStack = new StratigraphicStack(strataAnchor);

    // 5. Specimen Horizontal Gallery (Shot 3)
    this.specimenGallery = new SpecimenGallery(specimenAnchor, this.specimenLoupe);

    // 6. Telemetry HUD Overlay
    this.telemetryHud = new TelemetryHUD(hudContainer, this.audio);
  }

  private initSmoothScroll(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Synchronize Lenis with ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis & RAF rendering via unified GSAP central ticker
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
      this.renderLoop();
    });

    // Disable lagSmoothing to ensure real-time scrubber lockstep
    gsap.ticker.lagSmoothing(0);
  }

  private initMasterScrollTriggers(): void {
    // ----------------------------------------------------
    // Master Global Progress Scroller
    // ----------------------------------------------------
    ScrollTrigger.create({
      trigger: '.scrolly-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        this.globalScrollProgress = self.progress;
        this.telemetryHud.update(this.globalScrollProgress);
      }
    });

    // ----------------------------------------------------
    // Shot 1: Topographic Hero Animation
    // ----------------------------------------------------
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#shot-1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    heroTl.to('.topography-hero-content', {
      yPercent: -40,
      opacity: 0,
      ease: 'power2.in'
    });

    // ----------------------------------------------------
    // Shot 2: Stratigraphic Breakdown Pin & 3D Layer Split
    // ----------------------------------------------------
    ScrollTrigger.create({
      trigger: '#shot-2',
      start: 'top top',
      end: () => `+=${window.innerHeight * 2.5}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Drive 3D Z-axis strata separation
        this.strataStack.updateProgress(self.progress);
      }
    });

    // ----------------------------------------------------
    // Shot 3: Archaeological Specimen Horizontal Pin
    // ----------------------------------------------------
    const track = this.specimenGallery.getTrackElement();
    const calculateDistance = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -calculateDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#shot-3',
        start: 'top top',
        end: () => `+=${calculateDistance() + window.innerHeight}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // ----------------------------------------------------
    // Shot 4: Codex Reconstruction
    // ----------------------------------------------------
    const codexTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#shot-4',
        start: 'top 70%',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    codexTl.from('.codex-footer-meta', {
      opacity: 0,
      y: 40,
      ease: 'power3.out'
    });
  }

  private renderLoop(): void {
    // 1. Update Shot 1 Contours
    this.contourCanvas.update(this.globalScrollProgress);

    // 2. Update Shot 2/4 Sand Particles
    this.sandEngine.update(this.globalScrollProgress);

    // 3. Update Shot 3 Specimen procedural canvases & Loupe
    this.specimenGallery.update();
  }

  private bindGlobalEvents(): void {
    // Replay Expedition button
    const replayBtn = document.getElementById('btn-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.lenis.scrollTo(0, { duration: 2.2 });
      });
    }

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new TerraArchiveApp();
});
