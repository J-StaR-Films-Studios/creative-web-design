import { masterTicker } from './core/ticker';
import { soundEngine } from './core/audio';
import { telemetry } from './core/telemetry';
import { theaterEngine, PROVING_PROJECTS } from './components/FullCanvasTheater';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Act00_Prologue } from './acts/Act00_Prologue';
import { Act01_Evidence } from './acts/Act01_Evidence';
import { Act02_GoBack } from './acts/Act02_GoBack';
import { Act03_Extract } from './acts/Act03_Extract';
import { Act04_FiveMachines } from './acts/Act04_FiveMachines';
import { Act05_Tournament } from './acts/Act05_Tournament';
import { Act06_MissingPiece } from './acts/Act06_MissingPiece';
import { Act07_ProvingGround } from './acts/Act07_ProvingGround';
import { Act08_BattleScars } from './acts/Act08_BattleScars';
import { Act09_TheMachine } from './acts/Act09_TheMachine';
import { Act10_OpenExperiment } from './acts/Act10_OpenExperiment';

gsap.registerPlugin(ScrollTrigger);

class ResilientDavinciApp {
  private act00 = new Act00_Prologue();
  private act01 = new Act01_Evidence();
  private act02 = new Act02_GoBack();
  private act03 = new Act03_Extract();
  private act04 = new Act04_FiveMachines();
  private act05 = new Act05_Tournament();
  private act06 = new Act06_MissingPiece();
  private act07 = new Act07_ProvingGround();
  private act08 = new Act08_BattleScars();
  private act09 = new Act09_TheMachine();
  private act10 = new Act10_OpenExperiment();

  // Scroll State Cache for Zero-DOM-churn batching
  private lastProgressPct: string = '';
  private lastActName: string = '';
  private lastIsDarkMode: boolean = false;
  private lastSectionIndex: number = -1;

  public async bootstrap(): Promise<void> {
    await document.fonts.ready;

    const lenis = masterTicker.init();

    // Mount all 11 Acts
    const sections = [
      { id: 'prologue', act: this.act00 },
      { id: 'act-evidence', act: this.act01 },
      { id: 'act-goback', act: this.act02 },
      { id: 'act-extract', act: this.act03 },
      { id: 'act-five-machines', act: this.act04 },
      { id: 'act-tournament', act: this.act05 },
      { id: 'act-missing-piece', act: this.act06 },
      { id: 'act-proving-ground', act: this.act07 },
      { id: 'act-battle-scars', act: this.act08 },
      { id: 'act-the-machine', act: this.act09 },
      { id: 'act-open-experiment', act: this.act10 },
    ];

    sections.forEach(({ id, act }) => {
      const el = document.getElementById(id);
      if (el) act.init(el);
    });

    this.setupGlobalControls(lenis);
    this.setupScrollAnimations();

    // Refresh ScrollTrigger positions after layout calculation
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }

