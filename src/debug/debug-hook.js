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
      truefalse: function () { return { value: question.statementIsTrue }; },
      order: function () { return { items: question.itemsInOrder.slice() }; },
      match: function () { return { pairs: correctPairs(question) }; },
      typed: function () { return { text: question.acceptedAnswers[0] }; },
    };
    return byType[question.type]();
  }

  function wrongResponse(question) {
    const byType = {
      choice: function () { return { optionIndex: (question.correctIndex + 1) % question.options.length }; },
      truefalse: function () { return { value: !question.statementIsTrue }; },
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
    // The number keys that answer the current choice question right and wrong, as the options are shown.
    choiceKeys: function () {
      const overlay = LM.game.scenes.topLayer();
      const correctIndex = overlay.question.correctIndex;
      return {
        correct: 'Digit' + overlay.shownOptionNumber(correctIndex),
        wrong: 'Digit' + overlay.shownOptionNumber((correctIndex + 1) % overlay.question.options.length),
      };
    },
    continueFeedback: function () {
      LM.game.scenes.topLayer().continueAfterFeedback();
    },
    advanceStage: function () {
      LM.game.scenes.currentScene().stage().debugAdvance();
    },
    startStage: function (missionId, stageType, seed) {
      const runner = LM.missionRunner.createMissionRunner(LM.game, missionId, seed || 1);
      LM.game.currentMission = runner;
      LM.game.show('stage', { runner: runner, stageType: stageType });
    },
  };
}(window.LM = window.LM || {}));
