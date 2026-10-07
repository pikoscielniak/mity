// Builds a ballad where every verse is sung to the same melody over the same accompaniment.
(function (LM) {
  'use strict';

  const INTRO_BEATS = 4;

  // spec: { id, myth, title, bpm, melody: [notes per line], lyrics: [[line, …] per verse],
  //         accompaniment: [{ instrument, velocity?, intro (one bar), verse (one verse) }] }
  function strophicSong(spec) {
    const verseCount = spec.lyrics.length;
    return {
      id: spec.id,
      myth: spec.myth,
      title: spec.title,
      bpm: spec.bpm,
      introBeats: INTRO_BEATS,
      verses: spec.lyrics.map(function (lines) {
        return { lines: lines.map(function (lyrics, index) { return { lyrics: lyrics, notes: spec.melody[index] }; }) };
      }),
      accompaniment: spec.accompaniment.map(function (part) {
        return { instrument: part.instrument, velocity: part.velocity, notes: part.intro + ' ' + LM.notes.repeatPattern(part.verse, verseCount) };
      }),
    };
  }

  LM.data.songs = LM.data.songs || {};
  LM.songBuilder = { strophicSong };
}(window.LM = window.LM || {}));
