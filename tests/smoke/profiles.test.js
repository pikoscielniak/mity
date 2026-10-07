const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

test('a new player is created with real key presses and survives a reload', async function () {
  const { browser, page, errors } = await openGame();
  try {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await saveScreenshot(page, 'profiles-empty');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await page.keyboard.type('Paweł');
    await saveScreenshot(page, 'profiles-name');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await saveScreenshot(page, 'profiles-gender');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'map-first-visit');
    const profile = await page.evaluate(function () { return LM.game.profile(); });
    assert.equal(profile.name, 'Paweł');
    assert.equal(profile.gender, 'boy');

    await page.reload();
    await page.waitForFunction(function () { return Boolean(window.LM && window.LM.game); });
    const names = await page.evaluate(function () { return LM.game.save.profiles.map(function (p) { return p.name; }); });
    assert.deepEqual(names, ['Paweł']);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
