const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

test('the title screen opens from disk without errors', async function () {
  const { browser, page, errors } = await openGame();
  try {
    await page.waitForTimeout(500);
    await saveScreenshot(page, 'title');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
