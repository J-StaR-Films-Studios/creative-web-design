/**
 * Procedural Web Audio API Sound Engine
 * Synthesizes 4Hz horological escapement ticks, ambient room drones,
 * hover sweeps, and harmonic chords without external audio files.
 */

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private escapementInterval: number | null = null;

  public init(): void {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupAmbientDrone();
      this.isInitialized = true;
    } catch {
      console.warn('Web Audio API not supported or blocked in this environment.');
    }
  }

  private setupAmbientDrone(): void {
    if (!this.ctx || !this.masterGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    // 52Hz Subterranean Root + 104Hz Octave Drone
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(52, this.ctx.currentTime);

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(104.3, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const targetGain = this.isMuted ? 0 : 0.8;
    this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.15);

    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Procedural UI hover acoustic chirp
   */
  public playHoverChirp(freq: number = 640): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  /**
   * Procedural 4Hz mechanical horological escapement tick
   */
  public playEscapementTick(isTick: boolean = true): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Alternate frequency slightly for tick vs tock
    const baseFreq = isTick ? 1800 : 1400;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.02);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    filter.Q.setValueAtTime(8, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  /**
   * Start or stop continuous 4Hz escapement loop (e.g. for Chapter 04 / The Horologist preview)
   */
  public startEscapementLoop(): void {
    if (this.escapementInterval !== null) return;
    let isTick = true;
    this.escapementInterval = window.setInterval(() => {
      this.playEscapementTick(isTick);
      isTick = !isTick;
    }, 250); // 4Hz = 250ms interval
  }

  public stopEscapementLoop(): void {
    if (this.escapementInterval !== null) {
      clearInterval(this.escapementInterval);
      this.escapementInterval = null;
    }
  }

  /**
   * Procedural Harmonic Resolution Chord
   */
  public playHarmonicChord(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const chordFreqs = [220, 277.18, 329.63, 440, 554.37]; // A major 9 spread
    chordFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const delay = idx * 0.03;
      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.08 / chordFreqs.length, this.ctx.currentTime + delay + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + 2.0);
    });
  }
}

export const soundEngine = new ProceduralAudioEngine();
