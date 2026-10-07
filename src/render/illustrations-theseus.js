// Story pictures for the myth of Theseus and Ariadne. Each draws the whole 1280×720 frame.
(function (LM) {
  'use strict';

  const B = LM.backdrops;
  const S = LM.scenery;
  const person = LM.characters.drawPerson;
  const looks = LM.characters.looks;
  const BLACK_SAIL = '#1a1a1a';
  const SCARLET_SAIL = '#c8281a';
  const kingTheseus = Object.assign({}, looks.theseus, { headwear: 'crown' });
  const ariadneEmptyHanded = Object.assign({}, looks.ariadne, { accessory: null });
  const aegeusWithoutStaff = Object.assign({}, looks.aegeus, { accessory: null });

  function drawOpenSea(ctx, time) {
    S.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 380 }, '#3a7fe0', '#d8f0ff');
    S.drawCloud(ctx, 260, 110, 0.9);
    S.drawCloud(ctx, 980, 70, 0.7);
    S.drawSea(ctx, { x: 0, y: 380, width: 1280, height: 340 }, time);
  }

  function drawLyingPerson(ctx, x, y, scale, look) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 2);
    person(ctx, 0, 0, scale, look, 'stand');
    ctx.restore();
  }

  function drawThreadOnFloor(ctx, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(0, 690);
    ctx.bezierCurveTo(200, 640, 300, 560, toX, toY);
    ctx.strokeStyle = '#d8282a';
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  const PICTURES = {
    athens: function (ctx, time) {
      B.drawAthens(ctx, time);
      person(ctx, 300, 480, 2.2, looks.aegeus, 'stand');
      person(ctx, 520, 480, 2.5, looks.theseus, 'cheer');
    },
    tribute: function (ctx, time) {
      B.drawHarbor(ctx, time);
      S.drawShip(ctx, 930, 470, 1.2, BLACK_SAIL, time);
      [[120, 'youth'], [220, 'maiden'], [320, 'youth'], [420, 'maiden']].forEach(function (entry) {
        person(ctx, entry[0], 500, 1.6, looks[entry[1]], 'mourn');
      });
    },
    minotaur: function (ctx, time) {
      B.drawLabyrinthHall(ctx, time);
      LM.creatures.drawMinotaur(ctx, 640, 470, 2.1, 0.5 + 0.1 * Math.sin(time * 2), true);
    },
    volunteer: function (ctx, time) {
      B.drawAthens(ctx, time);
      person(ctx, 360, 480, 2.6, looks.theseus, 'cheer');
      person(ctx, 600, 480, 2.2, aegeusWithoutStaff, 'mourn');
    },
    farewell: function (ctx, time) {
      B.drawHarbor(ctx, time);
      person(ctx, 200, 500, 2.2, looks.aegeus, 'point');
      person(ctx, 400, 500, 2.4, looks.theseus, 'stand');
      S.drawShip(ctx, 950, 470, 1.2, BLACK_SAIL, time);
    },
    'ship-black-sail': function (ctx, time) {
      drawOpenSea(ctx, time);
      S.drawShip(ctx, 300 + (time * 25) % 700, 450, 1.6, BLACK_SAIL, time);
    },
    ariadne: function (ctx, time) {
      B.drawCretePalace(ctx, time);
      person(ctx, 320, 490, 2.4, ariadneEmptyHanded, 'mourn');
      person(ctx, 720, 490, 2.4, looks.theseus, 'stand');
      person(ctx, 880, 490, 1.9, looks.youth, 'stand');
      person(ctx, 1000, 490, 1.9, looks.maiden, 'stand');
    },
    'thread-gift': function (ctx, time) {
      B.drawCretePalace(ctx, time);
      person(ctx, 480, 490, 2.5, looks.ariadne, 'offer');
      person(ctx, 760, 490, 2.5, looks.theseus, 'stand');
    },
    'labyrinth-entrance': function (ctx, time) {
      B.drawLabyrinthHall(ctx, time);
      drawThreadOnFloor(ctx, 640, 470);
      person(ctx, 640, 480, 2.2, Object.assign({}, looks.theseus, { accessory: 'thread' }), 'stand');
    },
    fight: function (ctx, time) {
      B.drawLabyrinthHall(ctx, time);
      LM.creatures.drawMinotaur(ctx, 820, 480, 1.9, 0.8 + 0.2 * Math.sin(time * 5), true);
      person(ctx, 430, 480, 2.4, looks.theseus, 'point');
    },
    escape: function (ctx, time) {
      B.drawNightSea(ctx, time);
      S.drawShip(ctx, 640, 470, 1.7, BLACK_SAIL, time);
    },
    naxos: function (ctx, time) {
      B.drawBeach(ctx, time);
      S.drawShip(ctx, 1000 + (time * 10) % 300, 380, 0.6, BLACK_SAIL, time);
      drawLyingPerson(ctx, 620, 448, 1.6, ariadneEmptyHanded);
    },
    dionysus: function (ctx, time) {
      B.drawBeach(ctx, time);
      person(ctx, 480, 500, 2.3, ariadneEmptyHanded, 'stand');
      person(ctx, 760, 500, 2.5, looks.dionysus, 'offer');
    },
    'aegeus-cliff': function (ctx, time) {
      B.drawCliff(ctx, time);
      person(ctx, 250, 304, 1.7, aegeusWithoutStaff, 'mourn');
      S.drawShip(ctx, 980, 460, 0.6, BLACK_SAIL, time);
    },
    'athens-king': function (ctx, time) {
      B.drawAthens(ctx, time);
      person(ctx, 520, 480, 2.7, kingTheseus, 'cheer');
      person(ctx, 280, 490, 1.8, looks.youth, 'cheer');
      person(ctx, 760, 490, 1.8, looks.maiden, 'cheer');
    },
    'ship-scarlet-sail': function (ctx, time) {
      drawOpenSea(ctx, time);
      S.drawShip(ctx, 640, 450, 1.6, SCARLET_SAIL, time);
    },
  };

  Object.keys(PICTURES).forEach(function (id) { LM.illustrations[id] = PICTURES[id]; });
}(window.LM = window.LM || {}));
