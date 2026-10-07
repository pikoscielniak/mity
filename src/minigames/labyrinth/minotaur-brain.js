// Where the roaming Minotaur steps next: wanders the corridors, never through sealed doors, rarely turns back.
(function (LM) {
  'use strict';

  // blockedKeys: Set of "x,y" the Minotaur may not enter (sealed doors, the entrance).
  function chooseNextTile(maze, current, previous, blockedKeys, rng) {
    const open = LM.maze.neighbours(maze, current).filter(function (tile) { return !blockedKeys.has(LM.maze.tileKey(tile)); });
    if (open.length === 0) {
      return current;
    }
    const forward = open.filter(function (tile) { return !previous || !LM.maze.sameTile(tile, previous); });
    const choices = forward.length > 0 ? forward : open;
    return choices[Math.floor(rng() * choices.length)];
  }

  // A room far from the player, so the Minotaur never appears right next to them.
  function pickDistantRoom(maze, playerTile, rng) {
    const rooms = [];
    for (let y = 1; y < maze.height; y += 2) {
      for (let x = 1; x < maze.width; x += 2) {
        if (Math.abs(x - playerTile.x) + Math.abs(y - playerTile.y) >= 10) {
          rooms.push({ x: x, y: y });
        }
      }
    }
    return rooms.length > 0 ? rooms[Math.floor(rng() * rooms.length)] : { x: maze.width - 2, y: maze.height - 2 };
  }

  LM.minotaurBrain = { chooseNextTile, pickDistantRoom };
}(window.LM = window.LM || {}));
