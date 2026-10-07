// Stage 4 of mission 1: sailing home from Crete past Naxos to Athens under the black sail.
// ↑/↓ steer around rocks; at each island the voyage pauses for a question.
(function (LM) {
  'use strict';

  const D = LM.draw;
  const SEA_TOP = 400;
  const LANE_TOP = 450;
  const LANE_BOTTOM = 612;
  const SHIP_X = 280;
  const PROGRESS_PER_SECOND = 3.4;
  const STEER_SPEED = 260;
  const ROCK_SPEED = 250;
  const SAFE_SECONDS_AFTER_HIT = 1.6;
  const STOPS = [
    { at: 50, name: 'Naksos', header: 'Postój na wyspie Naksos', hasTemple: false },
    { at: 100, name: 'Ateny', header: 'Na horyzoncie Ateny', hasTemple: true },
  ];

  function createShipStage(context) {
    const game = context.game;
    let progress = 0;
    let shipY = (LANE_TOP + LANE_BOTTOM) / 2;
    let rocks = [];
    let nextRockIn = 1.5;
    let stopIndex = 0;
    let phase = 'sailing';
    let safeSeconds = 0;
    let checkpointProgress = 0;
    let elapsed = 0;

    function spawnRock() {
      rocks.push({ x: 1340, y: LANE_TOP + context.rng() * (LANE_BOTTOM - LANE_TOP), size: 26 + context.rng() * 14 });
      nextRockIn = 1.4 + context.rng() * 1.2;
    }

    function arriveAtStop() {
      const stop = STOPS[stopIndex];
      phase = 'docked';
      rocks = [];
      context.askQuestion('ship', { header: stop.header }, function () {
        checkpointProgress = stop.at;
        stopIndex += 1;
        phase = stopIndex < STOPS.length ? 'sailing' : 'home';
      });
    }

    function moveRocks(dt) {
      rocks.forEach(function (rock) { rock.x -= ROCK_SPEED * dt; });
      rocks = rocks.filter(function (rock) { return rock.x > -80; });
      const hit = rocks.find(function (rock) { return Math.abs(rock.x - SHIP_X) < 70 && Math.abs(rock.y - shipY) < rock.size + 12; });
      if (hit && safeSeconds <= 0) {
        rocks = rocks.filter(function (rock) { return rock !== hit; });
        game.sfx('splash');
        context.loseHeart();
        safeSeconds = SAFE_SECONDS_AFTER_HIT;
      }
    }

    function sail(dt, input) {
      progress = Math.min(STOPS[stopIndex].at, progress + PROGRESS_PER_SECOND * dt);
      const steer = (input.isHeld('down') ? 1 : 0) - (input.isHeld('up') ? 1 : 0);
      shipY = Math.min(LANE_BOTTOM, Math.max(LANE_TOP, shipY + steer * STEER_SPEED * dt));
      nextRockIn -= dt;
      if (nextRockIn <= 0 && STOPS[stopIndex].at - progress > 6) {
        spawnRock();
      }
      moveRocks(dt);
      if (progress >= STOPS[stopIndex].at) {
        arriveAtStop();
      }
    }

    function update(dt, input) {
      elapsed += dt;
      safeSeconds = Math.max(0, safeSeconds - dt);
      if (phase === 'sailing') {
        sail(dt, input);
      } else if (phase === 'home') {
        context.completeStage();
      }
    }

    function drawRock(ctx, rock) {
      const s = rock.size;
      D.drawOutlinedPolygon(ctx, [[rock.x - s, rock.y + 10], [rock.x - s * 0.6, rock.y - s * 0.8], [rock.x + s * 0.2, rock.y - s], [rock.x + s, rock.y + 10]], '#7a7a86', 3);
      D.fillCircle(ctx, rock.x - s * 0.2, rock.y - s * 0.5, s * 0.2, '#9a9aa6');
      ctx.fillStyle = LM.palette.foam;
      ctx.fillRect(rock.x - s - 6, rock.y + 8, s * 2 + 12, 4);
    }

    function drawStopIsland(ctx, stop) {
      const x = 760 + (stop.at - progress) * 34;
      if (x > 1500) {
        return;
      }
      LM.scenery.drawIsland(ctx, x, SEA_TOP + 4, 380, 120);
      if (stop.hasTemple) {
        LM.scenery.drawTemple(ctx, x - 10, SEA_TOP - 104, 0.8);
      }
      LM.ui.drawShadowText(ctx, stop.name, x, SEA_TOP - 140, 26, LM.palette.white, 'center');
    }

    function drawRouteBar(ctx) {
      const left = 340;
      const width = 600;
      D.drawOutlinedRoundRect(ctx, { x: left, y: 76, width: width, height: 10 }, 5, '#e8dcc0', 2);
      [{ at: 0, name: 'Kreta' }].concat(STOPS).forEach(function (stop) {
        D.drawOutlinedCircle(ctx, left + width * stop.at / 100, 81, 9, '#c8642c', 2);
        LM.ui.drawShadowText(ctx, stop.name, left + width * stop.at / 100, 116, 17, LM.palette.white, 'center');
      });
      D.drawOutlinedCircle(ctx, left + width * progress / 100, 81, 7, LM.palette.gold, 2);
    }

    function render(ctx) {
      LM.scenery.drawSky(ctx, { x: 0, y: 56, width: 1280, height: SEA_TOP - 56 }, '#3a7fe0', '#d8f0ff');
      LM.scenery.drawSun(ctx, 1080, 150, 44, elapsed);
      LM.scenery.drawCloud(ctx, 1280 - ((elapsed * 30) % 1500), 170, 0.8);
      STOPS.forEach(function (stop) { drawStopIsland(ctx, stop); });
      LM.scenery.drawSea(ctx, { x: 0, y: SEA_TOP, width: 1280, height: 720 - SEA_TOP }, elapsed * 3);
      rocks.forEach(function (rock) { drawRock(ctx, rock); });
      const isBlinking = safeSeconds > 0 && Math.floor(elapsed * 10) % 2 === 0;
      if (!isBlinking) {
        LM.scenery.drawShip(ctx, SHIP_X, shipY + 20, 0.85, '#1a1a1a', elapsed);
      }
      drawRouteBar(ctx);
    }

    function restoreCheckpoint() {
      progress = checkpointProgress;
      rocks = [];
      shipY = (LANE_TOP + LANE_BOTTOM) / 2;
    }

    function debugAdvance() {
      if (phase === 'sailing') {
        progress = STOPS[stopIndex].at;
        arriveAtStop();
      }
    }

    return {
      update: update,
      render: render,
      hud: function () { return { title: 'Powrót do Aten', rightText: '' }; },
      keyHints: function () { return [{ keys: ['↑', '↓'], label: 'steruj, omijaj skały' }]; },
      restoreCheckpoint: restoreCheckpoint,
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.ship = createShipStage;
}(window.LM = window.LM || {}));
