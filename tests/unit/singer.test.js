const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, toPlain } = require('../helpers/load-game');

const LM = loadGame();

function symbolsOf(word) {
  return LM.phonemes.wordToPhonemes(word).map(function (phoneme) { return phoneme.symbol; }).join(' ');
}

test('Polish digraphs and soft consonants', function () {
  assert.equal(symbolsOf('rzeka'), 'zh e k a');
  assert.equal(symbolsOf('szczęście'), 'sh ch e n~ sj cj e');
  assert.equal(symbolsOf('dziewczyna'), 'dzj e f ch y n a');
  assert.equal(symbolsOf('cień'), 'cj e nj');
  assert.equal(symbolsOf('chór'), 'x u r');
  assert.equal(symbolsOf('si'), 'sj i');
});

test('i before a vowel becomes a glide after other consonants', function () {
  assert.equal(symbolsOf('pióra'), 'p j u r a');
  assert.equal(symbolsOf('Ariadna'), 'a r j a d n a');
  assert.equal(symbolsOf('Minos'), 'm i n o s');
});

test('final devoicing and voicing assimilation', function () {
  assert.equal(symbolsOf('ząb'), 'z o n~ p');
  assert.equal(symbolsOf('przy'), 'p sh y');
  assert.equal(symbolsOf('kwiat'), 'k f j a t');
  assert.equal(symbolsOf('w'), 'v');
});

test('nasal ę is plain e at the end of a word', function () {
  assert.equal(symbolsOf('idę'), 'i d e');
  assert.equal(symbolsOf('Eurydykę'), 'e u r y d y k e');
});

test('hyphenated words split phonemes by syllable', function () {
  assert.deepEqual(toPlain(LM.phonemes.hyphenatedWordToSyllables('dzie-wczy-na')), [['dzj', 'e'], ['f', 'ch', 'y'], ['n', 'a']]);
  assert.deepEqual(toPlain(LM.phonemes.hyphenatedWordToSyllables('pió-ra')), [['p', 'j', 'u'], ['r', 'a']]);
});

test('a sung line joins vowel-less words to the next syllable and turns diphthong tails into glides', function () {
  const syllables = toPlain(LM.phonemes.lineToSyllables('sta-tek z A-ten, Mi-no-tau-ra _'));
  assert.deepEqual(syllables.map(function (syllable) { return syllable.text; }), ['sta', 'tek ', 'z A', 'ten, ', 'Mi', 'no', 'tau', 'ra ', '']);
  assert.deepEqual(syllables[2].symbols, ['z', 'a']);
  assert.deepEqual(syllables[6].symbols, ['t', 'a', 'w']);
  assert.equal(syllables[8].isHold, true);
});

test('every phoneme the converter can produce has a sound definition', function () {
  const sample = 'ąęółśćźżń abcdefghijklmnoprstuwyz dzi dź dż dz ch cz sz rz ci si zi ni';
  sample.split(' ').forEach(function (word) {
    LM.phonemes.wordToPhonemes(word).forEach(function (phoneme) {
      assert.ok(LM.phonemeTable.phonemeInfo(phoneme.symbol));
    });
  });
});

test('syllable timing fills the note exactly and keeps the vowel', function () {
  const segments = LM.phonemeTiming.planSyllableSegments(['s', 't', 'a', 'n'], 1, 1.5);
  const first = segments[0];
  const last = segments[segments.length - 1];
  assert.equal(first.start, 1);
  assert.ok(Math.abs(last.start + last.duration - 1.5) < 1e-9);
  const vowel = segments.find(function (segment) { return segment.symbol === 'a'; });
  assert.ok(vowel.duration >= 0.25, 'the vowel gets at least half of the note');
});

test('short notes squeeze consonants but never below 40%', function () {
  const segments = LM.phonemeTiming.planSyllableSegments(['sh', 'ch', 'e', 'n~'], 0, 0.1);
  const fricative = segments[0];
  assert.ok(fricative.duration >= 0.09 * 0.4 - 1e-9);
  assert.ok(segments.find(function (segment) { return segment.symbol === 'e'; }).duration >= 0.04);
});

test('every song line has one syllable per sung note', function () {
  Object.keys(LM.data.songs).forEach(function (songId) {
    LM.data.songs[songId].verses.forEach(function (verse) {
      verse.lines.forEach(function (line) {
        assert.equal(LM.voiceAutomation.lineAlignmentProblem(line), null);
      });
    });
  });
});

test('planSong produces time-ordered events and a karaoke timeline matching the melody', function () {
  const song = LM.data.songs.theseus;
  const plan = LM.voiceAutomation.planSong(song, 10);
  const beatSeconds = 60 / song.bpm;
  assert.ok(Math.abs(plan.karaoke[0].syllables[0].start - (10 + song.introBeats * beatSeconds)) < 1e-9);
  for (let index = 1; index < plan.events.length; index += 1) {
    assert.ok(plan.events[index].time >= plan.events[index - 1].time);
  }
  plan.events.forEach(function (event) {
    assert.ok(Number.isFinite(event.value), 'event value is a number: ' + JSON.stringify(event));
  });
  assert.equal(plan.karaoke.length, song.verses.reduce(function (sum, verse) { return sum + verse.lines.length; }, 0));
});
