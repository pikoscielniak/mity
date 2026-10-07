const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

test('the styleguide renders every widget without errors', async function () {
  const { browser, page, errors } = await openGame({ query: '?scene=styleguide' });
  try {
    await page.waitForTimeout(400);
    await saveScreenshot(page, 'styleguide');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('the game stays sharp on a high-DPI laptop screen', async function () {
  const { browser, page, errors } = await openGame({ width: 1366, height: 768 });
  try {
    await page.waitForTimeout(400);
    const size = await page.evaluate(function () {
      const canvas = document.getElementById('game');
      return { backing: canvas.width, css: canvas.getBoundingClientRect().width };
    });
    assert.ok(size.css >= 1300, 'canvas fills the window width');
    assert.equal(size.backing, Math.round(size.css * (await page.evaluate('window.devicePixelRatio'))));
    await saveScreenshot(page, 'title-1366');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
