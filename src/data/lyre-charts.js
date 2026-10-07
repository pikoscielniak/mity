// Orpheus's songs for the three guardians of the underworld. Lanes 0-3 are the arrow keys ← ↓ ↑ →,
// beats are slow and evenly spaced (no fast runs). Each lane sounds one string of the lute.
(function (LM) {
  'use strict';

  LM.data.lyreStrings = ['D4', 'F4', 'A4', 'D5'];

  LM.data.lyreCharts = [
    {
      guardian: 'charon',
      title: 'Pieśń dla Charona',
      bpm: 66,
      notes: [[0, 0], [1, 1], [2, 2], [3, 3], [2, 5], [1, 6], [0, 7], [1, 8]],
    },
    {
      guardian: 'cerberus',
      title: 'Kołysanka dla Cerbera',
      bpm: 62,
      notes: [[2, 0], [1, 1], [2, 2], [1, 3], [0, 5], [1, 6], [2, 7], [0, 9]],
    },
    {
      guardian: 'hades',
      title: 'Skarga przed tronem Hadesa',
      bpm: 60,
      notes: [[3, 0], [2, 1], [1, 2], [0, 3], [1, 5], [2, 6], [3, 7], [2, 8], [0, 10]],
    },
  ];
}(window.LM = window.LM || {}));
