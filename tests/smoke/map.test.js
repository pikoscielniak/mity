const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

async function press(page, key) {
  await page.keyboard.press(key);
  await page.waitForTimeout(150);
}

test('the map sails to an open mission, refuses a locked one and opens the menu screens', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1' });
  try {
    await press(page, 'Enter');
    await page.evaluate(function () {
      const profile = LM.profiles.createProfile(LM.game.save, 'Jaś', 'boy', 'now');
      LM.profiles.recordMissionResult(profile, { missionId: 'theseus', percent: 83, isPassed: true, dateIso: new Date().toISOString() });
      LM.achievements.awardAchievements(profile, LM.missionRun.createMissionRun('theseus'), true);
      LM.game.show('map');
    });
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'map');
    await page.mouse.move(640 + 115, 360 + 88);
    await page.waitForTimeout(200);
    await saveScreenshot(page, 'map-hover-naxos');

    await press(page, 'ArrowRight');
    await press(page, 'ArrowRight');
    await press(page, 'Enter');
    await saveScreenshot(page, 'map-locked');
    assert.equal(await page.evaluate(function () { return LM_DEBUG.describe().scene; }), 'map');

    for (const screen of ['achievements', 'history', 'jukebox']) {
      await press(page, 'Escape');
      const index = ['achievements', 'history', 'jukebox'].indexOf(screen);
      for (let step = 0; step < index; step += 1) {
        await press(page, 'ArrowDown');
      }
      await press(page, 'Enter');
      await saveScreenshot(page, 'menu-' + screen);
      assert.equal(await page.evaluate(function () { return LM_DEBUG.describe().scene; }), screen);
      await press(page, 'Escape');
    }

    await press(page, 'Enter');
    await page.waitForTimeout(2000);
    assert.equal(await page.evaluate(function () { return LM_DEBUG.describe().scene; }), 'cutscene');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
