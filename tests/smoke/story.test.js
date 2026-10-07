const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

async function mythIds(page) {
  return page.evaluate(function () { return Object.keys(LM.data.myths); });
}

test('every story page of every myth renders without errors', async function () {
  const { browser, page, errors } = await openGame({ query: '?scene=gallery&myth=theseus' });
  try {
    for (const mythId of await mythIds(page)) {
      await page.evaluate(function (id) { LM.game.show('gallery', { myth: id }); }, mythId);
      const pageCount = await page.evaluate(function (id) {
        return LM.data.myths[id].storyPages.length + LM.data.myths[id].endingPages.length;
      }, mythId);
      for (let index = 0; index < pageCount; index += 1) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(120);
        await saveScreenshot(page, 'story-' + mythId + '-' + String(index + 1).padStart(2, '0'));
        await page.keyboard.press('Enter');
        await page.waitForTimeout(60);
      }
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
