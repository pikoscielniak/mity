(function (LM) {
  'use strict';

  const FONT_FAMILY = 'Verdana, Tahoma, sans-serif';
  const NO_BREAK_SPACE = ' ';
  const MAX_CACHED_WRAPS = 600;
  const wrapCache = new Map();

  function boldFont(size) {
    return 'bold ' + size + 'px ' + FONT_FAMILY;
  }

  function regularFont(size) {
    return size + 'px ' + FONT_FAMILY;
  }

  // Polish typography: a one-letter word (a, i, o, u, w, z) must not end a line.
  function glueOneLetterWords(text) {
    return text.replace(/(?<=^|[\s(„])([aiouwzAIOUWZ])\s+/g, '$1' + NO_BREAK_SPACE);
  }

  function splitLongWord(ctx, word, maxWidth) {
    const pieces = [];
    let piece = '';
    Array.from(word).forEach(function (character) {
      if (piece && ctx.measureText(piece + character).width > maxWidth) {
        pieces.push(piece);
        piece = '';
      }
      piece += character;
    });
    pieces.push(piece);
    return pieces;
  }

  function wrapParagraph(ctx, paragraph, maxWidth) {
    const lines = [];
    let line = '';
    glueOneLetterWords(paragraph).split(' ').forEach(function (rawWord) {
      const words = ctx.measureText(rawWord).width > maxWidth ? splitLongWord(ctx, rawWord, maxWidth) : [rawWord];
      words.forEach(function (word) {
        const candidate = line ? line + ' ' + word : word;
        if (line && ctx.measureText(candidate).width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      });
    });
    lines.push(line);
    return lines;
  }

  function wrapText(ctx, text, maxWidth, font) {
    const key = font + '|' + maxWidth + '|' + text;
    if (wrapCache.has(key)) {
      return wrapCache.get(key);
    }
    ctx.font = font;
    const lines = [];
    String(text).split('\n').forEach(function (paragraph) {
      wrapParagraph(ctx, paragraph, maxWidth).forEach(function (line) { lines.push(line); });
    });
    if (wrapCache.size > MAX_CACHED_WRAPS) {
      wrapCache.clear();
    }
    wrapCache.set(key, lines);
    return lines;
  }

  function drawTextLine(ctx, text, x, y, style) {
    ctx.font = style.font;
    ctx.textAlign = style.align || 'left';
    ctx.textBaseline = 'alphabetic';
    if (style.shadowColor) {
      ctx.fillStyle = style.shadowColor;
      ctx.fillText(text, x + 2, y + 2);
    }
    ctx.fillStyle = style.color;
    ctx.fillText(text, x, y);
  }

  // `y` is the baseline of the first line. Returns the height taken by all lines.
  function drawWrappedText(ctx, text, x, y, maxWidth, style) {
    const lines = wrapText(ctx, text, maxWidth, style.font);
    lines.forEach(function (line, index) {
      drawTextLine(ctx, line, x, y + index * style.lineHeight, style);
    });
    return lines.length * style.lineHeight;
  }

  function measureWrappedHeight(ctx, text, maxWidth, style) {
    return wrapText(ctx, text, maxWidth, style.font).length * style.lineHeight;
  }

  function measureTextWidth(ctx, text, font) {
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  LM.text = {
    FONT_FAMILY,
    boldFont,
    regularFont,
    glueOneLetterWords,
    wrapText,
    drawTextLine,
    drawWrappedText,
    measureWrappedHeight,
    measureTextWidth,
  };
}(window.LM = window.LM || {}));
