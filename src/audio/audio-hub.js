// Owns the AudioContext and the mixing buses: music (ducked under narration), sfx and voice.
(function (LM) {
  'use strict';

  const DUCKED_MUSIC_LEVEL = 0.35;

  function createAudioHub() {
    const volumes = { music: 0.55, sfx: 0.8, voice: 1 };
    const buses = {};
    let context = null;
    let master = null;
    let musicDuck = null;
    let isMuted = false;

    function createBus(name, destination) {
      const bus = context.createGain();
      bus.gain.value = volumes[name];
      bus.connect(destination);
      buses[name] = bus;
    }

    function buildGraph() {
      master = context.createGain();
      master.gain.value = isMuted ? 0 : 1;
      master.connect(context.destination);
      musicDuck = context.createGain();
      musicDuck.connect(master);
      createBus('music', musicDuck);
      createBus('sfx', master);
      createBus('voice', master);
    }

    function suspendWhenHidden() {
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          context.suspend();
        } else {
          context.resume();
        }
      });
    }

    // Browsers only allow audio after a user gesture, so this runs on the first key press or click.
    function unlock() {
      if (context) {
        context.resume();
        return;
      }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      context = new AudioContextClass();
      buildGraph();
      suspendWhenHidden();
    }

    function setVolume(busName, value) {
      volumes[busName] = value;
      if (buses[busName]) {
        buses[busName].gain.setTargetAtTime(value, context.currentTime, 0.05);
      }
    }

    function setMuted(shouldMute) {
      isMuted = shouldMute;
      if (master) {
        master.gain.setTargetAtTime(shouldMute ? 0 : 1, context.currentTime, 0.05);
      }
    }

    function duckMusic() {
      if (musicDuck) {
        musicDuck.gain.setTargetAtTime(DUCKED_MUSIC_LEVEL, context.currentTime, 0.15);
      }
    }

    function restoreMusic() {
      if (musicDuck) {
        musicDuck.gain.setTargetAtTime(1, context.currentTime, 0.3);
      }
    }

    return {
      unlock,
      setVolume,
      setMuted,
      duckMusic,
      restoreMusic,
      context: function () { return context; },
      bus: function (name) { return buses[name]; },
      isReady: function () { return context !== null; },
      isMuted: function () { return isMuted; },
      volume: function (name) { return volumes[name]; },
    };
  }

  LM.audioHub = { createAudioHub };
}(window.LM = window.LM || {}));
