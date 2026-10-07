// Story pictures for the myth of Orpheus and Eurydice. Each draws the whole 1280×720 frame.
// The underworld is painted in purples and teals instead of black, so the dark scenes stay readable.
(function (LM) {
  'use strict';

  const B = LM.backdrops;
  const S = LM.scenery;
  const D = LM.draw;
  const P = LM.palette;
  const person = LM.characters.drawPerson;
  const looks = LM.characters.looks;
  const STYX_WATER = { top: '#2a9a9a', bottom: '#123a5a', foam: '#9ae8d8', wave: '#4ab8b0' };
  const CAVERN_ROCK = '#3a2d62';
  const CHARON_HOOD = '#2e2840';
  const DAY_LEAVES = { dark: '#3f8a3a', light: '#4fa04a', shine: '#7ac86a' };
  const DUSK_LEAVES = { dark: '#2f5a4a', light: '#3a6a56', shine: '#5a8a6a' };
  const SAD_NOTE = '#8ad0ff';
  const charonLook = Object.assign({}, looks.hades, { robe: '#3d3452', trim: '#6a8aa8', cape: CHARON_HOOD, hair: '#b8b8c0', beard: '#b8b8c0', headwear: null });
  const aristaeusLook = Object.assign({}, looks.youth, { robe: '#f0a830', trim: '#8a4a10', hairStyle: 'curly' });
  const erinysLook = Object.assign({}, looks.eurydice, { robe: '#7a1d3d', trim: '#e05a7a', hair: '#2a2438', skin: '#ecc8c4', headwear: null });
  const eurydiceShade = Object.assign({}, looks.eurydice, { robe: '#e4f4f2', trim: '#7ac8c8', skin: '#e2eeea', hair: '#d8cca8' });
  const museLooks = ['#f08ab0', '#8ab8f0', '#f0c850'].map(function (robe) {
    return Object.assign({}, looks.eurydice, { robe: robe, trim: P.gold, hair: '#6a3a1a' });
  });

  function withAlpha(ctx, alpha, drawFn) {
    ctx.save();
    ctx.globalAlpha = alpha;
    drawFn();
    ctx.restore();
  }

  // Rotates a drawing around its base point: leaning runners, bowing trees, a nymph lying in the grass.
  function withLean(ctx, x, y, lean, drawFn) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean);
    drawFn();
    ctx.restore();
  }

  function strokePolyline(ctx, points, color, width) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(function (point) { ctx.lineTo(point[0], point[1]); });
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  // A range of hills or mountains; the shape closes along the bottom edge of the picture.
  function drawRidge(ctx, points, color) {
    D.drawOutlinedPolygon(ctx, [[0, 720]].concat(points, [[1280, 720]]), color, 3);
  }

  function drawGround(ctx, top, topColor, bottomColor) {
    D.drawBandedGradient(ctx, { x: 0, y: top, width: 1280, height: 720 - top }, topColor, bottomColor, 7);
    ctx.fillStyle = P.outline;
    ctx.fillRect(0, top, 1280, 3);
  }

  function drawHalo(ctx, x, y, radius, rgb) {
    [[1, 0.12], [0.75, 0.18], [0.5, 0.26]].forEach(function (ring) {
      D.fillCircle(ctx, x, y, radius * ring[0], 'rgba(' + rgb + ', ' + ring[1] + ')');
    });
  }

  // ---- Music, sparkles and other small magic ----

  function drawMusicNote(ctx, x, y, size, color) {
    const stemX = x + size * 0.55;
    D.drawLine(ctx, stemX, y, stemX, y - size * 2, P.outline, 5);
    D.drawLine(ctx, stemX, y, stemX, y - size * 2, color, 2.5);
    D.drawOutlinedPolygon(ctx, [[stemX, y - size * 2], [stemX + size * 0.9, y - size * 1.3], [stemX, y - size * 1.5]], color, 1.5);
    D.drawOutlinedEllipse(ctx, x, y, size * 0.65, size * 0.48, color, 2);
  }

  // Notes rise from (x, y) and fade out, so the song seems to float through the picture.
  function drawRisingNotes(ctx, x, y, time, color) {
    for (let note = 0; note < 4; note += 1) {
      const rise = (time * 0.3 + note / 4) % 1;
      withAlpha(ctx, 1 - rise, function () {
        drawMusicNote(ctx, x + note * 30 + Math.sin(time * 2 + note) * 16, y - rise * 170, 13, color);
      });
    }
  }

  // Notes carried by the waves from one point to another, fading in and out on the way.
  function drawDriftingNotes(ctx, fromX, toX, y, time) {
    for (let note = 0; note < 5; note += 1) {
      const progress = (time * 0.08 + note / 5) % 1;
      withAlpha(ctx, Math.sin(progress * Math.PI), function () {
        drawMusicNote(ctx, fromX + (toX - fromX) * progress, y + Math.sin(time * 2 + note) * 10, 14, P.gold);
      });
    }
  }

  // Pale sparkles drifting upwards: the gentle sign of a soul.
  function drawSparkles(ctx, x, y, time) {
    for (let sparkle = 0; sparkle < 6; sparkle += 1) {
      const rise = (time * 0.25 + sparkle / 6) % 1;
      withAlpha(ctx, 1 - rise, function () {
        D.drawStar(ctx, x + Math.sin(sparkle * 2.1 + time) * 60, y - rise * 200, 9, 4, '#e8fff8', 1.2);
      });
    }
  }

  function drawSleepyZs(ctx, x, y, time) {
    for (let letter = 0; letter < 3; letter += 1) {
      const rise = (time * 0.4 + letter / 3) % 1;
      withAlpha(ctx, 1 - rise, function () {
        LM.text.drawTextLine(ctx, 'z', x + rise * 50, y - rise * 90, { font: LM.text.boldFont(24 + letter * 6), color: '#efe8ff', shadowColor: P.textShadow });
      });
    }
  }

  function drawPlaceLabel(ctx, name, x, y) {
    LM.text.drawTextLine(ctx, name, x, y, { font: LM.text.boldFont(30), color: P.white, align: 'center', shadowColor: P.textShadow });
  }

  // ---- Nature: trees, flowers, grass and animals ----

  // A round cartoon tree; (x, baseY) is the foot of the trunk, ~170 px tall at scale 1. lean bows it sideways.
  function drawTree(ctx, x, baseY, scale, lean, leaves) {
    withLean(ctx, x, baseY, lean, function () {
      ctx.scale(scale, scale);
      D.drawOutlinedRoundRect(ctx, { x: -10, y: -90, width: 20, height: 90 }, 4, '#7a4a20', 2.5);
      D.drawOutlinedCircle(ctx, -28, -98, 32, leaves.dark, 2.5);
      D.drawOutlinedCircle(ctx, 28, -98, 32, leaves.dark, 2.5);
      D.drawOutlinedCircle(ctx, 0, -130, 40, leaves.light, 2.5);
      D.fillCircle(ctx, -12, -144, 13, leaves.shine);
    });
  }

  function drawFlower(ctx, x, y, color) {
    D.drawLine(ctx, x, y, x, y - 18, '#3a7a2a', 3);
    for (let petal = 0; petal < 5; petal += 1) {
      const angle = petal * Math.PI * 0.4;
      D.drawOutlinedCircle(ctx, x + Math.cos(angle) * 6, y - 22 + Math.sin(angle) * 6, 5, color, 1.2);
    }
    D.drawOutlinedCircle(ctx, x, y - 22, 4, P.gold, 1.2);
  }

  // flowers: [[x, y, colour], …]
  function drawFlowers(ctx, flowers) {
    flowers.forEach(function (flower) { drawFlower(ctx, flower[0], flower[1], flower[2]); });
  }

  function drawGrassTufts(ctx, y, color, seed) {
    const rng = LM.random.createRng(seed);
    for (let tuft = 0; tuft < 24; tuft += 1) {
      const x = rng() * 1280;
      D.drawOutlinedPolygon(ctx, [[x - 14, y], [x - 7, y - 30], [x, y - 10], [x + 6, y - 34], [x + 14, y]], color, 1.5);
    }
  }

  function drawClosedEyes(ctx, x, y, spread) {
    ctx.strokeStyle = P.outline;
    ctx.lineWidth = 2;
    [-spread, spread].forEach(function (eyeX) {
      ctx.beginPath();
      ctx.arc(x + eyeX, y, 4, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    });
  }

  // Animals resting peacefully at the singer's feet; (x, y) is where they lie.
  function drawRestingBear(ctx, x, y, scale) {
    D.withTransform(ctx, x, y, scale, function () {
      D.drawOutlinedEllipse(ctx, 10, -26, 58, 26, '#7a4a2a', 2.5);
      [-26, 2].forEach(function (pawX) { D.drawOutlinedEllipse(ctx, pawX, -6, 14, 7, '#6a3a1a', 2); });
      [-64, -36].forEach(function (earX) { D.drawOutlinedCircle(ctx, earX, -58, 8, '#7a4a2a', 2); });
      D.drawOutlinedCircle(ctx, -50, -38, 22, '#7a4a2a', 2.5);
      D.drawOutlinedEllipse(ctx, -54, -28, 11, 8, '#c89a6a', 2);
      D.fillCircle(ctx, -54, -31, 3, P.outline);
      drawClosedEyes(ctx, -50, -44, 8);
    });
  }

  function drawAntlers(ctx, x, y) {
    [-1, 1].forEach(function (side) {
      D.drawLine(ctx, x + side * 4, y + 6, x + side * 14, y - 18, '#7a4a20', 3.5);
      D.drawLine(ctx, x + side * 9, y - 6, x + side * 20, y - 8, '#7a4a20', 3);
    });
  }

  function drawRestingDeer(ctx, x, y, scale) {
    D.withTransform(ctx, x, y, scale, function () {
      D.drawOutlinedEllipse(ctx, 0, -24, 50, 22, '#c8803a', 2.5);
      [[-20, -30], [2, -22], [20, -32]].forEach(function (spot) { D.fillCircle(ctx, spot[0], spot[1], 4, '#f4e0c0'); });
      D.drawOutlinedPolygon(ctx, [[26, -38], [46, -38], [58, -74], [42, -76]], '#c8803a', 2.5);
      drawAntlers(ctx, 50, -96);
      D.drawOutlinedEllipse(ctx, 52, -82, 15, 12, '#c8803a', 2.5);
      D.drawOutlinedEllipse(ctx, 64, -77, 7, 5, '#e8c8a0', 1.5);
      D.fillCircle(ctx, 68, -78, 2.2, P.outline);
      drawClosedEyes(ctx, 50, -86, 5);
    });
  }

  function drawRestingRabbit(ctx, x, y, scale) {
    D.withTransform(ctx, x, y, scale, function () {
      D.drawOutlinedEllipse(ctx, 0, -16, 26, 16, '#e8e4dc', 2.5);
      D.drawOutlinedEllipse(ctx, -14, -58, 5, 16, '#e8e4dc', 2);
      D.drawOutlinedEllipse(ctx, -2, -60, 5, 16, '#e8e4dc', 2);
      D.drawOutlinedCircle(ctx, -8, -34, 13, '#e8e4dc', 2.5);
      D.fillCircle(ctx, -8, -29, 2.5, '#e87a8a');
      drawClosedEyes(ctx, -8, -37, 5);
      D.drawOutlinedCircle(ctx, 25, -14, 6, P.white, 1.5);
    });
  }

  // A small viper slithering away through the grass, head to the right.
  function drawViper(ctx, x, y, scale, time) {
    const body = [];
    for (let step = 0; step <= 16; step += 1) {
      body.push([-step * 6, Math.sin(time * 5 - step * 0.6) * 6]);
    }
    D.withTransform(ctx, x, y, scale, function () {
      strokePolyline(ctx, body, P.outline, 14);
      strokePolyline(ctx, body, '#9a8a3a', 9);
      body.filter(function (point, index) { return index % 3 === 1; }).forEach(function (point) {
        D.fillCircle(ctx, point[0], point[1], 2.5, '#4a3a1a');
      });
      D.drawOutlinedEllipse(ctx, 6, body[0][1], 11, 8, '#9a8a3a', 2);
      D.fillCircle(ctx, 10, body[0][1] - 3, 2, P.outline);
    });
  }

  // ---- People on the run and at rest ----

  function drawLeaningPerson(ctx, x, y, scale, look, pose, lean) {
    withLean(ctx, x, y, lean, function () { person(ctx, 0, 0, scale, look, pose); });
  }

  // Eurydice lying still in the grass with her eyes closed, as if asleep; her head is on the left.
  // drawPerson puts the eyes at (±6, -97); they are painted over with skin and drawn shut.
  function drawSleepingNymph(ctx, x, y, scale) {
    withLean(ctx, x, y, -Math.PI / 2, function () {
      person(ctx, 0, 0, scale, looks.eurydice, 'stand');
      ctx.scale(scale, scale);
      [-6, 6].forEach(function (eyeX) { D.fillCircle(ctx, eyeX, -97, 3.6, looks.eurydice.skin); });
      drawClosedEyes(ctx, 0, -98, 6);
    });
  }

  function drawSpeedLines(ctx, x, y) {
    [[0, 0, 60], [10, 34, 44], [-6, 68, 52]].forEach(function (line) {
      D.drawLine(ctx, x + line[0] - line[2], y + line[1], x + line[0], y + line[1], P.white, 4);
    });
  }

  // ---- Landscapes of the upper world ----

  function drawThraceValley(ctx) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 400 }, '#4a90e8', '#dff4ff');
    S.drawCloud(ctx, 980, 100, 0.8);
    drawRidge(ctx, [[0, 230], [160, 140], [330, 210], [520, 110], [700, 220], [880, 130], [1080, 200], [1280, 150]], '#8a9ac8');
    drawRidge(ctx, [[0, 330], [300, 280], [640, 330], [980, 270], [1280, 320]], '#5a9a4a');
    drawGround(ctx, 380, '#8ad06a', '#4a9a3a');
    // The river stands still to listen, so it has no waves.
    D.drawOutlinedPolygon(ctx, [[0, 352], [1280, 340], [1280, 372], [0, 388]], '#6ac0f0', 2.5);
    ctx.fillStyle = '#c8ecff';
    ctx.fillRect(140, 362, 260, 3);
    ctx.fillRect(820, 354, 220, 3);
  }

  function drawValleyOfTempe(ctx) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 420 }, '#4a90e8', '#dff4ff');
    S.drawCloud(ctx, 560, 110, 0.8);
    drawRidge(ctx, [[0, 100], [210, 150], [440, 330], [640, 410], [850, 320], [1070, 140], [1280, 90]], '#4a8a3a');
    drawGround(ctx, 400, '#8ad06a', '#4a9a3a');
    D.drawOutlinedPolygon(ctx, [[610, 402], [670, 402], [800, 720], [480, 720]], '#5ab0e8', 2.5);
  }

  function drawCaveAtDusk(ctx) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 460 }, '#3a2a6a', '#f0a070');
    drawRidge(ctx, [[0, 300], [220, 240], [420, 290], [560, 250]], '#6a5a8a');
    D.drawOutlinedPolygon(ctx, [[560, 470], [760, 170], [1000, 110], [1280, 190], [1280, 470]], '#7a6a72', 3);
    drawArchOpening(ctx, 960, 470, 110, 110, '#241c46');
    D.fillCircle(ctx, 960, 400, 70, 'rgba(160, 110, 255, 0.25)');
    drawGround(ctx, 460, '#8a7a5a', '#5a4a3a');
  }

  function drawThraceDusk(ctx) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 420 }, '#2e2a6a', '#f0a070');
    B.drawStars(ctx, 30, 5);
    D.fillCircle(ctx, 1090, 120, 34, '#fff6d8');
    drawRidge(ctx, [[0, 250], [200, 170], [420, 240], [640, 160], [900, 250], [1100, 190], [1280, 240]], '#4a3a7a');
    drawRidge(ctx, [[0, 380], [360, 330], [640, 400], [960, 340], [1280, 380]], '#3a5a4a');
    drawGround(ctx, 450, '#4a6a50', '#2a4a3a');
  }

  function drawSunsetSea(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 400 }, '#5a4aa8', '#f8b878');
    S.drawSun(ctx, 260, 380, 50, time);
    S.drawSea(ctx, { x: 0, y: 400, width: 1280, height: 320 }, time);
  }

  function drawMountOlympus(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 440 }, '#5aa0f0', '#e8f6ff');
    D.drawOutlinedPolygon(ctx, [[200, 460], [480, 220], [570, 250], [680, 110], [800, 230], [900, 190], [1180, 460]], '#8a8aa8', 3);
    D.drawOutlinedPolygon(ctx, [[620, 186], [680, 110], [742, 186], [712, 170], [682, 192], [652, 172]], P.white, 2.5);
    S.drawTemple(ctx, 680, 116, 0.45);
    S.drawCloud(ctx, 470 + Math.sin(time * 0.3) * 10, 220, 0.9);
    S.drawCloud(ctx, 820 - Math.sin(time * 0.3) * 10, 196, 0.7);
    drawPlaceLabel(ctx, 'Olimp', 860, 120);
    drawGround(ctx, 430, '#8ad06a', '#4a9a3a');
  }

  // A grassy mound with flowers and a lute where the Muses buried the singer.
  function drawGraveMound(ctx, x, y) {
    D.drawOutlinedEllipse(ctx, x, y, 140, 50, '#5aa04a', 3);
    D.withTransform(ctx, x, y - 10, 2.2, function () { LM.props.drawLute(ctx, 0, 0); });
    drawFlowers(ctx, [[x - 100, y - 4, '#f08ab0'], [x - 60, y - 22, '#ffffff'], [x + 60, y - 22, '#8ab8f0'], [x + 100, y - 4, '#f0c850']]);
  }

  // ---- The underworld ----

  // An opening with straight sides and a round top, like a cave mouth or a gateway. (x, y) is the bottom centre.
  function drawArchOpening(ctx, x, y, halfWidth, sideHeight, color) {
    ctx.beginPath();
    ctx.moveTo(x - halfWidth, y);
    ctx.lineTo(x - halfWidth, y - sideHeight);
    ctx.arc(x, y - sideHeight, halfWidth, Math.PI, Math.PI * 2);
    ctx.lineTo(x + halfWidth, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = P.outline;
    ctx.stroke();
  }

  function drawStalactites(ctx) {
    for (let index = 0; index < 12; index += 1) {
      const x = 40 + index * 110;
      const length = 40 + (index * 47) % 70;
      D.drawOutlinedPolygon(ctx, [[x - 34, 54], [x + 34, 54], [x + 4, 54 + length]], CAVERN_ROCK, 2.5);
    }
  }

  // Teal motes of light floating in the dark keep the underworld readable and a little magical.
  function drawFloatingMotes(ctx, time) {
    const rng = LM.random.createRng(11);
    for (let mote = 0; mote < 24; mote += 1) {
      const x = rng() * 1280;
      const y = 90 + rng() * 360 + Math.sin(time + mote) * 6;
      const glow = 0.35 + 0.3 * Math.sin(time * 2 + mote);
      D.fillCircle(ctx, x, y, 3, 'rgba(140, 240, 220, ' + glow.toFixed(2) + ')');
    }
  }

  function drawCavern(ctx, time) {
    D.drawBandedGradient(ctx, { x: 0, y: 0, width: 1280, height: 720 }, '#1f1844', '#4a3c80', 12);
    drawStalactites(ctx);
    drawFloatingMotes(ctx, time);
  }

  function drawUnderworldFloor(ctx, top) {
    drawGround(ctx, top, '#5a4c88', '#2c2650');
  }

  // The slow, dark river; its waves drift at less than half the speed of the sea.
  function drawStyx(ctx, top, time) {
    S.drawSea(ctx, { x: 0, y: top, width: 1280, height: 720 - top }, time * 0.4, STYX_WATER);
  }

  function drawFarShore(ctx, waterTop) {
    D.drawOutlinedPolygon(ctx, [[0, waterTop], [0, waterTop - 50], [260, waterTop - 80], [520, waterTop - 40], [800, waterTop - 90], [1080, waterTop - 50], [1280, waterTop - 70], [1280, waterTop]], CAVERN_ROCK, 3);
  }

  // A waiting soul: a pale, friendly wisp with two dot eyes. (x, y) is the tip of its tail.
  function drawSoul(ctx, x, y, time) {
    D.withTransform(ctx, x, y + Math.sin(time * 2 + x) * 5, 1, function () {
      withAlpha(ctx, 0.75, function () {
        D.drawOutlinedPolygon(ctx, [[-22, -50], [22, -50], [12, -6], [0, -16], [-8, 0], [-16, -14]], '#d8e8f8', 0);
        D.fillCircle(ctx, 0, -60, 24, '#d8e8f8');
      });
      D.fillCircle(ctx, -8, -62, 3, '#3a3a6a');
      D.fillCircle(ctx, 8, -62, 3, '#3a3a6a');
    });
  }

  function drawLantern(ctx, x, y, time) {
    const flicker = Math.sin(time * 9) * 3;
    D.fillCircle(ctx, x, y + 16, 32 + flicker, 'rgba(255, 210, 110, 0.25)');
    D.drawLine(ctx, x, y, x, y + 6, P.outline, 2);
    D.drawOutlinedRoundRect(ctx, { x: x - 9, y: y + 6, width: 18, height: 22 }, 5, '#ffd870', 2);
  }

  // Charon's long, low boat; (x, y) is the waterline centre, ~300 px long at scale 1. drawCrew paints
  // whoever stands in it, in the boat's own coordinates, before the hull hides their feet.
  function drawFerry(ctx, x, y, scale, time, drawCrew) {
    D.withTransform(ctx, x, y + Math.sin(time * 1.5) * 3, scale, function () {
      drawCrew();
      D.drawOutlinedPolygon(ctx, [[-150, -42], [150, -42], [118, 8], [-118, 8]], '#5a3e30', 3);
      ctx.fillStyle = '#3a281e';
      ctx.fillRect(-136, -30, 266, 5);
      D.drawOutlinedPolygon(ctx, [[-150, -42], [-176, -80], [-164, -84], [-138, -42]], '#5a3e30', 3);
      drawLantern(ctx, -172, -82, time);
    });
  }

  // The brim of Charon's hood covers his hair and frames the face; drawn over the head.
  function drawHoodBrim(ctx) {
    ctx.beginPath();
    ctx.arc(0, -96, 25, Math.PI, Math.PI * 2);
    ctx.arc(0, -90, 18, Math.PI * 2, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = CHARON_HOOD;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = P.outline;
    ctx.stroke();
  }

  // The hooded ferryman: an old man in a dark cloak holding a long oar. (x, y) is between his feet.
  function drawCharon(ctx, x, y, scale) {
    D.withTransform(ctx, x, y, scale, function () { D.drawOutlinedEllipse(ctx, 0, -92, 30, 34, CHARON_HOOD, 2.5); });
    person(ctx, x, y, scale, charonLook, 'offer');
    D.withTransform(ctx, x, y, scale, function () {
      drawHoodBrim(ctx);
      D.drawLine(ctx, 44, -150, -12, 70, P.outline, 8);
      D.drawLine(ctx, 44, -150, -12, 70, '#9a6a3a', 5);
    });
  }

  function drawGateStones(ctx, x, y) {
    ctx.strokeStyle = '#4a4470';
    ctx.lineWidth = 2;
    for (let row = 1; row < 7; row += 1) {
      ctx.beginPath();
      ctx.moveTo(x - 226, y - row * 54);
      ctx.lineTo(x - 146, y - row * 54);
      ctx.moveTo(x + 146, y - row * 54);
      ctx.lineTo(x + 226, y - row * 54);
      ctx.stroke();
    }
  }

  // The stone gate of the underworld: a tall arch with a glowing purple passage. (x, y) is the bottom centre.
  function drawUnderworldGate(ctx, x, y, time) {
    D.drawOutlinedRoundRect(ctx, { x: x - 230, y: y - 380, width: 460, height: 380 }, 26, '#6a6290', 3);
    drawGateStones(ctx, x, y);
    drawArchOpening(ctx, x, y, 140, 190, '#2a1f52');
    D.fillCircle(ctx, x, y - 140, 100 + Math.sin(time * 2) * 6, 'rgba(160, 110, 255, 0.22)');
    B.drawTorch(ctx, x - 186, y - 250, time);
    B.drawTorch(ctx, x + 186, y - 250, time);
  }

  // Hades's throne of dark stone with gold trim; (x, y) is the bottom centre, ~330 px tall at scale 1.
  function drawThrone(ctx, x, y, scale) {
    D.withTransform(ctx, x, y, scale, function () {
      D.drawOutlinedRoundRect(ctx, { x: -80, y: -330, width: 160, height: 330 }, 18, '#4a3a72', 3);
      D.drawOutlinedRoundRect(ctx, { x: -62, y: -312, width: 124, height: 150 }, 12, '#5e4a8c', 2.5);
      D.drawOutlinedCircle(ctx, 0, -300, 16, P.gold, 2.5);
      [-1, 1].forEach(function (side) {
        D.drawOutlinedRoundRect(ctx, { x: side * 104 - 22, y: -150, width: 44, height: 150 }, 8, '#3c2e60', 3);
      });
    });
  }

  function drawThroneHall(ctx, time) {
    drawCavern(ctx, time);
    drawUnderworldFloor(ctx, 440);
    [70, 1210].forEach(function (pillarX) {
      D.drawOutlinedRoundRect(ctx, { x: pillarX - 30, y: 110, width: 60, height: 340 }, 6, '#5a5288', 3);
      B.drawTorch(ctx, pillarX, 190, time);
    });
    drawThrone(ctx, 700, 450, 1);
  }

  function drawErinysWings(ctx) {
    [-1, 1].forEach(function (side) {
      D.drawOutlinedPolygon(ctx, [[side * 12, -76], [side * 62, -118], [side * 56, -84], [side * 70, -66], [side * 50, -58], [side * 14, -52]], '#584a78', 2);
    });
  }

  function drawTears(ctx, time) {
    [-6, 6].forEach(function (eyeX, index) {
      const fall = (time * 28 + index * 11) % 30;
      D.fillCircle(ctx, eyeX, -92 + fall, 2.6, '#8ad8ff');
    });
  }

  // An Erinys, a stern winged goddess of vengeance, weeping at Orpheus's song.
  function drawWeepingErinys(ctx, x, y, scale, time) {
    D.withTransform(ctx, x, y, scale, function () { drawErinysWings(ctx); });
    person(ctx, x, y, scale, erinysLook, 'mourn');
    D.withTransform(ctx, x, y, scale, function () { drawTears(ctx, time + x); });
  }

  // Eurydice as a soul: pale colours, a soft teal glow and sparkles. fade (0..1) veils her in mist as she vanishes.
  function drawEurydiceShade(ctx, x, y, scale, pose, fade, time) {
    drawHalo(ctx, x, y - 60 * scale, 80 * scale, '150, 240, 230');
    person(ctx, x, y, scale, eurydiceShade, pose);
    const mist = { x: x - 36 * scale, y: y - 132 * scale, width: 72 * scale, height: 134 * scale };
    D.fillRoundRect(ctx, mist, 34 * scale, 'rgba(210, 250, 245, ' + fade.toFixed(2) + ')');
    drawSparkles(ctx, x, y - 40 * scale, time);
  }

  // The way out of the underworld: a warm, softly pulsing light.
  function drawDaylight(ctx, x, y, radius, time) {
    const pulse = Math.sin(time * 1.5) * radius * 0.06;
    [[2.4, 0.1], [1.8, 0.16], [1.35, 0.26]].forEach(function (ring) {
      D.fillCircle(ctx, x, y, radius * ring[0] + pulse, 'rgba(255, 236, 170, ' + ring[1] + ')');
    });
    D.drawOutlinedEllipse(ctx, x, y, radius, radius * 1.2, '#fff4c0', 3);
  }

  // A steep path winding up from the bottom left towards the daylight in the top right.
  function drawAscentTunnel(ctx, time) {
    D.drawBandedGradient(ctx, { x: 0, y: 0, width: 1280, height: 720 }, '#2a2050', '#3c5878', 12);
    drawDaylight(ctx, 1040, 150, 46, time);
    D.drawOutlinedPolygon(ctx, [[0, 56], [700, 56], [600, 150], [380, 250], [0, 320]], CAVERN_ROCK, 3);
    D.drawOutlinedPolygon(ctx, [[1280, 250], [1100, 320], [860, 470], [760, 720], [1280, 720]], CAVERN_ROCK, 3);
    D.drawOutlinedPolygon(ctx, [[0, 470], [500, 400], [860, 270], [1020, 180], [1060, 190], [900, 300], [560, 480], [0, 570]], '#6a6898', 3);
    drawFloatingMotes(ctx, time);
  }

  // The last stretch: the exit glows close by on the right.
  function drawCaveMouth(ctx, time) {
    D.drawBandedGradient(ctx, { x: 0, y: 0, width: 1280, height: 720 }, '#2a2050', '#3c5878', 12);
    drawStalactites(ctx);
    drawDaylight(ctx, 1080, 260, 110, time);
    drawUnderworldFloor(ctx, 440);
    drawFloatingMotes(ctx, time);
  }

  // ---- The pictures ----

  const PICTURES = {
    'thrace-forest': function (ctx, time) {
      const bow = 0.12 + Math.sin(time) * 0.02;
      drawThraceValley(ctx);
      drawTree(ctx, 110, 420, 1.3, bow, DAY_LEAVES);
      drawTree(ctx, 260, 400, 1.0, bow, DAY_LEAVES);
      drawTree(ctx, 1030, 400, 1.0, -bow, DAY_LEAVES);
      drawTree(ctx, 1170, 420, 1.3, -bow, DAY_LEAVES);
      person(ctx, 640, 440, 2.3, looks.orpheus, 'offer');
      drawRisingNotes(ctx, 480, 250, time, P.gold);
      drawRestingRabbit(ctx, 340, 470, 1.1);
      drawRestingBear(ctx, 480, 474, 1.0);
      drawRestingDeer(ctx, 840, 474, 1.1);
    },
    'orpheus-eurydice': function (ctx, time) {
      drawThraceValley(ctx);
      drawTree(ctx, 220, 440, 1.6, 0, DAY_LEAVES);
      drawTree(ctx, 1120, 420, 1.1, 0, DAY_LEAVES);
      person(ctx, 560, 460, 2.3, looks.orpheus, 'offer');
      person(ctx, 790, 460, 2.3, looks.eurydice, 'stand');
      drawRisingNotes(ctx, 625, 250, time, '#f05a9a');
      drawFlowers(ctx, [[380, 470, '#f08ab0'], [430, 462, '#ffffff'], [950, 466, '#f0c850'], [1000, 474, '#f08ab0']]);
    },
    'tempe-meadow': function (ctx, time) {
      const stride = Math.sin(time * 8) * 0.04;
      drawValleyOfTempe(ctx);
      drawSpeedLines(ctx, 220, 250);
      drawLeaningPerson(ctx, 330, 450, 1.9, aristaeusLook, 'point', 0.06 + stride);
      drawSpeedLines(ctx, 770, 240);
      drawLeaningPerson(ctx, 860, 460, 2.1, looks.eurydice, 'mourn', 0.08 - stride);
      drawGrassTufts(ctx, 470, '#5aa84a', 3);
    },
    viper: function (ctx, time) {
      drawValleyOfTempe(ctx);
      drawSparkles(ctx, 420, 380, time);
      drawSleepingNymph(ctx, 560, 426, 1.7);
      drawViper(ctx, 930, 452, 1.5, time);
      drawFlowers(ctx, [[230, 470, '#f08ab0'], [300, 462, '#ffffff'], [780, 474, '#f0c850'], [1120, 466, '#f08ab0']]);
      drawGrassTufts(ctx, 482, '#5aa84a', 8);
    },
    'orpheus-decision': function (ctx, time) {
      drawCaveAtDusk(ctx);
      person(ctx, 420, 470, 2.4, looks.orpheus, 'point');
    },
    'styx-shore': function (ctx, time) {
      drawCavern(ctx, time);
      drawFarShore(ctx, 290);
      drawStyx(ctx, 290, time);
      drawFerry(ctx, 800, 352, 0.45, time, function () { drawCharon(ctx, 60, -14, 1); });
      drawUnderworldFloor(ctx, 410);
      [900, 1010, 1120].forEach(function (soulX) { drawSoul(ctx, soulX, 450, time); });
      person(ctx, 330, 455, 2.2, looks.orpheus, 'stand');
    },
    'charon-boat': function (ctx, time) {
      drawCavern(ctx, time);
      drawFarShore(ctx, 330);
      drawStyx(ctx, 330, time);
      drawFerry(ctx, 640, 450, 2.0, time, function () {
        person(ctx, -60, -14, 1, looks.orpheus, 'offer');
        drawCharon(ctx, 80, -14, 1);
      });
      drawRisingNotes(ctx, 580, 250, time, P.gold);
    },
    'cerberus-gate': function (ctx, time) {
      drawCavern(ctx, time);
      drawUnderworldFloor(ctx, 440);
      drawUnderworldGate(ctx, 680, 450, time);
      LM.creatures.drawCerberus(ctx, 720, 458, 1.5, 0.85 + 0.15 * Math.sin(time * 1.5));
      drawSleepyZs(ctx, 790, 290, time);
      person(ctx, 270, 458, 2.2, looks.orpheus, 'offer');
      drawRisingNotes(ctx, 90, 290, time, P.gold);
    },
    'hades-throne': function (ctx, time) {
      drawThroneHall(ctx, time);
      person(ctx, 700, 450, 2.4, looks.hades, 'stand');
      person(ctx, 330, 450, 2.2, looks.orpheus, 'offer');
      drawRisingNotes(ctx, 160, 280, time, SAD_NOTE);
      drawWeepingErinys(ctx, 960, 450, 1.8, time);
      drawWeepingErinys(ctx, 1100, 450, 1.8, time);
    },
    'hades-decision': function (ctx, time) {
      drawThroneHall(ctx, time);
      person(ctx, 700, 450, 2.4, looks.hades, 'point');
      person(ctx, 330, 450, 2.2, looks.orpheus, 'stand');
      person(ctx, 950, 450, 2.1, looks.hermes, 'stand');
      drawEurydiceShade(ctx, 1110, 450, 2.1, 'stand', 0, time);
    },
    ascent: function (ctx, time) {
      drawAscentTunnel(ctx, time);
      person(ctx, 880, 285, 1.3, looks.orpheus, 'stand');
      person(ctx, 640, 400, 1.7, looks.hermes, 'stand');
      drawEurydiceShade(ctx, 420, 455, 1.9, 'stand', 0, time);
    },
    'look-back': function (ctx, time) {
      drawCaveMouth(ctx, time);
      person(ctx, 300, 450, 2.1, looks.hermes, 'offer');
      drawEurydiceShade(ctx, 500, 450, 2.1, 'offer', 0.45 + 0.1 * Math.sin(time * 3), time);
      person(ctx, 880, 450, 2.3, looks.orpheus, 'offer');
    },
    'eurydice-farewell': function (ctx, time) {
      drawCavern(ctx, time);
      drawUnderworldFloor(ctx, 440);
      person(ctx, 1000, 440, 1.4, looks.hermes, 'stand');
      drawEurydiceShade(ctx, 620, 455, 2.4, 'offer', 0.35 + 0.1 * Math.sin(time * 2), time);
    },
    'thrace-lament': function (ctx, time) {
      drawThraceDusk(ctx);
      drawTree(ctx, 150, 440, 1.2, 0.05, DUSK_LEAVES);
      drawTree(ctx, 1120, 440, 1.2, -0.05, DUSK_LEAVES);
      person(ctx, 640, 455, 2.3, looks.orpheus, 'offer');
      drawRisingNotes(ctx, 480, 260, time, SAD_NOTE);
    },
    lesbos: function (ctx, time) {
      drawSunsetSea(ctx, time);
      S.drawIsland(ctx, 940, 404, 460, 170);
      drawTree(ctx, 860, 300, 0.35, 0, DAY_LEAVES);
      drawTree(ctx, 1010, 320, 0.3, 0, DAY_LEAVES);
      drawPlaceLabel(ctx, 'Lesbos', 930, 200);
      drawDriftingNotes(ctx, 120, 760, 450, time);
    },
    'olympus-muses': function (ctx, time) {
      drawMountOlympus(ctx, time);
      drawGraveMound(ctx, 640, 470);
      person(ctx, 330, 465, 2.1, museLooks[0], 'mourn');
      person(ctx, 940, 465, 2.1, museLooks[1], 'stand');
      person(ctx, 1110, 465, 2.0, museLooks[2], 'offer');
    },
  };

  Object.keys(PICTURES).forEach(function (id) { LM.illustrations[id] = PICTURES[id]; });
}(window.LM = window.LM || {}));
