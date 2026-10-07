// Smooth step-by-step movement from tile to tile, shared by Theseus and the Minotaur.
(function (LM) {
  'use strict';

  const DIRECTIONS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

  function createWalker(tile, tilesPerSecond) {
    return { tile: tile, from: tile, progress: 1, speed: tilesPerSecond, facing: 0 };
  }

  function isMoving(walker) {
    return walker.progress < 1;
  }

  function startStep(walker, target) {
    walker.from = walker.tile;
    walker.tile = target;
    walker.progress = 0;
    walker.facing = Math.atan2(target.y - walker.from.y, target.x - walker.from.x);
  }

  function advance(walker, dt) {
    walker.progress = Math.min(1, walker.progress + dt * walker.speed);
  }

  function placeAt(walker, tile) {
    walker.tile = tile;
    walker.from = tile;
    walker.progress = 1;
  }

  // Position in tile units, between the previous and the current tile while walking.
  function position(walker) {
    return {
      x: walker.from.x + (walker.tile.x - walker.from.x) * walker.progress,
      y: walker.from.y + (walker.tile.y - walker.from.y) * walker.progress,
    };
  }

  function neighbourInDirection(tile, direction) {
    return { x: tile.x + DIRECTIONS[direction].x, y: tile.y + DIRECTIONS[direction].y };
  }

  // The direction of a neighbouring tile.
  function directionTowards(from, to) {
    return Object.keys(DIRECTIONS).find(function (direction) {
      return from.x + DIRECTIONS[direction].x === to.x && from.y + DIRECTIONS[direction].y === to.y;
    });
  }

  // The arrow pressed most recently wins while several are held, which feels natural at corridor corners.
  function createDirectionReader() {
    let latest = null;
    return function readDirection(input) {
      Object.keys(DIRECTIONS).forEach(function (direction) {
        if (input.wasPressed(direction)) {
          latest = direction;
        }
      });
      if (latest && input.isHeld(latest)) {
        return latest;
      }
      return Object.keys(DIRECTIONS).find(function (direction) { return input.isHeld(direction); }) || null;
    };
  }

  LM.tileWalker = { createWalker, isMoving, startStep, advance, placeAt, position, neighbourInDirection, directionTowards, createDirectionReader };
}(window.LM = window.LM || {}));
