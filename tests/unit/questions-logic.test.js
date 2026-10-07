const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, toPlain } = require('../helpers/load-game');

const LM = loadGame();

test('typed answers ignore case, Polish letters and punctuation', function () {
  assert.equal(LM.textNormalize.normalizeAnswerText('  Łódź, Kraków! '), 'lodz krakow');
  assert.equal(LM.textNormalize.normalizeAnswerText('ŻAGIEL'), 'zagiel');
});

test('levenshtein distance counts single-letter edits', function () {
  assert.equal(LM.textNormalize.levenshteinDistance('ariadna', 'ariadna'), 0);
  assert.equal(LM.textNormalize.levenshteinDistance('ariadna', 'arjadna'), 1);
  assert.equal(LM.textNormalize.levenshteinDistance('ariadna', 'aridna'), 1);
  assert.equal(LM.textNormalize.levenshteinDistance('', 'abc'), 3);
});

test('typo tolerance grows with the length of the answer', function () {
  const accepted = function (typed, answer) { return LM.textNormalize.isCloseEnough(typed, answer); };
  assert.ok(accepted('Arjadna', 'Ariadna'));
  assert.ok(accepted('aridna', 'Ariadna'));
  assert.ok(accepted('naksos', 'Naksos'));
  assert.ok(accepted('Minotaurr', 'Minotaur'));
  assert.ok(accepted('Morze Egiejskie', 'Morze Egejskie'));
  assert.ok(!accepted('Stos', 'Styks'));
  assert.ok(!accepted('Zeuz', 'Zeus'));
  assert.ok(!accepted('Dedal', 'Ikar'));
});

test('every question type is checked correctly', function () {
  const check = LM.answerCheck.isAnswerCorrect;
  assert.ok(check({ type: 'choice', correctIndex: 2 }, { optionIndex: 2 }));
  assert.ok(!check({ type: 'choice', correctIndex: 2 }, { optionIndex: 1 }));
  assert.ok(check({ type: 'truefalse', statementIsTrue: false }, { value: false }));
  assert.ok(!check({ type: 'truefalse', statementIsTrue: false }, { value: true }));
  const order = { type: 'order', itemsInOrder: ['a', 'b', 'c'] };
  assert.ok(check(order, { items: ['a', 'b', 'c'] }));
  assert.ok(!check(order, { items: ['b', 'a', 'c'] }));
  const match = { type: 'match', pairs: [{ left: 'Ariadna', right: 'córka Minosa' }, { left: 'Egeusz', right: 'król Aten' }] };
  assert.ok(check(match, { pairs: { Ariadna: 'córka Minosa', Egeusz: 'król Aten' } }));
  assert.ok(!check(match, { pairs: { Ariadna: 'król Aten', Egeusz: 'córka Minosa' } }));
  const typed = { type: 'typed', acceptedAnswers: ['Egeusz', 'Ajgeus'] };
  assert.ok(check(typed, { text: 'ajgeus' }));
  assert.ok(check(typed, { text: 'Egeus' }));
  assert.ok(!check(typed, { text: 'Minos' }));
});

test('the correct answer can be shown as one line for every type', function () {
  assert.equal(LM.answerCheck.correctAnswerText({ type: 'choice', options: ['x', 'y'], correctIndex: 1 }), 'y');
  assert.equal(LM.answerCheck.correctAnswerText({ type: 'truefalse', statementIsTrue: true }), 'Prawda');
  assert.equal(LM.answerCheck.correctAnswerText({ type: 'order', itemsInOrder: ['a', 'b'] }), 'a → b');
  assert.equal(LM.answerCheck.correctAnswerText({ type: 'typed', acceptedAnswers: ['Naksos'] }), 'Naksos');
});

test('the seeded random generator is repeatable', function () {
  const first = LM.random.createRng(42);
  const second = LM.random.createRng(42);
  const values = [first(), first(), first()];
  assert.deepEqual(values, [second(), second(), second()]);
  values.forEach(function (value) { assert.ok(value >= 0 && value < 1); });
  assert.notEqual(LM.random.createRng(43)(), values[0]);
});

function samplePool() {
  const pool = [];
  ['door', 'duel', 'ship'].forEach(function (slot) {
    for (let index = 0; index < 10; index += 1) {
      pool.push({ id: slot + index, slot: slot });
    }
  });
  return pool;
}

test('mission questions are drawn per slot without repeats, and seeds change the draw', function () {
  const drawn = LM.questionDraw.drawMissionQuestions(samplePool(), { door: 5, duel: 5, ship: 2 }, LM.random.createRng(1));
  assert.equal(drawn.door.length, 5);
  assert.equal(drawn.duel.length, 5);
  assert.equal(drawn.ship.length, 2);
  const ids = [].concat(drawn.door, drawn.duel, drawn.ship).map(function (question) { return question.id; });
  assert.equal(new Set(ids).size, ids.length);
  drawn.door.forEach(function (question) { assert.equal(question.slot, 'door'); });
  const other = LM.questionDraw.drawMissionQuestions(samplePool(), { door: 5 }, LM.random.createRng(2));
  assert.notDeepEqual(toPlain(other.door), toPlain(drawn.door));
});

test('the exam mixes cross-myth questions with an even share of each myth', function () {
  const myth = function (name) { return Array.from({ length: 10 }, function (unused, index) { return { id: name + index, myth: name }; }); };
  const cross = Array.from({ length: 6 }, function (unused, index) { return { id: 'cross' + index, myth: 'cross' }; });
  const exam = LM.questionDraw.drawExamQuestions([myth('a'), myth('b'), myth('c')], cross, 15, LM.random.createRng(7));
  assert.equal(exam.length, 15);
  ['a', 'b', 'c'].forEach(function (name) {
    assert.equal(exam.filter(function (question) { return question.myth === name; }).length, 4);
  });
  assert.equal(exam.filter(function (question) { return question.myth === 'cross'; }).length, 3);
});

function runWith(correct, total) {
  const run = LM.missionRun.createMissionRun('theseus');
  for (let index = 0; index < total; index += 1) {
    LM.missionRun.recordAnswer(run, { id: 'q' + index }, index < correct);
  }
  return run;
}

test('the mission pass threshold is 70% of first-try answers', function () {
  assert.equal(LM.missionRun.isPassed(runWith(7, 10)), true);
  assert.equal(LM.missionRun.isPassed(runWith(6, 10)), false);
  assert.equal(LM.missionRun.isPassed(runWith(9, 12)), true);
  assert.equal(LM.missionRun.isPassed(runWith(8, 12)), false);
  assert.equal(LM.missionRun.isPassed(runWith(0, 0)), false);
  assert.equal(LM.missionRun.scorePercent(runWith(8, 12)), 67);
});

test('only the first attempt at a question counts', function () {
  const run = LM.missionRun.createMissionRun('theseus');
  const question = { id: 'q1' };
  LM.missionRun.recordAnswer(run, question, false);
  LM.missionRun.recordAnswer(run, question, true);
  assert.equal(run.answers.length, 1);
  assert.equal(LM.missionRun.wrongAnswers(run)[0], question);
});

test('three hints per mission', function () {
  const run = LM.missionRun.createMissionRun('theseus');
  LM.missionRun.recordHintUse(run);
  assert.equal(LM.missionRun.hintsLeft(run), 2);
});
