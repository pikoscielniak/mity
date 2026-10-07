// Compact melody notation: "D4/8 E4/8. r/4 F#4/2" — pitch (or r for rest), slash, note value, optional dot.
(function (LM) {
  'use strict';

  const SEMITONES_FROM_C = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const ACCIDENTAL_SHIFT = { '': 0, '#': 1, b: -1 };
  const parsedCache = new Map();

  function noteNameToMidi(name) {
    const match = /^([A-G])([#b]?)(-?\d)$/.exec(name);
    if (!match) {
      throw new Error('Unknown note name: ' + name);
    }
    const octave = Number(match[3]);
    return 12 * (octave + 1) + SEMITONES_FROM_C[match[1]] + ACCIDENTAL_SHIFT[match[2]];
  }

  function midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Quarter note = 1 beat; "/8" = 0.5 beat; a trailing dot adds half the value.
  function noteValueToBeats(value) {
    const isDotted = value.endsWith('.');
    const denominator = Number(isDotted ? value.slice(0, -1) : value);
    if (!denominator) {
      throw new Error('Unknown note value: ' + value);
    }
    const beats = 4 / denominator;
    return isDotted ? beats * 1.5 : beats;
  }

  function parseToken(token) {
    const parts = token.split('/');
    if (parts.length !== 2) {
      throw new Error('Bad note token: ' + token);
    }
    const isRest = parts[0] === 'r';
    return { midi: isRest ? null : noteNameToMidi(parts[0]), beats: noteValueToBeats(parts[1]) };
  }

  function parseNoteString(text) {
    if (!parsedCache.has(text)) {
      const tokens = text.split(/\s+/).filter(function (token) { return token && token !== '|'; });
      parsedCache.set(text, tokens.map(parseToken));
    }
    return parsedCache.get(text);
  }

  function totalBeats(notes) {
    return notes.reduce(function (sum, note) { return sum + note.beats; }, 0);
  }

  function repeatPattern(pattern, times) {
    return new Array(times).fill(pattern).join(' ');
  }

  LM.notes = { noteNameToMidi, midiToFrequency, noteValueToBeats, parseNoteString, totalBeats, repeatPattern };
}(window.LM = window.LM || {}));
