import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { telemetry } from './telemetry';

gsap.registerPlugin(ScrollTrigger);

export type RenderCallback = (time: number, delta: number) => void;

class MasterTickerManager {
  public lenis!: Lenis;
  private callbacks: Set<RenderCallback> = new Set();
  private isRunning: boolean = false;
  private lastTime: number = performance.now();

  public init(): Lenis {
    if (this.lenis) return this.lenis;

    // Initialize Lenis smooth scroll
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Invariant: Enforce lagSmoothing(0) for 1:1 playhead fidelity
    gsap.ticker.lagSmoothing(0);

    // Drive Lenis through GSAP ticker or unified RAF
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    // Start Master RAF Loop
    this.start();

    return this.lenis;
  }

  public register(callback: RenderCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  private start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = (now: number) => {
      if (!this.isRunning) return;

      const delta = now - this.lastTime;
      this.lastTime = now;

      // Update telemetry
      telemetry.update(now);

      // Execute registered custom render loops
      this.callbacks.forEach((cb) => {
        try {
          cb(now, delta);
        } catch (e) {
          console.error('Ticker callback error:', e);
        }
      });

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  public stop(): void {
    this.isRunning = false;
  }
}

export const masterTicker = new MasterTickerManager();
