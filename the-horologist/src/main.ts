/**
 * Master Application Orchestrator: Connects Shutter, Sand Text, Tourbillon Canvas, Shaders & Sound
 */
import { CinematicShutter } from './ui/CinematicShutter';
import { SandDustEngine } from './particles/SandDustEngine';
import { TourbillonMechanics } from './canvas/TourbillonMechanics';
import { ChronoDistortion } from './shaders/ChronoDistortion';
import { HorologicalAudio } from './audio/HorologicalAudio';
import { ScrollChoreographer } from './motion/ScrollChoreographer';

class HorologicalApp {
  private shutter: CinematicShutter;
  private sandEngine: SandDustEngine;
  private tourbillon: TourbillonMechanics;
  private distortion: ChronoDistortion;
  private audio: HorologicalAudio;
  private scroller: ScrollChoreographer;

  private fpsCounter: HTMLElement;
  private audioBtn: HTMLElement;
  private lastTime: number = performance.now();
  private frames: number = 0;
  private fpsTimer: number = 0;

  constructor() {
    this.fpsCounter = document.getElementById('hud-fps-counter')!;
    this.audioBtn = document.getElementById('audio-toggle-btn')!;

    // 1. Initialize Components
    this.shutter = new CinematicShutter();
    this.audio = new HorologicalAudio();

    const particleCanvas = document.getElementById('particle-text-canvas') as HTMLCanvasElement;
    this.sandEngine = new SandDustEngine(particleCanvas);

    const tourbillonCanvas = document.getElementById('tourbillon-canvas') as HTMLCanvasElement;
    this.tourbillon = new TourbillonMechanics(tourbillonCanvas);

    const glCanvas = document.getElementById('gl-background-canvas') as HTMLCanvasElement;
    this.distortion = new ChronoDistortion(glCanvas);

    this.scroller = new ScrollChoreographer();

    this.bindEvents();
    this.startRenderLoop();
  }

  private bindEvents() {
    // Audio Toggle
    this.audioBtn.addEventListener('click', () => {
      const active = this.audio.toggle();
      this.audioBtn.classList.toggle('active', active);
      const btnText = this.audioBtn.querySelector('.btn-text')!;
      btnText.textContent = active ? 'ACOUSTIC TICKS: ACTIVE' : 'ACOUSTIC TICKS: OFF';
    });

    // Acquire CTA Button Shutter Flash
    const acquireBtn = document.getElementById('acquire-btn')!;
    acquireBtn.addEventListener('click', () => {
      this.audio.playHarmonicChime(660);
      this.shutter.flashShutter(() => {
        alert('COMMISSION SEQUENCE CONFIRMED: Observatory slot reserved for calendar year 2026.');
      });
    });

    // Window Resize Handling
    window.addEventListener('resize', () => {
      this.sandEngine.resize();
      this.tourbillon.resize();
      this.distortion.resize();
    });
  }

  private startRenderLoop() {
    const loop = (time: number) => {
      const delta = (time - this.lastTime) * 0.001;
      this.lastTime = time;

      // Update Systems
      this.sandEngine.update();
      this.tourbillon.update(delta);
      this.distortion.update(time * 0.001);

      // FPS Telemetry
      this.frames++;
      if (time - this.fpsTimer > 500) {
        const fps = Math.round((this.frames * 1000) / (time - this.fpsTimer));
        this.fpsCounter.textContent = `${fps}.0 FPS`;
        this.frames = 0;
        this.fpsTimer = time;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new HorologicalApp();
});
