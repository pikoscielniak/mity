// The materials on Daedalus's shelf and the speech bubble he talks in.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;

  function drawFeathersBundle(ctx, x, y) {
    [-0.5, -0.2, 0.1, 0.4].forEach(function (angle, index) {
      LM.props.drawFeather(ctx, x - 12 + index * 8, y - 10 - index * 3, 2.6, angle - 1.2);
    });
  }

  function drawWaxBlock(ctx, x, y) {
    D.drawOutlinedRoundRect(ctx, { x: x - 30, y: y - 34, width: 60, height: 34 }, 6, '#f2c442', 2.5);
    ctx.strokeStyle = '#c89a20';
    ctx.lineWidth = 1.5;
    for (let cell = 0; cell < 3; cell += 1) {
      ctx.beginPath();
      ctx.arc(x - 16 + cell * 16, y - 17, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawIronBars(ctx, x, y) {
    [-14, 0, 14].forEach(function (offset) {
      D.drawOutlinedRoundRect(ctx, { x: x - 34, y: y - 16 + offset * 0.6 - 10, width: 68, height: 10 }, 3, '#8a8f99', 2);
    });
  }

  function drawSailCloth(ctx, x, y) {
    D.drawOutlinedPolygon(ctx, [[x - 34, y], [x - 26, y - 38], [x + 30, y - 34], [x + 34, y]], '#f4eee0', 2.5);
    D.drawLine(ctx, x - 20, y - 22, x + 24, y - 20, '#c8bca0', 2);
  }

  function drawPlanks(ctx, x, y) {
    [0, 1, 2].forEach(function (plank) {
      D.drawOutlinedRoundRect(ctx, { x: x - 36, y: y - 12 - plank * 11, width: 72, height: 11 }, 2, plank % 2 ? '#b07a40' : '#9a6630', 2);
    });
  }

  function drawClay(ctx, x, y) {
    D.drawOutlinedEllipse(ctx, x, y - 16, 30, 18, '#b8643a', 2.5);
    D.fillCircle(ctx, x - 9, y - 22, 5, '#d0805a');
  }

  const ICONS = {
    feathers: drawFeathersBundle,
    wax: drawWaxBlock,
    iron: drawIronBars,
    cloth: drawSailCloth,
    planks: drawPlanks,
    clay: drawClay,
  };

  function drawMaterialIcon(ctx, materialId, x, y) {
    ICONS[materialId](ctx, x, y);
  }

  // A rounded bubble whose tail points down-left towards the speaker's head at (tailX, tailY).
  function drawSpeechBubble(ctx, text, rect, tailX, tailY) {
    D.drawOutlinedPolygon(ctx, [[rect.x + 30, rect.y + rect.height - 4], [tailX, tailY], [rect.x + 70, rect.y + rect.height - 4]], P.white, 3);
    D.drawOutlinedRoundRect(ctx, rect, 16, P.white, 3);
    LM.draw.fillRoundRect(ctx, { x: rect.x + 3, y: rect.y + rect.height - 8, width: 80, height: 6 }, 2, P.white);
    LM.text.drawWrappedText(ctx, text, rect.x + 20, rect.y + 34, rect.width - 40, {
      font: LM.text.boldFont(20), color: P.ink, lineHeight: 26,
    });
  }

  LM.workshopItems = { drawMaterialIcon, drawSpeechBubble };
}(window.LM = window.LM || {}));
