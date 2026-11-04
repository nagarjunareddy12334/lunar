import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Procedural Web Audio API sound generator.
 * Creates ultra-subtle, luxury micro-soundscapes without downloading any audio files.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default muted for respectful UX
    this.ambientGain = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.filter = null;
    this.isPlayingAmbient = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    } else {
      this.init();
      this.playClick();
      this.startAmbient();
    }
  }

  // Ultra-subtle luxury UI click
  playClick(freq = 1200, duration = 0.04) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Soft subtle hover tick
  playHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch {
      // ignore
    }
  }

  // Luxurious celestial harmonic chime (e.g. Add to Cart / Wishlist)
  playSuccessChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 830.61, 987.77]; // Funky Maj9 Groovy Arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.06 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Atmospheric Thunder Strike & Rolling Sub-bass Rumble
  playThunder() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // 1. Initial Electric Crack / Lightning Snap (white noise burst)
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Resonant lowpass filter to shape white noise into rolling thunder
      const thunderFilter = this.ctx.createBiquadFilter();
      thunderFilter.type = 'lowpass';
      thunderFilter.frequency.setValueAtTime(800, now);
      thunderFilter.frequency.exponentialRampToValueAtTime(70, now + 1.2);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      // Sharp lightning crack
      noiseGain.gain.linearRampToValueAtTime(0.09, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      whiteNoise.connect(thunderFilter);
      thunderFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      // 2. Deep Sub-bass Rumble (sub-oscillator 65Hz rolling to 30Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.6);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.07, now + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 1.5);
      subOsc.start(now);
      subOsc.stop(now + 1.8);
    } catch {
      // AudioContext might be blocked or unavailable
    }
  }

  // Continuous subtle warm celestial drone / space ambience
  startAmbient() {
    if (this.isMuted || this.isPlayingAmbient) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 3);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(108, this.ctx.currentTime); // Deep A2

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(162, this.ctx.currentTime); // Harmonic E3

      this.ambientOsc1.connect(this.filter);
      this.ambientOsc2.connect(this.filter);
      this.filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isPlayingAmbient = true;
    } catch {
      // ignore
    }
  }

  stopAmbient() {
    if (!this.isPlayingAmbient || !this.ctx) return;
    try {
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      }
      setTimeout(() => {
        if (this.ambientOsc1) {
          try { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); } catch {}
        }
        if (this.ambientOsc2) {
          try { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); } catch {}
        }
        this.isPlayingAmbient = false;
      }, 1000);
    } catch {
      this.isPlayingAmbient = false;
    }
  }
}

export const soundEngine = new SoundEngine();

export function useSoundFX() {
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);

  const toggleSound = useCallback(() => {
    const nextState = !soundEngine.isMuted;
    soundEngine.setMuted(nextState);
    setIsMuted(nextState);
  }, []);

  const playClick = useCallback((freq, duration) => soundEngine.playClick(freq, duration), []);
  const playHover = useCallback(() => soundEngine.playHover(), []);
  const playSuccessChime = useCallback(() => soundEngine.playSuccessChime(), []);
  const playThunder = useCallback(() => soundEngine.playThunder(), []);

  return {
    isMuted,
    toggleSound,
    playClick,
    playHover,
    playSuccessChime,
    playThunder,
  };
}
