// Answers A–D (or Prawda/Fałsz): number keys answer at once, arrows + Enter or a click also work.
(function (LM) {
  'use strict';

  function drawOption(ctx, item, rect, state) {
    LM.ui.drawOptionRow(ctx, rect, String(item.index + 1), item.label, state);
  }

  // labels: option texts; disabledIndices: options already tried and wrong. Responds with { optionIndex }.
  function createChoiceView(labels, area, disabledIndices, playSound) {
    const items = labels.map(function (label, index) {
      return { id: 'option', index: index, label: label, isEnabled: disabledIndices.indexOf(index) < 0 };
    });
    const itemHeight = labels.length > 2 ? 64 : 72;
    const menu = LM.menu.createMenu(items, {
      x: area.x, y: area.y, width: area.width, itemHeight: itemHeight, gap: 12,
      playSound: playSound, renderItem: drawOption,
    });

    function update(input) {
      const pressed = input.pressedOptionIndex();
      if (pressed >= 0 && pressed < items.length && items[pressed].isEnabled) {
        playSound('choose');
        return { optionIndex: pressed };
      }
      const chosen = menu.update(input);
      return chosen ? { optionIndex: chosen.index } : null;
    }

    return {
      update: update,
      render: menu.render,
      keyHints: [
        { keys: labels.length > 2 ? ['1', '2', '3', '4'] : ['1', '2'], label: 'odpowiedź' },
        { keys: ['↑', '↓', 'Enter'], label: 'albo strzałki' },
      ],
      dispose: function () {},
    };
  }

  LM.choiceView = { createChoiceView };
}(window.LM = window.LM || {}));
