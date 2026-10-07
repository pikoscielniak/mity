// Full-screen backgrounds for story pictures and stages (1280×720; the story text box covers y > 500).
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const S = LM.scenery;

  function drawGround(ctx, top, topColor, bottomColor) {
    D.drawBandedGradient(ctx, { x: 0, y: top, width: 1280, height: 720 - top }, topColor, bottomColor, 8);
  }

  function drawHouse(ctx, x, y, width, height) {
    D.drawOutlinedRoundRect(ctx, { x: x, y: y - height, width: width, height: height }, 3, '#f4eee0', 2.5);
    D.drawOutlinedPolygon(ctx, [[x - 6, y - height], [x + width / 2, y - height - 22], [x + width + 6, y - height]], '#c8642c', 2.5);
    D.drawOutlinedRoundRect(ctx, { x: x + width / 2 - 8, y: y - 30, width: 16, height: 30 }, 3, '#7a4a20', 2);
  }

  function drawAthens(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 470 }, '#3a7fe0', '#cdeeff');
    S.drawSun(ctx, 160, 110, 50, time);
    S.drawCloud(ctx, 520, 90, 0.8);
    D.drawOutlinedPolygon(ctx, [[760, 470], [860, 250], [1180, 240], [1280, 330], [1280, 470]], '#b8a070', 3);
    S.drawTemple(ctx, 1010, 250, 1.4);
    drawHouse(ctx, 640, 440, 90, 70);
    drawHouse(ctx, 770, 470, 110, 80);
    drawGround(ctx, 470, '#d8c088', '#a88850');
  }

  function drawHarbor(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 400 }, '#3a7fe0', '#d8f0ff');
    S.drawCloud(ctx, 900, 100, 0.9);
    S.drawSea(ctx, { x: 0, y: 400, width: 1280, height: 320 }, time);
    D.drawBandedGradient(ctx, { x: 0, y: 470, width: 560, height: 250 }, '#a87a4a', '#6a4a2a', 6);
    ctx.fillStyle = '#5a3a1a';
    for (let plank = 0; plank < 560; plank += 46) {
      ctx.fillRect(plank, 470, 3, 250);
    }
  }

  // Minoan palace: red columns that narrow towards the bottom and "horns" on the roof.
  function drawCretePalace(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 470 }, '#f0a860', '#ffe0b0');
    S.drawSun(ctx, 1120, 120, 46, time);
    D.drawOutlinedRoundRect(ctx, { x: 120, y: 150, width: 1040, height: 320 }, 4, '#f2e2c0', 3);
    D.drawOutlinedRoundRect(ctx, { x: 100, y: 130, width: 1080, height: 30 }, 4, '#c8642c', 3);
    for (let horn = 0; horn < 9; horn += 1) {
      const hornX = 160 + horn * 120;
      D.drawOutlinedPolygon(ctx, [[hornX - 26, 130], [hornX - 22, 98], [hornX - 12, 120], [hornX + 12, 120], [hornX + 22, 98], [hornX + 26, 130]], '#f2e6c8', 2.5);
    }
    for (let column = 0; column < 7; column += 1) {
      const columnX = 190 + column * 150;
      D.drawOutlinedPolygon(ctx, [[columnX - 18, 180], [columnX + 18, 180], [columnX + 12, 460], [columnX - 12, 460]], '#c82a1a', 2.5);
      D.drawOutlinedRoundRect(ctx, { x: columnX - 24, y: 164, width: 48, height: 18 }, 4, '#2a1a10', 2);
    }
    drawGround(ctx, 470, '#d8b888', '#a88050');
  }

  function drawTorch(ctx, x, y, time) {
    D.drawOutlinedRoundRect(ctx, { x: x - 5, y: y, width: 10, height: 40 }, 3, '#6a4a2a', 2);
    const flicker = Math.sin(time * 13 + x) * 3;
    D.fillCircle(ctx, x, y - 8, 22 + flicker, 'rgba(255, 170, 60, 0.25)');
    D.drawOutlinedPolygon(ctx, [[x - 9, y], [x, y - 26 - flicker], [x + 9, y]], '#ffb030', 1.5);
    D.drawOutlinedPolygon(ctx, [[x - 4, y], [x, y - 14 - flicker], [x + 4, y]], '#fff0a0', 0);
  }

  // A stone corridor seen in perspective, lit by two torches.
  function drawLabyrinthHall(ctx, time) {
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(0, 0, 1280, 720);
    D.drawOutlinedPolygon(ctx, [[0, 0], [480, 170], [480, 430], [0, 720]], '#5a4a3a', 3);
    D.drawOutlinedPolygon(ctx, [[1280, 0], [800, 170], [800, 430], [1280, 720]], '#5a4a3a', 3);
    D.drawOutlinedPolygon(ctx, [[0, 720], [480, 430], [800, 430], [1280, 720]], '#3a3028', 3);
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(480, 170, 320, 260);
    ctx.strokeStyle = '#3a3028';
    ctx.lineWidth = 2;
    for (let row = 1; row < 6; row += 1) {
      ctx.beginPath();
      ctx.moveTo(0, row * 120);
      ctx.lineTo(480, 170 + row * 43);
      ctx.moveTo(1280, row * 120);
      ctx.lineTo(800, 170 + row * 43);
      ctx.stroke();
    }
    drawTorch(ctx, 240, 220, time);
    drawTorch(ctx, 1040, 220, time);
  }

  function drawStars(ctx, count, seed) {
    const rng = LM.random.createRng(seed);
    ctx.fillStyle = P.white;
    for (let star = 0; star < count; star += 1) {
      const size = rng() < 0.2 ? 3 : 2;
      ctx.fillRect(Math.floor(rng() * 1280), Math.floor(rng() * 380), size, size);
    }
  }

  function drawNightSea(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 420 }, '#0b1030', '#2a3a7a');
    drawStars(ctx, 90, 7);
    D.fillCircle(ctx, 1080, 110, 46, '#fff6d8');
    D.fillCircle(ctx, 1100, 98, 40, '#1c2a60');
    S.drawSea(ctx, { x: 0, y: 420, width: 1280, height: 300 }, time, { top: '#1a3a7a', bottom: '#050a20', foam: '#8ab0e0', wave: '#3a5aa0' });
  }

  function drawBeach(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 360 }, '#4a90e8', '#dff4ff');
    S.drawCloud(ctx, 300, 90, 0.9);
    S.drawSea(ctx, { x: 0, y: 360, width: 1280, height: 200 }, time);
    D.drawOutlinedPolygon(ctx, [[0, 720], [0, 450], [400, 420], [900, 440], [1280, 410], [1280, 720]], '#f0d898', 0);
    D.drawBandedGradient(ctx, { x: 0, y: 470, width: 1280, height: 250 }, '#f0d898', '#d8b870', 6);
  }

  function drawCliff(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 420 }, '#5a5aa8', '#f0b880');
    S.drawSea(ctx, { x: 0, y: 420, width: 1280, height: 300 }, time);
    D.drawOutlinedPolygon(ctx, [[0, 720], [0, 300], [380, 300], [430, 380], [460, 720]], '#8a7a6a', 3);
    D.drawOutlinedPolygon(ctx, [[0, 300], [380, 300], [372, 316], [0, 318]], '#6a9a4a', 2);
  }

  LM.backdrops = { drawAthens, drawHarbor, drawCretePalace, drawLabyrinthHall, drawNightSea, drawBeach, drawCliff, drawStars, drawTorch };
}(window.LM = window.LM || {}));
