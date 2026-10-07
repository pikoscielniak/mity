// "Ballada o Orfeuszu": lines of 8-7-8-7 syllables over slow D minor lute arpeggios.
(function (LM) {
  'use strict';

  const DM = 'D3/8 A3/8 D4/8 F4/8 A4/8 F4/8 D4/8 A3/8';
  const A_MAJOR = 'A2/8 E3/8 A3/8 C#4/8 E4/8 C#4/8 A3/8 E3/8';
  const GM = 'G2/8 D3/8 G3/8 A#3/8 D4/8 A#3/8 G3/8 D3/8';

  LM.data.songs.orpheus = LM.songBuilder.strophicSong({
    id: 'ballad-orpheus',
    myth: 'orpheus',
    title: 'Ballada o Orfeuszu',
    bpm: 84,
    melody: [
      'A3/4 D4/4 E4/4 F4/4 E4/4 D4/4 C#4/4 D4/4',
      'F4/4 G4/4 A4/4 G4/4 F4/4 E4/4 A3/2',
      'D4/4 F4/4 A4/4 A#4/4 A4/4 G4/4 F4/4 E4/4',
      'D4/4 E4/4 F4/4 E4/4 D4/4 C#4/4 D4/2',
    ],
    lyrics: [
      ['W gó-rach Tra-cji śpie-wał Or-feusz,', 'lut-nię miał i pięk-nie grał.', 'Las i rze-ka go słu-cha-ły,', 'dzi-ki zwierz u stóp mu spał.'],
      ['Je-go żo-na, nim-fa drzew-na,', 'przed A-ri-sta-jo-sem gna.', 'W tra-wie żmi-ja ją u-ką-sza', 'i w kra-i-nie cie-ni trwa.'],
      ['Do Ha-de-su scho-dzi śpie-wak,', 'Cha-ron wie-zie go za nic.', 'Cer-ber nie szcze-ka, a Ha-des', 'wzru-szo-ny jest do gra-nic.'],
      ['„Nie o-glą-daj się za sie-bie!”', 'Her-mes wie-dzie ją na świat.', 'Lecz u wyj-ścia się o-bej-rzał…', 'Zni-kła na ty-sią-ce lat.'],
      ['Moc mu-zy-ki i mi-ło-ści', 'Or-feusz śpie-wa po dziś dzień.', 'Trzy-maj sło-wo, choć jest trud-no,', 'i nie o-glą-daj się w cień.'],
    ],
    accompaniment: [
      { instrument: 'lute', velocity: 0.55, intro: DM, verse: [DM, DM, DM, A_MAJOR, DM, GM, A_MAJOR, DM].join(' ') },
      {
        instrument: 'bell', velocity: 0.2, intro: 'r/1',
        verse: 'A4/4 D5/4 E5/4 F5/4 E5/4 D5/4 C#5/4 D5/4 | F5/4 G5/4 A5/4 G5/4 F5/4 E5/4 A4/2 |' +
          ' D5/4 F5/4 A5/4 A#5/4 A5/4 G5/4 F5/4 E5/4 | D5/4 E5/4 F5/4 E5/4 D5/4 C#5/4 D5/2',
      },
      { instrument: 'bass', intro: 'D2/1', verse: 'D2/2 A2/2 D2/2 A1/2 F2/2 C3/2 A1/2 E2/2 D2/2 A2/2 G2/2 D3/2 A1/2 E2/2 D2/1' },
      { instrument: 'pad', velocity: 0.4, intro: 'F4/1', verse: 'F4/1 E4/1 F4/1 E4/1 F4/1 G4/1 E4/1 F4/1' },
      { instrument: 'pad', velocity: 0.4, intro: 'D4/1', verse: 'D4/1 C#4/1 D4/1 C#4/1 D4/1 D4/1 C#4/1 D4/1' },
      { instrument: 'pad', velocity: 0.4, intro: 'A3/1', verse: 'A3/1 A3/1 A3/1 A3/1 A3/1 A#3/1 A3/1 A3/1' },
    ],
  });
}(window.LM = window.LM || {}));
