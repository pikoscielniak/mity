// Cartoon people seen from the front, built from outlined shapes. (x, y) is between the feet; ~110 px tall at scale 1.
// look: { skin, hair, hairStyle, beard, robe, trim, dressLength, cape, headwear, accessory }
// pose: 'stand' | 'point' | 'offer' | 'cheer' | 'mourn'
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const OUTLINE = 2.5;

  const HAND_POSITIONS = {
    stand: [[-23, -44], [23, -44]],
    point: [[-23, -44], [44, -72]],
    offer: [[-16, -58], [16, -58]],
    cheer: [[-30, -104], [30, -104]],
    mourn: [[-8, -86], [8, -86]],
  };

  function drawLimb(ctx, fromX, fromY, toX, toY, color, width) {
    D.drawLine(ctx, fromX, fromY, toX, toY, P.outline, width + OUTLINE * 2);
    D.drawLine(ctx, fromX, fromY, toX, toY, color, width);
  }

  function drawLegs(ctx, look) {
    [-7, 7].forEach(function (legX) {
      drawLimb(ctx, legX, -34, legX, -4, look.skin, 8);
      D.drawOutlinedEllipse(ctx, legX + (legX > 0 ? 2 : -2), -2, 7, 3.5, '#7a4a20', 2);
    });
  }

  function drawCape(ctx, look) {
    if (look.cape) {
      D.drawOutlinedPolygon(ctx, [[-17, -76], [17, -76], [30, -18], [-30, -18]], look.cape, OUTLINE);
    }
  }

  function drawRobe(ctx, look) {
    const hemY = look.dressLength === 'long' ? -6 : -28;
    const hemHalf = look.dressLength === 'long' ? 30 : 25;
    D.drawOutlinedPolygon(ctx, [[-17, -78], [17, -78], [hemHalf, hemY], [-hemHalf, hemY]], look.robe, OUTLINE);
    ctx.fillStyle = look.trim;
    ctx.fillRect(-hemHalf + 2, hemY - 6, hemHalf * 2 - 4, 5);
    ctx.fillRect(-17, -54, 34, 4);
    D.drawOutlinedPolygon(ctx, [[-8, -78], [8, -78], [0, -68]], look.skin, 1.5);
  }

  function drawArms(ctx, look, pose) {
    const hands = HAND_POSITIONS[pose];
    [[-16, -74], [16, -74]].forEach(function (shoulder, index) {
      drawLimb(ctx, shoulder[0], shoulder[1], hands[index][0], hands[index][1], look.skin, 7);
      D.drawOutlinedCircle(ctx, hands[index][0], hands[index][1], 4.5, look.skin, 2);
    });
    return hands;
  }

  const DRAPE_COLORS = { veil: '#e8e0f0', hood: '#3a3a4a' };

  function drawLongHairBack(ctx, look) {
    if (look.hairStyle === 'long') {
      D.drawOutlinedRoundRect(ctx, { x: -20, y: -110, width: 40, height: 44 }, 14, look.hair, OUTLINE);
    }
  }

  // A veil or a hood hangs behind the head and shoulders, leaving the face visible.
  function drawDrapeBack(ctx, look) {
    const color = DRAPE_COLORS[look.headwear];
    if (color) {
      D.drawOutlinedPolygon(ctx, [[-24, -100], [0, -124], [24, -100], [30, -64], [-30, -64]], color, OUTLINE);
    }
  }

  function drawDrapeRim(ctx, look) {
    ctx.beginPath();
    ctx.arc(0, -98, 21, Math.PI * 1.08, Math.PI * 1.92);
    ctx.lineWidth = 7;
    ctx.strokeStyle = DRAPE_COLORS[look.headwear];
    ctx.stroke();
  }

  function drawHairTop(ctx, look) {
    if (look.hairStyle === 'bald') {
      return;
    }
    ctx.beginPath();
    ctx.arc(0, -99, 18.5, Math.PI * 1.02, Math.PI * 1.98);
    ctx.closePath();
    ctx.fillStyle = look.hair;
    ctx.fill();
    ctx.lineWidth = OUTLINE;
    ctx.strokeStyle = P.outline;
    ctx.stroke();
    if (look.hairStyle === 'curly') {
      [-14, -7, 0, 7, 14].forEach(function (curlX) { D.drawOutlinedCircle(ctx, curlX, -113 + Math.abs(curlX) * 0.35, 6, look.hair, 1.5); });
    }
  }

  function drawFace(ctx, look) {
    D.drawOutlinedCircle(ctx, 0, -96, 17, look.skin, OUTLINE);
    [-6, 6].forEach(function (eyeX) {
      D.fillCircle(ctx, eyeX, -97, 2.6, P.outline);
      D.fillCircle(ctx, eyeX + 0.9, -97.9, 0.9, P.white);
    });
    D.fillCircle(ctx, -10, -90, 3, 'rgba(240, 120, 110, 0.35)');
    D.fillCircle(ctx, 10, -90, 3, 'rgba(240, 120, 110, 0.35)');
    if (look.beard) {
      D.drawOutlinedEllipse(ctx, 0, -84, 13, 10, look.beard, 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, -90, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = P.outline;
      ctx.stroke();
    }
  }

  function drawCrown(ctx, color) {
    D.drawOutlinedPolygon(ctx, [[-14, -110], [-14, -122], [-8, -114], [0, -126], [8, -114], [14, -122], [14, -110]], color, 2);
  }

  function drawWreath(ctx, leafColor, berryColor) {
    for (let leaf = 0; leaf < 9; leaf += 1) {
      const angle = Math.PI * (1.05 + leaf * 0.1);
      D.drawOutlinedEllipse(ctx, Math.cos(angle) * 18, -98 + Math.sin(angle) * 18, 5, 3, leafColor, 1.2);
    }
    if (berryColor) {
      [-12, 12].forEach(function (berryX) { D.drawOutlinedCircle(ctx, berryX, -110, 4, berryColor, 1.2); });
    }
  }

  function drawHeadwear(ctx, look) {
    if (look.headwear === 'crown') {
      drawCrown(ctx, P.gold);
    } else if (look.headwear === 'darkCrown') {
      drawCrown(ctx, '#5a4a7a');
    } else if (look.headwear === 'laurel') {
      drawWreath(ctx, '#4a9a3a', null);
    } else if (look.headwear === 'vine') {
      drawWreath(ctx, '#4a9a3a', '#7a2a8a');
    } else if (look.headwear === 'wingedHat') {
      D.drawOutlinedEllipse(ctx, 0, -110, 22, 6, '#c8a060', 2);
      D.drawOutlinedPolygon(ctx, [[16, -114], [34, -124], [30, -112]], P.white, 1.5);
      D.drawOutlinedPolygon(ctx, [[-16, -114], [-34, -124], [-30, -112]], P.white, 1.5);
    } else if (DRAPE_COLORS[look.headwear]) {
      drawDrapeRim(ctx, look);
    }
  }

  function drawPerson(ctx, x, y, scale, look, pose) {
    D.withTransform(ctx, x, y, scale, function () {
      drawCape(ctx, look);
      drawLegs(ctx, look);
      drawDrapeBack(ctx, look);
      drawLongHairBack(ctx, look);
      drawRobe(ctx, look);
      const hands = drawArms(ctx, look, pose || 'stand');
      drawFace(ctx, look);
      drawHairTop(ctx, look);
      drawHeadwear(ctx, look);
      if (look.accessory) {
        LM.props.drawHeldItem(ctx, look.accessory, hands);
      }
    });
  }

  function look(overrides) {
    return Object.assign({
      skin: P.skin, hair: '#5a3418', hairStyle: 'short', beard: null, robe: '#ffffff', trim: '#2f6fd8',
      dressLength: 'short', cape: null, headwear: null, accessory: null,
    }, overrides);
  }

  LM.characters = {
    drawPerson,
    looks: {
      theseus: look({ robe: '#d8382a', trim: '#ffd84a', cape: '#7a1a12', hairStyle: 'curly', hair: '#6b3e17', accessory: 'sword' }),
      aegeus: look({ robe: '#6a3a9a', trim: '#ffd84a', dressLength: 'long', hair: '#e8e8e8', beard: '#e8e8e8', headwear: 'crown', accessory: 'staff' }),
      minos: look({ robe: '#1d4f9a', trim: '#ffd84a', dressLength: 'long', hair: '#2a1a10', beard: '#2a1a10', headwear: 'crown', cape: '#c8281a' }),
      ariadne: look({ robe: '#ffffff', trim: '#2f6fd8', dressLength: 'long', hairStyle: 'long', hair: '#8a4a1a', accessory: 'thread' }),
      dionysus: look({ robe: '#7a2a8a', trim: '#ffd84a', dressLength: 'long', hairStyle: 'curly', hair: '#2a1a10', headwear: 'vine' }),
      youth: look({ robe: '#f0e6d0', trim: '#8a6a3a', hair: '#3a2a1a' }),
      maiden: look({ robe: '#f0e6d0', trim: '#c86a3a', dressLength: 'long', hairStyle: 'long', hair: '#2a1a10' }),
      daedalus: look({ robe: '#3b6fb0', trim: '#c8c8c8', hair: '#d8d8d8', beard: '#d8d8d8', hairStyle: 'bald' }),
      icarus: look({ robe: '#d8382a', trim: '#ffffff', hair: '#6b3e17', hairStyle: 'curly' }),
      orpheus: look({ robe: '#2f9e44', trim: '#ffd84a', cape: '#1d6a2c', hairStyle: 'curly', hair: '#c88a3a', headwear: 'laurel', accessory: 'lute' }),
      eurydice: look({ robe: '#d4f5cc', trim: '#2f9e44', dressLength: 'long', hairStyle: 'long', hair: '#d8a040', headwear: 'laurel' }),
      hermes: look({ robe: '#f0e6d0', trim: '#c0660f', hair: '#c88a3a', hairStyle: 'curly', headwear: 'wingedHat', accessory: 'staff' }),
      hades: look({ robe: '#2a2a3a', trim: '#7a5ab8', dressLength: 'long', hair: '#1a1a2a', beard: '#1a1a2a', headwear: 'darkCrown', skin: '#d8c8c0' }),
      pythia: look({ robe: '#f0e6d0', trim: '#c0660f', dressLength: 'long', hairStyle: 'long', hair: '#2a1a10', headwear: 'veil', accessory: 'laurelBranch' }),
    },
  };
}(window.LM = window.LM || {}));
