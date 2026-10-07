// Structural checks over all game content: every question is answerable, every hint and picture exists.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load-game');

const LM = loadGame();
const myths = Object.keys(LM.data.myths).map(function (id) { return LM.data.myths[id]; });
const allQuestions = Object.keys(LM.data.questions).reduce(function (all, key) { return all.concat(LM.data.questions[key]); }, []);
const QUESTION_TYPES = ['choice', 'truefalse', 'order', 'match', 'typed'];

function allPages() {
  return myths.reduce(function (pages, myth) { return pages.concat(myth.storyPages, myth.endingPages); }, []);
}

function hasNoUnresolvedGenderForms(text) {
  return !/[{}]/.test(LM.genderForms.applyGenderForms(text, 'girl'));
}

function isDistinct(items) {
  return new Set(items).size === items.length;
}

test('ids of pages and questions are unique', function () {
  const ids = allPages().map(function (page) { return page.id; }).concat(allQuestions.map(function (question) { return question.id; }));
  assert.ok(isDistinct(ids), 'duplicate ids');
});

test('every story page has a known speaker, a drawn illustration and well-formed text', function () {
  allPages().forEach(function (page) {
    assert.ok(LM.data.voices[page.speaker], page.id + ': unknown speaker ' + page.speaker);
    assert.equal(typeof LM.illustrations[page.illustration], 'function', page.id + ': missing illustration ' + page.illustration);
    assert.ok(page.text.length > 20 && page.text.length < 420, page.id + ': text length ' + page.text.length);
    assert.ok(hasNoUnresolvedGenderForms(page.text), page.id + ': broken {boy|girl} form');
  });
});

const TYPE_CHECKS = {
  choice: function (question) {
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id + ': 3-4 options');
    assert.ok(isDistinct(question.options), question.id + ': options repeat');
    assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, question.id + ': correctIndex');
  },
  truefalse: function (question) {
    assert.equal(typeof question.statement, 'string');
    assert.equal(typeof question.statementIsTrue, 'boolean', question.id);
  },
  order: function (question) {
    assert.ok(question.itemsInOrder.length >= 4 && question.itemsInOrder.length <= 5, question.id + ': 4-5 items');
    assert.ok(isDistinct(question.itemsInOrder), question.id + ': items repeat');
  },
  match: function (question) {
    assert.ok(question.pairs.length >= 3 && question.pairs.length <= 5, question.id + ': 3-5 pairs');
    assert.ok(isDistinct(question.pairs.map(function (pair) { return pair.left; })), question.id + ': left repeats');
    assert.ok(isDistinct(question.pairs.map(function (pair) { return pair.right; })), question.id + ': right repeats');
  },
  typed: function (question) {
    assert.ok(question.acceptedAnswers.length > 0, question.id + ': no accepted answers');
  },
};

test('every question is well-formed for its type and has an explanation and a hint', function () {
  allQuestions.forEach(function (question) {
    assert.ok(QUESTION_TYPES.indexOf(question.type) >= 0, question.id + ': type ' + question.type);
    TYPE_CHECKS[question.type](question);
    assert.ok(question.type === 'truefalse' || question.prompt, question.id + ': prompt');
    assert.ok(question.explanation && question.explanation.length > 5, question.id + ': explanation');
    assert.ok(LM.stories.findStoryPage(question.hintPageId), question.id + ': hint page ' + question.hintPageId + ' not found');
    if (question.myth !== 'cross') {
      const ownPages = LM.data.myths[question.myth].storyPages.map(function (page) { return page.id; });
      assert.ok(ownPages.indexOf(question.hintPageId) >= 0, question.id + ': hint points outside its own myth');
    }
  });
});

test('each mission pool can fill every slot at least twice over, so replays differ', function () {
  LM.data.missions.forEach(function (mission) {
    const pool = LM.data.questions[mission.id] || [];
    Object.keys(mission.questionSlots).forEach(function (slot) {
      const available = pool.filter(function (question) { return question.slot === slot; }).length;
      assert.ok(available >= 2 * mission.questionSlots[slot], mission.id + '/' + slot + ': ' + available + ' questions');
    });
  });
});

test('each myth teaches 5-7 key concepts', function () {
  myths.forEach(function (myth) {
    assert.ok(myth.concepts.length >= 5 && myth.concepts.length <= 7, myth.id + ': ' + myth.concepts.length + ' concepts');
    myth.concepts.forEach(function (concept) { assert.ok(concept.term && concept.definition); });
  });
});

test('questions use every question type in each myth', function () {
  myths.forEach(function (myth) {
    const types = new Set((LM.data.questions[myth.id] || []).map(function (question) { return question.type; }));
    QUESTION_TYPES.forEach(function (type) { assert.ok(types.has(type), myth.id + ' has no ' + type + ' question'); });
  });
});
