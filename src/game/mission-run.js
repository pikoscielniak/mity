// The record of one attempt at a mission: first-try answers, hints and mini-game stats.
(function (LM) {
  'use strict';

  const PASS_THRESHOLD = 0.7;
  const HINTS_PER_MISSION = 3;

  function createMissionRun(missionId) {
    return { missionId: missionId, answers: [], hintsUsed: 0, heartsLost: 0, stats: {}, wasStorySkipped: false };
  }

  // Only the first attempt counts; retries after a mistake are for learning.
  function recordAnswer(run, question, isCorrect) {
    const alreadyAnswered = run.answers.some(function (answer) { return answer.question.id === question.id; });
    if (!alreadyAnswered) {
      run.answers.push({ question: question, isCorrect: isCorrect });
    }
  }

  function hintsLeft(run) {
    return HINTS_PER_MISSION - run.hintsUsed;
  }

  function recordHintUse(run) {
    run.hintsUsed += 1;
  }

  function recordHeartLost(run) {
    run.heartsLost += 1;
  }

  function addToStat(run, name, amount) {
    run.stats[name] = (run.stats[name] || 0) + amount;
  }

  function correctCount(run) {
    return run.answers.filter(function (answer) { return answer.isCorrect; }).length;
  }

  function scorePercent(run) {
    if (run.answers.length === 0) {
      return 0;
    }
    return Math.round(100 * correctCount(run) / run.answers.length);
  }

  function isPassed(run) {
    return run.answers.length > 0 && correctCount(run) / run.answers.length >= PASS_THRESHOLD;
  }

  function wrongAnswers(run) {
    return run.answers.filter(function (answer) { return !answer.isCorrect; }).map(function (answer) { return answer.question; });
  }

  LM.missionRun = {
    PASS_THRESHOLD,
    HINTS_PER_MISSION,
    createMissionRun,
    recordAnswer,
    hintsLeft,
    recordHintUse,
    recordHeartLost,
    addToStat,
    correctCount,
    scorePercent,
    isPassed,
    wrongAnswers,
  };
}(window.LM = window.LM || {}));
