// Story pages: a picture, the text typed out letter by letter and read aloud. Enter = next, ← = back, Esc = skip all.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const TEXT_PANEL = { x: 40, y: 486, width: 1200, height: 164 };
  const TEXT_STYLE = { font: LM.text.regularFont(24), color: P.ink, lineHeight: 32 };
  const LETTERS_PER_SECOND = 55;

  // Wraps the whole text first, so words do not jump between lines while they are being typed.
  function drawTypedText(ctx, fullText, letterCount) {
    const width = TEXT_PANEL.width - 56;
    let budget = Math.floor(letterCount);
    LM.text.wrapText(ctx, fullText, width, TEXT_STYLE.font).forEach(function (line, index) {
      if (budget > 0) {
        LM.text.drawTextLine(ctx, line.slice(0, budget), TEXT_PANEL.x + 28, TEXT_PANEL.y + 44 + index * TEXT_STYLE.lineHeight, TEXT_STYLE);
      }
      budget -= line.length + 1;
    });
  }

  function drawSpeakerLabel(ctx, label) {
    const font = LM.text.boldFont(20);
    const width = LM.text.measureTextWidth(ctx, label, font) + 36;
    LM.draw.drawOutlinedRoundRect(ctx, { x: TEXT_PANEL.x + 24, y: TEXT_PANEL.y - 22, width: width, height: 36 }, 8, P.titleBarTop, 3);
    LM.text.drawTextLine(ctx, label, TEXT_PANEL.x + 42, TEXT_PANEL.y + 4, { font: font, color: P.white, shadowColor: P.textShadow });
  }

  // params: { title, pages, onFinished(wasSkipped) }
  function createCutsceneScene(game, params) {
    const pages = params.pages;
    let pageIndex = 0;
    let elapsed = 0;
    let lettersShown = 0;
    let shownText = '';

    function showPage(index) {
      pageIndex = index;
      lettersShown = 0;
      shownText = game.say(pages[pageIndex].text);
      game.narrate(shownText, pages[pageIndex].speaker);
    }

    function isOnLastPage() {
      return pageIndex === pages.length - 1;
    }

    function isPageFullyShown() {
      return lettersShown >= shownText.length;
    }

    function goForward() {
      if (!isPageFullyShown()) {
        lettersShown = shownText.length;
      } else if (!isOnLastPage()) {
        game.sfx('page');
        showPage(pageIndex + 1);
      } else {
        params.onFinished(false);
      }
    }

    function update(dt, input) {
      elapsed += dt;
      lettersShown = Math.min(shownText.length, lettersShown + dt * LETTERS_PER_SECOND);
      if (input.wasPressed('back')) {
        params.onFinished(!isOnLastPage());
      } else if (input.wasPressed('left') && pageIndex > 0) {
        game.sfx('page');
        showPage(pageIndex - 1);
      } else if (input.wasPressed('confirm') || input.wasPressed('right') || input.pointer.wasPressed) {
        goForward();
      }
    }

    function render(ctx) {
      LM.illustrations[pages[pageIndex].illustration](ctx, elapsed);
      LM.ui.drawHud(ctx, { title: params.title, rightText: (pageIndex + 1) + '/' + pages.length });
      LM.ui.drawParchmentPanel(ctx, TEXT_PANEL);
      const speaker = LM.data.voices[pages[pageIndex].speaker];
      if (speaker && speaker.label) {
        drawSpeakerLabel(ctx, speaker.label);
      }
      drawTypedText(ctx, shownText, lettersShown);
      LM.ui.drawKeyHintBar(ctx, [
        { keys: ['Enter'], label: 'dalej' },
        { keys: ['←'], label: 'wstecz' },
        { keys: ['Esc'], label: 'pomiń opowieść' },
      ]);
    }

    return {
      enter: function () { showPage(0); },
      update: update,
      render: render,
    };
  }

  LM.sceneFactories.cutscene = createCutsceneScene;
}(window.LM = window.LM || {}));
