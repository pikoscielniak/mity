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

  // A Phrygian dominant on a plucked lute: the sound of ancient Crete and the labyrinth.
  const crete = {
    id: 'crete',
    bpm: 92,
    loop: true,
    tracks: [
      {
        instrument: 'lute',
        notes: 'A4/4 A#4/8 C#5/8 D5/4 C#5/8 A#4/8 | A4/2 r/4 E4/4 | F4/4 G4/8 A4/8 A#4/4 A4/8 G4/8 | A4/2. r/4 |' +
          ' D5/4 E5/8 F5/8 E5/4 D5/8 C#5/8 | D5/4 C#5/8 A#4/8 A4/2 | A#4/8 A4/8 G4/8 F4/8 E4/4 F4/8 G4/8 | A4/2. r/4',
      },
      { instrument: 'flute', velocity: 0.35, notes: 'r/1 | r/1 | r/1 | r/2 E5/2 | r/1 | r/2 A5/2 | r/1 | r/2 E5/2' },
      { instrument: 'bass', notes: 'A2/1 A2/1 F2/1 A2/1 D2/1 F2/2 A2/2 G2/2 E2/2 A2/1' },
      { instrument: 'pad', velocity: 0.6, notes: 'E4/1 E4/1 F4/1 E4/1 F4/1 F4/2 E4/2 D4/2 E4/2 E4/1' },
      { instrument: 'pad', velocity: 0.6, notes: 'C#4/1 C#4/1 A3/1 C#4/1 A3/1 A3/2 C#4/2 A#3/2 C#4/2 C#4/1' },
      { instrument: 'snare', velocity: 0.35, notes: repeat('r/4 r/4 r/4 C4/4', 8) },
      { instrument: 'hat', velocity: 0.25, notes: repeat('C6/8 r/8 r/4 C6/8 r/8 r/4', 8) },
    ],
  };

  // F Lydian, bright and airy, for the flight of Daedalus and Icarus.
  const sky = {
    id: 'sky',
    bpm: 120,
    loop: true,
    tracks: [
      {
        instrument: 'bell',
        notes: 'F5/8 G5/8 A5/8 B5/8 C6/4 A5/4 | G5/4. E5/8 F5/2 | A5/8 B5/8 C6/8 D6/8 E6/4 C6/4 | D6/2 C6/2 |' +
          ' C6/4 B5/8 A5/8 G5/4 A5/8 B5/8 | C6/4 A5/4 F5/2 | G5/8 A5/8 B5/8 C6/8 D6/4 B5/4 | C6/1',
      },
      { instrument: 'bass', notes: 'F2/2 C3/2 G2/2 D3/2 F2/2 C3/2 G2/2 C3/2 A2/2 E3/2 F2/2 C3/2 G2/2 D3/2 C3/2 C2/2' },
      { instrument: 'pad', velocity: 0.6, notes: 'A4/1 B4/1 A4/1 B4/1 C5/1 A4/1 B4/1 C5/1' },
      { instrument: 'pad', velocity: 0.6, notes: 'F4/1 G4/1 F4/1 G4/1 E4/1 F4/1 G4/1 E4/1' },
      { instrument: 'kick', velocity: 0.5, notes: repeat('C2/4 r/4 C2/4 r/4', 8) },
      { instrument: 'snare', velocity: 0.3, notes: repeat('r/4 C4/4 r/4 C4/4', 8) },
      { instrument: 'hat', velocity: 0.22, notes: repeat('C6/8 C6/8', 32) },
    ],
  };

  function arpeggio(notes) {
    return notes.split(' ').map(function (note) { return note + '/8'; }).join(' ');
  }

  // Slow D minor arpeggios on the lute: the underworld, and Orpheus's song.
  const underworld = {
    id: 'underworld',
    bpm: 72,
    loop: true,
    tracks: [
      {
        instrument: 'lute',
        velocity: 0.7,
        notes: repeat([
          arpeggio('D3 A3 D4 F4 A4 F4 D4 A3'), arpeggio('A#2 F3 A#3 D4 F4 D4 A#3 F3'),
          arpeggio('G2 D3 G3 A#3 D4 A#3 G3 D3'), arpeggio('A2 E3 A3 C#4 E4 C#4 A3 E3'),
        ].join(' '), 2),
      },
      { instrument: 'flute', velocity: 0.5, notes: 'r/1 | A4/2 G4/4 F4/4 | E4/1 | r/2 C#5/2 | D5/2. C5/4 | A#4/2 G4/2 | A4/1 | r/1' },
      { instrument: 'bass', notes: 'D2/1 A#1/1 G1/1 A1/1 D2/1 A#1/1 G1/1 A1/1' },
      { instrument: 'pad', velocity: 0.7, notes: 'D4/1 D4/1 D4/1 C#4/1 D4/1 D4/1 D4/1 C#4/1' },
      { instrument: 'pad', velocity: 0.7, notes: 'F4/1 F4/1 G4/1 E4/1 F4/1 F4/1 G4/1 E4/1' },
    ],
  };

  // A light sea shanty in G major for sailing between the myths.
  const map = {
    id: 'map',
    bpm: 112,
    loop: true,
    tracks: [
      {
        instrument: 'marimba',
        notes: 'G5/8 A5/8 B5/4 D6/4 B5/4 | C6/4 A5/4 F#5/2 | G5/8 A5/8 B5/4 G5/4 E5/4 | D5/2. r/4 |' +
          ' E5/8 F#5/8 G5/4 A5/4 B5/4 | C6/4 B5/4 A5/2 | B5/8 A5/8 G5/4 F#5/4 A5/4 | G5/2. r/4',
      },
      { instrument: 'bass', notes: 'G2/2 D3/2 A2/2 D3/2 G2/2 D3/2 D2/2 A2/2 C3/2 G2/2 A2/2 D3/2 D3/2 D2/2 G2/2 G2/2' },
      { instrument: 'pad', velocity: 0.55, notes: 'B4/1 A4/1 B4/1 A4/1 G4/1 A4/1 F#4/1 G4/1' },
      { instrument: 'pad', velocity: 0.55, notes: 'G4/1 F#4/1 G4/1 F#4/1 E4/1 E4/1 D4/1 D4/1' },
      { instrument: 'kick', velocity: 0.45, notes: repeat('C2/4 r/4 C2/4 r/4', 8) },
      { instrument: 'hat', velocity: 0.25, notes: repeat('r/8 C6/8', 32) },
    ],
  };

  // Solemn C minor bells for the oracle at Delphi.
  const exam = {
    id: 'exam',
    bpm: 84,
    loop: true,
    tracks: [
      {
        instrument: 'bell',
        notes: 'C5/4 D#5/4 G5/2 | F5/4 D#5/4 D5/2 | C5/4 D#5/4 G5/4 C6/4 | A#5/2. r/4 |' +
          ' G#5/4 G5/4 F5/2 | D#5/4 D5/4 C5/2 | D5/4 F5/4 D#5/4 D5/4 | C5/2. r/4',
      },
      { instrument: 'bass', notes: 'C3/1 G#2/1 C3/1 A#2/1 F2/1 G#2/1 G2/1 C3/1' },
      { instrument: 'pad', velocity: 0.6, notes: 'D#4/1 D#4/1 D#4/1 D4/1 F4/1 D#4/1 D4/1 D#4/1' },
      { instrument: 'pad', velocity: 0.6, notes: 'G4/1 G#4/1 G4/1 F4/1 G#4/1 G#4/1 G4/1 G4/1' },
      { instrument: 'kick', velocity: 0.35, notes: repeat('C2/2 r/2', 8) },
    ],
  };

  LM.data.themes = { title: title, crete: crete, sky: sky, underworld: underworld, map: map, exam: exam };
}(window.LM = window.LM || {}));
