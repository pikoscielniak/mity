(function (LM) {
  'use strict';

  const P = LM.palette;

  function drawPressEnter(ctx, elapsed) {
    const pulse = 0.5 + 0.5 * Math.sin(elapsed * 4);
    const rect = { x: 470, y: 612, width: 340, height: 56 };
    LM.ui.drawButton(ctx, rect, 'Naciśnij Enter', pulse > 0.5 ? 'selected' : 'normal', 26);
  }

  function drawGameTitle(ctx) {
    LM.ui.drawMeanderBand(ctx, { x: 240, y: 52, width: 800, height: 22 }, P.gold);
    LM.ui.drawTitleText(ctx, 'Labirynt Mitów', 640, 168, 96);
    LM.ui.drawMeanderBand(ctx, { x: 240, y: 196, width: 800, height: 22 }, P.gold);
  }

  function createTitleScene(game) {
    let elapsed = 0;

    function update(dt, input) {
      elapsed += dt;
      if (input.wasAnyKeyPressed() || input.pointer.wasPressed) {
        game.onFirstGesture();
        game.sfx('choose');
        game.show('profiles');
      }
    }

    function render(ctx) {
      LM.scenery.drawSunsetCoast(ctx, elapsed);
      drawGameTitle(ctx);
      LM.ui.drawShadowText(ctx, 'Tezeusz i Ariadna  •  Dedal i Ikar  •  Orfeusz i Eurydyka', 640, 262, 24, P.white, 'center');
      drawPressEnter(ctx, elapsed);
      LM.ui.drawShadowText(ctx, 'Mity greckie według „Mitologii” Jana Parandowskiego', 640, 706, 15, '#cfe2ff', 'center');
    }

    return { update, render };
  }

  LM.sceneFactories.title = createTitleScene;
}(window.LM = window.LM || {}));
