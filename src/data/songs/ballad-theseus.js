// "Ballada o Tezeuszu". Lyrics are hyphenated into sung syllables, one syllable per melody note ("_" holds a vowel).
(function (LM) {
  'use strict';

  const repeat = LM.notes.repeatPattern;

  LM.data.songs = LM.data.songs || {};
  LM.data.songs.theseus = {
    id: 'ballad-theseus',
    myth: 'theseus',
    title: 'Ballada o Tezeuszu',
    bpm: 96,
    introBeats: 4,
    verses: [
      {
        lines: [
          { lyrics: 'Czar-ny ża-giel, czar-na fa-la,', notes: 'D3/4 F3/4 A3/4 A3/4 G3/4 F3/4 E3/4 D3/4' },
          { lyrics: 'sta-tek z A-ten w mo-rze gna.', notes: 'F3/4 G3/4 A3/4 C4/4 A3/4 G3/4 A3/2' },
          { lyrics: 'Sied-miu chłop-ców, sie-dem pa-nien —', notes: 'D4/4 D4/4 C4/4 A3/4 A#3/4 A3/4 G3/4 F3/4' },
          { lyrics: 'Mi-no-tau-ra Kre-ta ma.', notes: 'E3/4 F3/4 G3/4 E3/4 F3/4 E3/4 D3/2' },
        ],
      },
    ],
    accompaniment: [
      {
        instrument: 'bell',
        velocity: 0.25,
        notes: 'r/1 | D5/4 F5/4 A5/4 A5/4 G5/4 F5/4 E5/4 D5/4 | F5/4 G5/4 A5/4 C6/4 A5/4 G5/4 A5/2 |' +
          ' D6/4 D6/4 C6/4 A5/4 A#5/4 A5/4 G5/4 F5/4 | E5/4 F5/4 G5/4 E5/4 F5/4 E5/4 D5/2',
      },
      { instrument: 'bass', notes: 'D2/1 | D2/2 A2/2 A2/2 E2/2 | F2/2 C3/2 A2/2 E2/2 | D2/2 A2/2 G2/2 D3/2 | A2/2 C#3/2 D2/1' },
      { instrument: 'pad', velocity: 0.45, notes: 'D4/1 D4/1 C#4/1 C4/1 C#4/1 D4/1 D4/1 C#4/1 D4/1' },
      { instrument: 'pad', velocity: 0.45, notes: 'F4/1 F4/1 E4/1 F4/1 E4/1 F4/1 G4/1 E4/1 F4/1' },
      { instrument: 'pad', velocity: 0.45, notes: 'A4/1 A4/1 A4/1 A4/1 A4/1 A4/1 A#4/1 A4/1 A4/1' },
      { instrument: 'kick', velocity: 0.5, notes: repeat('C2/4 r/4 C2/4 r/4', 9) },
      { instrument: 'hat', velocity: 0.3, notes: repeat('r/8 C6/8', 36) },
    ],
  };
}(window.LM = window.LM || {}));
