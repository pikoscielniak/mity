const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { ROOT } = require('../helpers/load-game');
const { openGame } = require('./browser');
const { playUntil } = require('./playthrough');

test('the single-file build runs from disk and a whole mission can be played in it', async function () {
  execFileSync(process.execPath, [path.join(ROOT, 'tools', 'build-single-file.js')]);
  const { browser, page, errors } = await openGame({ htmlFile: 'dist/labirynt-mitow.html', query: '?debug=1&seed=11' });
  try {
    const scriptTags = await page.evaluate(function () { return document.querySelectorAll('script[src]').length; });
    assert.equal(scriptTags, 0, 'no external scripts are left');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    await page.evaluate(function () {
      LM.profiles.createProfile(LM.game.save, 'Test', 'boy', 'now');
      LM.game.startMission('theseus');
    });
    await playUntil(page, {
      answerCorrectly: function () { return true; },
      stopWhen: function (state) { return state.scene === 'map'; },
    });
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
