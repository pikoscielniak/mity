// Things characters hold or that lie around: sword, ball of thread, lute, staff, feather, scroll.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;

  function drawSword(ctx, hand) {
    D.drawLine(ctx, hand[0], hand[1], hand[0] + 4, hand[1] - 46, P.outline, 8);
    D.drawLine(ctx, hand[0], hand[1], hand[0] + 4, hand[1] - 46, '#dfe6ee', 5);
    D.drawLine(ctx, hand[0] - 8, hand[1] - 4, hand[0] + 9, hand[1] - 5, '#c8a040', 5);
  }

  function drawThreadBall(ctx, x, y, radius) {
    D.drawOutlinedCircle(ctx, x, y, radius, '#d8282a', 2);
    ctx.strokeStyle = '#ff8a7a';
    ctx.lineWidth = 1.4;
    for (let turn = -1; turn <= 1; turn += 1) {
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 0.85, radius * 0.4, turn * 0.8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawLute(ctx, x, y) {
    D.drawOutlinedPolygon(ctx, [[x - 14, y - 30], [x - 10, y], [x + 10, y], [x + 14, y - 30], [x + 8, y - 30], [x + 6, y - 8], [x - 6, y - 8], [x - 8, y - 30]], '#c8902a', 2);
    D.drawLine(ctx, x - 13, y - 28, x + 13, y - 28, '#7a4a10', 3);
    ctx.strokeStyle = '#fff6c8';
    ctx.lineWidth = 1;
    [-4, 0, 4].forEach(function (stringX) {
      ctx.beginPath();
      ctx.moveTo(x + stringX, y - 27);
      ctx.lineTo(x + stringX * 0.8, y - 4);
      ctx.stroke();
    });
  }

  function drawStaff(ctx, hand) {
    D.drawLine(ctx, hand[0] + 2, hand[1] - 50, hand[0] + 2, hand[1] + 44, P.outline, 7);
    D.drawLine(ctx, hand[0] + 2, hand[1] - 50, hand[0] + 2, hand[1] + 44, '#8a5a2a', 4);
  }

  function drawLaurelBranch(ctx, hand) {
    D.drawLine(ctx, hand[0], hand[1], hand[0] + 10, hand[1] - 34, '#5a3a1a', 3);
    for (let leaf = 0; leaf < 5; leaf += 1) {
      D.drawOutlinedEllipse(ctx, hand[0] + 2 + leaf * 2 + (leaf % 2 ? 5 : -5), hand[1] - 8 - leaf * 6, 5, 2.5, '#4a9a3a', 1);
    }
  }

  // hands: [[leftX, leftY], [rightX, rightY]] in the character's own coordinates.
  function drawHeldItem(ctx, item, hands) {
    const right = hands[1];
    if (item === 'sword') {
      drawSword(ctx, right);
    } else if (item === 'thread') {
      drawThreadBall(ctx, right[0] + 4, right[1] - 2, 9);
    } else if (item === 'lute') {
      drawLute(ctx, hands[0][0] + 4, hands[0][1] + 6);
    } else if (item === 'staff') {
      drawStaff(ctx, right);
    } else if (item === 'laurelBranch') {
      drawLaurelBranch(ctx, right);
    }
  }

  function drawFeather(ctx, x, y, scale, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    D.drawOutlinedEllipse(ctx, 0, 0, 8, 3, P.white, 0.8);
    ctx.fillStyle = '#b89a62';
    ctx.fillRect(-9, -0.5, 18, 1);
    ctx.restore();
  }

  function drawQuestionScroll(ctx, x, y, scale, time) {
    const bob = Math.sin(time * 3) * 4;
    D.withTransform(ctx, x, y + bob, scale, function () {
      D.drawOutlinedRoundRect(ctx, { x: -40, y: -28, width: 80, height: 56 }, 8, '#f6e2b0', 3);
      D.drawOutlinedEllipse(ctx, -40, 0, 7, 28, '#e2c88c', 2.5);
      D.drawOutlinedEllipse(ctx, 40, 0, 7, 28, '#e2c88c', 2.5);
      LM.text.drawTextLine(ctx, '?', 0, 15, { font: LM.text.boldFont(40), color: '#7a3a10', align: 'center' });
    });
  }

  LM.props = { drawHeldItem, drawThreadBall, drawLute, drawFeather, drawQuestionScroll };
}(window.LM = window.LM || {}));
