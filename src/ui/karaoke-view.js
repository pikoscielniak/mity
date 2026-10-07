// Karaoke lyrics: the current line with sung syllables in gold and a ball bouncing over the syllable being sung.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const CURRENT_FONT_SIZE = 40;
  const NEXT_FONT_SIZE = 28;

  function currentLineIndex(karaoke, now) {
    let index = 0;
    karaoke.forEach(function (line, lineIndex) {
      if (line.syllables.length > 0 && line.syllables[0].start - 0.4 <= now) {
        index = lineIndex;
      }
    });
    return index;
  }

  function syllableColor(syllable, now) {
    if (now >= syllable.end) {
      return P.gold;
    }
    if (now >= syllable.start) {
      return P.white;
    }
    return '#b8cdf0';
  }

  function lineText(line) {
    return line.syllables.map(function (syllable) { return syllable.text; }).join('');
  }

  // Returns the x positions of each syllable's left edge, with the line centred on centerX.
  function syllablePositions(ctx, line, centerX, font) {
    const widths = line.syllables.map(function (syllable) { return LM.text.measureTextWidth(ctx, syllable.text, font); });
    const total = widths.reduce(function (sum, width) { return sum + width; }, 0);
    let x = centerX - total / 2;
    return widths.map(function (width) {
      const left = x;
      x += width;
      return { left: left, width: width };
    });
  }

  function activeSyllableIndex(line, now) {
    const index = line.syllables.findIndex(function (syllable) { return now < syllable.end; });
    return index === -1 ? line.syllables.length - 1 : index;
  }

  function drawBall(ctx, position, syllable, baseline, now) {
    const span = Math.max(syllable.end - syllable.start, 0.05);
    const progress = Math.min(Math.max((now - syllable.start) / span, 0), 1);
    const height = Math.sin(progress * Math.PI) * 22;
    LM.draw.drawOutlinedCircle(ctx, position.left + position.width / 2, baseline - 52 - height, 10, P.gold, 2.5);
  }

  function drawCurrentLine(ctx, line, centerX, baseline, now) {
    const font = LM.text.boldFont(CURRENT_FONT_SIZE);
    const positions = syllablePositions(ctx, line, centerX, font);
    line.syllables.forEach(function (syllable, index) {
      LM.text.drawTextLine(ctx, syllable.text, positions[index].left, baseline, {
        font: font, color: syllableColor(syllable, now), align: 'left', shadowColor: P.textShadow,
      });
    });
    const active = activeSyllableIndex(line, now);
    drawBall(ctx, positions[active], line.syllables[active], baseline, now);
  }

  function drawKaraoke(ctx, karaoke, now, centerX, baseline) {
    const index = currentLineIndex(karaoke, now);
    drawCurrentLine(ctx, karaoke[index], centerX, baseline, now);
    const next = karaoke[index + 1];
    if (next) {
      LM.ui.drawShadowText(ctx, lineText(next), centerX, baseline + 62, NEXT_FONT_SIZE, '#9fb6dc', 'center');
    }
  }

  LM.karaokeView = { drawKaraoke, currentLineIndex };
}(window.LM = window.LM || {}));