  private setupGlobalControls(lenis: ReturnType<typeof masterTicker.init>): void {
    const navEl = document.getElementById('museum-nav')!;
    const soundBtn = document.getElementById('master-sound-btn')!;
    const soundLabel = document.getElementById('sound-btn-label')!;
    const navLaunchBtn = document.getElementById('nav-theater-launch')!;
    const progressBar = document.getElementById('master-progress-bar')!;
    const hudScrollPct = document.getElementById('hud-scroll-pct')!;
    const hudActName = document.getElementById('hud-act-name')!;
    const navFps = document.getElementById('nav-telemetry-fps')!;
    const navDpr = document.getElementById('nav-telemetry-dpr')!;

    // Sound Toggle
    soundBtn.addEventListener('click', () => {
      const isUnmuted = soundEngine.toggleMute();
      if (isUnmuted) {
        soundBtn.classList.add('active');
        soundLabel.textContent = 'AUDIO: ON';
        soundEngine.playHarmonicChord();
      } else {
        soundBtn.classList.remove('active');
        soundLabel.textContent = 'AUDIO: OFF';
      }
    });

    // Quick Launch Proving Worlds
    navLaunchBtn.addEventListener('click', () => {
      theaterEngine.launch(PROVING_PROJECTS[0]);
    });

    // Batched Scroll Progress & Section Spy (Zero DOM Churn)
    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      const progress = limit > 0 ? scroll / limit : 0;
      const pct = (progress * 100).toFixed(0);

      if (pct !== this.lastProgressPct) {
        this.lastProgressPct = pct;
        progressBar.style.width = `${pct}%`;
        hudScrollPct.textContent = `SCROLL: ${pct}%`;
      }

      // Determine active act based on scroll progress
      let currentActName = 'PROLOGUE';
      let isDarkSection = false;
      let sectionIndex = 0;

      if (progress < 0.08) {
        currentActName = 'PROLOGUE'; sectionIndex = 0;
      } else if (progress < 0.18) {
        currentActName = 'CH.01 EVIDENCE'; sectionIndex = 1;
      } else if (progress < 0.28) {
        currentActName = 'CH.02 GO BACK (1984)'; sectionIndex = 2;
      } else if (progress < 0.38) {
        currentActName = 'CH.03 EXTRACT'; sectionIndex = 3;
        isDarkSection = true;
      } else if (progress < 0.50) {
        currentActName = 'CH.04 FIVE MACHINES'; sectionIndex = 4;
      } else if (progress < 0.62) {
        currentActName = 'CH.05 TOURNAMENT'; sectionIndex = 5;
        isDarkSection = true;
      } else if (progress < 0.72) {
        currentActName = 'CH.06 MISSING PIECE'; sectionIndex = 6;
      } else if (progress < 0.84) {
        currentActName = 'CH.07 PROVING GROUND'; sectionIndex = 7;
        isDarkSection = true;
      } else if (progress < 0.92) {
        currentActName = 'CH.08 BATTLE SCARS'; sectionIndex = 8;
      } else if (progress < 0.97) {
        currentActName = 'CH.09 THE MACHINE'; sectionIndex = 9;
        isDarkSection = true;
      } else {
        currentActName = 'FINAL ACT'; sectionIndex = 10;
      }

      if (currentActName !== this.lastActName) {
        this.lastActName = currentActName;
        hudActName.textContent = currentActName;
      }

      // Section transition sound (plays once per section change)
      if (sectionIndex !== this.lastSectionIndex) {
        this.lastSectionIndex = sectionIndex;
        soundEngine.playSectionTransition(sectionIndex);
      }

      if (isDarkSection !== this.lastIsDarkMode) {
        this.lastIsDarkMode = isDarkSection;
        if (isDarkSection) {
          navEl.classList.add('dark-mode');
        } else {
          navEl.classList.remove('dark-mode');
        }
      }
    });

    // Nav Telemetry HUD (Throttled)
    setInterval(() => {
      navFps.textContent = `${telemetry.fps} FPS`;
      navDpr.textContent = `DPR ${telemetry.dpr.toFixed(1)}`;
    }, 500);
  }

  /**
   * GSAP ScrollTrigger entrance animations for every section.
   * Uses once: true and clearProps so elements never get stuck invisible or interfere with interactions.
   */
  private setupScrollAnimations(): void {
    const ease = 'power3.out';

    // Helper for robust section trigger
    const animateSection = (sectionId: string, animationFn: () => void) => {
      ScrollTrigger.create({
        trigger: sectionId,
        start: 'top 85%',
        once: true,
        onEnter: animationFn,
      });
    };

    // --- Prologue ---
    animateSection('#prologue', () => {
      gsap.fromTo('#prologue .prologue-hero-title', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.0, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#prologue .prologue-subtitle', 
        { y: 25, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#prologue .prologue-typewriter-box', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.01 Evidence ---
    animateSection('#act-evidence', () => {
      gsap.fromTo('#act-evidence .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-evidence .evidence-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-evidence .math-dissection-matrix',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.02 Go Back ---
    animateSection('#act-goback', () => {
      gsap.fromTo('#act-goback .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-goback .goback-timeline-strip',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-goback .pdf-cascade-container',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.25, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-goback .lanczos-compression-box',
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.25, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-goback .goback-insights-section',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.35, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.03 Extract ---
    animateSection('#act-extract', () => {
      gsap.fromTo('#act-extract .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-extract .extract-flow-canvas-container',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-extract .probe-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.25, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.04 Five Machines ---
    animateSection('#act-five-machines', () => {
      gsap.fromTo('#act-five-machines .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-five-machines .doorway-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.05 Tournament ---
    animateSection('#act-tournament', () => {
      gsap.fromTo('#act-tournament .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-tournament .tournament-bracket-wrapper',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.06 Missing Piece ---
    animateSection('#act-missing-piece', () => {
      gsap.fromTo('#act-missing-piece .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-missing-piece .timeline-track-row',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.07 Proving Ground ---
    animateSection('#act-proving-ground', () => {
      gsap.fromTo('#act-proving-ground .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-proving-ground .monolith-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.08 Battle Scars ---
    animateSection('#act-battle-scars', () => {
      gsap.fromTo('#act-battle-scars .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-battle-scars .scar-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Ch.09 The Machine ---
    animateSection('#act-the-machine', () => {
      gsap.fromTo('#act-the-machine .chapter-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-the-machine .dag-canvas-container',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, delay: 0.15, ease, clearProps: 'opacity,transform' }
      );
    });

    // --- Final Act ---
    animateSection('#act-open-experiment', () => {
      gsap.fromTo('#act-open-experiment .experiment-final-question',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease, clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-open-experiment .experiment-final-answer',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, delay: 0.2, ease: 'back.out(1.4)', clearProps: 'opacity,transform' }
      );
      gsap.fromTo('#act-open-experiment .experiment-videos-container',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.35, ease, clearProps: 'opacity,transform' }
      );
    });
  }
}

// Bootstrap Application
window.addEventListener('DOMContentLoaded', () => {
  const app = new ResilientDavinciApp();
  app.bootstrap().catch((err) => {
    console.error('Failed to initialize Resilient DaVinci App:', err);
  });
});
