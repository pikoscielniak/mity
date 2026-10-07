// Stage 1 of mission 1: find the way through the dark labyrinth to the Minotaur's chamber.
// Sealed doors open with a right answer; the roaming Minotaur costs a heart when it touches Theseus.
(function (LM) {
  'use strict';

  const W = LM.tileWalker;
  const MAZE_OPTIONS = { cellColumns: 10, cellRows: 6, doorCount: 5, minPathLength: 22 };
  const HERO_SPEED = 5.5;
  const MINOTAUR_SPEED = 1.9;
  const TOUCH_DISTANCE = 0.7;
  const SAFE_SECONDS_AFTER_TOUCH = 1.8;
  const LIGHT_RADIUS = 175;
  const FOOTSTEP_HEARING_TILES = 6;

  function sharedLabyrinth(runner) {
    if (!runner.shared.labyrinth) {
      runner.shared.labyrinth = LM.maze.generateLabyrinth(runner.rng, MAZE_OPTIONS);
    }
    return runner.shared.labyrinth;
  }

  function distance(first, second) {
    return Math.hypot(first.x - second.x, first.y - second.y);
  }

  function createLabyrinthStage(context) {
    const game = context.game;
    const maze = sharedLabyrinth(context.runner);
    const layout = LM.labyrinthRender.layoutFor(maze);
    const sealedDoors = new Set(maze.doors.map(LM.minotaurBrain.tileKey));
    const hero = W.createWalker(maze.entrance, HERO_SPEED);
    const minotaur = W.createWalker(LM.minotaurBrain.pickDistantRoom(maze, maze.entrance, context.rng), MINOTAUR_SPEED);
    const readDirection = W.createDirectionReader();
    let thread = [maze.entrance];
    let checkpoint = { tile: maze.entrance, thread: thread.slice() };
    let minotaurPrevious = null;
    let safeSeconds = 0;
    let isQuestionOpen = false;
    let elapsed = 0;

    function blockedForMinotaur() {
      return new Set(Array.from(sealedDoors).concat([LM.minotaurBrain.tileKey(maze.entrance)]));
    }

    function windThread(target) {
      const previous = thread[thread.length - 2];
      if (previous && LM.maze.sameTile(previous, target)) {
        thread.pop();
      } else {
        thread.push(target);
      }
    }

    function openDoor(doorKey) {
      isQuestionOpen = false;
      sealedDoors.delete(doorKey);
      game.sfx('door');
      checkpoint = { tile: hero.tile, thread: thread.slice() };
    }

    function askDoorQuestion(doorKey) {
      isQuestionOpen = true;
      const doorNumber = maze.doors.length - sealedDoors.size + 1;
      context.askQuestion('door', { header: 'Pieczęć Minosa ' + doorNumber + '/' + maze.doors.length }, function () { openDoor(doorKey); });
    }

    function reachChamber() {
      context.runner.shared.thread = thread.slice();
      context.completeStage();
    }

    function tryStep(direction) {
      const target = W.neighbourInDirection(hero.tile, direction);
      const targetKey = LM.minotaurBrain.tileKey(target);
      if (sealedDoors.has(targetKey)) {
        askDoorQuestion(targetKey);
      } else if (LM.maze.isWalkable(maze, target)) {
        W.startStep(hero, target);
        windThread(target);
      }
    }

    function moveMinotaur(dt) {
      W.advance(minotaur, dt);
      if (W.isMoving(minotaur)) {
        return;
      }
      const next = LM.minotaurBrain.chooseNextTile(maze, minotaur.tile, minotaurPrevious, blockedForMinotaur(), context.rng);
      minotaurPrevious = minotaur.tile;
      W.startStep(minotaur, next);
      if (distance(minotaur.tile, hero.tile) < FOOTSTEP_HEARING_TILES) {
        game.sfx('minotaurStep');
      }
    }

    function sendMinotaurAway() {
      W.placeAt(minotaur, LM.minotaurBrain.pickDistantRoom(maze, hero.tile, context.rng));
      minotaurPrevious = null;
    }

    function checkTouch() {
      if (safeSeconds > 0 || distance(W.position(hero), W.position(minotaur)) > TOUCH_DISTANCE) {
        return;
      }
      LM.missionRun.addToStat(context.run, 'minotaurTouches', 1);
      context.loseHeart();
      sendMinotaurAway();
      safeSeconds = SAFE_SECONDS_AFTER_TOUCH;
    }

    function update(dt, input) {
      elapsed += dt;
      safeSeconds = Math.max(0, safeSeconds - dt);
      W.advance(hero, dt);
      if (!W.isMoving(hero) && LM.maze.sameTile(hero.tile, maze.goal)) {
        reachChamber();
        return;
      }
      const direction = readDirection(input);
      if (!W.isMoving(hero) && direction && !isQuestionOpen) {
        tryStep(direction);
      }
      moveMinotaur(dt);
      checkTouch();
    }

    function render(ctx) {
      const R = LM.labyrinthRender;
      R.drawMaze(ctx, maze, layout);
      R.drawBullEmblem(ctx, layout, maze.goal, elapsed);
      const heroPoint = R.tileCenter(layout, W.position(hero));
      const minotaurPoint = R.tileCenter(layout, W.position(minotaur));
      R.drawMinotaurFromAbove(ctx, minotaurPoint, minotaur.facing);
      R.drawHeroFromAbove(ctx, heroPoint, hero.facing, safeSeconds > 0 && Math.floor(elapsed * 10) % 2 === 0);
      R.drawDarkness(ctx, heroPoint, LIGHT_RADIUS + Math.sin(elapsed * 9) * 4);
      R.drawThread(ctx, layout, thread.slice(0, -1), heroPoint);
      sealedDoors.forEach(function (key) {
        const parts = key.split(',');
        R.drawSealedDoor(ctx, layout, { x: Number(parts[0]), y: Number(parts[1]) }, elapsed);
      });
      R.drawGlowingEyes(ctx, minotaurPoint, elapsed);
    }

    function restoreCheckpoint() {
      W.placeAt(hero, checkpoint.tile);
      thread = checkpoint.thread.slice();
      sendMinotaurAway();
      safeSeconds = SAFE_SECONDS_AFTER_TOUCH;
    }

    // Developer shortcut: walk straight to the next sealed door (or the chamber).
    function debugAdvance() {
      const nextDoorIndex = maze.path.findIndex(function (tile) { return sealedDoors.has(LM.minotaurBrain.tileKey(tile)); });
      if (nextDoorIndex < 0) {
        thread = maze.path.slice();
        W.placeAt(hero, maze.goal);
        return;
      }
      W.placeAt(hero, maze.path[nextDoorIndex - 1]);
      thread = maze.path.slice(0, nextDoorIndex);
      tryStep(LM.tileWalker.directionTowards(hero.tile, maze.path[nextDoorIndex]));
    }

    return {
      update: update,
      render: render,
      hud: function () {
        return { title: 'Labirynt Minotaura', rightText: 'Pieczęcie: ' + (maze.doors.length - sealedDoors.size) + '/' + maze.doors.length };
      },
      keyHints: function () { return [{ keys: ['←', '↑', '↓', '→'], label: 'idź (nić rozwija się za tobą)' }]; },
      restoreCheckpoint: restoreCheckpoint,
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.labyrinth = createLabyrinthStage;
}(window.LM = window.LM || {}));
