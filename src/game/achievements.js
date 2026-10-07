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

  const MISSION_IDS = ['theseus', 'icarus', 'orpheus'];

  // facts: { run, isPassed, profile }
  const RULES = {
    flawlessMission: function (facts) { return facts.run.missionId !== 'exam' && isFlawless(facts.run); },
    noHints: function (facts) { return facts.isPassed && facts.run.hintsUsed === 0; },
    untouchedByMinotaur: function (facts) { return facts.isPassed && facts.run.missionId === 'theseus' && stat(facts.run, 'minotaurTouches') === 0; },
    escapeWithoutLoss: function (facts) { return facts.isPassed && facts.run.missionId === 'theseus' && stat(facts.run, 'escapeHeartsLost') === 0; },
    stayedInGoldenMean: function (facts) { return facts.isPassed && facts.run.missionId === 'icarus' && stat(facts.run, 'secondsOutsideZone') === 0; },
    collectedAllFeathers: function (facts) {
      return facts.isPassed && facts.run.missionId === 'icarus' && stat(facts.run, 'feathersTotal') > 0 && stat(facts.run, 'feathersCollected') === stat(facts.run, 'feathersTotal');
    },
    playedEveryNote: function (facts) { return facts.isPassed && facts.run.missionId === 'orpheus' && stat(facts.run, 'notesMissed') === 0; },
    neverLookedBack: function (facts) { return facts.isPassed && facts.run.missionId === 'orpheus' && stat(facts.run, 'lookBacks') === 0; },
    heardEveryStory: function (facts) { return hasAll(facts.profile.storiesHeard, MISSION_IDS); },
    heardEveryBallad: function (facts) { return hasAll(facts.profile.balladsHeard, MISSION_IDS); },
    passedExam: function (facts) { return facts.isPassed && facts.run.missionId === 'exam'; },
    flawlessExam: function (facts) { return facts.run.missionId === 'exam' && isFlawless(facts.run); },
  };

  // Awards every achievement whose rule now holds; returns the newly earned ones.
  function awardAchievements(profile, facts) {
    const earned = LM.data.achievements.filter(function (achievement) {
      return !profile.achievements[achievement.id] && RULES[achievement.rule](facts);
    });
    earned.forEach(function (achievement) { profile.achievements[achievement.id] = new Date().toISOString(); });
    return earned;
  }

  function awardMissionAchievements(profile, run, isPassed) {
    return awardAchievements(profile, { run: run, isPassed: isPassed, profile: profile });
  }

  LM.achievements = { RULES, awardAchievements, awardMissionAchievements };
}(window.LM = window.LM || {}));
