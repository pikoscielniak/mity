// A schematic map of the Aegean with Sicily far to the west, in the game's cartoon style.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const LAND = '#d8c48a';
  const LAND_SHADE = '#b8a468';
  const MAINLAND = [[300, 56], [760, 56], [1040, 80], [1000, 150], [880, 160], [760, 150], [640, 180], [560, 230],
    [520, 270], [600, 320], [610, 365], [560, 360], [520, 330], [480, 320], [500, 380], [560, 420], [520, 470],
    [470, 520], [430, 470], [400, 520], [360, 450], [380, 380], [330, 300], [300, 200]];
  const ASIA_MINOR = [[1080, 120], [1280, 90], [1280, 664], [1060, 664], [1080, 560], [1030, 480], [1060, 420],
    [1010, 330], [1040, 260], [1000, 210], [1050, 170]];
  const CRETE = [[600, 560], [680, 548], [760, 556], [840, 552], [890, 566], [860, 590], [760, 594], [660, 596], [600, 584]];
  const SICILY = [[40, 420], [190, 430], [170, 520], [80, 500]];
  const SMALL_ISLANDS = [
    { x: 760, y: 448, rx: 26, ry: 18 }, { x: 705, y: 462, rx: 20, ry: 14 }, { x: 728, y: 404, rx: 10, ry: 7 },
    { x: 975, y: 352, rx: 28, ry: 14 }, { x: 900, y: 372, rx: 30, ry: 10 }, { x: 955, y: 196, rx: 40, ry: 24 },
  ];

  function drawLand(ctx, points) {
    D.drawOutlinedPolygon(ctx, points, LAND, 3);
  }

  function drawMountains(ctx) {
    [[420, 240], [470, 200], [700, 110], [860, 100], [1150, 300], [1180, 500]].forEach(function (peak) {
      D.drawOutlinedPolygon(ctx, [[peak[0] - 22, peak[1] + 16], [peak[0], peak[1] - 14], [peak[0] + 22, peak[1] + 16]], LAND_SHADE, 2);
    });
  }

  function drawSeaLabels(ctx) {
    LM.text.drawTextLine(ctx, 'Morze Egejskie', 820, 290, { font: 'italic ' + LM.text.boldFont(26), color: 'rgba(255, 255, 255, 0.75)', align: 'center' });
    LM.text.drawTextLine(ctx, 'Morze Ikaryjskie', 905, 470, { font: 'italic ' + LM.text.boldFont(16), color: 'rgba(255, 255, 255, 0.75)', align: 'center' });
    LM.text.drawTextLine(ctx, 'Morze Jońskie', 190, 330, { font: 'italic ' + LM.text.boldFont(20), color: 'rgba(255, 255, 255, 0.6)', align: 'center' });
  }

  function drawCompass(ctx, x, y) {
    D.drawOutlinedCircle(ctx, x, y, 34, 'rgba(255, 247, 224, 0.85)', 2.5);
    D.drawOutlinedPolygon(ctx, [[x, y - 30], [x + 8, y], [x, y + 30], [x - 8, y]], P.titleBarBottom, 2);
    LM.text.drawTextLine(ctx, 'N', x, y - 38, { font: LM.text.boldFont(16), color: P.white, align: 'center', shadowColor: P.textShadow });
  }

  function drawMapBase(ctx, time) {
    LM.scenery.drawSea(ctx, { x: 0, y: 56, width: 1280, height: 608 }, time * 0.3, { top: '#3a8ae0', bottom: '#1a4a9a', foam: '#9ad0ff', wave: '#5aa0e8' });
    drawLand(ctx, SICILY);
    drawLand(ctx, MAINLAND);
    drawLand(ctx, ASIA_MINOR);
    drawLand(ctx, CRETE);
    SMALL_ISLANDS.forEach(function (island) { D.drawOutlinedEllipse(ctx, island.x, island.y, island.rx, island.ry, LAND, 2.5); });
    drawMountains(ctx);
    drawSeaLabels(ctx);
    drawCompass(ctx, 1200, 610);
  }

  function drawPlaceLabel(ctx, place, state) {
    const color = state === 'highlighted' ? P.gold : P.white;
    LM.text.drawTextLine(ctx, place.name, place.x, place.y - 16, { font: LM.text.boldFont(17), color: color, align: 'center', shadowColor: P.textShadow });
    D.drawOutlinedCircle(ctx, place.x, place.y, 5, color, 2);
  }

  // A mission's place name sits on a tag under its medallion.
  function drawDestinationLabel(ctx, place) {
    LM.ui.drawTag(ctx, place.name, place.x, place.y + 58);
  }

  // A round medallion marking a mission; icon: 'labyrinth' | 'wings' | 'lute' | 'oracle'.
  function drawMedallion(ctx, x, y, icon, state, time) {
    const radius = state === 'selected' ? 34 + Math.sin(time * 5) * 2 : 30;
    D.fillCircle(ctx, x, y, radius + 8, state === 'selected' ? 'rgba(255, 216, 74, 0.45)' : 'rgba(0, 0, 0, 0.2)');
    D.drawOutlinedCircle(ctx, x, y, radius, '#fff2c8', 3);
    D.drawOutlinedCircle(ctx, x, y, radius - 6, '#c0660f', 2);
    LM.mapIcons.drawIcon(ctx, icon, x, y);
  }

  function drawFog(ctx, x, y, time) {
    [[-26, 4, 26], [0, -10, 32], [26, 4, 26], [0, 14, 28]].forEach(function (puff, index) {
      D.fillCircle(ctx, x + puff[0] + Math.sin(time + index) * 3, y + puff[1], puff[2], 'rgba(230, 236, 245, 0.92)');
    });
    D.drawOutlinedRoundRect(ctx, { x: x - 10, y: y - 6, width: 20, height: 16 }, 3, '#8a8a9a', 2);
    ctx.beginPath();
    ctx.arc(x, y - 6, 7, Math.PI, 0);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#8a8a9a';
    ctx.stroke();
  }

  LM.mapPainter = { drawMapBase, drawPlaceLabel, drawDestinationLabel, drawMedallion, drawFog };
}(window.LM = window.LM || {}));
