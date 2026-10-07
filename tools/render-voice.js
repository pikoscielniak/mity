// Developer tool: renders only the robot voice of a ballad with the Klatt core, directly in Node (no browser).
// Usage: node tools/render-voice.js <songId> [sampleRate]  → test-results/<songId>-klatt.wav
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, loadGame } = require('../tests/helpers/load-game');

function wavFile(sampleRate, samples) {
  const pcm = Buffer.alloc(samples.length * 2);
  samples.forEach(function (sample, index) {
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), index * 2);
  });
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

function renderVoice(LM, song, sampleRate) {
  const plan = LM.voiceAutomation.planSong(song, 0.2);
  const samples = new Float32Array(Math.ceil((plan.endTime + 1) * sampleRate));
  LM.klattCore.createKlattSynth(sampleRate, plan.events).render(samples, 0);
  return samples;
}

function main() {
  const LM = loadGame();
  const songId = process.argv[2] || 'theseus';
  const sampleRate = Number(process.argv[3] || 16000);
  const samples = renderVoice(LM, LM.data.songs[songId], sampleRate);
  let peak = 0;
  let sumOfSquares = 0;
  samples.forEach(function (sample) {
    peak = Math.max(peak, Math.abs(sample));
    sumOfSquares += sample * sample;
  });
  const outputPath = path.join(ROOT, 'test-results', songId + '-klatt.wav');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, wavFile(sampleRate, Array.from(samples)));
  console.log(outputPath, 'peak', peak.toFixed(3), 'rms', Math.sqrt(sumOfSquares / samples.length).toFixed(3));
}

main();
