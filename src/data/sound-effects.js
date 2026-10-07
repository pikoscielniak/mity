// Short jingles in the same notation as the music themes.
(function (LM) {
  'use strict';

  function effect(bpm, tracks) {
    return { bpm: bpm, loop: false, tracks: tracks };
  }

  LM.data.soundEffects = {
    move: effect(300, [{ instrument: 'marimba', notes: 'E6/16', velocity: 0.5 }]),
    choose: effect(300, [{ instrument: 'marimba', notes: 'C6/16 G6/16', velocity: 0.7 }]),
    back: effect(300, [{ instrument: 'marimba', notes: 'G5/16 C5/16', velocity: 0.6 }]),
    page: effect(320, [{ instrument: 'marimba', notes: 'C6/32 E6/32', velocity: 0.4 }]),
    typeTick: effect(300, [{ instrument: 'hat', notes: 'C6/32', velocity: 0.25 }]),
    correct: effect(280, [
      { instrument: 'bell', notes: 'C6/16 E6/16 G6/16 C7/8' },
      { instrument: 'marimba', notes: 'r/16 r/16 r/16 G5/8', velocity: 0.6 },
    ]),
    wrong: effect(200, [
      { instrument: 'pulseLead', notes: 'E4/8 C4/4' },
      { instrument: 'bass', notes: 'E2/8 C2/4' },
    ]),
    heartLost: effect(240, [
      { instrument: 'pulseLead', notes: 'A4/16 F4/16 D4/8' },
      { instrument: 'snare', notes: 'C4/8', velocity: 0.6 },
    ]),
    pickup: effect(200, [{ instrument: 'bell', notes: 'E6/32 B6/32 E7/16', velocity: 0.7 }]),
    door: effect(180, [
      { instrument: 'snare', notes: 'C4/16 C4/16 C4/16 C4/16 C4/8', velocity: 0.5 },
      { instrument: 'kick', notes: 'C2/4', velocity: 0.8 },
    ]),
    strike: effect(240, [
      { instrument: 'hat', notes: 'C6/32 C6/32', velocity: 1 },
      { instrument: 'kick', notes: 'C2/8', velocity: 1 },
      { instrument: 'snare', notes: 'C4/8', velocity: 0.7 },
    ]),
    splash: effect(160, [{ instrument: 'snare', notes: 'C4/8 C4/16', velocity: 0.6 }]),
    achievement: effect(260, [
      { instrument: 'bell', notes: 'G5/16 C6/16 E6/16 G6/16 E6/16 G6/4' },
      { instrument: 'marimba', notes: 'C5/8 r/8 C5/8 E5/4', velocity: 0.6 },
    ]),
    missionComplete: effect(200, [
      { instrument: 'pulseLead', notes: 'C5/8 C5/8 C5/8 C5/4. A#4/4 D5/4 C5/8 D5/8 F5/2' },
      { instrument: 'bass', notes: 'C3/4 G2/4 C3/4 A#2/4 F2/4 F3/2' },
      { instrument: 'bell', notes: 'r/1 r/2 r/8 F6/2', velocity: 0.6 },
    ]),
    missionFailed: effect(150, [
      { instrument: 'pulseLead', notes: 'G4/8 F#4/8 F4/8 E4/2' },
      { instrument: 'bass', notes: 'C3/4 B2/4 A#2/2' },
    ]),
  };
}(window.LM = window.LM || {}));
