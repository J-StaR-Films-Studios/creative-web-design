/**
 * Procedural Web Audio Engine for Gemini 3.7 Hyperthought
 * Zero-asset browser-synthesized binaural drone, harmonic chimes, sub-bass surges, and telemetry blips.
 */

export class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private oscA: OscillatorNode | null = null;
  private oscB: OscillatorNode | null = null;
  private oscC: OscillatorNode | null = null;
  private analyser: AnalyserNode | null = null;

  private pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  private lastChimeTime = 0;

  constructor() {
    // AudioContext will be initialized on first user gesture to comply with browser autoplay policies
  }

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

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Ambient Binaural Drone Setup
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(3.5, this.ctx.currentTime);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      // Deep fundamental + detuned pair for binaural beating
      this.oscA = this.ctx.createOscillator();
      this.oscA.type = 'sine';
      this.oscA.frequency.setValueAtTime(55.0, this.ctx.currentTime); // A1

      this.oscB = this.ctx.createOscillator();
      this.oscB.type = 'sine';
      this.oscB.frequency.setValueAtTime(55.6, this.ctx.currentTime); // 0.6Hz binaural beat

      this.oscC = this.ctx.createOscillator();
      this.oscC.type = 'triangle';
      this.oscC.frequency.setValueAtTime(110.0, this.ctx.currentTime); // A2 harmonic

      this.oscA.connect(this.droneGain);
      this.oscB.connect(this.droneGain);
      this.oscC.connect(this.droneGain);

      this.droneGain.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);

      this.oscA.start();
      this.oscB.start();
      this.oscC.start();

      return true;
    } catch (err) {
      console.warn('Web Audio API not supported or restricted:', err);
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
      this.masterGain.gain.setTargetAtTime(0.65, now, 0.15);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Modulate drone filter cutoff and intensity based on reasoning depth (1x to 512x) & scroll
   */
  public setReasoningIntensity(level: number, scrollProgress: number = 0): void {
    if (!this.ctx || !this.filterNode || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Map reasoning level (1 to 512) and scroll progress to filter frequency (250Hz - 2400Hz)
    const normalizedLevel = Math.min(Math.log2(level) / 9, 1.0); // 1->0, 512->1
    const targetFreq = 280 + normalizedLevel * 1400 + scrollProgress * 600;

    this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.1);
  }

  /**
   * Granular crystalline chime triggered by particle scattering
   */
  public playParticleChime(intensity: number = 0.5): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = performance.now();
    if (now - this.lastChimeTime < 45) return; // Throttle to prevent audio buffer saturation
    this.lastChimeTime = now;

    const noteIdx = Math.floor(Math.random() * this.pentatonicScale.length);
    const freq = this.pentatonicScale[noteIdx];
    const audioNow = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioNow);

    const amp = Math.min(Math.max(intensity * 0.12, 0.02), 0.15);
    gain.gain.setValueAtTime(amp, audioNow);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(audioNow);
    osc.stop(audioNow + 0.36);
  }

  /**
   * Deep sub-bass pulse on 3D card flips or stage triggers
   */
  public playSubPulse(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const audioNow = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, audioNow);
    osc.frequency.exponentialRampToValueAtTime(38, audioNow + 0.45);

    gain.gain.setValueAtTime(0.35, audioNow);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(audioNow);
    osc.stop(audioNow + 0.51);
  }

  /**
   * High-tech UI click blip
   */
  public playUiBlip(freq: number = 880): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const audioNow = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioNow);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioNow + 0.06);

    gain.gain.setValueAtTime(0.12, audioNow);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(audioNow);
    osc.stop(audioNow + 0.08);
  }

  /**
   * Eureka burst harmonic chord
   */
  public playEurekaChord(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const audioNow = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioNow + idx * 0.04);

      gain.gain.setValueAtTime(0.08, audioNow + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 1.2 + idx * 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(audioNow + idx * 0.04);
      osc.stop(audioNow + 1.3 + idx * 0.04);
    });
  }

  /**
   * Returns current audio frequency data for reactive visualizers
   */
  public getFrequencyData(array: Uint8Array<ArrayBuffer>): void {
    if (this.analyser && !this.isMuted) {
      this.analyser.getByteFrequencyData(array);
    } else {
      array.fill(0);
    }
  }
}

export const soundEngine = new AudioSynthesizer();
