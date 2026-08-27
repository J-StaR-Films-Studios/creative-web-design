/**
 * Apple Tactile & Serene Audio Engine
 * Pure procedural Web Audio API: gentle sine ambient warmth and subtle tactile UI ticks.
 */

export class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private oscA: OscillatorNode | null = null;
  private oscB: OscillatorNode | null = null;

  constructor() {}

  public async init(): Promise<boolean> {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Warm, velvety lowpass ambient tone
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(220, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.0, this.ctx.currentTime);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.oscA = this.ctx.createOscillator();
      this.oscA.type = 'sine';
      this.oscA.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

      this.oscB = this.ctx.createOscillator();
      this.oscB.type = 'sine';
      this.oscB.frequency.setValueAtTime(65.75, this.ctx.currentTime);

      this.oscA.connect(this.droneGain);
      this.oscB.connect(this.droneGain);
      this.droneGain.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);

      this.oscA.start();
      this.oscB.start();

      return true;
    } catch (err) {
      console.warn('Web Audio API not initialized:', err);
      return false;
    }
  }

  public toggleMute(): boolean {
    if (!this.ctx) {
      this.init().then(() => {
        this.setMuted(false);
      });
      return false;
    }

    this.setMuted(!this.isMuted);
    return !this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    if (muted) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.0, now, 0.08);
    } else {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.5, now, 0.15);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setReasoningIntensity(level: number, scrollProgress: number = 0): void {
    if (!this.ctx || !this.filterNode || this.isMuted) return;

    const now = this.ctx.currentTime;
    const normalized = Math.min(Math.log2(level) / 9, 1.0);
    const targetFreq = 180 + normalized * 600 + scrollProgress * 300;

    this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.1);
  }

  /**
   * Tactile Apple UI Tick (Quiet, soft click)
   */
  public playUiBlip(_freq: number = 600): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Clean harmonic bell
   */
  public playEurekaChord(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const chord = [523.25, 659.25, 783.99];
    const now = this.ctx.currentTime;

    chord.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.85);
    });
  }

  public playSubPulse(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }
}

export const soundEngine = new AudioSynthesizer();
