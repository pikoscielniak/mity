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

  function swap(items, first, second) {
    const temporary = items[first];
    items[first] = items[second];
    items[second] = temporary;
  }

  function shuffle(items, rng) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      swap(shuffled, index, Math.floor(rng() * (index + 1)));
    }
    return shuffled;
  }

  // A shuffle that is not already in the right order, so an ordering puzzle never starts solved.
  function shuffledOutOfOrder(itemsInOrder, rng) {
    let shuffled = itemsInOrder.slice();
    for (let tries = 0; tries < 10; tries += 1) {
      shuffled = shuffle(itemsInOrder, rng);
      if (shuffled.some(function (item, index) { return item !== itemsInOrder[index]; })) {
        break;
      }
    }
    return shuffled;
  }

  function pickSome(items, count, rng) {
    return shuffle(items, rng).slice(0, count);
  }

  LM.random = { createRng, randomSeed, swap, shuffle, shuffledOutOfOrder, pickSome };
}(window.LM = window.LM || {}));
