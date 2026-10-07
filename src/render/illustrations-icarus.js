// Story pictures for the myth of Daedalus and Icarus. Each draws the whole 1280×720 frame;
// the story text box covers y > 486, so everything that matters stays above it.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const B = LM.backdrops;
  const S = LM.scenery;
  const person = LM.characters.drawPerson;
  const looks = LM.characters.looks;

  const CRETAN_SAIL = '#1d4f9a';
  const DAY_SKY = { top: '#3a7fe0', bottom: '#d8f0ff', horizonY: 440, sunX: 1100, sunY: 110, sunRadius: 48 };
  const HOT_SKY = { top: '#e8702a', bottom: '#ffe6a8', horizonY: 440, sunX: 1010, sunY: 130, sunRadius: 72 };
  const DUSK_SKY = { top: '#4a4a9a', bottom: '#f6b47a' };
  const marbleStatue = Object.assign({}, looks.daedalus, {
    skin: P.marble, hair: P.marbleShade, hairStyle: 'curly', beard: null, robe: P.marble, trim: P.marbleShade, dressLength: 'long',
  });
  const sicilianKing = Object.assign({}, looks.minos, { robe: '#2f8a4a', cape: '#ffd84a', hair: '#8a5a2a', beard: '#8a5a2a' });
  const { drawPairOfWings, drawWingedPerson, restingWings, drawFlyer, flapAt, drawGull, drawFallingFeathers } = LM.winged;
  const drawTag = LM.ui.drawTag;

  // ---- Landscape pieces ---------------------------------------------------------------------

  // sky: { top, bottom, horizonY, sunX, sunY, sunRadius }.
  function drawFlightSky(ctx, time, sky) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: sky.horizonY }, sky.top, sky.bottom);
    S.drawSun(ctx, sky.sunX, sky.sunY, sky.sunRadius, time);
    S.drawCloud(ctx, 1400 - ((time * 18 + 200) % 1600), sky.horizonY - 230, 0.8);
    S.drawCloud(ctx, 1400 - ((time * 11 + 1000) % 1600), sky.horizonY - 120, 0.6);
    S.drawSea(ctx, { x: 0, y: sky.horizonY, width: 1280, height: 720 - sky.horizonY }, time);
  }

  function drawPlaceLabel(ctx, text, x, y) {
    LM.ui.drawShadowText(ctx, text, x, y, 24, P.white, 'center');
  }

  function drawCreteHillside(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 400 }, DAY_SKY.top, DAY_SKY.bottom);
    S.drawSun(ctx, 1110, 120, 48, time);
    S.drawSea(ctx, { x: 0, y: 400, width: 1280, height: 320 }, time);
    D.drawOutlinedPolygon(ctx, [[0, 720], [0, 430], [300, 412], [640, 440], [820, 500], [880, 720]], P.grassDark, 3);
    D.drawOutlinedPolygon(ctx, [[0, 440], [300, 422], [640, 450], [700, 470], [300, 440], [0, 456]], P.grassLight, 0);
  }

  // A dotted line through the safe middle of the sky, between the sun and the sea.
  function drawMiddlePath(ctx, fromX, fromY, toX, toY) {
    ctx.save();
    ctx.setLineDash([4, 16]);
    D.drawLine(ctx, fromX, fromY, toX, toY, 'rgba(255, 255, 255, 0.85)', 6);
    ctx.restore();
  }

  function drawSkyBand(ctx, top, bottom, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, top, 1280, bottom - top);
  }

  function drawLabelledSkyBand(ctx, top, bottom, color, label) {
    drawSkyBand(ctx, top, bottom, color);
    drawPlaceLabel(ctx, label, 1150, top + (bottom - top) / 2 + 9);
  }

  // ---- Workshop -----------------------------------------------------------------------------

  // Świder: a T-shaped hand drill with a twisted bit.
  function drawDrill(ctx, x, y) {
    D.drawOutlinedRoundRect(ctx, { x: x - 34, y: y - 76, width: 68, height: 12 }, 5, '#a8743a', 2);
    D.drawOutlinedRoundRect(ctx, { x: x - 4, y: y - 66, width: 8, height: 62 }, 3, '#b8c0c8', 2);
    for (let twist = 0; twist < 4; twist += 1) {
      D.drawLine(ctx, x - 4, y - 36 + twist * 9, x + 4, y - 30 + twist * 9, '#5a6068', 2);
    }
  }

  // Poziomica: a wooden bar with a glass tube and its air bubble.
  function drawLevel(ctx, x, y, time) {
    D.drawOutlinedRoundRect(ctx, { x: x - 60, y: y - 18, width: 120, height: 18 }, 4, '#c8903a', 2);
    D.drawOutlinedRoundRect(ctx, { x: x - 18, y: y - 15, width: 36, height: 12 }, 5, '#b8f070', 1.5);
    D.drawOutlinedEllipse(ctx, x + Math.sin(time) * 3, y - 9, 5, 3.5, '#f0ffe0', 1);
  }

  function drawToolTable(ctx, x, y, time) {
    D.drawOutlinedRoundRect(ctx, { x: x - 10, y: y, width: 12, height: 476 - y }, 3, '#7a4a20', 2.5);
    D.drawOutlinedRoundRect(ctx, { x: x + 238, y: y, width: 12, height: 476 - y }, 3, '#7a4a20', 2.5);
    D.drawOutlinedRoundRect(ctx, { x: x - 20, y: y - 14, width: 280, height: 18 }, 4, '#a8743a', 2.5);
    drawDrill(ctx, x + 40, y - 14);
    drawLevel(ctx, x + 170, y - 14, time);
    drawTag(ctx, 'świder', x + 40, y - 104);
    drawTag(ctx, 'poziomica', x + 170, y - 48);
  }

  function drawStatue(ctx, x, y, scale, time) {
    D.drawOutlinedRoundRect(ctx, { x: x - 40 * scale, y: y - 30 * scale, width: 80 * scale, height: 30 * scale }, 4, P.marbleShade, 3);
    ctx.save();
    ctx.translate(x, y - 30 * scale);
    ctx.rotate(Math.sin(time * 1.5) * 0.03);
    person(ctx, 0, 0, scale, marbleStatue, 'point');
    ctx.restore();
  }

  function drawWorkbench(ctx, time) {
    D.drawOutlinedRoundRect(ctx, { x: 470, y: 400, width: 16, height: 76 }, 3, '#7a4a20', 2.5);
    D.drawOutlinedRoundRect(ctx, { x: 800, y: 400, width: 16, height: 76 }, 3, '#7a4a20', 2.5);
    D.drawOutlinedRoundRect(ctx, { x: 450, y: 384, width: 390, height: 22 }, 4, '#a8743a', 3);
    LM.workshopArt.drawWaxPot(ctx, 540, 384, time);
    [0, 1, 2, 3, 4].forEach(function (index) {
      LM.props.drawFeather(ctx, 640 + index * 34, 372, 2.4, -0.3 + index * 0.15);
    });
  }

  // ---- Crete, Sicily and Ikaria -------------------------------------------------------------

  // A parchment with the plan of the labyrinth: rings of walls, each with a gap.
  function drawLabyrinthPlan(ctx, x, y) {
    D.drawOutlinedRoundRect(ctx, { x: x - 66, y: y - 50, width: 132, height: 100 }, 6, P.parchment, 3);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#7a3a10';
    [40, 28, 16].forEach(function (ringSize, index) {
      ctx.strokeRect(x - ringSize * 1.3, y - ringSize, ringSize * 2.6, ringSize * 2);
      ctx.fillStyle = P.parchment;
      ctx.fillRect(x - 6 + (index % 2 ? 14 : -14), index % 2 ? y + ringSize - 4 : y - ringSize - 4, 12, 8);
    });
  }

  function drawThrone(ctx, x, y) {
    D.drawOutlinedRoundRect(ctx, { x: x - 54, y: y - 210, width: 108, height: 170 }, 14, P.gold, 3);
    D.drawOutlinedRoundRect(ctx, { x: x - 40, y: y - 196, width: 80, height: 150 }, 10, '#c8281a', 2.5);
    D.drawOutlinedRoundRect(ctx, { x: x - 66, y: y - 60, width: 132, height: 60 }, 6, '#c8a030', 3);
  }

  // A dream of Athens; the small bubbles trail off to the left, towards the dreamer's head.
  function drawThoughtBubble(ctx, x, y, time) {
    D.drawOutlinedCircle(ctx, x - 275, y - 20, 9, P.white, 2.5);
    D.drawOutlinedCircle(ctx, x - 220, y - 8, 14, P.white, 2.5);
    D.drawOutlinedEllipse(ctx, x, y, 140, 90, P.white, 3);
    S.drawSun(ctx, x + 92, y - 46, 14, time);
    S.drawTemple(ctx, x, y + 34, 0.95);
    drawTag(ctx, 'Ateny', x, y + 70);
  }

  function drawGrave(ctx, x, y) {
    D.drawOutlinedEllipse(ctx, x, y, 90, 26, '#8a6a3a', 3);
    D.drawOutlinedRoundRect(ctx, { x: x - 22, y: y - 86, width: 44, height: 76 }, 18, '#b8b0a0', 3);
    [-56, -30, 34, 60].forEach(function (flowerX) {
      D.drawOutlinedCircle(ctx, x + flowerX, y - 12, 6, flowerX < 0 ? '#ff8ab0' : P.gold, 1.5);
    });
  }

  function drawIkariaShore(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 330 }, DUSK_SKY.top, DUSK_SKY.bottom);
    S.drawSun(ctx, 300, 300, 46, time);
    S.drawSea(ctx, { x: 0, y: 330, width: 1280, height: 390 }, time, { top: '#3a70c0', bottom: '#14306a', foam: '#ffd8b0', wave: '#5a8ad0' });
    D.drawOutlinedPolygon(ctx, [[560, 720], [600, 400], [760, 330], [1000, 300], [1280, 320], [1280, 720]], '#6a8a4a', 3);
    D.drawOutlinedPolygon(ctx, [[600, 470], [620, 430], [1280, 430], [1280, 470]], '#d8c088', 0);
    drawPlaceLabel(ctx, 'Ikaria', 1080, 280);
    drawPlaceLabel(ctx, 'Morze Ikaryjskie', 270, 420);
  }

  // Etna smokes behind the coast of Sicily; Minos's fleet sails in from the left.
  function drawSicily(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 420 }, '#4a8ae0', '#ffe8c0');
    [0, 1, 2].forEach(function (puff) {
      const rise = (time * 10 + puff * 27) % 80;
      D.fillCircle(ctx, 1010 + puff * 10 + rise * 0.5, 170 - rise, 18 + rise * 0.15, 'rgba(120, 110, 110, 0.45)');
    });
    D.drawOutlinedPolygon(ctx, [[720, 440], [960, 180], [1060, 180], [1280, 400], [1280, 440]], '#8a6a5a', 3);
    D.drawOutlinedPolygon(ctx, [[960, 180], [1060, 180], [1090, 214], [1040, 204], [1000, 222], [940, 202]], P.white, 2);
    S.drawSea(ctx, { x: 0, y: 380, width: 1280, height: 340 }, time);
    D.drawOutlinedPolygon(ctx, [[460, 720], [520, 440], [700, 410], [1280, 420], [1280, 720]], '#c8b070', 3);
    drawPlaceLabel(ctx, 'Sycylia', 640, 130);
    S.drawShip(ctx, 140, 400, 0.45, CRETAN_SAIL, time);
    S.drawShip(ctx, 300, 410, 0.4, CRETAN_SAIL, time + 1);
  }

  // ---- The pictures -------------------------------------------------------------------------

  const PICTURES = {
    'ika-inventor': function (ctx, time) {
      B.drawAthens(ctx, time);
      person(ctx, 180, 490, 2.4, looks.daedalus, 'point');
      drawStatue(ctx, 420, 490, 2.0, time);
      drawToolTable(ctx, 640, 410, time);
    },
    'ika-crete': function (ctx, time) {
      B.drawCretePalace(ctx, time);
      person(ctx, 320, 490, 2.4, looks.daedalus, 'point');
      drawLabyrinthPlan(ctx, 540, 300);
      person(ctx, 840, 490, 2.6, looks.minos, 'stand');
    },
    'ika-homesick': function (ctx, time) {
      B.drawCliff(ctx, time);
      person(ctx, 110, 304, 1.3, looks.icarus, 'stand');
      person(ctx, 260, 304, 1.7, looks.daedalus, 'mourn');
      drawThoughtBubble(ctx, 620, 170, time);
    },
    'ika-minos-refuses': function (ctx, time) {
      B.drawCretePalace(ctx, time);
      drawThrone(ctx, 200, 490);
      person(ctx, 400, 490, 2.6, looks.minos, 'point');
      person(ctx, 780, 490, 2.3, looks.daedalus, 'mourn');
      person(ctx, 940, 490, 1.8, looks.icarus, 'stand');
    },
    'ika-guarded-sea': function (ctx, time) {
      B.drawHarbor(ctx, time);
      S.drawShip(ctx, 1080, 420, 0.7, CRETAN_SAIL, time + 2);
      S.drawShip(ctx, 840, 470, 1.1, CRETAN_SAIL, time);
      person(ctx, 200, 500, 2.3, looks.daedalus, 'mourn');
      person(ctx, 360, 500, 1.8, looks.icarus, 'stand');
    },
    'ika-birds': function (ctx, time) {
      drawCreteHillside(ctx, time);
      [[560, 150], [700, 110], [820, 180], [980, 250]].forEach(function (spot, index) {
        drawGull(ctx, spot[0] + Math.sin(time + index) * 20, spot[1] + Math.cos(time * 1.3 + index) * 10, 1.4, time);
      });
      person(ctx, 300, 470, 2.4, looks.daedalus, 'point');
      person(ctx, 150, 470, 1.8, looks.icarus, 'stand');
    },
    'ika-workshop': function (ctx, time) {
      LM.workshopArt.drawWorkshop(ctx, time);
      drawPairOfWings(ctx, 650, 340, 1.4, { flap: 0.2 }, time);
      drawWorkbench(ctx, time);
      person(ctx, 330, 490, 2.4, looks.daedalus, 'offer');
      drawFallingFeathers(ctx, { x: 920, y: 150, width: 170, height: 220 }, 4, time);
      person(ctx, 1000, 490, 1.9, looks.icarus, 'cheer');
    },
    'ika-first-flight': function (ctx, time) {
      drawCreteHillside(ctx, time);
      drawFlyer(ctx, 780, 210 + Math.sin(time * 1.5) * 12, 1.6, looks.daedalus, { flap: flapAt(time, 3), tilt: 0.15 }, time);
      drawWingedPerson(ctx, 330, 470, 1.8, looks.icarus, restingWings('cheer'), time);
    },
    'ika-warning': function (ctx, time) {
      drawFlightSky(ctx, time, Object.assign({}, DAY_SKY, { sunX: 960 }));
      drawLabelledSkyBand(ctx, 56, 190, 'rgba(255, 110, 40, 0.22)', 'za wysoko');
      drawLabelledSkyBand(ctx, 190, 330, 'rgba(70, 200, 90, 0.22)', 'środkiem');
      drawLabelledSkyBand(ctx, 330, 440, 'rgba(30, 90, 220, 0.22)', 'za nisko');
      D.drawOutlinedPolygon(ctx, [[0, 720], [0, 470], [600, 450], [740, 500], [760, 720]], P.grassDark, 3);
      drawWingedPerson(ctx, 240, 480, 2.0, looks.daedalus, restingWings('point'), time);
      drawWingedPerson(ctx, 560, 480, 1.6, looks.icarus, restingWings('stand'), time);
    },
    'ika-takeoff': function (ctx, time) {
      drawFlightSky(ctx, time, DAY_SKY);
      S.drawIsland(ctx, 170, 470, 420, 150);
      drawPlaceLabel(ctx, 'Kreta', 160, 300);
      drawMiddlePath(ctx, 300, 330, 1280, 250);
      drawFlyer(ctx, 820, 270 + Math.sin(time * 1.4) * 8, 1.3, looks.daedalus, { flap: flapAt(time, 3), tilt: 0.3 }, time);
      drawFlyer(ctx, 560, 300 + Math.sin(time * 1.4 + 1) * 8, 1.1, looks.icarus, { flap: flapAt(time + 0.5, 3.4), tilt: 0.3 }, time);
    },
    'ika-islands': function (ctx, time) {
      drawFlightSky(ctx, time, Object.assign({}, DAY_SKY, { horizonY: 370 }));
      [['Samos', 230, 300, 90], ['Paros', 650, 230, 66], ['Delos', 1050, 180, 52]].forEach(function (island) {
        S.drawIsland(ctx, island[1], 400, island[2], island[3]);
        drawPlaceLabel(ctx, island[0], island[1], 380 - island[3]);
      });
      drawFlyer(ctx, 700, 185 + Math.sin(time * 1.4) * 8, 0.9, looks.daedalus, { flap: flapAt(time, 3), tilt: 0.3 }, time);
      drawFlyer(ctx, 530, 205 + Math.sin(time * 1.4 + 1) * 8, 0.75, looks.icarus, { flap: flapAt(time + 0.5, 3.4), tilt: 0.3 }, time);
    },
    'ika-joy': function (ctx, time) {
      drawFlightSky(ctx, time, DAY_SKY);
      drawFlyer(ctx, 1000, 360, 0.8, looks.daedalus, { flap: flapAt(time, 3), tilt: 0.3 }, time);
      drawFlyer(ctx, 540, 285 + Math.sin(time * 2) * 12, 1.9, looks.icarus, { flap: flapAt(time, 4.5), tilt: 0.2, pose: 'cheer' }, time);
    },
    'ika-higher': function (ctx, time) {
      drawFlightSky(ctx, time, HOT_SKY);
      drawMiddlePath(ctx, 0, 380, 1280, 330);
      drawFlyer(ctx, 330, 340 + Math.sin(time * 1.4) * 8, 1.0, looks.daedalus, { flap: flapAt(time, 3), tilt: 0.25 }, time);
      drawFlyer(ctx, 790, 190 + Math.sin(time * 2) * 10, 1.3, looks.icarus, { flap: flapAt(time, 4.5), tilt: -0.3, pose: 'cheer', isMelting: true }, time);
    },
    'ika-fall': function (ctx, time) {
      drawFlightSky(ctx, time, HOT_SKY);
      drawFallingFeathers(ctx, { x: 420, y: 80, width: 520, height: 360 }, 9, time);
      drawFlyer(ctx, 640, 270, 1.4, looks.icarus, { flap: 0.9 + Math.sin(time * 7) * 0.3, tilt: 2.6 + Math.sin(time * 2) * 0.15, pose: 'cheer', featherCount: 2 }, time);
      drawFlyer(ctx, 200, 330, 0.9, looks.daedalus, { flap: flapAt(time, 3), tilt: 0.2 }, time);
    },
    'ika-burial': function (ctx, time) {
      drawIkariaShore(ctx, time);
      drawGrave(ctx, 980, 460);
      person(ctx, 800, 470, 2.2, looks.daedalus, 'mourn');
      LM.props.drawFeather(ctx, 1110, 452, 2.4, 0.3);
      LM.props.drawFeather(ctx, 690, 456, 2.4, -0.4);
    },
    'ika-sicily': function (ctx, time) {
      drawSicily(ctx, time);
      S.drawTemple(ctx, 1110, 420, 1.1);
      person(ctx, 680, 480, 2.3, looks.daedalus, 'offer');
      person(ctx, 900, 480, 2.5, sicilianKing, 'stand');
    },
    'ika-dream': function (ctx, time) {
      B.drawCliff(ctx, time);
      S.drawSun(ctx, 880, 320, 50, time);
      [[560, 200], [660, 160], [760, 230], [880, 190]].forEach(function (spot, index) {
        drawGull(ctx, spot[0] + ((time * 25) % 120), spot[1] + Math.sin(time + index) * 10, 1.2, time);
      });
      drawWingedPerson(ctx, 230, 304, 1.3, looks.daedalus, restingWings('stand'), time);
    },
    'ika-player-wings': function (ctx, time) {
      drawFlightSky(ctx, time, DAY_SKY);
      drawSkyBand(ctx, 190, 330, 'rgba(70, 200, 90, 0.22)');
      D.fillCircle(ctx, 640, 250, 130, 'rgba(255, 220, 90, 0.4)');
      drawPairOfWings(ctx, 640, 440, 2.4, { flap: flapAt(time, 2) }, time);
      D.drawStar(ctx, 640, 262, 38, 17, P.gold, 3);
      drawFallingFeathers(ctx, { x: 300, y: 70, width: 680, height: 380 }, 7, time);
    },
  };

  Object.keys(PICTURES).forEach(function (id) { LM.illustrations[id] = PICTURES[id]; });
}(window.LM = window.LM || {}));
