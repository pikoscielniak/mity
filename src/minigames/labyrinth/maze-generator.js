// A perfect maze (exactly one way between any two places) on a tile grid: rooms on odd coordinates, walls between.
// The entrance is on the left edge, the Minotaur's chamber near the centre; sealed doors sit on the only way there.
(function (LM) {
  'use strict';

  const WALL = 1;
  const FLOOR = 0;
  const STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function createWallGrid(width, height) {
    return Array.from({ length: height }, function () { return new Array(width).fill(WALL); });
  }

  function tileKey(tile) {
    return tile.x + ',' + tile.y;
  }

  function sameTile(first, second) {
    return first.x === second.x && first.y === second.y;
  }

  // Iterative recursive-backtracker: walk to a random unvisited neighbour room, knocking down the wall between.
  function carveRooms(tiles, cellColumns, cellRows, startCell, rng) {
    const visited = new Set([tileKey(startCell)]);
    const stack = [startCell];
    tiles[startCell.y * 2 + 1][startCell.x * 2 + 1] = FLOOR;
    while (stack.length > 0) {
      const cell = stack[stack.length - 1];
      const options = LM.random.shuffle(STEPS, rng).map(function (step) { return { x: cell.x + step[0], y: cell.y + step[1] }; })
        .filter(function (next) { return next.x >= 0 && next.y >= 0 && next.x < cellColumns && next.y < cellRows && !visited.has(tileKey(next)); });
      if (options.length === 0) {
        stack.pop();
        continue;
      }
      const next = options[0];
      visited.add(tileKey(next));
      tiles[next.y * 2 + 1][next.x * 2 + 1] = FLOOR;
      tiles[cell.y + next.y + 1][cell.x + next.x + 1] = FLOOR;
      stack.push(next);
    }
  }

  function isWalkable(maze, tile) {
    return tile.x >= 0 && tile.y >= 0 && tile.x < maze.width && tile.y < maze.height && maze.tiles[tile.y][tile.x] === FLOOR;
  }

  function neighbours(maze, tile) {
    return STEPS.map(function (step) { return { x: tile.x + step[0], y: tile.y + step[1] }; })
      .filter(function (next) { return isWalkable(maze, next); });
  }

  // Breadth-first search; returns the tiles from start to goal inclusive.
  function findPath(maze, start, goal) {
    const cameFrom = new Map([[tileKey(start), null]]);
    const queue = [start];
    while (queue.length > 0) {
      const tile = queue.shift();
      if (sameTile(tile, goal)) {
        break;
      }
      neighbours(maze, tile).forEach(function (next) {
        const key = tileKey(next);
        if (!cameFrom.has(key)) {
          cameFrom.set(key, tile);
          queue.push(next);
        }
      });
    }
    const path = [];
    for (let tile = goal; tile; tile = cameFrom.get(tileKey(tile))) {
      path.unshift(tile);
    }
    return path;
  }

  // Doors go on corridor tiles (between two rooms), spread evenly along the way to the chamber.
  function placeDoors(path, doorCount) {
    const doors = [];
    for (let door = 1; door <= doorCount; door += 1) {
      let index = Math.round(door * (path.length - 1) / (doorCount + 1));
      if (path[index].x % 2 === 1 && path[index].y % 2 === 1) {
        index += 1;
      }
      doors.push(path[index]);
    }
    return doors;
  }

  function buildMaze(cellColumns, cellRows, rng) {
    const width = cellColumns * 2 + 1;
    const height = cellRows * 2 + 1;
    const entranceRow = Math.floor(cellRows / 2);
    const tiles = createWallGrid(width, height);
    carveRooms(tiles, cellColumns, cellRows, { x: 0, y: entranceRow }, rng);
    const entrance = { x: 0, y: entranceRow * 2 + 1 };
    tiles[entrance.y][entrance.x] = FLOOR;
    const goal = { x: Math.floor(cellColumns / 2) * 2 + 1, y: entranceRow * 2 + 1 };
    const maze = { width: width, height: height, tiles: tiles, entrance: entrance, goal: goal };
    maze.path = findPath(maze, entrance, goal);
    return maze;
  }

  // options: { cellColumns, cellRows, doorCount, minPathLength }. Re-rolls until the way is long enough for all doors.
  function generateLabyrinth(rng, options) {
    let maze = buildMaze(options.cellColumns, options.cellRows, rng);
    for (let attempt = 0; attempt < 50 && maze.path.length < options.minPathLength; attempt += 1) {
      maze = buildMaze(options.cellColumns, options.cellRows, rng);
    }
    maze.doors = placeDoors(maze.path, options.doorCount);
    return maze;
  }

  LM.maze = { WALL, FLOOR, tileKey, generateLabyrinth, findPath, neighbours, isWalkable, sameTile };
}(window.LM = window.LM || {}));
