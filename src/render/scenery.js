// Reusable landscape pieces: sky, sun, clouds, sea, islands, a temple and a Greek ship.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;

  function drawSky(ctx, rect, topColor, bottomColor) {
    D.drawBandedGradient(ctx, rect, topColor, bottomColor, 22);
  }

  function drawSun(ctx, x, y, radius, time) {
    D.fillCircle(ctx, x, y, radius * 1.75, 'rgba(255, 196, 60, 0.16)');
    D.fillCircle(ctx, x, y, radius * 1.37, 'rgba(255, 210, 80, 0.28)');
    ctx.fillStyle = '#ffd24a';
    const spin = time * 0.15;
    for (let ray = 0; ray < 12; ray += 1) {
      const angle = spin + ray * Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle - 0.1) * radius * 1.1, y + Math.sin(angle - 0.1) * radius * 1.1);
      ctx.lineTo(x + Math.cos(angle) * radius * 1.55, y + Math.sin(angle) * radius * 1.55);
      ctx.lineTo(x + Math.cos(angle + 0.1) * radius * 1.1, y + Math.sin(angle + 0.1) * radius * 1.1);
      ctx.fill();
    }
    D.fillCircle(ctx, x, y, radius, '#ffe27a');
    D.fillCircle(ctx, x, y, radius * 0.72, '#fff6c8');
  }

  function drawCloud(ctx, x, y, scale) {
    const shade = [[0, 6, 26], [34, 0, 34], [70, 6, 26], [34, 12, 30]];
    const puffs = [[0, 0, 26], [34, -10, 34], [70, 0, 26]];
    shade.forEach(function (puff) { D.fillCircle(ctx, x + puff[0] * scale, y + (puff[1] + 8) * scale, puff[2] * scale, '#c4def7'); });
    puffs.forEach(function (puff) { D.fillCircle(ctx, x + puff[0] * scale, y + puff[1] * scale, puff[2] * scale, P.white); });
    D.fillCircle(ctx, x + 26 * scale, y - 20 * scale, 12 * scale, P.white);
  }

  function drawSea(ctx, rect, time, colors) {
    const seaColors = colors || { top: P.seaTop, bottom: P.seaBottom, foam: P.foam, wave: '#74b4f0' };
    D.drawBandedGradient(ctx, rect, seaColors.top, seaColors.bottom, 10);
    const drift = (time * 30) % 56;
    ctx.fillStyle = seaColors.foam;
    for (let x = -56; x < rect.x + rect.width + 56; x += 56) {
      const offset = (Math.round(x / 56) % 2) * 20;
      ctx.beginPath();
      ctx.ellipse(x + offset + drift + 20, rect.y + 8, 22, 3, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = seaColors.wave;
    const slowDrift = (time * 14) % 74;
    for (let x = -74; x < rect.x + rect.width + 74; x += 74) {
      ctx.fillRect(x + 30 - slowDrift, rect.y + rect.height * 0.3, 34, 3);
      ctx.fillRect(x + 6 + slowDrift, rect.y + rect.height * 0.62, 26, 3);
    }
  }

  // An island hill: `baseY` is the waterline, `width` and `height` its size.
  function drawIsland(ctx, centerX, baseY, width, height) {
    const half = width / 2;
    D.drawOutlinedPolygon(ctx, [
      [centerX - half, baseY],
      [centerX - half * 0.6, baseY - height * 0.7],
      [centerX - half * 0.1, baseY - height],
      [centerX + half * 0.45, baseY - height * 0.75],
      [centerX + half, baseY],
    ], P.grassDark, 3);
    D.drawOutlinedPolygon(ctx, [
      [centerX - half * 0.6, baseY - height * 0.7],
      [centerX - half * 0.1, baseY - height],
      [centerX + half * 0.45, baseY - height * 0.75],
      [centerX + half * 0.3, baseY - height * 0.62],
      [centerX - half * 0.1, baseY - height * 0.84],
      [centerX - half * 0.5, baseY - height * 0.58],
    ], P.grassLight, 0);
    ctx.fillStyle = '#e6d6a8';
    ctx.fillRect(centerX - half, baseY - 4, width, 4);
  }

  // Temple with a pediment roof; (x, y) is the bottom centre, drawn ~120 px wide at scale 1.
  function drawTemple(ctx, x, y, scale) {
    D.withTransform(ctx, x, y, scale, function () {
      D.drawOutlinedRoundRect(ctx, { x: -64, y: -10, width: 128, height: 10 }, 2, P.marbleShade, 2);
      D.drawOutlinedRoundRect(ctx, { x: -56, y: -18, width: 112, height: 9 }, 2, P.marble, 2);
      for (let column = 0; column < 6; column += 1) {
        const columnX = -48 + column * 19;
        D.drawOutlinedRoundRect(ctx, { x: columnX - 5, y: -66, width: 10, height: 48 }, 2, P.marble, 2);
        ctx.fillStyle = P.marbleShade;
        ctx.fillRect(columnX + 1, -64, 2, 44);
      }
      D.drawOutlinedRoundRect(ctx, { x: -60, y: -76, width: 120, height: 11 }, 2, P.marble, 2);
      D.drawOutlinedPolygon(ctx, [[-64, -76], [0, -104], [64, -76]], P.marble, 2);
      D.drawOutlinedPolygon(ctx, [[-44, -80], [0, -98], [44, -80]], P.marbleShade, 0);
    });
  }

  // Greek ship with one square sail; (x, y) is the waterline centre, ~180 px long at scale 1.
  function drawShip(ctx, x, y, scale, sailColor, time) {
    const bob = Math.sin(time * 2) * 3;
    D.withTransform(ctx, x, y + bob, scale, function () {
      D.drawOutlinedPolygon(ctx, [[-90, -26], [96, -26], [70, 6], [-70, 6]], '#8a4a20', 3);
      ctx.fillStyle = '#5a2c10';
      ctx.fillRect(-82, -14, 160, 5);
      D.drawOutlinedPolygon(ctx, [[96, -26], [118, -44], [104, -22]], '#8a4a20', 3);
      D.drawOutlinedPolygon(ctx, [[-90, -26], [-104, -52], [-112, -48], [-98, -20]], '#8a4a20', 3);
      D.drawOutlinedCircle(ctx, 78, -15, 4, P.white, 1.5);
      D.fillCircle(ctx, 79, -15, 2, '#10306a');
      for (let oar = 0; oar < 7; oar += 1) {
        const oarX = -60 + oar * 20;
        const swing = Math.sin(time * 3 + oar * 0.4) * 5;
        D.drawLine(ctx, oarX, -8, oarX - 12 + swing, 22, '#6a3a18', 3);
      }
      D.drawLine(ctx, 0, -26, 0, -150, '#5a2c10', 5);
      D.drawLine(ctx, -46, -142, 46, -142, '#5a2c10', 4);
      const billow = Math.sin(time * 1.5) * 4;
      D.drawOutlinedPolygon(ctx, [[-44, -140], [44, -140], [48 + billow, -58], [-48 + billow, -58]], sailColor, 3);
    });
  }

  // The coast at sunset used behind the title, player and settings screens.
  function drawSunsetCoast(ctx, elapsed) {
    drawSky(ctx, { x: 0, y: 0, width: 1280, height: 520 }, '#1d3f94', '#f7c58a');
    drawSun(ctx, 1010, 470, 80, elapsed);
    drawCloud(ctx, ((elapsed * 12) % 1500) - 200, 350, 1.0);
    drawCloud(ctx, ((elapsed * 7 + 700) % 1500) - 200, 420, 0.7);
    drawSea(ctx, { x: 0, y: 520, width: 1280, height: 200 }, elapsed);
    drawIsland(ctx, 300, 524, 460, 150);
    drawTemple(ctx, 290, 404, 0.9);
    drawShip(ctx, 820, 580, 0.75, '#1a1a1a', elapsed);
  }

  LM.scenery = { drawSky, drawSun, drawCloud, drawSea, drawIsland, drawTemple, drawShip, drawSunsetCoast };
}(window.LM = window.LM || {}));
