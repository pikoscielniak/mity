(function (LM) {
  'use strict';

  function isEnabled(item) {
    return item.isEnabled !== false;
  }

  function silence() {}

  // A vertical list of buttons driven by arrows + Enter or the mouse.
  // items: [{ id, label, isEnabled? }]; layout: { x, y, width, itemHeight, gap, fontSize?, playSound? }
  function createMenu(items, layout) {
    const playSound = layout.playSound || silence;
    let selectedIndex = Math.max(0, items.findIndex(isEnabled));

    function itemRect(index) {
      return {
        x: layout.x,
        y: layout.y + index * (layout.itemHeight + layout.gap),
        width: layout.width,
        height: layout.itemHeight,
      };
    }

    function indexAtPointer(pointer) {
      return items.findIndex(function (item, index) {
        return isEnabled(item) && LM.ui.isPointInRect(pointer, itemRect(index));
      });
    }

    function moveSelection(step) {
      let candidate = selectedIndex;
      for (let tries = 0; tries < items.length; tries += 1) {
        candidate = (candidate + step + items.length) % items.length;
        if (isEnabled(items[candidate])) {
          selectedIndex = candidate;
          playSound('move');
          return;
        }
      }
    }

    function selectHoveredItem(pointer) {
      const hovered = indexAtPointer(pointer);
      if (pointer.hasMoved && hovered >= 0 && hovered !== selectedIndex) {
        selectedIndex = hovered;
        playSound('move');
      }
      return hovered;
    }

    // Returns the chosen item, or null when nothing was chosen this update.
    function update(input) {
      if (input.wasPressed('up')) {
        moveSelection(-1);
      }
      if (input.wasPressed('down')) {
        moveSelection(1);
      }
      const hovered = selectHoveredItem(input.pointer);
      const clickedItem = input.pointer.wasPressed && hovered >= 0;
      const confirmedItem = input.wasPressed('confirm') && isEnabled(items[selectedIndex]);
      if (clickedItem || confirmedItem) {
        playSound('choose');
        return items[selectedIndex];
      }
      return null;
    }

    function stateOf(item, index) {
      if (!isEnabled(item)) {
        return 'disabled';
      }
      return index === selectedIndex ? 'selected' : 'normal';
    }

    function render(ctx) {
      items.forEach(function (item, index) {
        LM.ui.drawButton(ctx, itemRect(index), item.label, stateOf(item, index), layout.fontSize);
      });
    }

    return {
      update,
      render,
      itemRect,
      selectedItem: function () { return items[selectedIndex]; },
    };
  }

  LM.menu = { createMenu };
}(window.LM = window.LM || {}));
