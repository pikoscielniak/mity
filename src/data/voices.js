// Who speaks with which system voice. Windows ships the Polish voices "Paulina" and "Adam";
// pitch and rate give each character their own colour. label is shown above the story text.
(function (LM) {
  'use strict';

  function voice(voiceName, pitch, rate, label) {
    return { voiceName: voiceName, pitch: pitch, rate: rate, label: label };
  }

  LM.data.voices = {
    narrator: voice('Paulina', 1, 1, null),
    theseus: voice('Adam', 1.15, 1.02, 'Tezeusz'),
    aegeus: voice('Adam', 0.75, 0.9, 'Król Egeusz'),
    ariadne: voice('Paulina', 1.3, 1, 'Ariadna'),
    minos: voice('Adam', 0.8, 0.95, 'Król Minos'),
    daedalus: voice('Adam', 0.85, 0.95, 'Dedal'),
    icarus: voice('Adam', 1.3, 1.08, 'Ikar'),
    orpheus: voice('Adam', 1.05, 0.98, 'Orfeusz'),
    eurydice: voice('Paulina', 1.25, 1, 'Eurydyka'),
    hades: voice('Adam', 0.6, 0.88, 'Hades'),
    charon: voice('Adam', 0.65, 0.85, 'Charon'),
    hermes: voice('Adam', 1.25, 1.1, 'Hermes'),
    pythia: voice('Paulina', 0.85, 0.92, 'Pytia'),
  };
}(window.LM = window.LM || {}));
