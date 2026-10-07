// The underworld for Orpheus's stages: a purple cavern, the river Styx, Charon's boat, Hades on his throne.
(function (LM) {
  'use strict';

  const D = LM.draw;
  const S = LM.scenery;

  function drawStalactites(ctx) {
    ctx.fillStyle = '#2a1a44';
    for (let x = 0; x < 1280; x += 90) {
      const depth = 40 + ((x * 37) % 70);
      ctx.beginPath();
      ctx.moveTo(x, 56);
      ctx.lineTo(x + 45, 56 + depth);
      ctx.lineTo(x + 90, 56);
      ctx.fill();
    }
  }

  function drawCavern(ctx, time) {
    D.drawBandedGradient(ctx, { x: 0, y: 56, width: 1280, height: 560 }, '#1a0e30', '#4a2a6a', 12);
    drawStalactites(ctx);
    S.drawSea(ctx, { x: 0, y: 590, width: 1280, height: 74 }, time * 0.5, { top: '#1a4a5a', bottom: '#082028', foam: '#6ab0b0', wave: '#2a6a7a' });
    LM.ui.drawShadowText(ctx, 'Styks', 1200, 640, 18, '#9fd8d8', 'right');
  }

  function drawCharon(ctx, x, y, time) {
    const bob = Math.sin(time * 1.5) * 4;
    D.drawOutlinedPolygon(ctx, [[x - 120, y - 10 + bob], [x + 110, y - 10 + bob], [x + 80, y + 24 + bob], [x - 90, y + 24 + bob]], '#3a2a1a', 3);
    const charonLook = Object.assign({}, LM.characters.looks.hades, { robe: '#3a3a4a', trim: '#6a6a7a', headwear: 'hood', beard: '#9a9aa0', accessory: 'staff' });
    LM.characters.drawPerson(ctx, x, y - 10 + bob, 1.9, charonLook, 'stand');
  }

  function drawThrone(ctx, x, y) {
    D.drawOutlinedRoundRect(ctx, { x: x - 70, y: y - 300, width: 140, height: 250 }, 16, '#3a2a5a', 3);
    D.drawOutlinedRoundRect(ctx, { x: x - 54, y: y - 284, width: 108, height: 220 }, 12, '#6a3a8a', 2.5);
    D.drawOutlinedRoundRect(ctx, { x: x - 90, y: y - 70, width: 180, height: 70 }, 8, '#2a1a3a', 3);
  }

  function drawHades(ctx, x, y) {
    drawThrone(ctx, x, y);
    LM.characters.drawPerson(ctx, x, y - 20, 2.1, LM.characters.looks.hades, 'stand');
  }

  // charm 0..1: how far the music has calmed the guardian.
  function drawGuardian(ctx, guardian, charm, time) {
    if (guardian === 'charon') {
      drawCharon(ctx, 1040, 590, time);
    } else if (guardian === 'cerberus') {
      LM.creatures.drawCerberus(ctx, 1040, 560, 2.2, charm);
    } else {
      drawHades(ctx, 1040, 580);
    }
  }

  LM.underworldArt = { drawCavern, drawGuardian };
}(window.LM = window.LM || {}));
