// Pausing during a question, muting there, and finding the mute again in the settings.
const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

async function press(page, key) {
  await page.keyboard.press(key);
  await page.waitForTimeout(120);
}

function describe(page) {
  return page.evaluate(function () { return window.LM_DEBUG.describe(); });
}

test('Esc pauses a question, the mute is saved and shown in the settings', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1' });
  try {
    await press(page, 'Enter');
    await page.evaluate(function () {
      LM.profiles.createProfile(LM.game.save, 'Ola', 'girl', 'now');
      window.LM_DEBUG.startStage('theseus', 'labyrinth', 4);
      window.LM_DEBUG.advanceStage();
    });
    await page.waitForTimeout(150);
    assert.equal((await describe(page)).overlay, 'question');

    await press(page, 'Escape');
    assert.equal((await describe(page)).overlay, 'pause');
    await saveScreenshot(page, 'pause-over-question');
    await press(page, 'ArrowDown');
    await press(page, 'Enter');
    assert.equal(await page.evaluate(function () { return LM.game.profile().settings.isMuted; }), true);

    await press(page, 'Escape');
    assert.equal((await describe(page)).overlay, 'question');

    await page.evaluate(function () { LM.game.show('settings'); });
    await page.waitForTimeout(150);
    for (let step = 0; step < 3; step += 1) {
      await press(page, 'ArrowDown');
    }
    await saveScreenshot(page, 'settings-muted');
    await press(page, 'Enter');
    assert.equal(await page.evaluate(function () { return LM.game.profile().settings.isMuted; }), false);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
