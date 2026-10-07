const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load-game');

const LM = loadGame({ Math: Math });
const SAMPLE_RATE = 16000;

function renderVowel(symbol, frequency, seconds) {
  const info = LM.phonemeTable.phonemeInfo(symbol);
  const events = [
    { time: 0, param: 'pitch', value: frequency, timeConstant: 0 },
    { time: 0, param: 'voicing', value: 1, timeConstant: 0 },
    { time: 0, param: 'f1', value: info.formants[0], timeConstant: 0 },
    { time: 0, param: 'f2', value: info.formants[1], timeConstant: 0 },
    { time: 0, param: 'f3', value: info.formants[2], timeConstant: 0 },
  ];
  const samples = new Float32Array(Math.round(SAMPLE_RATE * seconds));
  LM.klattCore.createKlattSynth(SAMPLE_RATE, events).render(samples, 0);
  return samples;
}

// Picks the lag with the strongest self-similarity between 60 and 600 Hz.
function estimatePitch(samples) {
  const window = samples.subarray(4000, 8000);
  let bestLag = 0;
  let bestScore = -Infinity;
  for (let lag = Math.floor(SAMPLE_RATE / 600); lag <= Math.ceil(SAMPLE_RATE / 60); lag += 1) {
    let score = 0;
    for (let index = 0; index + lag < window.length; index += 1) {
      score += window[index] * window[index + lag];
    }
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }
  return SAMPLE_RATE / bestLag;
}

function semitonesBetween(first, second) {
  return Math.abs(12 * Math.log2(first / second));
}

test('the synthesizer sings the requested pitch within a semitone', function () {
  [146.83, 220, 293.66].forEach(function (frequency) {
    const pitch = estimatePitch(renderVowel('a', frequency, 0.6));
    assert.ok(semitonesBetween(pitch, frequency) < 1, 'asked ' + frequency + ' Hz, got ' + pitch.toFixed(1) + ' Hz');
  });
});

test('a sung vowel is audible, finite and never clips', function () {
  ['a', 'e', 'i', 'o', 'u', 'y'].forEach(function (symbol) {
    const samples = renderVowel(symbol, 196, 0.5);
    let peak = 0;
    let sumOfSquares = 0;
    samples.forEach(function (sample) {
      assert.ok(Number.isFinite(sample));
      peak = Math.max(peak, Math.abs(sample));
      sumOfSquares += sample * sample;
    });
    const rms = Math.sqrt(sumOfSquares / samples.length);
    assert.ok(rms > 0.03, symbol + ' is too quiet: ' + rms);
    assert.ok(peak < 1, symbol + ' clips: ' + peak);
  });
});

test('the voice is silent until voicing is turned on', function () {
  const samples = new Float32Array(1600);
  LM.klattCore.createKlattSynth(SAMPLE_RATE, []).render(samples, 0);
  assert.ok(samples.every(function (sample) { return sample === 0; }));
});
