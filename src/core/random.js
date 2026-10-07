// Seedable random numbers (mulberry32), so a debug run with ?seed= replays the same question draw.
(function (LM) {
  'use strict';

  function createRng(seed) {
    let state = seed >>> 0;
    return function next() {
      state = (state + 0x6D2B79F5) | 0;
      let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
      mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomSeed() {
    return Math.floor(Math.random() * 4294967296);
  }

  function shuffle(items, rng) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      const temporary = shuffled[index];
      shuffled[index] = shuffled[swapIndex];
      shuffled[swapIndex] = temporary;
    }
    return shuffled;
  }

  function pickSome(items, count, rng) {
    return shuffle(items, rng).slice(0, count);
  }

  function randomBetween(min, max, rng) {
    return min + (max - min) * rng();
  }

  LM.random = { createRng, randomSeed, shuffle, pickSome, randomBetween };
}(window.LM = window.LM || {}));
