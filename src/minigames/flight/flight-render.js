// Drawing the flight: sky split into the three zones of Daedalus's advice, the altimeter and the danger meters.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const F = LM.flightModel;
  const ZONE_LABEL_X = 1250;

  function drawZoneBand(ctx, top, bottom, color, label) {
    ctx.fillStyle = color;
    ctx.fillRect(0, top, 1280, bottom - top);
    LM.ui.drawShadowText(ctx, label, ZONE_LABEL_X, top + (bottom - top) / 2 + 7, 18, P.white, 'right');
  }

  function drawZoneEdge(ctx, y) {
    ctx.save();
    ctx.setLineDash([10, 14]);
    D.drawLine(ctx, 60, y, 1280, y, 'rgba(255, 255, 255, 0.55)', 3);
    ctx.restore();
  }

  // sky: 'day' or 'dusk' (the last part, Daedalus alone).
  function drawFlightSky(ctx, time, sky) {
    const colors = sky === 'dusk' ? ['#5a5aa8', '#f6b47a'] : ['#2b6cd4', '#d8f0ff'];
    LM.scenery.drawSky(ctx, { x: 0, y: 56, width: 1280, height: F.SEA_LEVEL - 56 }, colors[0], colors[1]);
    LM.scenery.drawSun(ctx, 1120, 120, 60, time);
    LM.scenery.drawCloud(ctx, 1400 - ((time * 40) % 1700), 330, 0.9);
    LM.scenery.drawCloud(ctx, 1400 - ((time * 26 + 800) % 1700), 250, 0.6);
  }

  function drawZones(ctx) {
    drawZoneBand(ctx, 56, F.HOT_LIMIT, 'rgba(255, 110, 30, 0.2)', 'za wysoko: słońce topi wosk');
    drawZoneBand(ctx, F.WET_LIMIT, F.SEA_LEVEL, 'rgba(30, 90, 220, 0.2)', 'za nisko: fale moczą pióra');
    drawZoneEdge(ctx, F.HOT_LIMIT);
    drawZoneEdge(ctx, F.WET_LIMIT);
  }

  function drawSeaBelow(ctx, time) {
    LM.scenery.drawSea(ctx, { x: 0, y: F.SEA_LEVEL, width: 1280, height: 664 - F.SEA_LEVEL }, time * 6);
  }

  function drawAltimeter(ctx, flyerY) {
    const left = 22;
    D.drawOutlinedRoundRect(ctx, { x: left - 4, y: 70, width: 34, height: F.SEA_LEVEL - 66 }, 10, '#1b1b2a', 2);
    D.drawBandedGradient(ctx, { x: left + 2, y: 76, width: 22, height: F.HOT_LIMIT - 76 }, '#ff4a2a', '#ff9a2a', 4);
    D.drawBandedGradient(ctx, { x: left + 2, y: F.HOT_LIMIT, width: 22, height: F.WET_LIMIT - F.HOT_LIMIT }, '#43d052', '#2a9a3a', 5);
    D.drawBandedGradient(ctx, { x: left + 2, y: F.WET_LIMIT, width: 22, height: F.SEA_LEVEL - F.WET_LIMIT - 6 }, '#3a8ae8', '#1a4aa8', 4);
    D.drawOutlinedPolygon(ctx, [[left + 34, flyerY], [left + 50, flyerY - 10], [left + 50, flyerY + 10]], P.white, 2);
  }

  // A small bar above the flyer that fills while it is in danger.
  function drawDangerMeter(ctx, x, y, fill, color, label) {
    if (fill <= 0.02) {
      return;
    }
    D.drawOutlinedRoundRect(ctx, { x: x - 50, y: y, width: 100, height: 12 }, 5, '#2a2a2a', 2);
    D.fillRoundRect(ctx, { x: x - 48, y: y + 2, width: 96 * Math.min(1, fill), height: 8 }, 4, color);
    LM.ui.drawShadowText(ctx, label, x, y - 6, 16, P.white, 'center');
  }

  function drawIslandOnHorizon(ctx, island) {
    LM.scenery.drawIsland(ctx, island.x, F.SEA_LEVEL + 4, island.width, island.height);
    if (island.hasTemple) {
      LM.scenery.drawTemple(ctx, island.x, F.SEA_LEVEL - island.height + 16, 0.6);
    }
    LM.ui.drawShadowText(ctx, island.name, island.x, F.SEA_LEVEL - island.height - 18, 24, P.white, 'center');
  }

  LM.flightRender = { drawFlightSky, drawZones, drawSeaBelow, drawAltimeter, drawDangerMeter, drawIslandOnHorizon };
}(window.LM = window.LM || {}));
