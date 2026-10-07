// Looping background themes. Notation: see src/core/note-notation.js.
(function (LM) {
  'use strict';

  const repeat = LM.notes.repeatPattern;

  // D harmonic minor gives the "ancient Greek" colour; 8 bars of 4/4.
  const title = {
    id: 'title',
    bpm: 104,
    loop: true,
    tracks: [
      {
        instrument: 'bell',
        notes: 'D5/4 A4/8 D5/8 F5/4 E5/8 D5/8 | C#5/4 E5/4 A4/2 | A#4/4 D5/8 F5/8 G5/4 F5/8 E5/8 | F5/4 E5/4 D5/2 |' +
          ' A5/4 G5/8 F5/8 E5/4 F5/8 G5/8 | A5/4 A#5/8 A5/8 G5/4 E5/4 | F5/8 E5/8 D5/8 E5/8 F5/4 C#5/4 | D5/2 r/2',
      },
      {
        instrument: 'flute',
        velocity: 0.45,
        notes: 'r/1 | r/2 E5/4 C#5/4 | r/1 | r/2 A4/2 | r/1 | r/2 D5/4 C#5/4 | r/1 | A4/2 r/2',
      },
      {
        instrument: 'bass',
        notes: 'D3/4 A2/4 D3/4 A2/4 | A2/4 E3/4 A2/4 C#3/4 | A#2/4 F3/4 G2/4 D3/4 | D3/4 A2/4 D3/2 |' +
          ' F2/4 C3/4 F2/4 C3/4 | G2/4 D3/4 A2/4 E3/4 | D3/4 A2/4 A2/4 C#3/4 | D3/2 D2/2',
      },
      { instrument: 'pad', notes: 'D4/1 C#4/1 D4/1 D4/1 C4/1 D4/2 C#4/2 D4/2 C#4/2 D4/1' },
      { instrument: 'pad', notes: 'F4/1 E4/1 F4/1 F4/1 F4/1 G4/2 E4/2 F4/2 E4/2 F4/1' },
      { instrument: 'pad', notes: 'A4/1 A4/1 A#4/1 A4/1 A4/1 A#4/2 A4/2 A4/2 A4/2 A4/1' },
      { instrument: 'kick', notes: repeat('C2/4 r/4 C2/4 r/4', 8), velocity: 0.6 },
      { instrument: 'hat', notes: repeat('r/8 C6/8', 32), velocity: 0.35 },
    ],
  };

  LM.data.themes = { title: title };
}(window.LM = window.LM || {}));
