const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, toPlain } = require('../helpers/load-game');

const LM = loadGame();

test('note names map to MIDI numbers', function () {
  assert.equal(LM.notes.noteNameToMidi('C4'), 60);
  assert.equal(LM.notes.noteNameToMidi('A4'), 69);
  assert.equal(LM.notes.noteNameToMidi('C#5'), 73);
  assert.equal(LM.notes.noteNameToMidi('Bb3'), 58);
  assert.throws(function () { LM.notes.noteNameToMidi('H4'); });
});

test('A4 is 440 Hz', function () {
  assert.equal(LM.notes.midiToFrequency(69), 440);
  assert.ok(Math.abs(LM.notes.midiToFrequency(60) - 261.63) < 0.01);
});

test('note values convert to beats, including dotted notes', function () {
  assert.equal(LM.notes.noteValueToBeats('4'), 1);
  assert.equal(LM.notes.noteValueToBeats('8'), 0.5);
  assert.equal(LM.notes.noteValueToBeats('2.'), 3);
  assert.equal(LM.notes.noteValueToBeats('16'), 0.25);
});

test('a note string parses into pitches and rests, ignoring bar lines', function () {
  const notes = toPlain(LM.notes.parseNoteString('D4/8 r/4 | F#4/2.'));
  assert.deepEqual(notes, [{ midi: 62, beats: 0.5 }, { midi: null, beats: 1 }, { midi: 66, beats: 3 }]);
  assert.equal(LM.notes.totalBeats(notes), 4.5);
});

test('every music theme and sound effect parses, and all tracks of a looping theme have equal length', function () {
  const all = Object.assign({}, LM.data.themes, LM.data.soundEffects);
  Object.keys(all).forEach(function (name) {
    const theme = all[name];
    theme.tracks.forEach(function (track) {
      assert.equal(typeof LM.instruments[track.instrument], 'function', name + ': unknown instrument ' + track.instrument);
      LM.notes.parseNoteString(track.notes);
    });
    if (theme.loop) {
      const lengths = theme.tracks.map(function (track) { return LM.notes.totalBeats(LM.notes.parseNoteString(track.notes)); });
      assert.ok(lengths.every(function (length) { return length === lengths[0]; }), name + ' track lengths differ: ' + lengths);
    }
  });
});
