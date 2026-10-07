const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame } = require('./browser');
const { playUntil, wrongFirstTime } = require('./playthrough');

async function startMission(page, missionId) {
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  await page.evaluate(function (id) {
    LM.profiles.createProfile(LM.game.save, 'Tester', 'girl', 'now');
    LM.game.persist();
    LM.game.startMission(id);
  }, missionId);
}

test('mission 1 can be played from story to the ballad and is saved as passed', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1&seed=42' });
  try {
    await startMission(page, 'theseus');
    await playUntil(page, {
      answerCorrectly: function () { return true; },
      screenshotPrefix: 'theseus',
      stopWhen: function (state) { return state.scene === 'map'; },
    });
    const profile = await page.evaluate(function () { return LM.game.profile(); });
    assert.deepEqual(profile.progress.passedMissions, ['theseus']);
    assert.equal(profile.history[0].percent, 100);
    assert.ok(profile.achievements['bez-bledu'], 'flawless achievement awarded');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('mission 1 answered all wrong is not passed and offers a retry', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1&seed=7' });
  try {
    await startMission(page, 'theseus');
    await playUntil(page, {
      answerCorrectly: wrongFirstTime(),
      stopWhen: function (state) { return state.scene === 'summary'; },
    });
    const profile = await page.evaluate(function () { return LM.game.profile(); });
    assert.deepEqual(profile.progress.passedMissions, []);
    assert.equal(profile.history[0].isPassed, false);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
