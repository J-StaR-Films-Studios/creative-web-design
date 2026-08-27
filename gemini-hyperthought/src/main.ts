/**
 * Main Application Orchestrator
 * Fuses Canvas 2D Sand Typography, Three.js 3D WebGL Reasoning Core,
 * GLSL Fluid Distortion, Lenis + GSAP Scrollytelling, Procedural Audio, and Thought Crucible.
 */

import './styles/main.css';
import { soundEngine } from './audio/Synthesizer';
import { SandTextEngine } from './particles/SandTextEngine';
import { ReasoningCore3D } from './webgl/ReasoningCore3D';
import { FluidDistortionCanvas } from './webgl/FluidDistortionCanvas';
import { ScrollOrchestrator } from './motion/ScrollOrchestrator';
import { ThoughtCrucible } from './crucible/ThoughtCrucible';
import { shutter } from './ui/ShutterTransition';

class HyperthoughtApp {
  public sandEngine: SandTextEngine | null = null;
  public reasoningCore: ReasoningCore3D | null = null;
  public fluidCanvas: FluidDistortionCanvas | null = null;
  public scrollOrchestrator: ScrollOrchestrator | null = null;
  public crucible: ThoughtCrucible | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // 1. Play Cinematic Shutter Reveal
    await shutter.reveal();

    // 2. Initialize 3D Reasoning Core
    const threeContainer = document.getElementById('threeCanvasContainer');
    if (threeContainer) {
      this.reasoningCore = new ReasoningCore3D(threeContainer);
    }

    // 3. Initialize Fluid Distortion Canvas
    const fluidContainer = document.getElementById('fluidCanvasContainer');
    if (fluidContainer) {
      this.fluidCanvas = new FluidDistortionCanvas(fluidContainer);
    }

    // 4. Initialize Canvas 2D Sand Typography
    const sandCanvas = document.getElementById('sandTextCanvas') as HTMLCanvasElement;
    if (sandCanvas) {
      this.sandEngine = new SandTextEngine(sandCanvas);
    }

    // 5. Initialize Motion & Scroll Orchestrator
    this.scrollOrchestrator = new ScrollOrchestrator(this.reasoningCore || undefined);

    // 6. Initialize Thought Crucible
    const crucibleCanvas = document.getElementById('crucibleCanvas') as HTMLCanvasElement;
    if (crucibleCanvas) {
      this.crucible = new ThoughtCrucible(crucibleCanvas);
    }

    // 7. Bind UI Interactivity
    this.bindUI();
  }

  private bindUI(): void {
    // Audio Toggle
    const audioBtn = document.getElementById('audioToggleBtn');
    const audioStatusText = document.getElementById('audioStatusText');

    if (audioBtn && audioStatusText) {
      audioBtn.addEventListener('click', () => {
        const isNowActive = soundEngine.toggleMute();
        if (isNowActive) {
          audioBtn.classList.add('active');
          audioStatusText.textContent = 'AUDIO: SYNTH ONLINE';
          soundEngine.playEurekaChord();
        } else {
          audioBtn.classList.remove('active');
          audioStatusText.textContent = 'AUDIO: MUTED';
        }
      });
    }

    // Sand Text Morph Selector Pills
    const morphPills = document.querySelectorAll('.morph-pill-btn');
    morphPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const index = parseInt(target.dataset.index || '0', 10);
        morphPills.forEach(p => p.classList.remove('active'));
        target.classList.add('active');
        if (this.sandEngine) {
          this.sandEngine.setPhrase(index);
        }
      });
    });

    // Reasoning Budget Buttons (1X, 8X, 64X, 512X)
    const budgetBtns = document.querySelectorAll('.budget-btn');
    budgetBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const budget = parseInt(target.dataset.budget || '64', 10);
        budgetBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        if (this.reasoningCore) {
          this.reasoningCore.setReasoningBudget(budget);
        }
        soundEngine.playUiBlip(600 + Math.log2(budget) * 120);
      });
    });

    // Navigation Anchors
    const navHero = document.getElementById('navHero');
    const navStrata = document.getElementById('navStrata');
    const navCrucible = document.getElementById('navCrucible');
    const navSpecs = document.getElementById('navSpecs');
    const btnBackToTop = document.getElementById('btnBackToTop');

    if (navHero) navHero.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionHero'));
    if (navStrata) navStrata.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionStrata'));
    if (navCrucible) navCrucible.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionCrucible'));
    if (navSpecs) navSpecs.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionSpecs'));
    if (btnBackToTop) btnBackToTop.addEventListener('click', () => this.scrollOrchestrator?.scrollTo(0));

    // Thought Crucible Scenarios
    const scenarioPills = document.querySelectorAll('.scenario-pill');
    scenarioPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const scenarioId = target.dataset.scenario || 'many-worlds';
        scenarioPills.forEach(p => p.classList.remove('active'));
        target.classList.add('active');

        if (this.crucible) {
          this.crucible.setScenarioById(scenarioId);
        }
      });
    });

    // Execute Reason Button
    const btnExecuteReason = document.getElementById('btnExecuteReason');
    if (btnExecuteReason) {
      btnExecuteReason.addEventListener('click', () => {
        if (this.crucible) {
          this.crucible.triggerSimulation();
        }
      });
    }

    // Custom Query Injection
    const btnCustomQuery = document.getElementById('btnCustomQuery');
    const customQueryInput = document.getElementById('customQueryInput') as HTMLInputElement;
    if (btnCustomQuery && customQueryInput) {
      const handleCustom = () => {
        const val = customQueryInput.value.trim();
        if (val && this.crucible) {
          scenarioPills.forEach(p => p.classList.remove('active'));
          this.crucible.runCustomQuery(val);
          customQueryInput.value = '';
        }
      };

      btnCustomQuery.addEventListener('click', handleCustom);
      customQueryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCustom();
      });
    }

    // Hover UI sounds
    document.querySelectorAll('button, .nav-link, .morph-pill-btn, .split-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        soundEngine.playUiBlip(1200);
      });
    });
  }
}

// Boot application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new HyperthoughtApp();
});
