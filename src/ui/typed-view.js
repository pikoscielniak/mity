// The player types the answer. Esc means "nie wiem" (counts as wrong and shows the answer); Tab opens the hint.
(function (LM) {
  'use strict';

  // Responds with { text } (or { text: '' } after Esc).
  function createTypedView(area, game, onHintKey) {
    const fieldRect = { x: area.x + area.width / 2 - 290, y: area.y + 56, width: 580, height: 60 };
    let pendingResponse = null;
    let coveredText = '';

    function showField(initialText) {
      game.textInput.show(fieldRect, {
        initialText: initialText,
        placeholder: 'Wpisz odpowiedź…',
        maxLength: 40,
        onSubmit: function (text) {
          if (text.trim().length > 0) {
            pendingResponse = { text: text };
          }
        },
        onCancel: function () { pendingResponse = { text: '' }; },
        onTab: onHintKey,
      });
    }

    function update() {
      game.textInput.keepFocus();
      const response = pendingResponse;
      pendingResponse = null;
      return response;
    }

    function render(ctx) {
      const style = { font: LM.text.boldFont(22), color: LM.palette.ink, lineHeight: 28, align: 'center' };
      LM.text.drawWrappedText(ctx, 'Twoja odpowiedź:', area.x + area.width / 2, area.y + 30, area.width, style);
      LM.text.drawWrappedText(ctx, 'Wielkie litery i polskie znaki nie mają znaczenia, drobna literówka też.', area.x + area.width / 2, fieldRect.y + 100, area.width, {
        font: LM.text.regularFont(18), color: LM.palette.inkSoft, lineHeight: 24, align: 'center',
      });
    }

    showField('');

    return {
      update: update,
      render: render,
      keyHints: [{ keys: ['Enter'], label: 'zatwierdź' }, { keys: ['Esc'], label: 'nie wiem' }],
      // The HTML field would float above the hint scroll, so it hides while covered and returns with the typed text.
      cover: function () {
        coveredText = game.textInput.currentText();
        game.textInput.hide();
      },
      uncover: function () { showField(coveredText); },
      dispose: function () { game.textInput.hide(); },
    };
  }

  LM.typedView = { createTypedView };
}(window.LM = window.LM || {}));
