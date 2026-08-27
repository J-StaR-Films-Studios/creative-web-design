'use client';

export class ArchiveAudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private masterGain: GainNode | null = null;
  private roomGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private currentRoom: string = 'image';
  private listeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    // AudioContext is created on first user gesture
  }

  private initContext() {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.roomGain = this.ctx.createGain();
    this.roomGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.roomGain.connect(this.masterGain);

    this.startAtmosphere();
  }

  private startAtmosphere() {
    if (!this.ctx || !this.roomGain) return;

    // Sub-bass drone oscillator 1 (43.65 Hz - F1)
    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(43.65, this.ctx.currentTime);

    // Harmonic drone oscillator 2 (65.41 Hz - C2)
    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'triangle';
    this.ambientOsc2.frequency.setValueAtTime(65.41, this.ctx.currentTime);

    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
    this.ambientFilter.Q.setValueAtTime(4, this.ctx.currentTime);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.ambientOsc1.connect(this.ambientFilter);
    this.ambientOsc2.connect(this.ambientFilter);
    this.ambientFilter.connect(oscGain);
    oscGain.connect(this.roomGain);

    this.ambientOsc1.start();
    this.ambientOsc2.start();

    // Procedural organic noise floor (35mm film grain / archival room air)
    this.createArchivalNoise();
  }

  private createArchivalNoise() {
    if (!this.ctx || !this.roomGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Pinkish/brownish noise generator
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
      b6 = white * 0.115926;
    }

    const whiteNoiseSource = this.ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.012, this.ctx.currentTime);

    whiteNoiseSource.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.roomGain);

    whiteNoiseSource.start();
    this.noiseNode = whiteNoiseSource;
  }

  public toggle(): boolean {
    this.initContext();

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = !this.isEnabled;

    if (this.masterGain && this.ctx) {
      const targetGain = this.isEnabled ? 0.3 : 0.0;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }

    if (this.isEnabled) {
      this.playHarmonicChime(520);
    }

    this.listeners.forEach(cb => cb(this.isEnabled));
    return this.isEnabled;
  }

  public getIsAudioEnabled(): boolean {
    return this.isEnabled;
  }

  public onStateChange(callback: (enabled: boolean) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public setRoomAtmosphere(roomId: string) {
    if (!this.ctx || !this.isEnabled || !this.ambientFilter || !this.ambientOsc1 || !this.ambientOsc2) return;
    this.currentRoom = roomId;

    const now = this.ctx.currentTime;
    switch (roomId) {
      case 'image':
        this.ambientOsc1.frequency.setTargetAtTime(43.65, now, 0.4);
        this.ambientOsc2.frequency.setTargetAtTime(65.41, now, 0.4);
        this.ambientFilter.frequency.setTargetAtTime(200, now, 0.4);
        if (this.noiseGain) this.noiseGain.gain.setTargetAtTime(0.015, now, 0.3);
        break;
      case 'sound':
        this.ambientOsc1.frequency.setTargetAtTime(55.0, now, 0.4); // A1
        this.ambientOsc2.frequency.setTargetAtTime(110.0, now, 0.4); // A2
        this.ambientFilter.frequency.setTargetAtTime(480, now, 0.4);
        break;
      case 'typography':
        this.ambientOsc1.frequency.setTargetAtTime(36.71, now, 0.4); // D1
        this.ambientOsc2.frequency.setTargetAtTime(73.42, now, 0.4); // D2
        this.ambientFilter.frequency.setTargetAtTime(140, now, 0.4);
        break;
      case 'objects':
        this.ambientOsc1.frequency.setTargetAtTime(48.99, now, 0.4); // G1
        this.ambientOsc2.frequency.setTargetAtTime(97.99, now, 0.4); // G2
        this.ambientFilter.frequency.setTargetAtTime(280, now, 0.4);
        break;
      case 'film':
        this.ambientOsc1.frequency.setTargetAtTime(32.70, now, 0.4); // C1
        this.ambientOsc2.frequency.setTargetAtTime(65.41, now, 0.4); // C2
        this.ambientFilter.frequency.setTargetAtTime(350, now, 0.4);
        if (this.noiseGain) this.noiseGain.gain.setTargetAtTime(0.04, now, 0.3);
        break;
      case 'digital':
        this.ambientOsc1.frequency.setTargetAtTime(58.27, now, 0.4); // Bb1
        this.ambientOsc2.frequency.setTargetAtTime(116.54, now, 0.4); // Bb2
        this.ambientFilter.frequency.setTargetAtTime(650, now, 0.4);
        break;
      case 'finale':
        this.ambientOsc1.frequency.setTargetAtTime(32.70, now, 0.8);
        this.ambientOsc2.frequency.setTargetAtTime(48.99, now, 0.8);
        this.ambientFilter.frequency.setTargetAtTime(100, now, 0.8);
        break;
    }
  }

  public playTick(frequency: number = 2400, decay: number = 0.02, gainVal: number = 0.08) {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1600, this.ctx.currentTime);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + decay);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + decay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + decay);
  }

  public playHarmonicChime(rootFreq: number = 520) {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(rootFreq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  public playDoorPassage() {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 2.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 2.5);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.5);
  }

  public playDestructionSound() {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 3.0);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 3.0);
  }

  public dispose() {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.listeners.clear();
  }
}

export const globalAudio = new ArchiveAudioEngine();
