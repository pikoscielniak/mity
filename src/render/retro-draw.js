// Drawing primitives for the "colour phone game" look: banded gradients and outlined cartoon shapes.
(function (LM) {
  'use strict';

  function hexToRgb(hex) {
    return [1, 3, 5].map(function (start) { return parseInt(hex.slice(start, start + 2), 16); });
  }

  function mixColors(fromHex, toHex, amount) {
    const from = hexToRgb(fromHex);
    const to = hexToRgb(toHex);
    const mixed = from.map(function (channel, index) {
      return Math.round(channel + (to[index] - channel) * amount);
    });
    return 'rgb(' + mixed.join(',') + ')';
  }

  const bandColorCache = new Map();

  // The palette is small and fixed, so each gradient's band colours are worked out once.
  function bandColors(topColor, bottomColor, bandCount) {
    const key = topColor + '|' + bottomColor + '|' + bandCount;
    if (!bandColorCache.has(key)) {
      const colors = [];
      for (let band = 0; band < bandCount; band += 1) {
        colors.push(mixColors(topColor, bottomColor, bandCount > 1 ? band / (bandCount - 1) : 0));
      }
      bandColorCache.set(key, colors);
    }
    return bandColorCache.get(key);
  }

  // Visible colour steps instead of a smooth gradient: the signature of early colour phone screens.
  function drawBandedGradient(ctx, rect, topColor, bottomColor, bandCount) {
    const colors = bandColors(topColor, bottomColor, bandCount);
    for (let band = 0; band < bandCount; band += 1) {
      const bandTop = rect.y + Math.floor(rect.height * band / bandCount);
      const bandBottom = rect.y + Math.floor(rect.height * (band + 1) / bandCount);
      // Overlap the next band by a pixel, otherwise scaled canvases show hairline seams between bands.
      const overlap = band < bandCount - 1 ? 1 : 0;
      ctx.fillStyle = colors[band];
      ctx.fillRect(rect.x, bandTop, rect.width, bandBottom - bandTop + overlap);
    }
  }

  function roundRectPath(ctx, rect, radius) {
    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;
    ctx.beginPath();
    ctx.moveTo(rect.x + radius, rect.y);
    ctx.arcTo(right, rect.y, right, bottom, radius);
    ctx.arcTo(right, bottom, rect.x, bottom, radius);
    ctx.arcTo(rect.x, bottom, rect.x, rect.y, radius);
    ctx.arcTo(rect.x, rect.y, right, rect.y, radius);
    ctx.closePath();
  }

  function fillRoundRect(ctx, rect, radius, color) {
    roundRectPath(ctx, rect, radius);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function strokeOutline(ctx, outlineWidth) {
    if (outlineWidth > 0) {
      ctx.lineWidth = outlineWidth;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = LM.palette.outline;
      ctx.stroke();
    }
  }

  function fillCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawOutlinedCircle(ctx, x, y, radius, fillColor, outlineWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    strokeOutline(ctx, outlineWidth);
  }

  function drawOutlinedEllipse(ctx, x, y, radiusX, radiusY, fillColor, outlineWidth) {
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    strokeOutline(ctx, outlineWidth);
  }

  function polygonPath(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let index = 1; index < points.length; index += 1) {
      ctx.lineTo(points[index][0], points[index][1]);
    }
    ctx.closePath();
  }

  function drawOutlinedPolygon(ctx, points, fillColor, outlineWidth) {
    polygonPath(ctx, points);
    ctx.fillStyle = fillColor;
    ctx.fill();
    strokeOutline(ctx, outlineWidth);
  }

  function drawOutlinedRoundRect(ctx, rect, radius, fillColor, outlineWidth) {
    roundRectPath(ctx, rect, radius);
    ctx.fillStyle = fillColor;
    ctx.fill();
    strokeOutline(ctx, outlineWidth);
  }

  function drawStar(ctx, x, y, outerRadius, innerRadius, fillColor, outlineWidth) {
    const points = [];
    for (let corner = 0; corner < 10; corner += 1) {
      const radius = corner % 2 === 0 ? outerRadius : innerRadius;
      const angle = -Math.PI / 2 + corner * Math.PI / 5;
      points.push([x + Math.cos(angle) * radius, y + Math.sin(angle) * radius]);
    }
    drawOutlinedPolygon(ctx, points, fillColor, outlineWidth);
  }

  function drawLine(ctx, fromX, fromY, toX, toY, color, width) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function withTransform(ctx, x, y, scale, drawFn) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawFn();
    ctx.restore();
  }

  LM.draw = {
    hexToRgb,
    mixColors,
    drawBandedGradient,
    roundRectPath,
    fillRoundRect,
    fillCircle,
    drawOutlinedCircle,
    drawOutlinedEllipse,
    polygonPath,
    drawOutlinedPolygon,
    drawOutlinedRoundRect,
    drawStar,
    drawLine,
    withTransform,
  };
}(window.LM = window.LM || {}));
