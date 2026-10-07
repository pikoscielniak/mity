// A Klatt-style cascade formant synthesizer, sample by sample.
// createKlattSynth is turned into AudioWorklet code with Function.toString(), so it must stay
// self-contained: no references to anything outside its own body.
(function (LM) {
  'use strict';

  function createKlattSynth(sampleRate, events) {
    const TWO_PI = Math.PI * 2;
    const VIBRATO_HZ = 5.2;
    const VIBRATO_CENTS = 16;
    const OPEN_QUOTIENT = 0.6;
    const VOICE_GAIN = 0.15;
    const FRICATION_GAIN = 0.6;
    const FILTER_UPDATE_SAMPLES = 8;
    const FIXED_FORMANTS = [[3300, 250], [3900, 300]];
    const NASAL_POLE = [270, 100];

    // nasalZero equal to the nasal pole frequency cancels it (oral sounds); m, n move it up to colour the murmur.
    const params = {
      pitch: 150, voicing: 0, aspiration: 0,
      f1: 500, f2: 1500, f3: 2500, b1: 90, b2: 110, b3: 170, nasalZero: NASAL_POLE[0],
      noiseGain: 0, noiseFrequency: 4000, noiseQ: 1,
    };
    const paramNames = Object.keys(params);
    const targets = Object.assign({}, params);
    const smoothing = {};
    paramNames.forEach(function (name) { smoothing[name] = 0; });

    const resonators = [0, 1, 2, 3, 4].map(function () { return { a: 0, b: 0, c: 0, y1: 0, y2: 0 }; });
    const nasalPole = { a: 0, b: 0, c: 0, y1: 0, y2: 0 };
    const nasalZero = { a: 0, b: 0, c: 0, x1: 0, x2: 0 };
    const fricationFilter = { b0: 0, b2: 0, a1: 0, a2: 0, x1: 0, x2: 0, y1: 0, y2: 0 };
    let eventIndex = 0;
    let glottalPhase = 0;
    let tiltState = 0;
    let sampleCounter = 0;

    function tuneResonator(resonator, frequency, bandwidth) {
      const period = 1 / sampleRate;
      resonator.c = -Math.exp(-TWO_PI * bandwidth * period);
      resonator.b = 2 * Math.exp(-Math.PI * bandwidth * period) * Math.cos(TWO_PI * frequency * period);
      resonator.a = 1 - resonator.b - resonator.c;
    }

    function runResonator(resonator, input) {
      const output = resonator.a * input + resonator.b * resonator.y1 + resonator.c * resonator.y2;
      resonator.y2 = resonator.y1;
      resonator.y1 = output;
      return output;
    }

    // The inverse of a resonator: a notch that removes energy around its frequency.
    function tuneAntiResonator(antiResonator, frequency, bandwidth) {
      tuneResonator(antiResonator, frequency, bandwidth);
      antiResonator.b = -antiResonator.b / antiResonator.a;
      antiResonator.c = -antiResonator.c / antiResonator.a;
      antiResonator.a = 1 / antiResonator.a;
    }

    function runAntiResonator(antiResonator, input) {
      const output = antiResonator.a * input + antiResonator.b * antiResonator.x1 + antiResonator.c * antiResonator.x2;
      antiResonator.x2 = antiResonator.x1;
      antiResonator.x1 = input;
      return output;
    }

    // RBJ band-pass with 0 dB peak, used for the hiss of s, sz, ś, f, ch.
    function tuneFricationFilter(frequency, q) {
      const omega = TWO_PI * Math.min(frequency, sampleRate * 0.45) / sampleRate;
      const alpha = Math.sin(omega) / (2 * q);
      const a0 = 1 + alpha;
      fricationFilter.b0 = alpha / a0;
      fricationFilter.b2 = -alpha / a0;
      fricationFilter.a1 = -2 * Math.cos(omega) / a0;
      fricationFilter.a2 = (1 - alpha) / a0;
    }

    function runFricationFilter(input) {
      const f = fricationFilter;
      const output = f.b0 * input + f.b2 * f.x2 - f.a1 * f.y1 - f.a2 * f.y2;
      f.x2 = f.x1;
      f.x1 = input;
      f.y2 = f.y1;
      f.y1 = output;
      return output;
    }

    function updateFilters() {
      tuneResonator(resonators[0], params.f1, params.b1);
      tuneResonator(resonators[1], params.f2, params.b2);
      tuneResonator(resonators[2], params.f3, params.b3);
      tuneResonator(resonators[3], FIXED_FORMANTS[0][0], FIXED_FORMANTS[0][1]);
      tuneResonator(resonators[4], FIXED_FORMANTS[1][0], FIXED_FORMANTS[1][1]);
      tuneAntiResonator(nasalZero, params.nasalZero, NASAL_POLE[1]);
      tuneFricationFilter(params.noiseFrequency, params.noiseQ);
    }

    // Events follow AudioParam semantics: timeConstant 0 jumps, otherwise approach exponentially.
    function applyDueEvents(now) {
      while (eventIndex < events.length && events[eventIndex].time <= now) {
        const event = events[eventIndex];
        eventIndex += 1;
        targets[event.param] = event.value;
        if (event.timeConstant > 0) {
          smoothing[event.param] = Math.exp(-1 / (event.timeConstant * sampleRate));
        } else {
          params[event.param] = event.value;
          smoothing[event.param] = 0;
        }
      }
    }

    function smoothParams() {
      for (let index = 0; index < paramNames.length; index += 1) {
        const name = paramNames[index];
        params[name] = targets[name] + (params[name] - targets[name]) * smoothing[name];
      }
    }

    // Derivative of the KLGLOTT88 glottal flow: smooth opening, sharp closure (rich in harmonics).
    function glottalSource(now) {
      const vibrato = Math.pow(2, VIBRATO_CENTS * Math.sin(TWO_PI * VIBRATO_HZ * now) / 1200);
      glottalPhase += params.pitch * vibrato / sampleRate;
      if (glottalPhase >= 1) {
        glottalPhase -= 1;
      }
      if (glottalPhase >= OPEN_QUOTIENT) {
        return 0;
      }
      const x = glottalPhase / OPEN_QUOTIENT;
      return 2 * x - 3 * x * x;
    }

    function nextSample(now) {
      applyDueEvents(now);
      smoothParams();
      if (sampleCounter % FILTER_UPDATE_SAMPLES === 0) {
        updateFilters();
      }
      sampleCounter += 1;
      const noise = Math.random() * 2 - 1;
      const excitation = glottalSource(now) * params.voicing + noise * params.aspiration;
      tiltState += 0.5 * (excitation - tiltState);
      let voice = runAntiResonator(nasalZero, runResonator(nasalPole, tiltState));
      for (let index = 0; index < resonators.length; index += 1) {
        voice = runResonator(resonators[index], voice);
      }
      const frication = runFricationFilter(noise) * params.noiseGain;
      return Math.tanh(voice * VOICE_GAIN + frication * FRICATION_GAIN);
    }

    tuneResonator(nasalPole, NASAL_POLE[0], NASAL_POLE[1]);

    function render(output, blockStartTime) {
      for (let index = 0; index < output.length; index += 1) {
        output[index] = nextSample(blockStartTime + index / sampleRate);
      }
    }

    return { render: render };
  }

  LM.klattCore = { createKlattSynth };
}(window.LM = window.LM || {}));
