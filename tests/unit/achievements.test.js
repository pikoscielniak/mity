const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, toPlain } = require('../helpers/load-game');

const LM = loadGame();

function newProfile() {
  return LM.profiles.createDetachedProfile(1, 'Ola', 'girl', '2026-10-07T10:00:00.000Z');
}

function passedRun(missionId, hintBudget) {
  const run = LM.missionRun.createMissionRun(missionId, hintBudget);
  LM.data.questions.theseus.slice(0, 10).forEach(function (question) { LM.missionRun.recordAnswer(run, question, true); });
  return run;
}

function earnedIds(profile, run, isPassed) {
  return LM.achievements.awardAchievements(profile, run, isPassed).map(function (achievement) { return achievement.id; });
}

test('a mission passed without opening a scroll earns "Bez podpowiedzi"', function () {
  assert.ok(earnedIds(newProfile(), passedRun('theseus'), true).includes('bez-podpowiedzi'));
});

test('the exam, which has no scrolls at all, does not earn "Bez podpowiedzi"', function () {
  const ids = earnedIds(newProfile(), passedRun('exam', 0), true);
  assert.ok(ids.includes('znawca-mitow'));
  assert.ok(!ids.includes('bez-podpowiedzi'));
});

test('"Wszystkie pióra zebrane" needs caught feathers and none missed', function () {
  const perfectFlight = passedRun('icarus');
  LM.missionRun.addToStat(perfectFlight, 'feathersCollected', 12);
  assert.ok(earnedIds(newProfile(), perfectFlight, true).includes('wszystkie-piora'));

  const oneMissed = passedRun('icarus');
  LM.missionRun.addToStat(oneMissed, 'feathersCollected', 11);
  LM.missionRun.addToStat(oneMissed, 'feathersMissed', 1);
  assert.ok(!earnedIds(newProfile(), oneMissed, true).includes('wszystkie-piora'));
});

test('a ballad heard in the jukebox counts without any mission attempt', function () {
  const profile = newProfile();
  LM.data.missions.forEach(function (mission) { LM.profiles.recordBalladHeard(profile, mission.songId); });
  assert.deepEqual(toPlain(earnedIds(profile, null, false)), ['spiewak-z-tracji']);
});
