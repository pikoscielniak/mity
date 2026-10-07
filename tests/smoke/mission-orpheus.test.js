const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame } = require('./browser');
const { playUntil } = require('./playthrough');

test('mission 3 can be played from the lute through the ascent to the ballad', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1&seed=9' });
  try {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    await page.evaluate(function () {
      const profile = LM.profiles.createProfile(LM.game.save, 'Tester', 'girl', 'now');
      profile.progress.passedMissions.push('theseus', 'icarus');
      LM.game.startMission('orpheus');
    });
    await playUntil(page, {
      answerCorrectly: function () { return true; },
      screenshotPrefix: 'orpheus',
      stopWhen: function (state) { return state.scene === 'map'; },
    });
    const profile = await page.evaluate(function () { return LM.game.profile(); });
    assert.deepEqual(profile.progress.passedMissions, ['theseus', 'icarus', 'orpheus']);
    const isExamUnlocked = await page.evaluate(function () { return LM.profiles.isExamUnlocked(LM.game.profile()); });
    assert.equal(isExamUnlocked, true);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
