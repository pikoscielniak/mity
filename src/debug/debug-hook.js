// Test hook, active only with ?debug=1: lets automated tests answer questions and skip mini-game action.
(function (LM) {
  'use strict';

  if (!/[?&]debug=1/.test(window.location.search)) {
    return;
  }

  function correctPairs(question) {
    const pairs = {};
    question.pairs.forEach(function (pair) { pairs[pair.left] = pair.right; });
    return pairs;
  }

  function correctResponse(question) {
    const byType = {
      choice: function () { return { optionIndex: question.correctIndex }; },
      truefalse: function () { return { optionIndex: question.statementIsTrue ? 0 : 1 }; },
      order: function () { return { items: question.itemsInOrder.slice() }; },
      match: function () { return { pairs: correctPairs(question) }; },
      typed: function () { return { text: question.acceptedAnswers[0] }; },
    };
    return byType[question.type]();
  }

  function wrongResponse(question) {
    const byType = {
      choice: function () { return { optionIndex: (question.correctIndex + 1) % question.options.length }; },
      truefalse: function () { return { optionIndex: question.statementIsTrue ? 1 : 0 }; },
      order: function () { return { items: question.itemsInOrder.slice().reverse() }; },
      match: function () { return { pairs: {} }; },
      typed: function () { return { text: 'qqq' }; },
    };
    return byType[question.type]();
  }

  window.LM_DEBUG = {
    describe: function () {
      const scenes = LM.game.scenes;
      const base = scenes.currentScene();
      const top = scenes.topLayer();
      return {
        scene: base.sceneName,
        stageType: base.stageType || null,
        overlay: top === base ? null : (top.kind || 'other'),
        questionId: top.question ? top.question.id : null,
        isShowingFeedback: Boolean(top.isShowingFeedback && top.isShowingFeedback()),
      };
    },
    answer: function (isCorrect) {
      const overlay = LM.game.scenes.topLayer();
      overlay.answerWith(isCorrect ? correctResponse(overlay.question) : wrongResponse(overlay.question));
    },
    continueFeedback: function () {
      LM.game.scenes.topLayer().continueAfterFeedback();
    },
    advanceStage: function () {
      LM.game.scenes.currentScene().stage().debugAdvance();
    },
  };
}(window.LM = window.LM || {}));
