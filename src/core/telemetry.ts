/**
 * Performance Telemetry & Hardware Monitor
 * Invariant: Math.min(window.devicePixelRatio, 2.0)
 */

export class PerformanceTelemetry {
  public fps: number = 60;
  public frameTimeMs: number = 16.6;
  public drawCalls: number = 0;
  public dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);

  private lastTime: number = performance.now();
  private frames: number = 0;
  private accumulator: number = 0;

  public update(now: number): void {
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.frameTimeMs = delta;

    this.accumulator += delta;
    this.frames++;

    if (this.accumulator >= 500) {
      this.fps = Math.round((this.frames * 1000) / this.accumulator);
      this.accumulator = 0;
      this.frames = 0;
    }
  }

  public getFormattedHUD(): { fpsStr: string; frameTimeStr: string; dprStr: string; drawCallsStr: string } {
    return {
      fpsStr: `${this.fps} FPS`,
      frameTimeStr: `${this.frameTimeMs.toFixed(1)}ms`,
      dprStr: `DPR ${this.dpr.toFixed(1)} [CLAMPED ≤ 2.0]`,
      drawCallsStr: `${this.drawCalls} DRAWS`,
    };
  }
}

export const telemetry = new PerformanceTelemetry();
