// Drives one attempt at a mission: story → stages → ending → summary → ballad (when passed) → map.
(function (LM) {
  'use strict';

  function createMissionRunner(game, missionId, seed) {
    const mission = LM.missions.byId(missionId);
    const myth = LM.data.myths[missionId];
    const rng = LM.random.createRng(seed);
    const run = LM.missionRun.createMissionRun(missionId);
    const questionQueues = LM.questionDraw.drawMissionQuestions(LM.data.questions[missionId], mission.questionSlots, rng);
    let stageIndex = 0;

    function showStage(index) {
      stageIndex = index;
      if (index >= mission.stages.length) {
        showEnding();
        return;
      }
      game.show('stage', { runner: runner, stageType: mission.stages[index] });
    }

    function showStory() {
      game.show('cutscene', {
        title: 'Misja ' + mission.number + ': ' + mission.title,
        pages: myth.storyPages,
        onFinished: function (wasSkipped) {
          if (!wasSkipped) {
            LM.profiles.recordStoryHeard(game.profile(), missionId);
          }
          showStage(0);
        },
      });
    }

    function showEnding() {
      game.show('cutscene', { title: mission.title, pages: myth.endingPages, onFinished: showSummary });
    }

    function showSummary() {
      finishRun(game, run, {
        scoreTitle: 'Wynik misji',
        concepts: myth.concepts,
        backgroundIllustration: myth.endingPages[myth.endingPages.length - 1].illustration,
        choiceWhenPassed: { label: 'Posłuchaj ballady!', onChoose: showBallad },
        retry: function () { game.startMission(missionId); },
      });
    }

    function showBallad() {
      game.show('song', { songId: mission.songId, onFinished: function () { game.show('map'); } });
    }

    const runner = {
      mission: mission,
      myth: myth,
      run: run,
      rng: rng,
      shared: {},
      start: function () {
        game.playTheme(mission.themeId);
        showStory();
      },
      nextQuestion: function (slot) {
        return questionQueues[slot] && questionQueues[slot].length > 0 ? questionQueues[slot].shift() : null;
      },
      remainingQuestions: function (slot) {
        return questionQueues[slot] ? questionQueues[slot].length : 0;
      },
      completeStage: function () { showStage(stageIndex + 1); },
    };
    return runner;
  }

  function retryChoices(game, retry) {
    return [
      { label: 'Spróbuj jeszcze raz', onChoose: retry },
      { label: 'Wróć na mapę', onChoose: function () { game.show('map'); } },
    ];
  }

  // Ends an attempt (a mission or the exam): saves the result and new achievements, then shows the summary.
  // summary: { scoreTitle, concepts, backgroundIllustration, choiceWhenPassed, retry() }
  function finishRun(game, run, summary) {
    const profile = game.profile();
    const isPassed = LM.missionRun.isPassed(run);
    LM.profiles.recordMissionResult(profile, {
      missionId: run.missionId, percent: LM.missionRun.scorePercent(run), isPassed: isPassed, dateIso: new Date().toISOString(),
    });
    const newAchievements = LM.achievements.awardAchievements(profile, run, isPassed);
    game.persist();
    game.sfx(isPassed ? 'missionComplete' : 'missionFailed');
    game.show('summary', {
      scoreTitle: summary.scoreTitle,
      run: run,
      isPassed: isPassed,
      newAchievements: newAchievements,
      concepts: summary.concepts,
      backgroundIllustration: summary.backgroundIllustration,
      choices: isPassed ? [summary.choiceWhenPassed] : retryChoices(game, summary.retry),
    });
  }

  LM.missionRunner = { createMissionRunner, finishRun };
}(window.LM = window.LM || {}));
