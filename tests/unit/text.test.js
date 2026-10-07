const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, toPlain } = require('../helpers/load-game');

const LM = loadGame();
const NBSP = ' ';

// Every character is 10 px wide, so line widths are easy to reason about.
function fakeContext() {
  return {
    font: '',
    measureText: function (text) { return { width: text.length * 10 }; },
  };
}

test('one-letter Polish words are glued to the next word', function () {
  assert.equal(LM.text.glueOneLetterWords('Tezeusz i Ariadna w labiryncie'), 'Tezeusz i' + NBSP + 'Ariadna w' + NBSP + 'labiryncie');
  assert.equal(LM.text.glueOneLetterWords('i w domu'), 'i' + NBSP + 'w' + NBSP + 'domu');
  assert.equal(LM.text.glueOneLetterWords('Zatem o tym'), 'Zatem o' + NBSP + 'tym');
});

test('wrapText breaks lines at the given width', function () {
  const lines = toPlain(LM.text.wrapText(fakeContext(), 'Minos król Krety', 100, 'f1'));
  assert.deepEqual(lines, ['Minos król', 'Krety']);
});

test('wrapText never leaves a one-letter word at the end of a line', function () {
  const lines = LM.text.wrapText(fakeContext(), 'Ikar i Dedal', 60, 'f2');
  lines.forEach(function (line) {
    assert.ok(!/\s[aiouwz]$/i.test(line), 'line ends with a one-letter word: ' + line);
  });
});

test('wrapText keeps explicit line breaks and splits words longer than a line', function () {
  const lines = toPlain(LM.text.wrapText(fakeContext(), 'ab\nKonstantynopolitańczykiewiczówna', 100, 'f3'));
  assert.equal(lines[0], 'ab');
  assert.ok(lines.length >= 4);
  lines.forEach(function (line) { assert.ok(line.length <= 10); });
});
