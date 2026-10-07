// "Zwój": shows the story passage that contains the answer to the current question.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const SCROLL = { x: 230, y: 90, width: 820, height: 500 };

  function drawScroll(ctx) {
    LM.ui.drawParchmentPanel(ctx, SCROLL);
    [SCROLL.y, SCROLL.y + SCROLL.height].forEach(function (rollY) {
      LM.draw.drawOutlinedRoundRect(ctx, { x: SCROLL.x - 30, y: rollY - 16, width: SCROLL.width + 60, height: 32 }, 16, '#e2c88c', 3);
      LM.draw.drawOutlinedCircle(ctx, SCROLL.x - 30, rollY, 16, '#c8a060', 3);
      LM.draw.drawOutlinedCircle(ctx, SCROLL.x + SCROLL.width + 30, rollY, 16, '#c8a060', 3);
    });
  }

  function createHintScrollOverlay(game, page, hintsLeft) {
    const overlay = {
      update: function (dt, input) {
        if (input.wasPressed('confirm') || input.wasPressed('back') || input.wasPressed('hint') || input.pointer.wasPressed) {
          game.sfx('page');
          game.scenes.popOverlay(overlay);
        }
      },
      render: function (ctx) {
        LM.ui.drawDimmer(ctx);
        drawScroll(ctx);
        LM.text.drawWrappedText(ctx, 'Zwój: fragment opowieści', 640, SCROLL.y + 64, 700, {
          font: LM.text.boldFont(26), color: P.inkSoft, lineHeight: 30, align: 'center',
        });
        LM.ui.drawMeanderBand(ctx, { x: 340, y: SCROLL.y + 82, width: 600, height: 16 }, '#c8a060');
        LM.text.drawWrappedText(ctx, game.say(page.text), SCROLL.x + 50, SCROLL.y + 140, SCROLL.width - 100, {
          font: LM.text.regularFont(23), color: P.ink, lineHeight: 33,
        });
        LM.ui.drawKeyHintBar(ctx, [{ keys: ['Enter'], label: 'wracam do pytania' }], 'Zostało zwojów: ' + hintsLeft);
      },
    };
    return overlay;
  }

  LM.hintScroll = { createHintScrollOverlay };
}(window.LM = window.LM || {}));
