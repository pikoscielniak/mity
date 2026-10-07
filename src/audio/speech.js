// The narrator: the browser's own speech synthesis with Polish voices. Without voices the game is simply text-only.
(function (LM) {
  'use strict';

  const MAX_CHUNK_LENGTH = 180;

  // Chrome stops long utterances half-way, so text is spoken sentence by sentence (long ones split at commas).
  function splitIntoChunks(text) {
    const chunks = [];
    text.split(/(?<=[.!?…:])\s+/).forEach(function (sentence) {
      if (sentence.length <= MAX_CHUNK_LENGTH) {
        chunks.push(sentence);
        return;
      }
      sentence.split(/(?<=,)\s+/).forEach(function (part) { chunks.push(part); });
    });
    return chunks.filter(function (chunk) { return chunk.trim().length > 0; });
  }

  // Offline voices first: the game must also work without internet.
  function pickVoice(polishVoices, wantedName) {
    const byPreference = polishVoices.slice().sort(function (first, second) {
      return Number(second.localService) - Number(first.localService);
    });
    return byPreference.find(function (voice) { return voice.name.indexOf(wantedName) >= 0; }) || byPreference[0] || null;
  }

  function createSpeech(hub) {
    const synth = window.speechSynthesis || null;
    let polishVoices = [];
    let speaking = [];

    function loadVoices() {
      polishVoices = synth.getVoices().filter(function (voice) { return /^pl/i.test(voice.lang); });
    }

    if (synth) {
      loadVoices();
      synth.addEventListener('voiceschanged', loadVoices);
    }

    function isAvailable() {
      return synth !== null && polishVoices.length > 0;
    }

    function cancel() {
      if (synth) {
        synth.cancel();
      }
      speaking = [];
      hub.restoreMusic();
    }

    function createUtterance(chunk, speaker, isLast) {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'pl-PL';
      utterance.voice = pickVoice(polishVoices, speaker.voiceName);
      utterance.pitch = speaker.pitch;
      utterance.rate = speaker.rate;
      utterance.volume = hub.volume('voice');
      if (isLast) {
        utterance.onend = function () { hub.restoreMusic(); };
      }
      return utterance;
    }

    function speak(text, speakerId) {
      cancel();
      if (!isAvailable()) {
        return;
      }
      const speaker = LM.data.voices[speakerId] || LM.data.voices.narrator;
      const chunks = splitIntoChunks(text);
      hub.duckMusic();
      // Utterances are kept in an array: Chrome garbage-collects them otherwise and never fires onend.
      speaking = chunks.map(function (chunk, index) { return createUtterance(chunk, speaker, index === chunks.length - 1); });
      speaking.forEach(function (utterance) { synth.speak(utterance); });
    }

    return { speak, cancel, isAvailable };
  }

  LM.speech = { createSpeech, splitIntoChunks };
}(window.LM = window.LM || {}));
