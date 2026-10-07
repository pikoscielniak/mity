// Developer tool: renders a ballad offline (headless Edge) to test-results/<songId>[-voice].wav.
// Usage: node tools/render-song.js <songId> [--voice-only]
const fs = require('node:fs');
const path = require('node:path');
const { openGame } = require('../tests/smoke/browser');
const { ROOT } = require('../tests/helpers/load-game');

async function renderSong(page, songId, isVoiceOnly) {
  return page.evaluate(async function (options) {
    const sampleRate = 16000;
    const song = LM.data.songs[options.songId];
    const plan = LM.voiceAutomation.planSong(song, 0.2);
    const seconds = plan.endTime + 3;
    const context = new OfflineAudioContext(1, Math.ceil(sampleRate * seconds), sampleRate);
    const music = context.createGain();
    music.gain.value = options.isVoiceOnly ? 0 : 0.55;
    music.connect(context.destination);
    await LM.klattVoice.prepare(context);
    LM.songPlayer.scheduleSong(context, context.destination, music, song, 0.2);
    const samples = (await context.startRendering()).getChannelData(0);
    const pcm = new Int16Array(samples.length);
    for (let index = 0; index < samples.length; index += 1) {
      pcm[index] = Math.max(-1, Math.min(1, samples[index])) * 32767;
    }
    let binary = '';
    const bytes = new Uint8Array(pcm.buffer);
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }
    return { sampleRate: sampleRate, pcmBase64: btoa(binary) };
  }, { songId: songId, isVoiceOnly: isVoiceOnly });
}

function wavFile(sampleRate, pcm) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function main() {
  const songId = process.argv[2] || 'theseus';
  const isVoiceOnly = process.argv.includes('--voice-only');
  const { browser, page } = await openGame();
  try {
    const rendered = await renderSong(page, songId, isVoiceOnly);
    const outputDir = path.join(ROOT, 'test-results');
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, songId + (isVoiceOnly ? '-voice' : '') + '.wav');
    fs.writeFileSync(outputPath, wavFile(rendered.sampleRate, Buffer.from(rendered.pcmBase64, 'base64')));
    console.log(outputPath);
  } finally {
    await browser.close();
  }
}

main();
