// Judging the lute game: which falling note a key press belongs to, and how well it was timed.
// Windows are wide on purpose: the game teaches myths, not reflexes.
(function (LM) {
  'use strict';

  const GREAT_SECONDS = 0.2;
  const GOOD_SECONDS = 0.38;

  // notes: [{ lane, time, result }] with result null until judged.
  function judgePress(notes, lane, pressTime) {
    const candidates = notes.filter(function (note) {
      return note.result === null && note.lane === lane && Math.abs(note.time - pressTime) <= GOOD_SECONDS;
    });
    if (candidates.length === 0) {
      return null;
    }
    const closest = candidates.reduce(function (best, note) {
      return Math.abs(note.time - pressTime) < Math.abs(best.time - pressTime) ? note : best;
    });
    closest.result = Math.abs(closest.time - pressTime) <= GREAT_SECONDS ? 'great' : 'good';
    return closest;
  }

  // Notes nobody played in time become misses; returns the newly missed ones.
  function markMissed(notes, now) {
    const missed = notes.filter(function (note) { return note.result === null && now - note.time > GOOD_SECONDS; });
    missed.forEach(function (note) { note.result = 'miss'; });
    return missed;
  }

  function hitShare(notes) {
    const hits = notes.filter(function (note) { return note.result === 'great' || note.result === 'good'; }).length;
    return notes.length === 0 ? 0 : hits / notes.length;
  }

  // chart: { bpm, notes: [[lane, beat], …] } → timed notes starting at startTime.
  function scheduleChart(chart, startTime) {
    const beatSeconds = 60 / chart.bpm;
    return chart.notes.map(function (entry) {
      return { lane: entry[0], time: startTime + entry[1] * beatSeconds, result: null };
    });
  }

  LM.rhythmJudge = { GREAT_SECONDS, GOOD_SECONDS, judgePress, markMissed, hitShare, scheduleChart };
}(window.LM = window.LM || {}));
