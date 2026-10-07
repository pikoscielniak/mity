// Stage 3 of mission 1: back to the entrance along Ariadne's thread before the torch burns out.
// The time is generous; a burnt-out torch costs a heart and is lit again.
(function (LM) {
  'use strict';

  const W = LM.tileWalker;
  const HERO_SPEED = 5.5;
  const SECONDS_PER_TILE_ALLOWED = 0.55;
  const EXTRA_SECONDS = 14;
  const RELIGHT_SHARE = 0.6;
  const MAX_LIGHT = 190;
  const MIN_LIGHT = 95;

  function createEscapeStage(context) {
    const game = context.game;
    const maze = context.runner.shared.labyrinth;
    const thread = context.runner.shared.thread || maze.path;
    const layout = LM.labyrinthRender.layoutFor(maze);
    const hero = W.createWalker(maze.goal, HERO_SPEED);
    const readDirection = W.createDirectionReader();
    const torchSeconds = thread.length * SECONDS_PER_TILE_ALLOWED + EXTRA_SECONDS;
    let torchLeft = torchSeconds;
    let elapsed = 0;

    function burnTorch(dt) {
      torchLeft -= dt;
      if (torchLeft > 0) {
        return;
      }
      LM.missionRun.addToStat(context.run, 'escapeHeartsLost', 1);
      context.loseHeart();
      torchLeft = torchSeconds * RELIGHT_SHARE;
    }

    function update(dt, input) {
      elapsed += dt;
      W.advance(hero, dt);
      if (!W.isMoving(hero) && LM.maze.sameTile(hero.tile, maze.entrance)) {
        game.sfx('door');
        context.completeStage();
        return;
      }
      const direction = readDirection(input);
      if (!W.isMoving(hero) && direction) {
        const target = W.neighbourInDirection(hero.tile, direction);
        if (LM.maze.isWalkable(maze, target)) {
          W.startStep(hero, target);
        }
      }
      burnTorch(dt);
    }

    function lightRadius() {
      return MIN_LIGHT + (MAX_LIGHT - MIN_LIGHT) * Math.max(0, torchLeft / torchSeconds);
    }

    function drawTorchMeter(ctx) {
      const share = Math.max(0, torchLeft / torchSeconds);
      LM.draw.drawOutlinedRoundRect(ctx, { x: 980, y: 70, width: 260, height: 22 }, 8, '#3a2a1a', 2);
      LM.draw.drawBandedGradient(ctx, { x: 983, y: 73, width: 254 * share, height: 16 }, '#fff0a0', '#ff8a20', 3);
      LM.ui.drawShadowText(ctx, 'Pochodnia', 970, 88, 18, LM.palette.white, 'right');
    }

    function render(ctx) {
      const R = LM.labyrinthRender;
      R.drawMaze(ctx, maze, layout);
      const heroPoint = R.tileCenter(layout, W.position(hero));
      R.drawHeroFromAbove(ctx, heroPoint, hero.facing, false);
      R.drawDarkness(ctx, heroPoint, lightRadius() + Math.sin(elapsed * 9) * 4);
      R.drawThread(ctx, layout, thread, null);
      drawTorchMeter(ctx);
    }

    function restoreCheckpoint() {
      W.placeAt(hero, maze.goal);
      torchLeft = torchSeconds;
    }

    function debugAdvance() {
      W.placeAt(hero, maze.entrance);
    }

    return {
      update: update,
      render: render,
      hud: function () { return { title: 'Ucieczka po nici Ariadny', rightText: '' }; },
      keyHints: function () { return [{ keys: ['←', '↑', '↓', '→'], label: 'idź po nici do wyjścia' }]; },
      restoreCheckpoint: restoreCheckpoint,
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.escape = createEscapeStage;
}(window.LM = window.LM || {}));
