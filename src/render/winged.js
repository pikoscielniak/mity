// Feathered wings made of wax and feathers, people flying with them, gulls and drifting feathers.
// Used by the Icarus story pictures and by the workshop and flight stages.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const FEATHER = '#fbf6ea';
  const FEATHER_QUILL = '#c8b88e';
  const WAX = '#f2c442';
  const CHEST_TO_FEET = 60;

  // Feathers of one wing, from the body outwards: [along x, along y, length, angle].
  const WING_FEATHERS = [
    [6, 2, 34, 1.45], [16, 0, 40, 1.3], [26, -2, 46, 1.14], [36, -4, 50, 0.98],
    [46, -7, 54, 0.8], [56, -10, 58, 0.6], [64, -12, 60, 0.4], [70, -14, 58, 0.2],
  ];

  function drawWingFeather(ctx, x, y, length, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    D.drawOutlinedEllipse(ctx, length / 2, 0, length / 2, length * 0.17, FEATHER, 1.6);
    D.drawLine(ctx, 3, 0, length * 0.85, 0, FEATHER_QUILL, 1.4);
    ctx.restore();
  }

  function drawWaxDrips(ctx, time) {
    [14, 34, 54].forEach(function (dripX, index) {
      const dripLength = 6 + ((time * 8 + index * 5) % 10);
      D.drawLine(ctx, dripX, -dripX * 0.2 + 4, dripX, -dripX * 0.2 + 4 + dripLength, WAX, 4);
    });
  }

  // wings: { flap (radians, up is positive), featherCount (0-8, default all), isMelting, and for the wearer: pose, tilt }.
  // Drawn in a person's own coordinates, hanging from the shoulder on `side` (-1 left, 1 right).
  function drawWing(ctx, side, wings, time) {
    ctx.save();
    ctx.translate(side * 14, -74);
    ctx.scale(side, 1);
    ctx.rotate(-(wings.flap || 0));
    const featherCount = wings.featherCount === undefined ? WING_FEATHERS.length : wings.featherCount;
    WING_FEATHERS.slice(0, featherCount).reverse().forEach(function (feather) {
      drawWingFeather(ctx, feather[0], feather[1], feather[2], feather[3]);
    });
    D.drawLine(ctx, 0, 0, 72, -15, P.outline, 13);
    D.drawLine(ctx, 0, 0, 72, -15, WAX, 8);
    if (wings.isMelting) {
      drawWaxDrips(ctx, time);
    }
    ctx.restore();
  }

  // Placed like a person: (x, y) is where the wearer's feet are.
  function drawPairOfWings(ctx, x, y, scale, wings, time) {
    D.withTransform(ctx, x, y, scale, function () {
      drawWing(ctx, -1, wings, time);
      drawWing(ctx, 1, wings, time);
    });
  }

  // Like drawPerson, with a pair of wings strapped to the shoulders.
  function drawWingedPerson(ctx, x, y, scale, look, wings, time) {
    drawPairOfWings(ctx, x, y, scale, wings, time);
    LM.characters.drawPerson(ctx, x, y, scale, look, wings.pose || 'stand');
  }

  // On the ground the wings are held up behind the back, so they do not hide the body.
  function restingWings(pose) {
    return { flap: 0.9, pose: pose };
  }

  // A flyer is placed by the chest and leans forward by wings.tilt (radians).
  function drawFlyer(ctx, x, y, scale, look, wings, time) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(wings.tilt || 0);
    drawWingedPerson(ctx, 0, CHEST_TO_FEET * scale, scale, look, wings, time);
    ctx.restore();
  }

  function flapAt(time, speed) {
    return 0.25 + 0.35 * Math.sin(time * speed);
  }

  function drawGull(ctx, x, y, scale, time) {
    const lift = Math.sin(time * 6 + x) * 10;
    D.withTransform(ctx, x, y, scale, function () {
      D.drawOutlinedPolygon(ctx, [[-2, 0], [-28, -12 - lift], [-12, 3]], '#d8dde6', 2);
      D.drawOutlinedPolygon(ctx, [[2, 0], [28, -12 - lift], [12, 3]], '#d8dde6', 2);
      D.drawOutlinedEllipse(ctx, 0, 2, 13, 5, P.white, 2);
      D.drawOutlinedCircle(ctx, 12, -1, 5, P.white, 2);
      D.drawOutlinedPolygon(ctx, [[16, -2], [24, 0], [16, 2]], P.orange, 1);
    });
  }

  // Loose feathers drifting down through `area`, each on its own looping path.
  function drawFallingFeathers(ctx, area, count, time) {
    for (let index = 0; index < count; index += 1) {
      const progress = (time * 0.12 + index / count) % 1;
      const x = area.x + ((index * 137) % area.width) + Math.sin(time * 2 + index) * 18;
      const y = area.y + progress * area.height;
      LM.props.drawFeather(ctx, x, y, 2.2, Math.sin(time * 2.5 + index) * 0.8);
    }
  }

  LM.winged = {
    drawPairOfWings,
    drawWingedPerson,
    restingWings,
    drawFlyer,
    flapAt,
    drawGull,
    drawFallingFeathers,
  };
}(window.LM = window.LM || {}));
