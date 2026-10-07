// Developer view (?scene=styleguide) showing every drawing widget on one screen.
(function (LM) {
  'use strict';

  const SAMPLE_TEXT = 'Ariadna, córka króla Minosa, dała Tezeuszowi kłębek nici. Tezeusz przywiązał nić u wejścia ' +
    'i ruszył w głąb labiryntu, a nić rozwijała się za nim.';

  function createStyleguideScene() {
    let elapsed = 0;

    function drawLandscape(ctx) {
      LM.scenery.drawSky(ctx, { x: 0, y: 56, width: 1280, height: 440 }, LM.palette.skyTop, LM.palette.skyBottom);
      LM.scenery.drawSun(ctx, 1140, 150, 60, elapsed);
      LM.scenery.drawCloud(ctx, 640, 140, 0.8);
      LM.scenery.drawSea(ctx, { x: 0, y: 496, width: 1280, height: 168 }, elapsed);
      LM.scenery.drawIsland(ctx, 1040, 500, 320, 110);
      LM.scenery.drawTemple(ctx, 1030, 412, 0.8);
      LM.scenery.drawShip(ctx, 780, 540, 0.9, '#c8281a', elapsed);
    }

    function drawWidgets(ctx) {
      const content = LM.ui.drawTitledPanel(ctx, { x: 40, y: 80, width: 520, height: 300 }, 'Pytanie 3/12');
      LM.text.drawWrappedText(ctx, SAMPLE_TEXT, content.x, content.y + 20, content.width, {
        font: LM.text.regularFont(20), color: LM.palette.ink, lineHeight: 28,
      });
      ['normal', 'selected', 'disabled', 'correct', 'wrong'].forEach(function (state, index) {
        LM.ui.drawButton(ctx, { x: 40 + (index % 3) * 175, y: 400 + Math.floor(index / 3) * 64, width: 165, height: 52 }, state, state);
      });
      LM.ui.drawNumberBadge(ctx, 600, 90, '1');
      LM.ui.drawTitleText(ctx, 'Labirynt Mitów', 900, 300, 72);
      LM.ui.drawMeanderBand(ctx, { x: 600, y: 320, width: 600, height: 22 }, LM.palette.gold);
    }

    function render(ctx) {
      drawLandscape(ctx);
      drawWidgets(ctx);
      LM.ui.drawHud(ctx, { title: 'Misja 2: Lot Ikara', heartsLeft: 2, heartsMax: 3, rightText: 'Pióra: 7/12' });
      LM.ui.drawKeyHintBar(ctx, [
        { keys: ['↑', '↓'], label: 'lot' },
        { keys: ['H'], label: 'podpowiedź' },
        { keys: ['Esc'], label: 'pauza' },
      ], 'Zwoje: 2/4');
    }

    return {
      update: function (dt) { elapsed += dt; },
      render,
    };
  }

  LM.sceneFactories.styleguide = createStyleguideScene;
}(window.LM = window.LM || {}));
