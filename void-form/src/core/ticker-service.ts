import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

type TickerCallback = (time: number, deltaTime: number) => void;

class MasterTickerService {
  private lenis: Lenis | null = null;
  private callbacks: Set<TickerCallback> = new Set();
  private lastTime = 0;

  public init(): Lenis {
    if (this.lenis) return this.lenis;

    // 1. Initialize Lenis with Exponential Inertia
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    // 2. Synchronize Lenis Scroll Updates with ScrollTrigger
    this.lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // 3. Drive Lenis via GSAP Central Ticker (Unified Clock)
    gsap.ticker.add((time: number) => {
      if (this.lenis) {
        this.lenis.raf(time * 1000); // GSAP provides seconds, Lenis expects ms
      }

      const deltaTime = this.lastTime ? time - this.lastTime : 0.016;
      this.lastTime = time;

      // Dispatch to all registered renderers (Three.js, Canvas, Cursor)
      this.callbacks.forEach((cb) => {
        try {
          cb(time, deltaTime);
        } catch (err) {
          console.error('Ticker callback error:', err);
        }
      });
    });

    // 4. Disable Lag Smoothing for Real-Time Scrubber Sync
    gsap.ticker.lagSmoothing(0);

    return this.lenis;
  }

  public getLenis(): Lenis | null {
    return this.lenis;
  }

  public add(cb: TickerCallback): () => void {
    this.callbacks.add(cb);
    return () => {
      this.callbacks.delete(cb);
    };
  }

  public remove(cb: TickerCallback): void {
    this.callbacks.delete(cb);
  }

  public destroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    this.callbacks.clear();
    ScrollTrigger.killAll();
  }
}

export const tickerService = new MasterTickerService();
