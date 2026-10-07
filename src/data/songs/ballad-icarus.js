// "Ballada o Dedalu i Ikarze": lines of 8-7-8-7 syllables over an airy F major melody.
(function (LM) {
  'use strict';

  const repeat = LM.notes.repeatPattern;

  LM.data.songs.icarus = LM.songBuilder.strophicSong({
    id: 'ballad-icarus',
    myth: 'icarus',
    title: 'Ballada o Dedalu i Ikarze',
    bpm: 108,
    melody: [
      'F3/4 G3/4 A3/4 C4/4 A3/4 G3/4 F3/4 G3/4',
      'A3/4 A#3/4 C4/4 D4/4 C4/4 A3/4 G3/2',
      'F3/4 G3/4 A3/4 C4/4 D4/4 C4/4 A3/4 F3/4',
      'G3/4 A3/4 A#3/4 A3/4 G3/4 E3/4 F3/2',
    ],
    lyrics: [
      ['De-dal żył na Kre-cie dłu-go,', 'dom ro-dzin-ny go wo-łał.', 'A-le król mu rzekł: „Zo-sta-niesz!”', 'U-ciec nikt by nie zdo-łał.'],
      ['Mo-rza strze-gą kró-la sta-tki,', 'lecz nie-ba nie pil-nu-ją.', 'Pió-ra, wosk i rę-ce mi-strza', 'skrzy-dła dla dwóch bu-du-ją.'],
      ['Rzekł De-dal: „Leć za-wsze środ-kiem!', 'Słoń-ce w gó-rze wosk to-pi.', 'Ni-sko fa-la pió-ra zmo-czy,', 'a mo-rze cię za-to-pi.”'],
      ['Lecz I-kar, szczęś-li-wy w lo-cie,', 'wzle-ciał wy-żej i wy-żej.', 'Wosk się sto-pił, pió-ra spa-dły,', 'spadł I-kar, co-raz ni-żej.'],
      ['Mo-rze I-ka-ryj-skie szu-mi,', 'nad I-ka-rią fa-le gna.', 'Gdy masz śmia-ły plan jak I-kar,', 'niech ci roz-sąd skrzy-dła da!'],
    ],
    accompaniment: [
      {
        instrument: 'bell', velocity: 0.25, intro: 'r/1',
        verse: 'F5/4 G5/4 A5/4 C6/4 A5/4 G5/4 F5/4 G5/4 | A5/4 A#5/4 C6/4 D6/4 C6/4 A5/4 G5/2 |' +
          ' F5/4 G5/4 A5/4 C6/4 D6/4 C6/4 A5/4 F5/4 | G5/4 A5/4 A#5/4 A5/4 G5/4 E5/4 F5/2',
      },
      { instrument: 'flute', velocity: 0.3, intro: 'r/1', verse: 'r/1 r/2 C5/2 r/1 r/2 E5/2 r/1 r/2 A4/2 r/1 r/2 C5/2' },
      { instrument: 'bass', intro: 'F2/1', verse: 'F2/2 C3/2 F2/2 A2/2 A#2/2 F2/2 C3/2 C2/2 F2/2 C3/2 D2/2 A2/2 C3/2 G2/2 F2/1' },
      { instrument: 'pad', velocity: 0.45, intro: 'A4/1', verse: 'A4/1 A4/1 A#4/1 G4/1 A4/1 A4/1 G4/1 A4/1' },
      { instrument: 'pad', velocity: 0.45, intro: 'F4/1', verse: 'F4/1 F4/1 D4/1 E4/1 F4/1 D4/1 E4/1 F4/1' },
      { instrument: 'pad', velocity: 0.45, intro: 'C4/1', verse: 'C4/1 C4/1 F4/1 C4/1 C4/1 F4/1 C4/1 C4/1' },
      { instrument: 'kick', velocity: 0.45, intro: 'C2/4 r/4 C2/4 r/4', verse: repeat('C2/4 r/4 C2/4 r/4', 8) },
      { instrument: 'hat', velocity: 0.25, intro: repeat('r/8 C6/8', 4), verse: repeat('r/8 C6/8', 32) },
    ],
  });
}(window.LM = window.LM || {}));
