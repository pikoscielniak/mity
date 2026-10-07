// Pictures for the final exam at Delphi and for the ending of the game.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const S = LM.scenery;
  const person = LM.characters.drawPerson;
  const looks = LM.characters.looks;

  function drawParnassus(ctx) {
    D.drawOutlinedPolygon(ctx, [[0, 470], [180, 200], [360, 300], [560, 140], [820, 320], [1040, 180], [1280, 360], [1280, 470]], '#8a8a9a', 3);
    D.drawOutlinedPolygon(ctx, [[520, 186], [560, 140], [610, 182], [585, 176], [560, 190], [540, 180]], P.white, 2);
    D.drawOutlinedPolygon(ctx, [[1000, 222], [1040, 180], [1086, 220], [1060, 214], [1040, 226]], P.white, 2);
  }

  function drawTripod(ctx, x, y, time) {
    [-30, 0, 30].forEach(function (legX) { D.drawLine(ctx, x + legX * 0.5, y - 90, x + legX, y, '#a8742a', 6); });
    D.drawOutlinedEllipse(ctx, x, y - 92, 44, 12, '#c8902a', 3);
    for (let wisp = 0; wisp < 4; wisp += 1) {
      const rise = (time * 22 + wisp * 30) % 120;
      D.fillCircle(ctx, x - 10 + wisp * 7 + Math.sin(time + wisp) * 8, y - 110 - rise, 10 + rise * 0.12, 'rgba(230, 230, 240, ' + (0.5 - rise / 300) + ')');
    }
  }

  function drawLaurelTree(ctx, x, y) {
    D.drawOutlinedRoundRect(ctx, { x: x - 8, y: y - 90, width: 16, height: 90 }, 4, '#6a4a2a', 2.5);
    [[-30, -110, 40], [20, -120, 44], [-4, -150, 38]].forEach(function (blob) {
      D.drawOutlinedCircle(ctx, x + blob[0], y + blob[1], blob[2], '#4a8a3a', 2.5);
    });
  }

  function drawDelphi(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 470 }, '#6a8ae0', '#ffe0b0');
    S.drawSun(ctx, 1120, 110, 44, time);
    drawParnassus(ctx);
    D.drawBandedGradient(ctx, { x: 0, y: 470, width: 1280, height: 250 }, '#c8b080', '#9a8050', 6);
    S.drawTemple(ctx, 900, 470, 1.8);
    drawLaurelTree(ctx, 140, 480);
    drawTripod(ctx, 470, 500, time);
    person(ctx, 470, 410, 1.9, looks.pythia, 'offer');
  }

  function drawLaurelWreath(ctx, x, y, radius) {
    for (let leaf = 0; leaf < 22; leaf += 1) {
      const angle = Math.PI * (0.65 + leaf * 0.078);
      [-1, 1].forEach(function (side) {
        D.drawOutlinedEllipse(ctx, x + side * Math.cos(angle) * radius, y - Math.sin(angle) * radius, 14, 7, '#5aa04a', 1.5);
      });
    }
  }

  function drawFinale(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 400 }, '#3a7fe0', '#ffe8b0');
    S.drawSun(ctx, 640, 290, 64, time);
    drawLaurelWreath(ctx, 640, 300, 120);
    S.drawSea(ctx, { x: 0, y: 400, width: 1280, height: 320 }, time);
    D.drawBandedGradient(ctx, { x: 0, y: 440, width: 1280, height: 280 }, '#e0c890', '#b8986a', 6);
    person(ctx, 170, 480, 1.7, Object.assign({}, looks.theseus, { headwear: 'crown' }), 'cheer');
    LM.winged.drawWingedPerson(ctx, 370, 480, 1.6, looks.daedalus, LM.winged.restingWings('cheer'), time);
    person(ctx, 910, 480, 1.7, looks.orpheus, 'offer');
    person(ctx, 1110, 480, 1.7, looks.ariadne, 'cheer');
  }

  LM.illustrations.delphi = drawDelphi;
  LM.illustrations.finale = drawFinale;
}(window.LM = window.LM || {}));
