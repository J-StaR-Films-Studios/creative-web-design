/**
 * Main Application Orchestrator
 * Apple Minimalist Architecture for Gemini 3.7 Pro High Reasoning
 * Unifies Three.js Titanium Monolith, Canvas 2D Sand Typography, Lenis Smooth Scroll, and Thought Bench.
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
    // 1. Play Cinematic Apple Shutter Reveal
    await shutter.reveal();

    // 2. Initialize 3D Titanium Monolith Core
    const threeContainer = document.getElementById('threeCanvasContainer');
    if (threeContainer) {
      this.reasoningCore = new ReasoningCore3D(threeContainer);
    }

    // 3. Initialize Ambient Spotlight Canvas
    const fluidContainer = document.getElementById('fluidCanvasContainer');
    if (fluidContainer) {
      this.fluidCanvas = new FluidDistortionCanvas(fluidContainer);
    }

    // 4. Initialize Canvas 2D Sand Typography
    const sandCanvas = document.getElementById('sandTextCanvas') as HTMLCanvasElement;
    if (sandCanvas) {
      this.sandEngine = new SandTextEngine(sandCanvas);
    }

    // 5. Initialize Motion & Smooth Scroll Orchestrator
    this.scrollOrchestrator = new ScrollOrchestrator(this.reasoningCore || undefined);

    // 6. Initialize Apple Developer Thinking Bench
    const crucibleCanvas = document.getElementById('crucibleCanvas') as HTMLCanvasElement;
    if (crucibleCanvas) {
      this.crucible = new ThoughtCrucible(crucibleCanvas);
    }

    // 7. Bind Clean UI Interactions
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
          audioStatusText.textContent = 'Sound: On';
          soundEngine.playEurekaChord();
        } else {
          audioBtn.classList.remove('active');
          audioStatusText.textContent = 'Sound';
        }
      });
    }

    // Reasoning Budget Segmented Buttons (Standard, 8X, 64X Pro, 512X Max)
    const segmentedBtns = document.querySelectorAll('.segmented-btn');
    segmentedBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const budget = parseInt(target.dataset.budget || '64', 10);
        segmentedBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        if (this.reasoningCore) {
          this.reasoningCore.setReasoningBudget(budget);
        }
        soundEngine.playUiBlip();
      });
    });

    // Navigation Anchors
    const navOverview = document.getElementById('navOverview');
    const navArchitecture = document.getElementById('navArchitecture');
    const navBench = document.getElementById('navBench');
    const navSpecs = document.getElementById('navSpecs');
    const btnExploreArch = document.getElementById('btnExploreArch');
    const btnTryBench = document.getElementById('btnTryBench');
    const btnBackToTop = document.getElementById('btnBackToTop');

    if (navOverview) navOverview.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionHero'));
    if (navArchitecture) navArchitecture.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionStrata'));
    if (navBench) navBench.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionCrucible'));
    if (navSpecs) navSpecs.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionSpecs'));
    if (btnExploreArch) btnExploreArch.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionStrata'));
    if (btnTryBench) btnTryBench.addEventListener('click', () => this.scrollOrchestrator?.scrollTo('#sectionCrucible'));
    if (btnBackToTop) btnBackToTop.addEventListener('click', () => this.scrollOrchestrator?.scrollTo(0));

    // Thought Crucible Scenarios
    const scenarioPills = document.querySelectorAll('.scenario-pill');
    scenarioPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const scenarioId = target.dataset.scenario || 'formal-logic';
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

    // Soft tactile click sounds on buttons
    document.querySelectorAll('button, .nav-link, .segmented-btn, .scenario-pill').forEach(el => {
      el.addEventListener('click', () => {
        soundEngine.playUiBlip();
      });
    });
  }
}

// Boot application
document.addEventListener('DOMContentLoaded', () => {
  new HyperthoughtApp();
});
