// "Polyphonic ringtone" instruments built from oscillators. Each schedules one note:
// instrument(context, destination, frequency, startTime, durationSeconds, velocity 0..1).
(function (LM) {
  'use strict';

  const SILENT = 0.0001;
  const noiseBuffers = new WeakMap();
  const pulseWaves = new WeakMap();

  function noiseBuffer(context) {
    if (!noiseBuffers.has(context)) {
      const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let index = 0; index < samples.length; index += 1) {
        samples[index] = Math.random() * 2 - 1;
      }
      noiseBuffers.set(context, buffer);
    }
    return noiseBuffers.get(context);
  }

  // Fourier series of a 25% pulse wave: the classic "chip" lead colour.
  function pulseWave(context) {
    if (!pulseWaves.has(context)) {
      const harmonics = 32;
      const real = new Float32Array(harmonics);
      const imaginary = new Float32Array(harmonics);
      for (let n = 1; n < harmonics; n += 1) {
        real[n] = (2 / (n * Math.PI)) * Math.sin(Math.PI * n * 0.25);
      }
      pulseWaves.set(context, context.createPeriodicWave(real, imaginary));
    }
    return pulseWaves.get(context);
  }

  // shape: { attack, decay, sustain (0..1 of peak), release, peak }. Returns the time the note is silent.
  function applyEnvelope(gainParam, startTime, duration, shape) {
    const decayEnd = startTime + shape.attack + shape.decay;
    const sustainLevel = Math.max(shape.peak * shape.sustain, SILENT);
    const releaseStart = Math.max(startTime + duration, decayEnd);
    gainParam.setValueAtTime(SILENT, startTime);
    gainParam.linearRampToValueAtTime(shape.peak, startTime + shape.attack);
    gainParam.exponentialRampToValueAtTime(sustainLevel, decayEnd);
    gainParam.setValueAtTime(sustainLevel, releaseStart);
    gainParam.exponentialRampToValueAtTime(SILENT, releaseStart + shape.release);
    return releaseStart + shape.release;
  }

  function createVoiceGain(context, destination) {
    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(destination);
    return gain;
  }

  function startOscillator(context, type, frequency, destination, startTime, stopTime) {
    const oscillator = context.createOscillator();
    if (type === 'pulse') {
      oscillator.setPeriodicWave(pulseWave(context));
    } else {
      oscillator.type = type;
    }
    oscillator.frequency.value = frequency;
    oscillator.connect(destination);
    oscillator.start(startTime);
    oscillator.stop(stopTime);
    return oscillator;
  }

  function disconnectWhenDone(oscillator, nodes) {
    oscillator.onended = function () {
      nodes.forEach(function (node) { node.disconnect(); });
    };
  }

  function bell(context, destination, frequency, startTime, duration, velocity) {
    const gain = createVoiceGain(context, destination);
    const endTime = applyEnvelope(gain.gain, startTime, 0.02, { attack: 0.004, decay: 0.05, sustain: 0.6, release: 1.1, peak: 0.2 * velocity });
    const fundamental = startOscillator(context, 'sine', frequency, gain, startTime, endTime);
    const overtoneGain = context.createGain();
    overtoneGain.gain.value = 0.25;
    overtoneGain.connect(gain);
    startOscillator(context, 'sine', frequency * 2.76, overtoneGain, startTime, endTime);
    disconnectWhenDone(fundamental, [gain, overtoneGain]);
  }

  function marimba(context, destination, frequency, startTime, duration, velocity) {
    const gain = createVoiceGain(context, destination);
    const endTime = applyEnvelope(gain.gain, startTime, 0.01, { attack: 0.003, decay: 0.03, sustain: 0.5, release: 0.35, peak: 0.28 * velocity });
    const fundamental = startOscillator(context, 'sine', frequency, gain, startTime, endTime);
    const overtoneGain = context.createGain();
    overtoneGain.gain.value = 0.12;
    overtoneGain.connect(gain);
    startOscillator(context, 'sine', frequency * 4, overtoneGain, startTime, startTime + 0.08);
    disconnectWhenDone(fundamental, [gain, overtoneGain]);
  }

  function flute(context, destination, frequency, startTime, duration, velocity) {
    const gain = createVoiceGain(context, destination);
    const endTime = applyEnvelope(gain.gain, startTime, duration, { attack: 0.06, decay: 0.1, sustain: 0.8, release: 0.12, peak: 0.22 * velocity });
    const tone = startOscillator(context, 'triangle', frequency, gain, startTime, endTime);
    const vibrato = context.createOscillator();
    const vibratoDepth = context.createGain();
    vibrato.frequency.value = 5.5;
    vibratoDepth.gain.setValueAtTime(0, startTime);
    vibratoDepth.gain.linearRampToValueAtTime(frequency * 0.008, startTime + 0.25);
    vibrato.connect(vibratoDepth);
    vibratoDepth.connect(tone.frequency);
    vibrato.start(startTime);
    vibrato.stop(endTime);
    disconnectWhenDone(tone, [gain, vibratoDepth, vibrato]);
  }

  function pulseLead(context, destination, frequency, startTime, duration, velocity) {
    const gain = createVoiceGain(context, destination);
    const endTime = applyEnvelope(gain.gain, startTime, duration, { attack: 0.01, decay: 0.12, sustain: 0.6, release: 0.08, peak: 0.11 * velocity });
    const tone = startOscillator(context, 'pulse', frequency, gain, startTime, endTime);
    disconnectWhenDone(tone, [gain]);
  }

  function bass(context, destination, frequency, startTime, duration, velocity) {
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    filter.Q.value = 3;
    filter.connect(destination);
    const gain = createVoiceGain(context, filter);
    const endTime = applyEnvelope(gain.gain, startTime, duration * 0.9, { attack: 0.008, decay: 0.2, sustain: 0.55, release: 0.06, peak: 0.34 * velocity });
    const tone = startOscillator(context, 'sawtooth', frequency, gain, startTime, endTime);
    disconnectWhenDone(tone, [gain, filter]);
  }

  function pad(context, destination, frequency, startTime, duration, velocity) {
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1300;
    filter.connect(destination);
    const gain = createVoiceGain(context, filter);
    const endTime = applyEnvelope(gain.gain, startTime, duration, { attack: 0.3, decay: 0.2, sustain: 0.85, release: 0.45, peak: 0.05 * velocity });
    const detune = Math.pow(2, 6 / 1200);
    const lower = startOscillator(context, 'sawtooth', frequency / detune, gain, startTime, endTime);
    startOscillator(context, 'sawtooth', frequency * detune, gain, startTime, endTime);
    disconnectWhenDone(lower, [gain, filter]);
  }

  // A plucked string (Orpheus's lute): bright attack that darkens as it rings.
  function lute(context, destination, frequency, startTime, duration, velocity) {
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 2;
    filter.frequency.setValueAtTime(frequency * 8, startTime);
    filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, startTime + 0.4);
    filter.connect(destination);
    const gain = createVoiceGain(context, filter);
    const endTime = applyEnvelope(gain.gain, startTime, 0.01, { attack: 0.003, decay: 0.08, sustain: 0.5, release: 1.2, peak: 0.3 * velocity });
    const tone = startOscillator(context, 'sawtooth', frequency, gain, startTime, endTime);
    startOscillator(context, 'triangle', frequency * 2, gain, startTime, endTime);
    disconnectWhenDone(tone, [gain, filter]);
  }

  function kick(context, destination, frequency, startTime, duration, velocity) {
    const gain = createVoiceGain(context, destination);
    const endTime = applyEnvelope(gain.gain, startTime, 0.01, { attack: 0.002, decay: 0.05, sustain: 0.4, release: 0.18, peak: 0.5 * velocity });
    const tone = startOscillator(context, 'sine', 150, gain, startTime, endTime);
    tone.frequency.setValueAtTime(150, startTime);
    tone.frequency.exponentialRampToValueAtTime(42, startTime + 0.14);
    disconnectWhenDone(tone, [gain]);
  }

  function playNoise(context, destination, startTime, filterType, filterFrequency, shape) {
    const filter = context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFrequency;
    filter.connect(destination);
    const gain = createVoiceGain(context, filter);
    const endTime = applyEnvelope(gain.gain, startTime, 0.005, shape);
    const source = context.createBufferSource();
    source.buffer = noiseBuffer(context);
    source.connect(gain);
    source.start(startTime);
    source.stop(endTime);
    source.onended = function () { gain.disconnect(); filter.disconnect(); };
    return source;
  }

  function hat(context, destination, frequency, startTime, duration, velocity) {
    playNoise(context, destination, startTime, 'highpass', 7000, { attack: 0.001, decay: 0.02, sustain: 0.3, release: 0.04, peak: 0.12 * velocity });
  }

  function snare(context, destination, frequency, startTime, duration, velocity) {
    playNoise(context, destination, startTime, 'bandpass', 1800, { attack: 0.001, decay: 0.05, sustain: 0.4, release: 0.12, peak: 0.3 * velocity });
  }

  LM.instruments = {
    bell, marimba, flute, pulseLead, bass, pad, lute, kick, hat, snare,
    applyEnvelope, noiseBuffer, startOscillator,
  };
}(window.LM = window.LM || {}));
