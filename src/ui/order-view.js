// Put the events of a myth in order: pick a card up (Enter or mouse), move it with ↑/↓ or by dragging, drop it.
(function (LM) {
  'use strict';

  const CARD_HEIGHT = 54;
  const CARD_GAP = 10;
  const NUMBER_COLUMN = 52;

  // Responds with { items } in the order the player arranged them.
  function createOrderView(itemsInOrder, area, rng, playSound) {
    const cards = LM.random.shuffledOutOfOrder(itemsInOrder, rng);
    const submitIndex = cards.length;
    let cursor = 0;
    let heldIndex = null;
    let isDragging = false;

    function cardRect(index) {
      return { x: area.x + NUMBER_COLUMN, y: area.y + index * (CARD_HEIGHT + CARD_GAP), width: area.width - NUMBER_COLUMN, height: CARD_HEIGHT };
    }

    function submitRect() {
      return { x: area.x + area.width / 2 - 170, y: area.y + cards.length * (CARD_HEIGHT + CARD_GAP) + 8, width: 340, height: 52 };
    }

    function cardIndexAt(point) {
      return cards.findIndex(function (card, index) { return LM.ui.isPointInRect(point, cardRect(index)); });
    }

    function moveHeldCard(step) {
      const target = heldIndex + step;
      if (target < 0 || target >= cards.length) {
        return;
      }
      LM.random.swap(cards, heldIndex, target);
      heldIndex = target;
      cursor = target;
      playSound('move');
    }

    function moveCursor(step) {
      cursor = Math.min(submitIndex, Math.max(0, cursor + step));
      playSound('move');
    }

    function toggleHold() {
      heldIndex = heldIndex === null ? cursor : null;
      playSound('choose');
    }

    function updateKeyboard(input) {
      const step = input.pressedStep('up', 'down');
      if (step !== 0 && heldIndex !== null) {
        moveHeldCard(step);
      } else if (step !== 0) {
        moveCursor(step);
      }
      if (input.wasPressed('confirm') && cursor === submitIndex) {
        return { items: cards.slice() };
      }
      if (input.wasPressed('confirm')) {
        toggleHold();
      }
      return null;
    }

    function dragHeldCardTo(pointerY) {
      const target = Math.min(cards.length - 1, Math.max(0, Math.floor((pointerY - area.y) / (CARD_HEIGHT + CARD_GAP))));
      while (heldIndex !== target) {
        moveHeldCard(target > heldIndex ? 1 : -1);
      }
    }

    function updatePointer(pointer) {
      if (pointer.wasPressed && LM.ui.isPointInRect(pointer, submitRect())) {
        return { items: cards.slice() };
      }
      const pressedCard = pointer.wasPressed ? cardIndexAt(pointer) : -1;
      if (pressedCard >= 0) {
        heldIndex = pressedCard;
        cursor = pressedCard;
        isDragging = true;
      }
      if (isDragging && pointer.isDown) {
        dragHeldCardTo(pointer.y);
      }
      if (isDragging && pointer.wasReleased) {
        isDragging = false;
        heldIndex = null;
      }
      return null;
    }

    function update(input) {
      return updatePointer(input.pointer) || updateKeyboard(input);
    }

    function render(ctx) {
      cards.forEach(function (card, index) {
        const rect = cardRect(index);
        LM.ui.drawNumberBadge(ctx, area.x, rect.y + (CARD_HEIGHT - 34) / 2, String(index + 1));
        const lift = index === heldIndex ? -4 : 0;
        const state = index === cursor ? 'selected' : 'normal';
        LM.ui.drawOptionRow(ctx, { x: rect.x + lift, y: rect.y + lift, width: rect.width, height: rect.height }, index === heldIndex ? '↕' : null, card, state);
      });
      LM.ui.drawButton(ctx, submitRect(), 'Sprawdź kolejność', cursor === submitIndex ? 'selected' : 'normal', 22);
    }

    return {
      update: update,
      render: render,
      keyHints: [
        { keys: ['↑', '↓'], label: 'wybierz / przesuń' },
        { keys: ['Enter'], label: 'chwyć / upuść' },
      ],
      dispose: function () {},
    };
  }

  LM.orderView = { createOrderView };
}(window.LM = window.LM || {}));
