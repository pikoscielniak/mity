const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame } = require('./browser');

test('the title theme renders offline to non-silent, finite audio', async function () {
  const { browser, page, errors } = await openGame();
  try {
    const stats = await page.evaluate(async function () {
      const sampleRate = 22050;
      const context = new OfflineAudioContext(1, sampleRate * 6, sampleRate);
      LM.music.scheduleThemeOnce(context, context.destination, LM.data.themes.title, 0);
      const samples = (await context.startRendering()).getChannelData(0);
      let sumOfSquares = 0;
      let peak = 0;
      let hasNaN = false;
      for (let index = 0; index < samples.length; index += 1) {
        hasNaN = hasNaN || Number.isNaN(samples[index]);
        sumOfSquares += samples[index] * samples[index];
        peak = Math.max(peak, Math.abs(samples[index]));
      }
      return { rms: Math.sqrt(sumOfSquares / samples.length), peak: peak, hasNaN: hasNaN };
    });
    assert.equal(stats.hasNaN, false);
    assert.ok(stats.rms > 0.02, 'music is audible, rms=' + stats.rms);
    assert.ok(stats.peak < 1.0, 'music does not clip, peak=' + stats.peak);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('pressing Enter on the title screen starts the music', async function () {
  const { browser, page, errors } = await openGame();
  try {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const themeId = await page.evaluate(function () { return LM.game.music.currentThemeId(); });
    assert.equal(themeId, 'title');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
