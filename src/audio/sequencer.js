// Plays music themes: { id, bpm, loop, tracks: [{ instrument, notes, velocity?, octaveShift? }] }.
(function (LM) {
  'use strict';

  const LOOP_SCHEDULE_AHEAD_SECONDS = 1.5;
  const LOOP_CHECK_MS = 250;

  function secondsPerBeat(theme) {
    return 60 / theme.bpm;
  }

  function themeLengthBeats(theme) {
    return Math.max.apply(null, theme.tracks.map(function (track) {
      return LM.notes.totalBeats(LM.notes.parseNoteString(track.notes));
    }));
  }

  function scheduleTrack(context, destination, track, startTime, beatSeconds) {
    const playNote = LM.instruments[track.instrument];
    const velocity = track.velocity || 0.8;
    let beat = 0;
    LM.notes.parseNoteString(track.notes).forEach(function (note) {
      if (note.midi !== null) {
        const frequency = LM.notes.midiToFrequency(note.midi);
        playNote(context, destination, frequency, startTime + beat * beatSeconds, note.beats * beatSeconds, velocity);
      }
      beat += note.beats;
    });
  }

  // Schedules one pass of the whole theme; returns when it ends. Also used for offline rendering in tests.
  function scheduleThemeOnce(context, destination, theme, startTime) {
    const beatSeconds = secondsPerBeat(theme);
    theme.tracks.forEach(function (track) {
      scheduleTrack(context, destination, track, startTime, beatSeconds);
    });
    return startTime + themeLengthBeats(theme) * beatSeconds;
  }

  function createMusicPlayer(hub) {
    let current = null;

    function scheduleNextPassIfDue(playing) {
      const context = hub.context();
      if (context.currentTime > playing.nextPassTime - LOOP_SCHEDULE_AHEAD_SECONDS) {
        playing.nextPassTime = scheduleThemeOnce(context, playing.gain, playing.theme, playing.nextPassTime);
      }
    }

    function stop(fadeSeconds) {
      if (!current) {
        return;
      }
      const playing = current;
      current = null;
      window.clearInterval(playing.timer);
      const context = hub.context();
      playing.gain.gain.setTargetAtTime(0, context.currentTime, Math.max(fadeSeconds, 0.01) / 3);
      window.setTimeout(function () { playing.gain.disconnect(); }, fadeSeconds * 1000 + 300);
    }

    function play(theme) {
      if (!hub.isReady() || (current && current.theme === theme)) {
        return;
      }
      stop(0.4);
      const context = hub.context();
      const gain = context.createGain();
      gain.connect(hub.bus('music'));
      const playing = { theme: theme, gain: gain, timer: null, nextPassTime: context.currentTime + 0.1 };
      playing.nextPassTime = scheduleThemeOnce(context, gain, theme, playing.nextPassTime);
      if (theme.loop) {
        playing.timer = window.setInterval(function () { scheduleNextPassIfDue(playing); }, LOOP_CHECK_MS);
      }
      current = playing;
    }

    return {
      play,
      stop,
      currentThemeId: function () { return current ? current.theme.id : null; },
    };
  }

  LM.music = { scheduleThemeOnce, themeLengthBeats, createMusicPlayer };
}(window.LM = window.LM || {}));
