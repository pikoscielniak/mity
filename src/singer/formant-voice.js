// The robot singer: a buzzing source through three formant filters (vowels), plus filtered noise (s, sz, f…).
(function (LM) {
  'use strict';

  const FORMANT_Q = [4, 8, 10];
  const FORMANT_LEVELS = [1, 0.7, 0.35];
  const OUTPUT_LEVEL = 1.6;
  const VIBRATO_HZ = 5.2;
  const VIBRATO_CENTS = 18;

  function createFormantBank(context, input, output) {
    return FORMANT_Q.map(function (q, index) {
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = q;
      filter.frequency.value = [500, 1500, 2500][index];
      const level = context.createGain();
      level.gain.value = FORMANT_LEVELS[index];
      input.connect(filter);
      filter.connect(level);
      level.connect(output);
      return filter;
    });
  }

  function createVibrato(context, source) {
    const lfo = context.createOscillator();
    lfo.frequency.value = VIBRATO_HZ;
    const depth = context.createGain();
    depth.gain.value = VIBRATO_CENTS;
    lfo.connect(depth);
    depth.connect(source.detune);
    return lfo;
  }

  function createNoise(context, output) {
    const source = context.createBufferSource();
    source.buffer = LM.instruments.noiseBuffer(context);
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    const gain = context.createGain();
    gain.gain.value = 0;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    return { source: source, filter: filter, gain: gain };
  }

  function createFormantVoice(context, destination) {
    const output = context.createGain();
    output.gain.value = OUTPUT_LEVEL;
    output.connect(destination);

    const source = context.createOscillator();
    source.type = 'sawtooth';
    source.frequency.value = 220;
    const softener = context.createBiquadFilter();
    softener.type = 'lowpass';
    softener.frequency.value = 4200;
    const voicing = context.createGain();
    voicing.gain.value = 0;
    source.connect(softener);
    softener.connect(voicing);

    const formants = createFormantBank(context, voicing, output);
    const vibrato = createVibrato(context, source);
    const noise = createNoise(context, output);

    const params = {
      pitch: source.frequency,
      voicing: voicing.gain,
      f1: formants[0].frequency,
      f2: formants[1].frequency,
      f3: formants[2].frequency,
      noiseGain: noise.gain.gain,
      noiseFrequency: noise.filter.frequency,
      noiseQ: noise.filter.Q,
    };

    // Parameters this simpler voice lacks (bandwidths, aspiration) are skipped.
    function apply(events) {
      events.forEach(function (event) {
        const param = params[event.param];
        if (!param) {
          return;
        }
        if (event.timeConstant > 0) {
          param.setTargetAtTime(event.value, event.time, event.timeConstant);
        } else {
          param.setValueAtTime(event.value, event.time);
        }
      });
    }

    function start(time) {
      source.start(time);
      vibrato.start(time);
      noise.source.start(time);
    }

    function stop(time) {
      source.stop(time);
      vibrato.stop(time);
      noise.source.stop(time);
      source.onended = function () { output.disconnect(); };
    }

    return { apply, start, stop };
  }

  LM.formantVoice = { createFormantVoice };
}(window.LM = window.LM || {}));
