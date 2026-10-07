// Turns a song (lyrics + melody) into plain parameter events for the formant voice, plus a karaoke timeline.
// Pure data in, pure data out, so it is unit-tested without Web Audio.
(function (LM) {
  'use strict';

  const FORMANT_PARAMS = ['f1', 'f2', 'f3'];
  const BANDWIDTH_PARAMS = ['b1', 'b2', 'b3'];

  function setAt(time, param, value) {
    return { time: time, param: param, value: value, timeConstant: 0 };
  }

  function glideTo(time, param, value, timeConstant) {
    return { time: time, param: param, value: value, timeConstant: timeConstant };
  }

  function formantEvents(time, info, timeConstant) {
    const frequencies = info.formants.map(function (frequency, index) {
      return glideTo(time, FORMANT_PARAMS[index], frequency, timeConstant);
    });
    const bandwidths = info.bandwidths.map(function (bandwidth, index) {
      return glideTo(time, BANDWIDTH_PARAMS[index], bandwidth, timeConstant);
    });
    return frequencies.concat(bandwidths, [glideTo(time, 'nasalZero', info.nasalZero, timeConstant)]);
  }

  function noiseOnEvents(time, noise, level) {
    return [
      setAt(time, 'noiseFrequency', noise.frequency),
      setAt(time, 'noiseQ', noise.q),
      glideTo(time, 'noiseGain', level, 0.006),
    ];
  }

  function sonorantEvents(segment, info) {
    return [
      glideTo(segment.start, 'voicing', info.voicing, 0.015),
      glideTo(segment.start, 'noiseGain', 0, 0.01),
      glideTo(segment.start, 'aspiration', 0, 0.01),
    ].concat(formantEvents(segment.start, info, 0.022));
  }

  // A Polish rolled r: the voice dips quickly two or three times.
  function trillEvents(segment, info) {
    const events = sonorantEvents(segment, info);
    for (let tap = 0; tap < 3; tap += 1) {
      const tapTime = segment.start + segment.duration * (0.15 + tap * 0.28);
      events.push(glideTo(tapTime, 'voicing', 0.12, 0.004));
      events.push(glideTo(tapTime + segment.duration * 0.12, 'voicing', info.voicing, 0.004));
    }
    return events;
  }

  function fricativeEvents(segment, info) {
    return [
      glideTo(segment.start, 'voicing', info.voicing, 0.01),
      glideTo(segment.start, 'aspiration', info.aspiration, 0.01),
    ].concat(formantEvents(segment.start, info, 0.015), noiseOnEvents(segment.start, info.noise, info.noise.level));
  }

  // Closure (silence or a voice bar) with the formants moving to the consonant's locus, then a short burst.
  function plosiveEvents(segment, info) {
    const burstTime = segment.start + segment.duration * 0.7;
    return [
      glideTo(segment.start, 'voicing', info.voicing, 0.006),
      glideTo(segment.start, 'noiseGain', 0, 0.004),
      glideTo(segment.start, 'aspiration', 0, 0.004),
    ].concat(formantEvents(segment.start, info, 0.01), noiseOnEvents(burstTime, info.noise, info.noise.level), [
      glideTo(burstTime, 'aspiration', info.aspiration, 0.003),
      glideTo(burstTime + segment.duration * 0.15, 'noiseGain', 0, 0.008),
    ]);
  }

  function affricateEvents(segment, info) {
    const frictionTime = segment.start + segment.duration * 0.35;
    return [
      glideTo(segment.start, 'voicing', info.voicing, 0.006),
      glideTo(segment.start, 'noiseGain', 0, 0.004),
      glideTo(segment.start, 'aspiration', 0, 0.004),
    ].concat(formantEvents(segment.start, info, 0.01), noiseOnEvents(frictionTime, info.noise, info.noise.level));
  }

  const EVENT_BUILDERS = {
    vowel: sonorantEvents,
    nasal: sonorantEvents,
    liquid: sonorantEvents,
    glide: sonorantEvents,
    trill: trillEvents,
    fricative: fricativeEvents,
    plosive: plosiveEvents,
    affricate: affricateEvents,
  };

  function segmentEvents(segment) {
    const info = LM.phonemeTable.phonemeInfo(segment.symbol);
    return EVENT_BUILDERS[info.kind](segment, info);
  }

  function silenceEvents(time) {
    return [glideTo(time, 'voicing', 0, 0.03), glideTo(time, 'noiseGain', 0, 0.02), glideTo(time, 'aspiration', 0, 0.02)];
  }

  function singableNoteCount(line) {
    return LM.notes.parseNoteString(line.notes).filter(function (note) { return note.midi !== null; }).length;
  }

  // Returns a description of the problem, or null when every sung note has exactly one syllable or "_".
  function lineAlignmentProblem(line) {
    const syllableCount = LM.phonemes.lineToSyllables(line.lyrics).length;
    const noteCount = singableNoteCount(line);
    if (syllableCount === noteCount) {
      return null;
    }
    return '"' + line.lyrics + '": ' + syllableCount + ' syllables for ' + noteCount + ' notes';
  }

  // Walks the melody note by note and pairs every sung note with a syllable (or extends the previous one on "_").
  function placeLine(line, verseIndex, startTime, beatSeconds, syllablePlans) {
    const syllables = LM.phonemes.lineToSyllables(line.lyrics);
    const karaokeLine = { verseIndex: verseIndex, syllables: [] };
    let time = startTime;
    let cursor = 0;
    LM.notes.parseNoteString(line.notes).forEach(function (note) {
      const noteStart = time;
      time += note.beats * beatSeconds;
      if (note.midi === null) {
        return;
      }
      const syllable = syllables[cursor];
      cursor += 1;
      if (syllable.isHold) {
        const held = syllablePlans[syllablePlans.length - 1];
        held.end = time;
        held.pitches.push({ time: noteStart, midi: note.midi });
        karaokeLine.syllables[karaokeLine.syllables.length - 1].end = time;
        return;
      }
      syllablePlans.push({ symbols: syllable.symbols, start: noteStart, end: time, pitches: [{ time: noteStart, midi: note.midi }] });
      karaokeLine.syllables.push({ text: syllable.text, start: noteStart, end: time });
    });
    return { karaokeLine: karaokeLine, endTime: time };
  }

  function syllableEvents(plan, nextPlan) {
    let events = [];
    plan.pitches.forEach(function (pitch) {
      events.push(glideTo(pitch.time, 'pitch', LM.notes.midiToFrequency(pitch.midi), 0.012));
    });
    LM.phonemeTiming.planSyllableSegments(plan.symbols, plan.start, plan.end).forEach(function (segment) {
      events = events.concat(segmentEvents(segment));
    });
    const isFollowedByRest = !nextPlan || nextPlan.start > plan.end + 0.001;
    if (isFollowedByRest) {
      events = events.concat(silenceEvents(plan.end));
    }
    return events;
  }

  // song: { bpm, introBeats, verses: [{ lines: [{ lyrics, notes }] }] }
  function planSong(song, startTime) {
    const beatSeconds = 60 / song.bpm;
    const syllablePlans = [];
    const karaoke = [];
    let time = startTime + (song.introBeats || 0) * beatSeconds;
    song.verses.forEach(function (verse, verseIndex) {
      verse.lines.forEach(function (line) {
        const placed = placeLine(line, verseIndex, time, beatSeconds, syllablePlans);
        karaoke.push(placed.karaokeLine);
        time = placed.endTime;
      });
    });
    let events = silenceEvents(startTime);
    syllablePlans.forEach(function (plan, index) {
      events = events.concat(syllableEvents(plan, syllablePlans[index + 1]));
    });
    events.sort(function (first, second) { return first.time - second.time; });
    return { events: events, karaoke: karaoke, endTime: time };
  }

  LM.voiceAutomation = { planSong, lineAlignmentProblem, segmentEvents };
}(window.LM = window.LM || {}));
