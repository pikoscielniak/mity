// Mythical creatures, front view. (x, y) is between the feet; ~150 px tall at scale 1.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const FUR = '#6a3a1a';
  const FUR_LIGHT = '#8a5a2a';
  const HORN = '#f2e6c8';

  function drawMinotaurHead(ctx, isAngry) {
    D.drawOutlinedPolygon(ctx, [[-30, -150], [-58, -168], [-62, -158], [-36, -138]], HORN, 2.5);
    D.drawOutlinedPolygon(ctx, [[30, -150], [58, -168], [62, -158], [36, -138]], HORN, 2.5);
    D.drawOutlinedEllipse(ctx, 0, -134, 30, 28, FUR, 2.5);
    D.drawOutlinedEllipse(ctx, -32, -140, 9, 5, FUR_LIGHT, 2);
    D.drawOutlinedEllipse(ctx, 32, -140, 9, 5, FUR_LIGHT, 2);
    D.drawOutlinedEllipse(ctx, 0, -116, 20, 14, '#c89a7a', 2.5);
    D.fillCircle(ctx, -7, -116, 3, P.outline);
    D.fillCircle(ctx, 7, -116, 3, P.outline);
    ctx.beginPath();
    ctx.arc(0, -106, 8, 0, Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = P.gold;
    ctx.stroke();
    const eyeColor = isAngry ? '#ff3a2a' : '#ffd84a';
    [-12, 12].forEach(function (eyeX) {
      D.drawOutlinedCircle(ctx, eyeX, -140, 5, eyeColor, 1.5);
      D.fillCircle(ctx, eyeX, -140, 2, P.outline);
    });
    D.drawLine(ctx, -18, -149, -6, -145, P.outline, 3);
    D.drawLine(ctx, 18, -149, 6, -145, P.outline, 3);
  }

  function drawMinotaurBody(ctx, armRaise) {
    [-12, 12].forEach(function (legX) {
      D.drawOutlinedRoundRect(ctx, { x: legX - 8, y: -46, width: 16, height: 42 }, 6, FUR, 2.5);
      D.drawOutlinedRoundRect(ctx, { x: legX - 10, y: -8, width: 20, height: 9 }, 3, '#2a1a10', 2);
    });
    D.drawOutlinedPolygon(ctx, [[-34, -112], [34, -112], [26, -46], [-26, -46]], FUR_LIGHT, 2.5);
    D.drawOutlinedPolygon(ctx, [[-26, -58], [26, -58], [22, -30], [-22, -30]], '#a82a1a', 2.5);
    [-1, 1].forEach(function (side) {
      const handX = side * (44 + armRaise * 6);
      const handY = -66 - armRaise * 40;
      D.drawLine(ctx, side * 30, -104, handX, handY, P.outline, 17);
      D.drawLine(ctx, side * 30, -104, handX, handY, FUR, 12);
      D.drawOutlinedCircle(ctx, handX, handY, 8, FUR, 2);
    });
  }

  // armRaise 0..1 lifts the arms for a menacing pose.
  function drawMinotaur(ctx, x, y, scale, armRaise, isAngry) {
    D.withTransform(ctx, x, y, scale, function () {
      drawMinotaurBody(ctx, armRaise);
      drawMinotaurHead(ctx, isAngry);
    });
  }

  function drawDogHead(ctx, headX, headY, mouthOpen) {
    D.drawOutlinedPolygon(ctx, [[headX - 14, headY - 10], [headX - 20, headY - 30], [headX - 6, headY - 16]], '#2a2a2a', 2);
    D.drawOutlinedPolygon(ctx, [[headX + 14, headY - 10], [headX + 20, headY - 30], [headX + 6, headY - 16]], '#2a2a2a', 2);
    D.drawOutlinedEllipse(ctx, headX, headY, 18, 16, '#3a3a3a', 2.5);
    D.drawOutlinedEllipse(ctx, headX, headY + 10, 11, 8 + mouthOpen * 4, '#5a5a5a', 2);
    D.fillCircle(ctx, headX, headY + 4, 3.5, P.outline);
    [-7, 7].forEach(function (eyeX) { D.drawOutlinedCircle(ctx, headX + eyeX, headY - 5, 3.5, '#ff5a2a', 1.2); });
    if (mouthOpen > 0.3) {
      D.drawOutlinedEllipse(ctx, headX, headY + 16, 6, 4 * mouthOpen, '#d84a5a', 1.5);
    }
  }

  // sleepiness 0..1 closes the mouths and lowers the heads (Orpheus's music calms Cerberus).
  function drawCerberus(ctx, x, y, scale, sleepiness) {
    const mouthOpen = 1 - sleepiness;
    D.withTransform(ctx, x, y, scale, function () {
      D.drawOutlinedEllipse(ctx, 0, -50, 52, 32, '#3a3a3a', 2.5);
      [-34, -14, 14, 34].forEach(function (legX) {
        D.drawOutlinedRoundRect(ctx, { x: legX - 7, y: -30, width: 14, height: 30 }, 5, '#2a2a2a', 2);
      });
      const droop = sleepiness * 16;
      drawDogHead(ctx, -40, -88 + droop, mouthOpen);
      drawDogHead(ctx, 0, -100 + droop, mouthOpen);
      drawDogHead(ctx, 40, -88 + droop, mouthOpen);
    });
  }

  LM.creatures = { drawMinotaur, drawCerberus };
}(window.LM = window.LM || {}));
