// The dark path up from the underworld, its echo stones, the light of the exit and the hills of Thrace.
(function (LM) {
  'use strict';

  const D = LM.draw;
  const PIXELS_PER_UNIT = 22;
  const HERO_SCREEN_X = 420;

  // The path rises from the depths (distance 0) to the exit (distance 100).
  function groundY(distance) {
    return 590 - distance * 1.7;
  }

  function screenX(distance, heroDistance) {
    return HERO_SCREEN_X + (distance - heroDistance) * PIXELS_PER_UNIT;
  }

  function drawExitLight(ctx, heroDistance) {
    const x = screenX(104, heroDistance);
    const glow = ctx.createRadialGradient(x, groundY(100) - 80, 10, x, groundY(100) - 80, 520);
    glow.addColorStop(0, 'rgba(255, 244, 200, 0.95)');
    glow.addColorStop(0.3, 'rgba(255, 220, 140, 0.45)');
    glow.addColorStop(1, 'rgba(255, 220, 140, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 56, 1280, 608);
  }

  function drawPath(ctx, heroDistance) {
    const from = heroDistance - 30;
    const to = heroDistance + 40;
    ctx.beginPath();
    ctx.moveTo(screenX(from, heroDistance), 720);
    for (let distance = from; distance <= to; distance += 2) {
      ctx.lineTo(screenX(distance, heroDistance), groundY(distance) + Math.sin(distance) * 3);
    }
    ctx.lineTo(screenX(to, heroDistance), 720);
    ctx.closePath();
    ctx.fillStyle = '#3a2a4a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#6a5a8a';
    ctx.stroke();
  }

  function drawTunnel(ctx, heroDistance, time) {
    D.drawBandedGradient(ctx, { x: 0, y: 56, width: 1280, height: 608 }, '#0e0818', '#2a1a3a', 10);
    drawExitLight(ctx, heroDistance);
    ctx.fillStyle = '#1a1028';
    for (let rock = Math.floor(heroDistance / 8) * 8 - 24; rock < heroDistance + 48; rock += 8) {
      const x = screenX(rock, heroDistance);
      ctx.beginPath();
      ctx.moveTo(x - 40, 56);
      ctx.lineTo(x, 56 + 50 + ((rock * 13) % 60));
      ctx.lineTo(x + 40, 56);
      ctx.fill();
    }
    drawPath(ctx, heroDistance);
  }

  // state: 'waiting' (glowing question) or 'answered'.
  function drawEchoStone(ctx, distance, heroDistance, time, state) {
    const x = screenX(distance, heroDistance);
    const y = groundY(distance);
    D.drawOutlinedPolygon(ctx, [[x - 26, y + 4], [x - 20, y - 70], [x + 18, y - 76], [x + 26, y + 4]], '#5a5a7a', 3);
    const pulse = 0.4 + 0.25 * Math.sin(time * 4);
    const glow = state === 'answered' ? 'rgba(120, 220, 160, 0.5)' : 'rgba(150, 200, 255, ' + pulse + ')';
    D.fillCircle(ctx, x, y - 38, 18, glow);
    LM.text.drawTextLine(ctx, state === 'answered' ? '✔' : '?', x, y - 29, { font: LM.text.boldFont(24), color: '#e8f0ff', align: 'center' });
  }

  LM.ascentArt = { HERO_SCREEN_X, groundY, screenX, drawTunnel, drawEchoStone };
}(window.LM = window.LM || {}));
