const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame } = require('./browser');
const { playUntil } = require('./playthrough');

test('mission 2 can be played from the workshop through the flight to the ballad', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1&seed=5' });
  try {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    await page.evaluate(function () {
      const profile = LM.profiles.createProfile(LM.game.save, 'Tester', 'boy', 'now');
      profile.progress.passedMissions.push('theseus');
      LM.game.startMission('icarus');
    });
    await playUntil(page, {
      answerCorrectly: function () { return true; },
      screenshotPrefix: 'icarus',
      stopWhen: function (state) { return state.scene === 'map'; },
    });
    const profile = await page.evaluate(function () { return LM.game.profile(); });
    assert.deepEqual(profile.progress.passedMissions, ['theseus', 'icarus']);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
