// Plays a ballad: the robot voice and the accompaniment start together; the karaoke follows audio time.
(function (LM) {
  'use strict';

  function accompanimentTheme(song) {
    return { bpm: song.bpm, loop: false, tracks: song.accompaniment };
  }

  // The Klatt worklet sounds far clearer; the plain filter voice is the fallback for browsers without worklets.
  function startVoice(context, destination, plan) {
    if (LM.klattVoice.isReady(context)) {
      return LM.klattVoice.startKlattVoice(context, destination, plan);
    }
    const voice = LM.formantVoice.createFormantVoice(context, destination);
    voice.apply(plan.events);
    voice.start(context.currentTime);
    voice.stop(plan.endTime + 0.6);
    return { stop: function () { voice.stop(context.currentTime + 0.05); } };
  }

  // Schedules everything on any AudioContext (live or offline). Returns the karaoke timeline and end time.
  function scheduleSong(context, voiceDestination, musicDestination, song, startTime) {
    const plan = LM.voiceAutomation.planSong(song, startTime);
    const voice = startVoice(context, voiceDestination, plan);
    const accompanimentEnd = LM.music.scheduleThemeOnce(context, musicDestination, accompanimentTheme(song), startTime);
    return { karaoke: plan.karaoke, endTime: Math.max(plan.endTime, accompanimentEnd), voice: voice };
  }

  function playSong(hub, song) {
    const context = hub.context();
    const startTime = context.currentTime + 0.3;
    const voiceGain = context.createGain();
    voiceGain.connect(hub.bus('voice'));
    const musicGain = context.createGain();
    musicGain.connect(hub.bus('music'));
    const scheduled = scheduleSong(context, voiceGain, musicGain, song, startTime);

    function stop() {
      const now = context.currentTime;
      voiceGain.gain.setTargetAtTime(0, now, 0.05);
      musicGain.gain.setTargetAtTime(0, now, 0.1);
      window.setTimeout(function () {
        scheduled.voice.stop();
        voiceGain.disconnect();
        musicGain.disconnect();
      }, 800);
    }

    return {
      karaoke: scheduled.karaoke,
      startTime: startTime,
      endTime: scheduled.endTime,
      currentTime: function () { return context.currentTime; },
      stop: stop,
    };
  }

  LM.songPlayer = { scheduleSong, playSong };
}(window.LM = window.LM || {}));
