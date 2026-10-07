const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load-game');

const LM = loadGame();
const OPTIONS = { cellColumns: 10, cellRows: 6, doorCount: 5, minPathLength: 20 };

function countReachable(maze) {
  const seen = new Set([maze.entrance.x + ',' + maze.entrance.y]);
  const queue = [maze.entrance];
  while (queue.length > 0) {
    LM.maze.neighbours(maze, queue.shift()).forEach(function (tile) {
      const key = tile.x + ',' + tile.y;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push(tile);
      }
    });
  }
  return seen.size;
}

function countFloor(maze) {
  return maze.tiles.reduce(function (sum, row) { return sum + row.filter(function (tile) { return tile === LM.maze.FLOOR; }).length; }, 0);
}

test('every floor tile of the labyrinth is reachable from the entrance', function () {
  [1, 2, 3, 42, 999].forEach(function (seed) {
    const maze = LM.maze.generateLabyrinth(LM.random.createRng(seed), OPTIONS);
    assert.equal(countReachable(maze), countFloor(maze), 'seed ' + seed);
  });
});

test('the way to the chamber is long enough and all doors lie on it, on corridor tiles, in order', function () {
  [1, 2, 3, 42, 999].forEach(function (seed) {
    const maze = LM.maze.generateLabyrinth(LM.random.createRng(seed), OPTIONS);
    assert.ok(maze.path.length >= OPTIONS.minPathLength, 'seed ' + seed + ' path ' + maze.path.length);
    assert.ok(LM.maze.sameTile(maze.path[0], maze.entrance));
    assert.ok(LM.maze.sameTile(maze.path[maze.path.length - 1], maze.goal));
    assert.equal(maze.doors.length, 5);
    let lastIndex = -1;
    maze.doors.forEach(function (door) {
      const index = maze.path.findIndex(function (tile) { return LM.maze.sameTile(tile, door); });
      assert.ok(index > lastIndex, 'doors follow the way in order');
      assert.ok(door.x % 2 === 0 || door.y % 2 === 0, 'door is a corridor tile');
      assert.ok(!LM.maze.sameTile(door, maze.goal) && !LM.maze.sameTile(door, maze.entrance));
      lastIndex = index;
    });
  });
});

test('the same seed builds the same labyrinth', function () {
  const first = LM.maze.generateLabyrinth(LM.random.createRng(7), OPTIONS);
  const second = LM.maze.generateLabyrinth(LM.random.createRng(7), OPTIONS);
  assert.equal(JSON.stringify(first.tiles), JSON.stringify(second.tiles));
});

test('the Minotaur never steps into blocked tiles and only moves to neighbours', function () {
  const maze = LM.maze.generateLabyrinth(LM.random.createRng(5), OPTIONS);
  const rng = LM.random.createRng(11);
  const blocked = new Set(maze.doors.map(LM.maze.tileKey).concat([LM.maze.tileKey(maze.entrance)]));
  let previous = null;
  let current = LM.minotaurBrain.pickDistantRoom(maze, maze.entrance, rng);
  for (let step = 0; step < 500; step += 1) {
    const next = LM.minotaurBrain.chooseNextTile(maze, current, previous, blocked, rng);
    assert.ok(!blocked.has(LM.maze.tileKey(next)));
    assert.ok(Math.abs(next.x - current.x) + Math.abs(next.y - current.y) <= 1);
    previous = current;
    current = next;
  }
});
