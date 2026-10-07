// Decides which achievements a player has just earned. Each rule reads the finished attempt and the profile.
(function (LM) {
  'use strict';

  function isFlawless(run) {
    return run.answers.length > 0 && LM.missionRun.correctCount(run) === run.answers.length;
  }

  function stat(run, name) {
    return run.stats[name] || 0;
  }

  function hasAll(list, required) {
    return required.every(function (item) { return list.indexOf(item) >= 0; });
  }

  function missionIds() {
    return LM.data.missions.map(function (mission) { return mission.id; });
  }

  // There is no run when a ballad ends in the jukebox; such facts are never passed, so the run is not read.
  function passed(facts, missionId) {
    return facts.isPassed && facts.run.missionId === missionId;
  }

  function passedWithNone(missionId, statName) {
    return function (facts) { return passed(facts, missionId) && stat(facts.run, statName) === 0; };
  }

  // facts: { run (or null), isPassed, profile }
  const RULES = {
    flawlessMission: function (facts) { return facts.isPassed && facts.run.missionId !== 'exam' && isFlawless(facts.run); },
    noHints: function (facts) { return facts.isPassed && facts.run.hintsUsed === 0; },
    untouchedByMinotaur: passedWithNone('theseus', 'minotaurTouches'),
    escapeWithoutLoss: passedWithNone('theseus', 'escapeHeartsLost'),
    stayedInGoldenMean: passedWithNone('icarus', 'secondsOutsideZone'),
    collectedAllFeathers: function (facts) {
      return passed(facts, 'icarus') && stat(facts.run, 'feathersTotal') > 0 && stat(facts.run, 'feathersCollected') === stat(facts.run, 'feathersTotal');
    },
    playedEveryNote: passedWithNone('orpheus', 'notesMissed'),
    neverLookedBack: passedWithNone('orpheus', 'lookBacks'),
    heardEveryStory: function (facts) { return hasAll(facts.profile.storiesHeard, missionIds()); },
    heardEveryBallad: function (facts) { return hasAll(facts.profile.balladsHeard, missionIds()); },
    passedExam: function (facts) { return passed(facts, 'exam'); },
    flawlessExam: function (facts) { return passed(facts, 'exam') && isFlawless(facts.run); },
  };

  // Awards every achievement whose rule now holds; returns the newly earned ones. run is null outside an attempt.
  function awardAchievements(profile, run, isPassed) {
    const facts = { run: run, isPassed: isPassed, profile: profile };
    const earned = LM.data.achievements.filter(function (achievement) {
      return !profile.achievements[achievement.id] && RULES[achievement.rule](facts);
    });
    earned.forEach(function (achievement) { profile.achievements[achievement.id] = new Date().toISOString(); });
    return earned;
  }

  LM.achievements = { awardAchievements };
}(window.LM = window.LM || {}));
