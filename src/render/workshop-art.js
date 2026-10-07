// Daedalus's workshop on Crete: wooden walls, a window onto the sea, the wax pot over a flame.
(function (LM) {
  'use strict';

  const D = LM.draw;
  const S = LM.scenery;
  const WAX = '#f2c442';
  const DAY_SKY = { top: '#3a7fe0', bottom: '#d8f0ff' };

  function drawViewThroughWindow(ctx, frame, time) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(frame.x, frame.y, frame.width, frame.height);
    ctx.clip();
    S.drawSky(ctx, { x: frame.x, y: frame.y, width: frame.width, height: 130 }, DAY_SKY.top, DAY_SKY.bottom);
    S.drawSea(ctx, { x: frame.x, y: frame.y + 130, width: frame.width, height: frame.height - 130 }, time);
    LM.winged.drawGull(ctx, frame.x + 40 + ((time * 30) % 220), frame.y + 60, 0.9, time);
    ctx.restore();
  }

  function drawWorkshopWindow(ctx, time) {
    const frame = { x: 880, y: 100, width: 300, height: 210 };
    D.drawOutlinedRoundRect(ctx, { x: frame.x - 14, y: frame.y - 14, width: frame.width + 28, height: frame.height + 28 }, 6, '#7a4a20', 3);
    drawViewThroughWindow(ctx, frame, time);
    D.drawLine(ctx, frame.x + frame.width / 2, frame.y, frame.x + frame.width / 2, frame.y + frame.height, '#7a4a20', 10);
  }

  // (x, y) is the bottom centre of the flame under the pot.
  function drawWaxPot(ctx, x, y, time) {
    const flicker = Math.sin(time * 12) * 3;
    D.drawOutlinedPolygon(ctx, [[x - 14, y], [x, y - 26 - flicker], [x + 14, y]], '#ffb030', 1.5);
    D.drawOutlinedPolygon(ctx, [[x - 34, y - 52], [x + 34, y - 52], [x + 26, y - 14], [x - 26, y - 14]], '#b0603a', 2.5);
    D.drawOutlinedEllipse(ctx, x, y - 52, 34, 9, WAX, 2.5);
  }

  function drawWorkshop(ctx, time) {
    D.drawBandedGradient(ctx, { x: 0, y: 0, width: 1280, height: 476 }, '#d0a070', '#8a5a32', 10);
    ctx.fillStyle = 'rgba(90, 50, 20, 0.35)';
    for (let plankX = 60; plankX < 1280; plankX += 120) {
      ctx.fillRect(plankX, 0, 4, 476);
    }
    drawWorkshopWindow(ctx, time);
    D.drawBandedGradient(ctx, { x: 0, y: 476, width: 1280, height: 244 }, '#9a7448', '#6a4a2a', 6);
  }

  LM.workshopArt = { drawWorkshop, drawWaxPot };
}(window.LM = window.LM || {}));
