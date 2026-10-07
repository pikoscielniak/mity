(function (LM) {
  'use strict';

  function createTitleScene(game) {
    let elapsed = 0;

    function update(dt, input) {
      elapsed += dt;
      if (input.wasAnyKeyPressed() || input.pointer.wasPressed) {
        game.onFirstGesture();
      }
    }

    function render(ctx) {
      ctx.fillStyle = '#2b6cd4';
      ctx.fillRect(0, 0, LM.view.WIDTH, LM.view.HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Verdana, Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Labirynt Mitów', LM.view.WIDTH / 2, 300);
      if (Math.floor(elapsed * 2) % 2 === 0) {
        ctx.font = 'bold 28px Verdana, Tahoma, sans-serif';
        ctx.fillText('Naciśnij Enter', LM.view.WIDTH / 2, 480);
      }
    }

    return { update, render };
  }

  LM.sceneFactories.title = createTitleScene;
}(window.LM = window.LM || {}));
