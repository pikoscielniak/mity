// How each phoneme sounds: voicing, formant targets (for consonants: the "locus" the vowel glides from),
// formant bandwidths, aspiration and a band of hiss. Values are tunable averages for Polish.
(function (LM) {
  'use strict';

  const VOWEL_BANDWIDTHS = [90, 110, 170];
  const NASAL_BANDWIDTHS = [160, 200, 260];
  const CONSONANT_BANDWIDTHS = [110, 140, 200];
  const ORAL = 270;

  // Place of articulation â†’ formant locus [F1, F2, F3].
  const LOCUS = {
    labial: [250, 900, 2100],
    dental: [300, 1700, 2600],
    postalveolar: [300, 1800, 2300],
    palatal: [280, 2200, 3000],
    velar: [300, 1700, 2200],
  };

  function vowel(f1, f2, f3) {
    return { kind: 'vowel', voicing: 1, formants: [f1, f2, f3], bandwidths: VOWEL_BANDWIDTHS, nasalZero: ORAL, noise: null, aspiration: 0, duration: 0 };
  }

  function sonorant(kind, voicing, formants, bandwidths, nasalZero, duration) {
    return { kind: kind, voicing: voicing, formants: formants, bandwidths: bandwidths, nasalZero: nasalZero, noise: null, aspiration: 0, duration: duration };
  }

  function obstruent(kind, voicing, place, noise, aspiration, duration) {
    return {
      kind: kind, voicing: voicing, formants: LOCUS[place], bandwidths: CONSONANT_BANDWIDTHS, nasalZero: ORAL,
      noise: noise, aspiration: aspiration, duration: duration,
    };
  }

  function hiss(frequency, q, level) {
    return { frequency: frequency, q: q, level: level };
  }

  const HISS_S = hiss(6500, 2.5, 0.55);
  const HISS_SH = hiss(3000, 1.6, 0.55);
  const HISS_SJ = hiss(4500, 2, 0.55);
  const HISS_X = hiss(1600, 1, 0.3);

  function voicedHiss(voiceless) {
    return hiss(voiceless.frequency, voiceless.q, voiceless.level * 0.95);
  }

  const PHONEMES = {
    a: vowel(720, 1300, 2500),
    e: vowel(550, 1750, 2550),
    i: vowel(300, 2300, 3000),
    o: vowel(500, 900, 2450),
    u: vowel(330, 750, 2300),
    y: vowel(420, 1600, 2450),
    m: sonorant('nasal', 0.5, [260, 1000, 2200], NASAL_BANDWIDTHS, 450, 0.07),
    n: sonorant('nasal', 0.5, [260, 1450, 2500], NASAL_BANDWIDTHS, 600, 0.07),
    nj: sonorant('nasal', 0.5, [260, 2000, 2800], NASAL_BANDWIDTHS, 800, 0.07),
    'n~': sonorant('nasal', 0.55, [320, 1150, 2350], NASAL_BANDWIDTHS, 500, 0.07),
    l: sonorant('liquid', 0.65, [350, 1250, 2700], CONSONANT_BANDWIDTHS, ORAL, 0.06),
    r: sonorant('trill', 0.75, [450, 1350, 2400], CONSONANT_BANDWIDTHS, ORAL, 0.075),
    w: sonorant('glide', 0.65, [320, 650, 2200], VOWEL_BANDWIDTHS, ORAL, 0.05),
    j: sonorant('glide', 0.65, [270, 2200, 2950], VOWEL_BANDWIDTHS, ORAL, 0.05),
    f: obstruent('fricative', 0, 'labial', hiss(3500, 0.5, 0.22), 0.08, 0.11),
    v: obstruent('fricative', 0.25, 'labial', hiss(3500, 0.5, 0.18), 0, 0.09),
    s: obstruent('fricative', 0, 'dental', HISS_S, 0, 0.1),
    z: obstruent('fricative', 0.25, 'dental', voicedHiss(HISS_S), 0, 0.09),
    sh: obstruent('fricative', 0, 'postalveolar', HISS_SH, 0, 0.1),
    zh: obstruent('fricative', 0.2, 'postalveolar', voicedHiss(HISS_SH), 0, 0.1),
    sj: obstruent('fricative', 0, 'palatal', HISS_SJ, 0, 0.1),
    zj: obstruent('fricative', 0.25, 'palatal', voicedHiss(HISS_SJ), 0, 0.09),
    x: obstruent('fricative', 0, 'velar', HISS_X, 0.35, 0.09),
    p: obstruent('plosive', 0, 'labial', hiss(900, 1, 0.5), 0.3, 0.07),
    b: obstruent('plosive', 0.12, 'labial', hiss(900, 1, 0.35), 0, 0.06),
    t: obstruent('plosive', 0, 'dental', hiss(4200, 1.2, 0.55), 0.3, 0.07),
    d: obstruent('plosive', 0.12, 'dental', hiss(4200, 1.2, 0.4), 0, 0.06),
    k: obstruent('plosive', 0, 'velar', hiss(2200, 1.5, 0.55), 0.3, 0.07),
    g: obstruent('plosive', 0.12, 'velar', hiss(2200, 1.5, 0.55), 0.1, 0.065),
    c: obstruent('affricate', 0, 'dental', HISS_S, 0, 0.1),
    dz: obstruent('affricate', 0.2, 'dental', voicedHiss(HISS_S), 0, 0.09),
    ch: obstruent('affricate', 0, 'postalveolar', HISS_SH, 0, 0.1),
    dzh: obstruent('affricate', 0.2, 'postalveolar', voicedHiss(HISS_SH), 0, 0.09),
    cj: obstruent('affricate', 0, 'palatal', HISS_SJ, 0, 0.1),
    dzj: obstruent('affricate', 0.2, 'palatal', voicedHiss(HISS_SJ), 0, 0.09),
  };

  function phonemeInfo(symbol) {
    const info = PHONEMES[symbol];
    if (!info) {
      throw new Error('Unknown phoneme: ' + symbol);
    }
    return info;
  }

  LM.phonemeTable = { PHONEMES, phonemeInfo };
}(window.LM = window.LM || {}));
