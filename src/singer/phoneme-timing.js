// Splits one sung syllable's time between its consonants and its vowel.
(function (LM) {
  'use strict';

  const MAX_CONSONANT_SHARE = 0.5;
  const MIN_CONSONANT_SCALE = 0.4;
  const MIN_VOWEL_SECONDS = 0.04;

  function consonantSeconds(symbols) {
    return symbols.reduce(function (sum, symbol) { return sum + LM.phonemeTable.phonemeInfo(symbol).duration; }, 0);
  }

  // Consonants keep their natural length unless they would take over half the note; then they shrink (to 40% at most).
  function consonantScale(totalConsonantSeconds, syllableSeconds) {
    if (totalConsonantSeconds === 0) {
      return 1;
    }
    const scale = syllableSeconds * MAX_CONSONANT_SHARE / totalConsonantSeconds;
    return Math.min(1, Math.max(MIN_CONSONANT_SCALE, scale));
  }

  function appendSegments(segments, symbols, startTime, scale) {
    let time = startTime;
    symbols.forEach(function (symbol) {
      const duration = LM.phonemeTable.phonemeInfo(symbol).duration * scale;
      segments.push({ symbol: symbol, start: time, duration: duration });
      time += duration;
    });
    return time;
  }

  // Returns [{ symbol, start, duration }]: onset consonants, the vowel filling the middle, then the coda.
  function planSyllableSegments(symbols, start, end) {
    const nucleus = symbols.findIndex(LM.phonemes.isVowelSymbol);
    const onset = symbols.slice(0, nucleus);
    const coda = symbols.slice(nucleus + 1);
    const scale = consonantScale(consonantSeconds(onset) + consonantSeconds(coda), end - start);
    const segments = [];
    const vowelStart = appendSegments(segments, onset, start, scale);
    const codaSeconds = consonantSeconds(coda) * scale;
    const vowelDuration = Math.max(MIN_VOWEL_SECONDS, end - codaSeconds - vowelStart);
    segments.push({ symbol: symbols[nucleus], start: vowelStart, duration: vowelDuration });
    appendSegments(segments, coda, vowelStart + vowelDuration, scale);
    return segments;
  }

  LM.phonemeTiming = { planSyllableSegments };
}(window.LM = window.LM || {}));
