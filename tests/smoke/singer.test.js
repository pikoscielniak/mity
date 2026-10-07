const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

test('the Klatt singer loads as an AudioWorklet from disk and sings audibly', async function () {
  const { browser, page, errors } = await openGame();
  try {
    const stats = await page.evaluate(async function () {
      const sampleRate = 22050;
      const song = LM.data.songs.theseus;
      const plan = LM.voiceAutomation.planSong(song, 0.1);
      const context = new OfflineAudioContext(1, Math.ceil(sampleRate * (plan.endTime + 1)), sampleRate);
      const isWorkletReady = await LM.klattVoice.prepare(context);
      const muted = context.createGain();
      muted.gain.value = 0;
      muted.connect(context.destination);
      LM.songPlayer.scheduleSong(context, context.destination, muted, song, 0.1);
      const samples = (await context.startRendering()).getChannelData(0);
      let sumOfSquares = 0;
      let peak = 0;
      let hasNaN = false;
      for (let index = 0; index < samples.length; index += 1) {
        hasNaN = hasNaN || Number.isNaN(samples[index]);
        sumOfSquares += samples[index] * samples[index];
        peak = Math.max(peak, Math.abs(samples[index]));
      }
      return { isWorkletReady: isWorkletReady, rms: Math.sqrt(sumOfSquares / samples.length), peak: peak, hasNaN: hasNaN };
    });
    assert.equal(stats.isWorkletReady, true);
    assert.equal(stats.hasNaN, false);
    assert.ok(stats.rms > 0.03, 'voice is audible, rms=' + stats.rms);
    assert.ok(stats.peak <= 1, 'voice does not clip, peak=' + stats.peak);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('the karaoke demo starts singing on Enter', async function () {
  const { browser, page, errors } = await openGame({ query: '?scene=singdemo' });
  try {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4500);
    await saveScreenshot(page, 'singdemo');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
