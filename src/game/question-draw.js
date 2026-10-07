// Draws a fresh set of questions for one play-through, so replays ask different things.
(function (LM) {
  'use strict';

  const EXAM_CROSS_QUESTIONS = 3;

  // slotCounts: { door: 5, duel: 5, ship: 2 } → { door: [...], duel: [...], ship: [...] }
  function drawMissionQuestions(pool, slotCounts, rng) {
    const drawn = {};
    Object.keys(slotCounts).forEach(function (slot) {
      const candidates = pool.filter(function (question) { return question.slot === slot; });
      drawn[slot] = LM.random.pickSome(candidates, slotCounts[slot], rng);
    });
    return drawn;
  }

  // A few questions that link the myths, the rest spread evenly over the three myths.
  function drawExamQuestions(mythPools, crossPool, questionCount, rng) {
    const perMyth = Math.floor((questionCount - EXAM_CROSS_QUESTIONS) / mythPools.length);
    let questions = LM.random.pickSome(crossPool, EXAM_CROSS_QUESTIONS, rng);
    mythPools.forEach(function (pool) {
      questions = questions.concat(LM.random.pickSome(pool, perMyth, rng));
    });
    return LM.random.shuffle(questions, rng).slice(0, questionCount);
  }

  LM.questionDraw = { drawMissionQuestions, drawExamQuestions };
}(window.LM = window.LM || {}));
