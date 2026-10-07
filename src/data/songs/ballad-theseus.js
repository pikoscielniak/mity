// "Ballada o Tezeuszu". Lyrics are hyphenated into sung syllables, one syllable per melody note ("_" holds a vowel).
// Every verse has lines of 8-7-8-7 syllables sung to the same melody.
(function (LM) {
  'use strict';

  const repeat = LM.notes.repeatPattern;
  const VERSE_COUNT = 5;
  const MELODY = [
    'D3/4 F3/4 A3/4 A3/4 G3/4 F3/4 E3/4 D3/4',
    'F3/4 G3/4 A3/4 C4/4 A3/4 G3/4 A3/2',
    'D4/4 D4/4 C4/4 A3/4 A#3/4 A3/4 G3/4 F3/4',
    'E3/4 F3/4 G3/4 E3/4 F3/4 E3/4 D3/2',
  ];
  const LYRICS = [
    ['Czar-ny ża-giel, czar-na fa-la,', 'sta-tek z A-ten w mo-rze gna.', 'Sied-miu chłop-ców, sie-dem pa-nien —', 'Mi-no-tau-ra Kre-ta ma.'],
    ['Kró-lew-na A-riad-na pięk-na', 'da-je mu kłę-bek ni-ci:', '„Gdy po-ko-nasz Mi-no-tau-ra,', 'wyj-dziesz zno-wu po ni-ci!”'],
    ['W la-bi-ryn-cie ciem-no, strasz-no,', 'czy-ha po-twór, groź-ny byk.', 'A-le dziel-ny syn E-geu-sza —', 'i u-cichł po-two-ra ryk.'],
    ['Śpią-cą na Nak-sos A-riad-nę', 'zo-sta-wia i pły-nie w dal.', 'Lecz za-po-mniał zmie-nić ża-giel —', 'E-geusz rzu-cił się do fal.'],
    ['Mo-rze E-gej-skie do dzi-siaj', 'i-mię kró-la swe-go ma.', 'A ty pa-mię-taj o ni-ci,', 'gdy w la-bi-ryn-cie jest mgła!'],
  ];

  const BELL_VERSE = 'D5/4 F5/4 A5/4 A5/4 G5/4 F5/4 E5/4 D5/4 | F5/4 G5/4 A5/4 C6/4 A5/4 G5/4 A5/2 |' +
    ' D6/4 D6/4 C6/4 A5/4 A#5/4 A5/4 G5/4 F5/4 | E5/4 F5/4 G5/4 E5/4 F5/4 E5/4 D5/2';
  const BASS_VERSE = 'D2/2 A2/2 A2/2 E2/2 | F2/2 C3/2 A2/2 E2/2 | D2/2 A2/2 G2/2 D3/2 | A2/2 C#3/2 D2/1';

  LM.data.songs = LM.data.songs || {};
  LM.data.songs.theseus = {
    id: 'ballad-theseus',
    myth: 'theseus',
    title: 'Ballada o Tezeuszu',
    bpm: 100,
    introBeats: 4,
    verses: LYRICS.map(function (lines) {
      return { lines: lines.map(function (lyrics, index) { return { lyrics: lyrics, notes: MELODY[index] }; }) };
    }),
    accompaniment: [
      { instrument: 'bell', velocity: 0.25, notes: 'r/1 ' + repeat(BELL_VERSE, VERSE_COUNT) },
      { instrument: 'bass', notes: 'D2/1 ' + repeat(BASS_VERSE, VERSE_COUNT) },
      { instrument: 'pad', velocity: 0.45, notes: 'D4/1 ' + repeat('D4/1 C#4/1 C4/1 C#4/1 D4/1 D4/1 C#4/1 D4/1', VERSE_COUNT) },
      { instrument: 'pad', velocity: 0.45, notes: 'F4/1 ' + repeat('F4/1 E4/1 F4/1 E4/1 F4/1 G4/1 E4/1 F4/1', VERSE_COUNT) },
      { instrument: 'pad', velocity: 0.45, notes: 'A4/1 ' + repeat('A4/1 A4/1 A4/1 A4/1 A4/1 A#4/1 A4/1 A4/1', VERSE_COUNT) },
      { instrument: 'kick', velocity: 0.5, notes: repeat('C2/4 r/4 C2/4 r/4', 1 + 8 * VERSE_COUNT) },
      { instrument: 'hat', velocity: 0.3, notes: repeat('r/8 C6/8', 4 + 32 * VERSE_COUNT) },
    ],
  };
}(window.LM = window.LM || {}));
