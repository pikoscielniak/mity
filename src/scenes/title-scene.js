(function (LM) {
  'use strict';

  const P = LM.palette;
  const SKY_RECT = { x: 0, y: 0, width: 1280, height: 520 };
  const SEA_RECT = { x: 0, y: 520, width: 1280, height: 200 };

  function drawBackdrop(ctx, elapsed) {
    LM.scenery.drawSky(ctx, SKY_RECT, '#1d3f94', '#f7c58a');
    LM.scenery.drawSun(ctx, 1010, 470, 80, elapsed);
    LM.scenery.drawCloud(ctx, ((elapsed * 12) % 1500) - 200, 350, 1.0);
    LM.scenery.drawCloud(ctx, ((elapsed * 7 + 700) % 1500) - 200, 420, 0.7);
    LM.scenery.drawSea(ctx, SEA_RECT, elapsed);
    LM.scenery.drawIsland(ctx, 300, 524, 460, 150);
    LM.scenery.drawTemple(ctx, 290, 404, 0.9);
    LM.scenery.drawShip(ctx, 820, 580, 0.75, '#1a1a1a', elapsed);
  }

  function drawPressEnter(ctx, elapsed) {
    const pulse = 0.5 + 0.5 * Math.sin(elapsed * 4);
    const rect = { x: 470, y: 612, width: 340, height: 56 };
    LM.ui.drawButton(ctx, rect, 'Naciśnij Enter', pulse > 0.5 ? 'selected' : 'normal', 26);
  }

  function createTitleScene(game) {
    let elapsed = 0;

    function update(dt, input) {
      elapsed += dt;
      if (input.wasAnyKeyPressed() || input.pointer.wasPressed) {
        game.onFirstGesture();
      }
    }

    function render(ctx) {
      drawBackdrop(ctx, elapsed);
      LM.ui.drawMeanderBand(ctx, { x: 240, y: 52, width: 800, height: 22 }, P.gold);
      LM.ui.drawTitleText(ctx, 'Labirynt Mitów', 640, 168, 96);
      LM.ui.drawMeanderBand(ctx, { x: 240, y: 196, width: 800, height: 22 }, P.gold);
      LM.ui.drawShadowText(ctx, 'Tezeusz i Ariadna  •  Dedal i Ikar  •  Orfeusz i Eurydyka', 640, 262, 24, P.white, 'center');
      drawPressEnter(ctx, elapsed);
      LM.ui.drawShadowText(ctx, 'Mity greckie według „Mitologii” Jana Parandowskiego', 640, 706, 15, '#cfe2ff', 'center');
    }

    return { update, render };
  }

  LM.sceneFactories.title = createTitleScene;
}(window.LM = window.LM || {}));
