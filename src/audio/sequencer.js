// Plays music themes: { id, bpm, loop, tracks: [{ instrument, notes, velocity? }] }.
(function (LM) {
  'use strict';

  const LOOKAHEAD_SECONDS = 0.6;
  const SCHEDULER_TICK_MS = 100;
  const LATE_NOTE_TOLERANCE_SECONDS = 0.05;
  const DEFAULT_VELOCITY = 0.8;
  const timelineCache = new WeakMap();

  function secondsPerBeat(theme) {
    return 60 / theme.bpm;
  }

  function themeLengthBeats(theme) {
    return Math.max.apply(null, theme.tracks.map(function (track) {
      return LM.notes.totalBeats(LM.notes.parseNoteString(track.notes));
    }));
  }

  function trackNotes(track) {
    const notes = [];
    let beat = 0;
    LM.notes.parseNoteString(track.notes).forEach(function (note) {
      if (note.midi !== null) {
        notes.push({ beat: beat, beats: note.beats, frequency: LM.notes.midiToFrequency(note.midi), instrument: track.instrument, velocity: track.velocity || DEFAULT_VELOCITY });
      }
      beat += note.beats;
    });
    return notes;
  }

  // All notes of all tracks, sorted by when they start (worked out once per theme).
  function themeTimeline(theme) {
    if (!timelineCache.has(theme)) {
      const notes = theme.tracks.reduce(function (all, track) { return all.concat(trackNotes(track)); }, []);
      notes.sort(function (first, second) { return first.beat - second.beat; });
      timelineCache.set(theme, notes);
    }
    return timelineCache.get(theme);
  }

  function playNote(context, destination, note, startTime, beatSeconds) {
    LM.instruments[note.instrument](context, destination, note.frequency, startTime + note.beat * beatSeconds, note.beats * beatSeconds, note.velocity);
  }

  // Schedules one whole pass at once; returns when it ends. Used for jingles, ballads and offline rendering.
  function scheduleThemeOnce(context, destination, theme, startTime) {
    const beatSeconds = secondsPerBeat(theme);
    themeTimeline(theme).forEach(function (note) { playNote(context, destination, note, startTime, beatSeconds); });
    return startTime + themeLengthBeats(theme) * beatSeconds;
  }

  // Background music is scheduled a little ahead at a time, so a long loop never creates hundreds of nodes at once.
  function createMusicPlayer(hub) {
    let current = null;

    // Notes already late (after the page stalled) are skipped; playing them now would sound as one burst.
    function scheduleDueNotes(playing) {
      const now = hub.context().currentTime;
      while (playing.timeline.length > 0) {
        if (playing.cursor >= playing.timeline.length) {
          if (!playing.theme.loop) {
            return;
          }
          playing.passStart += playing.passSeconds;
          playing.cursor = 0;
        }
        const note = playing.timeline[playing.cursor];
        const noteStart = playing.passStart + note.beat * playing.beatSeconds;
        if (noteStart > now + LOOKAHEAD_SECONDS) {
          return;
        }
        if (noteStart >= now - LATE_NOTE_TOLERANCE_SECONDS) {
          playNote(hub.context(), playing.gain, note, playing.passStart, playing.beatSeconds);
        }
        playing.cursor += 1;
      }
    }

    function stop(fadeSeconds) {
      if (!current) {
        return;
      }
      const playing = current;
      current = null;
      window.clearInterval(playing.timer);
      playing.gain.gain.setTargetAtTime(0, hub.context().currentTime, Math.max(fadeSeconds, 0.01) / 3);
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
      const beatSeconds = secondsPerBeat(theme);
      const playing = {
        theme: theme, gain: gain, timeline: themeTimeline(theme), cursor: 0,
        beatSeconds: beatSeconds, passSeconds: themeLengthBeats(theme) * beatSeconds, passStart: context.currentTime + 0.1,
      };
      scheduleDueNotes(playing);
      playing.timer = window.setInterval(function () { scheduleDueNotes(playing); }, SCHEDULER_TICK_MS);
      current = playing;
    }

    return {
      play,
      stop,
      currentThemeId: function () { return current ? current.theme.id : null; },
    };
  }

  LM.music = { scheduleThemeOnce, createMusicPlayer };
}(window.LM = window.LM || {}));
