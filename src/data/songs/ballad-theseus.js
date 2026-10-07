// "Ballada o Tezeuszu": lines of 8-7-8-7 syllables, hyphenated into sung syllables (one per note, "_" holds a vowel).
(function (LM) {
  'use strict';

  const repeat = LM.notes.repeatPattern;

  LM.data.songs.theseus = LM.songBuilder.strophicSong({
    id: 'ballad-theseus',
    myth: 'theseus',
    title: 'Ballada o Tezeuszu',
    bpm: 100,
    melody: [
      'D3/4 F3/4 A3/4 A3/4 G3/4 F3/4 E3/4 D3/4',
      'F3/4 G3/4 A3/4 C4/4 A3/4 G3/4 A3/2',
      'D4/4 D4/4 C4/4 A3/4 A#3/4 A3/4 G3/4 F3/4',
      'E3/4 F3/4 G3/4 E3/4 F3/4 E3/4 D3/2',
    ],
    lyrics: [
      ['Czar-ny ża-giel, czar-na fa-la,', 'sta-tek z A-ten w mo-rze gna.', 'Sied-miu chłop-ców, sie-dem pa-nien —', 'Mi-no-tau-ra Kre-ta ma.'],
      ['Kró-lew-na A-riad-na pięk-na', 'da-je mu kłę-bek ni-ci:', '„Gdy po-ko-nasz Mi-no-tau-ra,', 'wyj-dziesz zno-wu po ni-ci!”'],
      ['W la-bi-ryn-cie ciem-no, strasz-no,', 'czy-ha po-twór, groź-ny byk.', 'A-le dziel-ny syn E-geu-sza —', 'i u-cichł po-two-ra ryk.'],
      ['Śpią-cą na Nak-sos A-riad-nę', 'zo-sta-wia i pły-nie w dal.', 'Lecz za-po-mniał zmie-nić ża-giel —', 'E-geusz rzu-cił się do fal.'],
      ['Mo-rze E-gej-skie do dzi-siaj', 'i-mię kró-la swe-go ma.', 'A ty pa-mię-taj o ni-ci,', 'gdy w la-bi-ryn-cie jest mgła!'],
    ],
    accompaniment: [
      {
        instrument: 'bell', velocity: 0.25, intro: 'r/1',
        verse: 'D5/4 F5/4 A5/4 A5/4 G5/4 F5/4 E5/4 D5/4 | F5/4 G5/4 A5/4 C6/4 A5/4 G5/4 A5/2 |' +
          ' D6/4 D6/4 C6/4 A5/4 A#5/4 A5/4 G5/4 F5/4 | E5/4 F5/4 G5/4 E5/4 F5/4 E5/4 D5/2',
      },
      { instrument: 'bass', intro: 'D2/1', verse: 'D2/2 A2/2 A2/2 E2/2 | F2/2 C3/2 A2/2 E2/2 | D2/2 A2/2 G2/2 D3/2 | A2/2 C#3/2 D2/1' },
      { instrument: 'pad', velocity: 0.45, intro: 'D4/1', verse: 'D4/1 C#4/1 C4/1 C#4/1 D4/1 D4/1 C#4/1 D4/1' },
      { instrument: 'pad', velocity: 0.45, intro: 'F4/1', verse: 'F4/1 E4/1 F4/1 E4/1 F4/1 G4/1 E4/1 F4/1' },
      { instrument: 'pad', velocity: 0.45, intro: 'A4/1', verse: 'A4/1 A4/1 A4/1 A4/1 A4/1 A#4/1 A4/1 A4/1' },
      { instrument: 'kick', velocity: 0.5, intro: 'C2/4 r/4 C2/4 r/4', verse: repeat('C2/4 r/4 C2/4 r/4', 8) },
      { instrument: 'hat', velocity: 0.3, intro: repeat('r/8 C6/8', 4), verse: repeat('r/8 C6/8', 32) },
    ],
  });
}(window.LM = window.LM || {}));
