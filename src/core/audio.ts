/**
 * Procedural Web Audio API Sound Engine
 * Ambient section transitions, warm hover tones, and harmonic chords.
 * No external audio files — everything synthesized in real-time.
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
  private lastSectionIndex: number = -1;

  // Section harmonic roots (one per chapter, ascending warmth)
  private readonly sectionRoots: number[] = [
    110,   // Prologue — A2 deep
    130.81, // Ch.01 — C3
    146.83, // Ch.02 — D3
    164.81, // Ch.03 — E3
    174.61, // Ch.04 — F3
    196,    // Ch.05 — G3
    220,    // Ch.06 — A3
    246.94, // Ch.07 — B3
    261.63, // Ch.08 — C4
    293.66, // Ch.09 — D4
    329.63, // Ch.10 — E4
  ];

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
      console.warn('Web Audio API not supported or blocked.');
    }
  }

  private setupAmbientDrone(): void {
    if (!this.ctx || !this.masterGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

    // 52Hz Subterranean Root + 104Hz Octave
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
    const targetGain = this.isMuted ? 0 : 0.7;
    this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.15);

    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Soft, warm hover tone — sine wave with gentle attack/decay.
   * Much subtler than the previous version.
   */
  public playHoverChirp(freq: number = 640): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.2, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.025, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  /**
   * Subtle woodblock-style tick for typewriter keys.
   */
  public playSubtleTick(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  /**
   * Ambient pad swell on section transition.
   * Plays a warm two-note interval based on the section's harmonic root.
   * Fades in slowly and decays over 2.5 seconds — feels like a room shift.
   */
  public playSectionTransition(sectionIndex: number): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    if (sectionIndex === this.lastSectionIndex) return;
    this.lastSectionIndex = sectionIndex;

    const root = this.sectionRoots[Math.min(sectionIndex, this.sectionRoots.length - 1)];
    const fifth = root * 1.5; // Perfect fifth
    const now = this.ctx.currentTime;

    [root, fifth].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400 + sectionIndex * 30, now);
      filter.Q.setValueAtTime(1.2, now);

      const delay = idx * 0.08;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.04, now + delay + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 3.0);
    });
  }

  /**
   * 4Hz mechanical horological escapement tick
   */
  public playEscapementTick(isTick: boolean = true): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const baseFreq = isTick ? 1800 : 1400;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.02);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    filter.Q.setValueAtTime(8, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  public startEscapementLoop(): void {
    if (this.escapementInterval !== null) return;
    let isTick = true;
    this.escapementInterval = window.setInterval(() => {
      this.playEscapementTick(isTick);
      isTick = !isTick;
    }, 250);
  }

  public stopEscapementLoop(): void {
    if (this.escapementInterval !== null) {
      clearInterval(this.escapementInterval);
      this.escapementInterval = null;
    }
  }

  /**
   * Harmonic Resolution Chord — for major moments
   */
  public playHarmonicChord(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const chordFreqs = [220, 277.18, 329.63, 440, 554.37];
    chordFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const delay = idx * 0.03;
      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.06 / chordFreqs.length, this.ctx.currentTime + delay + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + 2.0);
    });
  }
}

export const soundEngine = new ProceduralAudioEngine();
