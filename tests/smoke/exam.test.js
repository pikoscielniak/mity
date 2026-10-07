const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame } = require('./browser');
const { playUntil } = require('./playthrough');

test('the Delphi exam can be passed and leads to the ending', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1&seed=3' });
  try {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    await page.evaluate(function () {
      const profile = LM.profiles.createProfile(LM.game.save, 'Ola', 'girl', 'now');
      profile.progress.passedMissions.push('theseus', 'icarus', 'orpheus');
      LM.game.startExam();
    });
    const final = await playUntil(page, {
      answerCorrectly: function () { return true; },
      screenshotPrefix: 'exam',
      stopWhen: function (state) { return state.scene === 'ending'; },
    });
    assert.equal(final.scene, 'ending');
    const profile = await page.evaluate(function () { return LM.game.profile(); });
    assert.equal(profile.progress.isExamPassed, true);
    assert.ok(profile.achievements['znawca-mitow']);
    assert.ok(profile.achievements.wyrocznia);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
