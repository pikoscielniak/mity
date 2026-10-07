// Small icons inside the map medallions: the labyrinth, a pair of wings, the lute and the oracle's tripod.
(function (LM) {
  'use strict';

  const D = LM.draw;
  const INK = '#7a3a10';

  function drawLabyrinthIcon(ctx, x, y) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    [14, 9, 4].forEach(function (size) { ctx.strokeRect(x - size, y - size, size * 2, size * 2); });
    ctx.fillStyle = '#fff2c8';
    ctx.fillRect(x - 3, y - 16, 6, 6);
    ctx.fillRect(x + 6, y - 3, 6, 6);
  }

  function drawWingsIcon(ctx, x, y) {
    [-1, 1].forEach(function (side) {
      for (let feather = 0; feather < 4; feather += 1) {
        D.drawOutlinedEllipse(ctx, x + side * (6 + feather * 4), y - 2 + feather * 3, 4, 10 - feather, '#ffffff', 1.5);
      }
    });
  }

  function drawOracleIcon(ctx, x, y) {
    [-8, 0, 8].forEach(function (legX) { D.drawLine(ctx, x + legX * 0.4, y - 2, x + legX, y + 14, INK, 3); });
    D.drawOutlinedEllipse(ctx, x, y - 4, 13, 5, '#c8902a', 2);
    D.fillCircle(ctx, x - 3, y - 14, 5, 'rgba(160, 160, 170, 0.8)');
    D.fillCircle(ctx, x + 3, y - 20, 4, 'rgba(160, 160, 170, 0.6)');
  }

  const ICONS = {
    labyrinth: drawLabyrinthIcon,
    wings: drawWingsIcon,
    lute: function (ctx, x, y) { LM.props.drawLute(ctx, x, y + 15); },
    oracle: drawOracleIcon,
  };

  function drawIcon(ctx, icon, x, y) {
    ICONS[icon](ctx, x, y);
  }

  LM.mapIcons = { drawIcon };
}(window.LM = window.LM || {}));
