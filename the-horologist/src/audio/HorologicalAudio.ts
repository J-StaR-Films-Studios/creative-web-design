/**
 * Procedural Web Audio API Sound Synthesizer for Escapement Ticks & Mechanics
 */
export class HorologicalAudio {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private tickInterval: number | null = null;

  constructor() {}

  public toggle(): boolean {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = !this.isEnabled;

    if (this.isEnabled) {
      this.startEscapementLoop();
      this.playHarmonicChime(440);
    } else {
      this.stopEscapementLoop();
    }

    return this.isEnabled;
  }

  public playTick(frequency: number = 2400, decay: number = 0.02, gainVal: number = 0.12) {
    if (!this.isEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Highpass filter for crisp mechanical tooth escapement click
    filter.type = 'highpass';
    filter.frequency.value = 1800;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + decay);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + decay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + decay);
  }

  public playHarmonicChime(rootFreq: number = 520) {
    if (!this.isEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(rootFreq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  private startEscapementLoop() {
    // 4Hz = 8 ticks per second (28,800 VPH)
    let alt = false;
    this.tickInterval = window.setInterval(() => {
      alt = !alt;
      this.playTick(alt ? 2800 : 2200, 0.015, alt ? 0.15 : 0.1);
    }, 125);
  }

  private stopEscapementLoop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}
