// Mini-games driven by real key presses (no debug shortcuts), to prove the controls work.
const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame } = require('./browser');

async function startStage(page, missionId, stageType) {
  await page.keyboard.press('Enter');
  await page.evaluate(function (args) { window.LM_DEBUG.startStage(args[0], args[1], 4); }, [missionId, stageType]);
}

async function holdKey(page, key, milliseconds) {
  await page.keyboard.down(key);
  await page.waitForTimeout(milliseconds);
  await page.keyboard.up(key);
}

test('holding → walks Theseus into the labyrinth', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1' });
  try {
    await startStage(page, 'theseus', 'labyrinth');
    await holdKey(page, 'ArrowRight', 400);
    const tile = await page.evaluate(function () { return LM.game.scenes.currentScene().stage().heroTile(); });
    assert.ok(tile.x >= 1, 'Theseus left the entrance: ' + JSON.stringify(tile));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('holding → climbs towards the exit, and ← costs a heart', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1' });
  try {
    await startStage(page, 'orpheus', 'ascent');
    const stepsLeft = function () {
      return page.evaluate(function () { return Number(LM.game.scenes.currentScene().stage().hud().rightText.replace(/\D/g, '')); });
    };
    const before = await stepsLeft();
    await holdKey(page, 'ArrowRight', 1000);
    assert.ok(await stepsLeft() < before, 'Orpheus walked up the path');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);
    const lookBacks = await page.evaluate(function () { return LM.game.currentMission.run.stats.lookBacks; });
    assert.equal(lookBacks, 1);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('the workshop accepts number keys for materials', async function () {
  const { browser, page, errors } = await openGame({ query: '?debug=1' });
  try {
    await startStage(page, 'icarus', 'workshop');
    await page.waitForTimeout(200);
    for (const key of ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6']) {
      const hasQuestion = await page.evaluate(function () { return window.LM_DEBUG.describe().overlay === 'question'; });
      if (hasQuestion) {
        break;
      }
      await page.keyboard.press(key);
      await page.waitForTimeout(80);
    }
    const state = await page.evaluate(function () { return window.LM_DEBUG.describe(); });
    assert.equal(state.overlay, 'question', 'handing over the feathers or the wax asks a question');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
