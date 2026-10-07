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
          run.wasStorySkipped = wasSkipped;
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
      const profile = game.profile();
      const isPassed = LM.missionRun.isPassed(run);
      LM.profiles.recordMissionResult(profile, {
        missionId: missionId, percent: LM.missionRun.scorePercent(run), isPassed: isPassed, dateIso: new Date().toISOString(),
      });
      const newAchievements = LM.achievements.awardMissionAchievements(profile, run, isPassed);
      game.persist();
      game.sfx(isPassed ? 'missionComplete' : 'missionFailed');
      game.show('summary', { runner: runner, isPassed: isPassed, newAchievements: newAchievements });
    }

    function afterSummary(isPassed) {
      if (!isPassed) {
        game.show('map');
        return;
      }
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
      afterSummary: afterSummary,
    };
    return runner;
  }

  LM.missionRunner = { createMissionRunner };
}(window.LM = window.LM || {}));
