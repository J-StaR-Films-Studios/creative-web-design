import { masterTicker } from './core/ticker';
import { soundEngine } from './core/audio';
import { telemetry } from './core/telemetry';
import { theaterEngine, PROVING_PROJECTS } from './components/FullCanvasTheater';

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
  private lastScrollSoundTime: number = 0;

  public async bootstrap(): Promise<void> {
    // Invariant: Wait for all web font glyphs to load before calculating metrics
    await document.fonts.ready;

    // Initialize master RAF clock and Lenis smooth scroll
    const lenis = masterTicker.init();

    // Mount all 11 Acts
    const p00 = document.getElementById('prologue');
    const p01 = document.getElementById('act-evidence');
    const p02 = document.getElementById('act-goback');
    const p03 = document.getElementById('act-extract');
    const p04 = document.getElementById('act-five-machines');
    const p05 = document.getElementById('act-tournament');
    const p06 = document.getElementById('act-missing-piece');
    const p07 = document.getElementById('act-proving-ground');
    const p08 = document.getElementById('act-battle-scars');
    const p09 = document.getElementById('act-the-machine');
    const p10 = document.getElementById('act-open-experiment');

    if (p00) this.act00.init(p00);
    if (p01) this.act01.init(p01);
    if (p02) this.act02.init(p02);
    if (p03) this.act03.init(p03);
    if (p04) this.act04.init(p04);
    if (p05) this.act05.init(p05);
    if (p06) this.act06.init(p06);
    if (p07) this.act07.init(p07);
    if (p08) this.act08.init(p08);
    if (p09) this.act09.init(p09);
    if (p10) this.act10.init(p10);

    this.setupGlobalControls(lenis);
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
    lenis.on('scroll', ({ scroll, limit, velocity }: { scroll: number; limit: number; velocity: number }) => {
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

      if (progress < 0.08) {
        currentActName = 'PROLOGUE';
      } else if (progress < 0.18) {
        currentActName = 'CH.01 EVIDENCE';
      } else if (progress < 0.28) {
        currentActName = 'CH.02 GO BACK (1984)';
      } else if (progress < 0.38) {
        currentActName = 'CH.03 EXTRACT';
        isDarkSection = true;
      } else if (progress < 0.50) {
        currentActName = 'CH.04 FIVE MACHINES';
      } else if (progress < 0.62) {
        currentActName = 'CH.05 TOURNAMENT';
        isDarkSection = true;
      } else if (progress < 0.72) {
        currentActName = 'CH.06 MISSING PIECE';
      } else if (progress < 0.84) {
        currentActName = 'CH.07 PROVING GROUND';
        isDarkSection = true;
      } else if (progress < 0.92) {
        currentActName = 'CH.08 BATTLE SCARS';
      } else if (progress < 0.97) {
        currentActName = 'CH.09 THE MACHINE';
        isDarkSection = true;
      } else {
        currentActName = 'FINAL ACT';
      }

      if (currentActName !== this.lastActName) {
        this.lastActName = currentActName;
        hudActName.textContent = currentActName;
      }

      if (isDarkSection !== this.lastIsDarkMode) {
        this.lastIsDarkMode = isDarkSection;
        if (isDarkSection) {
          navEl.classList.add('dark-mode');
        } else {
          navEl.classList.remove('dark-mode');
        }
      }

      // Throttled Audio on fast flick scrolling (max 1 chirp per 350ms)
      const now = performance.now();
      if (Math.abs(velocity) > 12 && now - this.lastScrollSoundTime > 350) {
        this.lastScrollSoundTime = now;
        soundEngine.playHoverChirp(320 + Math.min(600, Math.abs(velocity) * 15));
      }
    });

    // Nav Telemetry HUD Updates (Throttled)
    setInterval(() => {
      navFps.textContent = `${telemetry.fps} FPS`;
      navDpr.textContent = `DPR ${telemetry.dpr.toFixed(1)}`;
    }, 500);
  }
}

// Bootstrap Application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const app = new ResilientDavinciApp();
  app.bootstrap().catch((err) => {
    console.error('Failed to initialize Resilient DaVinci App:', err);
  });
});
