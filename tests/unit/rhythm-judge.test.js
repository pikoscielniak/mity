const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load-game');

const LM = loadGame();
const J = LM.rhythmJudge;

function notesAt(times) {
  return times.map(function (time) { return { lane: 0, time: time, result: null }; });
}

test('a press close to the note is great, a bit off is still good, far off hits nothing', function () {
  const notes = notesAt([1, 3, 5]);
  assert.equal(J.judgePress(notes, 0, 1.1).result, 'great');
  assert.equal(J.judgePress(notes, 0, 3.3).result, 'good');
  assert.equal(J.judgePress(notes, 0, 4.2), null);
  assert.equal(notes[2].result, null);
});

test('a press only plays a note in its own lane, and each note only once', function () {
  const notes = notesAt([1]);
  assert.equal(J.judgePress(notes, 2, 1), null);
  assert.ok(J.judgePress(notes, 0, 1));
  assert.equal(J.judgePress(notes, 0, 1), null);
});

test('notes left unplayed become misses and lower the share of hits', function () {
  const notes = notesAt([1, 2, 3, 4]);
  J.judgePress(notes, 0, 1);
  J.judgePress(notes, 0, 2.05);
  assert.equal(J.markMissed(notes, 5).length, 2);
  assert.equal(J.hitShare(notes), 0.5);
});

test('every guardian chart is slow: at least about a second between notes, all four strings valid', function () {
  LM.data.lyreCharts.forEach(function (chart) {
    const notes = J.scheduleChart(chart, 0);
    for (let index = 1; index < notes.length; index += 1) {
      assert.ok(notes[index].time - notes[index - 1].time >= 0.85, chart.guardian + ' has a fast run');
    }
    notes.forEach(function (note) { assert.ok(note.lane >= 0 && note.lane < LM.data.lyreStrings.length); });
  });
});
