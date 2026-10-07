(function (LM) {
  'use strict';

  const P = LM.palette;
  const HUD_HEIGHT = 56;
  const HINT_BAR_TOP = 664;
  const HINT_BAR_HEIGHT = 56;

  const BUTTON_COLORS = {
    normal: { top: P.buttonTop, bottom: P.buttonBottom, text: P.ink, edge: P.parchmentEdge },
    selected: { top: '#5a96f5', bottom: '#1a4fb8', text: P.white, edge: P.selectionDark },
    disabled: { top: '#e4e0d8', bottom: '#c8c2b6', text: '#8a8478', edge: '#8a8478' },
    correct: { top: '#7fd86a', bottom: '#2f9e44', text: P.white, edge: '#1d6a2c' },
    wrong: { top: '#ff8a70', bottom: '#c8281a', text: P.white, edge: '#7a160e' },
  };

  function isPointInRect(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
      point.y >= rect.y && point.y <= rect.y + rect.height;
  }

  function drawGlossyBar(ctx, rect, highlightEdge) {
    LM.draw.drawBandedGradient(ctx, rect, P.hudTop, P.hudBottom, 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height / 2);
    ctx.fillStyle = P.hudLine;
    const lineY = highlightEdge === 'top' ? rect.y : rect.y + rect.height - 2;
    ctx.fillRect(rect.x, lineY, rect.width, 2);
  }

  function heartPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, 1, -5, -1, -5, -4);
    ctx.bezierCurveTo(-5, -7, -1, -8, 0, -5);
    ctx.bezierCurveTo(1, -8, 5, -7, 5, -4);
    ctx.bezierCurveTo(5, -1, 0, 1, 0, 4);
    ctx.closePath();
  }

  function drawHeart(ctx, x, y, scale, state) {
    LM.draw.withTransform(ctx, x, y, scale, function () {
      heartPath(ctx);
      ctx.fillStyle = state === 'full' ? P.heart : P.heartEmpty;
      ctx.fill();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = '#200810';
      ctx.stroke();
      if (state === 'full') {
        LM.draw.fillCircle(ctx, -2.6, -4.6, 0.9, P.heartShine);
      }
    });
  }

  function drawHearts(ctx, x, y, heartsLeft, heartsMax) {
    for (let index = 0; index < heartsMax; index += 1) {
      drawHeart(ctx, x + index * 40, y, 3.2, index < heartsLeft ? 'full' : 'empty');
    }
  }

  function drawShadowText(ctx, text, x, y, size, color, align) {
    LM.text.drawTextLine(ctx, text, x, y, {
      font: LM.text.boldFont(size), color: color, align: align, shadowColor: P.textShadow,
    });
  }

  // hud: { title, heartsLeft?, heartsMax?, rightText? }
  function drawHud(ctx, hud) {
    drawGlossyBar(ctx, { x: 0, y: 0, width: LM.view.WIDTH, height: HUD_HEIGHT }, 'bottom');
    if (hud.heartsMax) {
      drawHearts(ctx, 36, 30, hud.heartsLeft, hud.heartsMax);
    }
    drawShadowText(ctx, hud.title, LM.view.WIDTH / 2, 37, 24, P.white, 'center');
    if (hud.rightText) {
      drawShadowText(ctx, hud.rightText, LM.view.WIDTH - 24, 37, 22, P.gold, 'right');
    }
  }

  function drawKeyCap(ctx, x, y, label) {
    const font = LM.text.boldFont(16);
    const width = Math.max(30, LM.text.measureTextWidth(ctx, label, font) + 18);
    LM.draw.fillRoundRect(ctx, { x: x, y: y + 4, width: width, height: 26 }, 6, P.keyCapSide);
    LM.draw.fillRoundRect(ctx, { x: x, y: y, width: width, height: 26 }, 6, P.keyCap);
    LM.text.drawTextLine(ctx, label, x + width / 2, y + 19, { font: font, color: P.keyCapText, align: 'center' });
    return x + width;
  }

  // hints: [{ keys: ['↑', '↓'], label: 'lot' }]
  function drawKeyHintBar(ctx, hints, rightText) {
    drawGlossyBar(ctx, { x: 0, y: HINT_BAR_TOP, width: LM.view.WIDTH, height: HINT_BAR_HEIGHT }, 'top');
    let x = 24;
    hints.forEach(function (hint) {
      hint.keys.forEach(function (key, index) {
        x = drawKeyCap(ctx, x + (index > 0 ? 6 : 0), HINT_BAR_TOP + 14, key);
      });
      drawShadowText(ctx, hint.label, x + 10, HINT_BAR_TOP + 35, 17, P.white, 'left');
      x += 10 + LM.text.measureTextWidth(ctx, hint.label, LM.text.boldFont(17)) + 34;
    });
    if (rightText) {
      drawShadowText(ctx, rightText, LM.view.WIDTH - 24, HINT_BAR_TOP + 35, 18, P.white, 'right');
    }
  }

  function drawParchmentPanel(ctx, rect) {
    LM.draw.fillRoundRect(ctx, { x: rect.x - 3, y: rect.y - 3, width: rect.width + 6, height: rect.height + 6 }, 12, P.parchmentEdge);
    LM.draw.fillRoundRect(ctx, rect, 10, P.parchment);
    ctx.save();
    LM.draw.roundRectPath(ctx, rect, 10);
    ctx.clip();
    ctx.fillStyle = P.parchmentShade;
    ctx.fillRect(rect.x, rect.y + rect.height - 10, rect.width, 10);
    ctx.restore();
  }

  // Returns the area below the title bar, where callers draw the panel content.
  function drawTitledPanel(ctx, rect, title) {
    drawParchmentPanel(ctx, rect);
    const barRect = { x: rect.x + 2, y: rect.y + 2, width: rect.width - 4, height: 40 };
    ctx.save();
    LM.draw.roundRectPath(ctx, barRect, 9);
    ctx.clip();
    LM.draw.drawBandedGradient(ctx, barRect, P.titleBarTop, P.titleBarBottom, 5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(barRect.x, barRect.y, barRect.width, barRect.height / 2);
    ctx.restore();
    drawShadowText(ctx, title, rect.x + 20, rect.y + 30, 20, P.white, 'left');
    return { x: rect.x + 20, y: rect.y + 56, width: rect.width - 40, height: rect.height - 72 };
  }

  // state: 'normal' | 'selected' | 'disabled' | 'correct' | 'wrong'
  function drawButton(ctx, rect, label, state, fontSize) {
    const colors = BUTTON_COLORS[state];
    const size = fontSize || 22;
    LM.draw.fillRoundRect(ctx, { x: rect.x - 2, y: rect.y - 2, width: rect.width + 4, height: rect.height + 4 }, 10, colors.edge);
    ctx.save();
    LM.draw.roundRectPath(ctx, rect, 8);
    ctx.clip();
    LM.draw.drawBandedGradient(ctx, rect, colors.top, colors.bottom, 5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height * 0.45);
    ctx.restore();
    const style = { font: LM.text.boldFont(size), color: colors.text, lineHeight: size * 1.25, align: 'center' };
    const textHeight = LM.text.measureWrappedHeight(ctx, label, rect.width - 24, style);
    const firstBaseline = rect.y + (rect.height - textHeight) / 2 + size * 0.95;
    LM.text.drawWrappedText(ctx, label, rect.x + rect.width / 2, firstBaseline, rect.width - 24, style);
  }

  function drawNumberBadge(ctx, x, y, label) {
    LM.draw.drawOutlinedRoundRect(ctx, { x: x, y: y, width: 34, height: 34 }, 7, P.gold, 2);
    LM.text.drawTextLine(ctx, label, x + 17, y + 25, { font: LM.text.boldFont(20), color: P.ink, align: 'center' });
  }

  function drawDimmer(ctx) {
    ctx.fillStyle = P.dimmer;
    ctx.fillRect(0, 0, LM.view.WIDTH, LM.view.HEIGHT);
  }

  // Hard colour stops give the chunky banded look of old title logos.
  function bandedTextFill(ctx, topY, bottomY, colors) {
    const gradient = ctx.createLinearGradient(0, topY, 0, bottomY);
    colors.forEach(function (color, index) {
      gradient.addColorStop(index / colors.length, color);
      gradient.addColorStop((index + 1) / colors.length, color);
    });
    return gradient;
  }

  function drawTitleText(ctx, text, x, y, size) {
    ctx.font = LM.text.boldFont(size);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.2;
    ctx.strokeStyle = '#2a1004';
    ctx.strokeText(text, x, y + size * 0.08);
    ctx.strokeText(text, x, y);
    ctx.fillStyle = bandedTextFill(ctx, y - size * 0.78, y + size * 0.05, ['#fff8c8', '#ffe066', '#ffbf2e', '#f08a1c']);
    ctx.fillText(text, x, y);
  }

  // A Greek key ("meander") band: a baseline with a hook in every square unit.
  function drawMeanderBand(ctx, rect, color) {
    const unit = rect.height;
    const lineWidth = Math.max(2, unit / 7);
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    const bottom = rect.y + unit - lineWidth / 2;
    ctx.beginPath();
    ctx.moveTo(rect.x, bottom);
    ctx.lineTo(rect.x + rect.width, bottom);
    for (let left = rect.x; left < rect.x + rect.width; left += unit) {
      const s = unit / 10;
      ctx.moveTo(left + s, bottom);
      ctx.lineTo(left + s, rect.y + s);
      ctx.lineTo(left + 8 * s, rect.y + s);
      ctx.lineTo(left + 8 * s, rect.y + 6.5 * s);
      ctx.lineTo(left + 4.5 * s, rect.y + 6.5 * s);
      ctx.lineTo(left + 4.5 * s, rect.y + 4 * s);
    }
    ctx.stroke();
    ctx.restore();
  }

  LM.ui = {
    HUD_HEIGHT,
    HINT_BAR_TOP,
    isPointInRect,
    drawGlossyBar,
    drawHeart,
    drawHearts,
    drawShadowText,
    drawHud,
    drawKeyCap,
    drawKeyHintBar,
    drawParchmentPanel,
    drawTitledPanel,
    drawButton,
    drawNumberBadge,
    drawDimmer,
    drawTitleText,
    drawMeanderBand,
  };
}(window.LM = window.LM || {}));
