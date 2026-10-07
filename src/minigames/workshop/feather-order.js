// Laying out the feathers of a wing from the shortest to the longest: pick one up and move it with ←/→,
// or click two feathers to swap them.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const SLOT_LEFT = 420;
  const SLOT_SPACING = 76;
  const BASE_Y = 440;

  function isAscending(lengths) {
    return lengths.every(function (length, index) { return index === 0 || lengths[index - 1] < length; });
  }

  function slotX(index) {
    return SLOT_LEFT + index * SLOT_SPACING;
  }

  function swap(items, first, second) {
    const temporary = items[first];
    items[first] = items[second];
    items[second] = temporary;
  }

  function createFeatherRow(lengths, rng, playSound) {
    let order = lengths.slice();
    while (isAscending(order)) {
      order = LM.random.shuffle(lengths, rng);
    }
    const row = { order: order, cursor: 0, heldIndex: null };

    function moveHeld(step) {
      const target = row.heldIndex + step;
      if (target >= 0 && target < order.length) {
        swap(order, row.heldIndex, target);
        row.heldIndex = target;
        row.cursor = target;
        playSound('move');
      }
    }

    function featherAt(pointer) {
      return order.findIndex(function (length, index) {
        return Math.abs(pointer.x - slotX(index)) < SLOT_SPACING / 2 && pointer.y > BASE_Y - 140 && pointer.y < BASE_Y + 20;
      });
    }

    function clickFeather(index) {
      if (row.heldIndex === null) {
        row.heldIndex = index;
      } else {
        swap(order, row.heldIndex, index);
        row.heldIndex = null;
      }
      row.cursor = index;
      playSound('choose');
    }

    function updateKeyboard(input) {
      const step = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
      if (step !== 0 && row.heldIndex !== null) {
        moveHeld(step);
      } else if (step !== 0) {
        row.cursor = Math.min(order.length - 1, Math.max(0, row.cursor + step));
      }
      if (input.wasPressed('confirm')) {
        row.heldIndex = row.heldIndex === null ? row.cursor : null;
        playSound('choose');
      }
    }

    // Returns true at the moment the feathers become sorted.
    row.update = function (input) {
      const clicked = input.pointer.wasPressed ? featherAt(input.pointer) : -1;
      if (clicked >= 0) {
        clickFeather(clicked);
      } else {
        updateKeyboard(input);
      }
      return isAscending(order);
    };

    row.sortForTesting = function () {
      order.sort(function (first, second) { return first - second; });
    };

    return row;
  }

  function drawLongFeather(ctx, x, baseY, length) {
    D.drawOutlinedEllipse(ctx, x, baseY - length / 2, length * 0.15, length / 2, '#fbf6ea', 2);
    D.drawLine(ctx, x, baseY + 4, x, baseY - length * 0.9, '#c8b88e', 2);
  }

  // look: 'arranging' shows the cursor and the picked-up feather; 'glued' shows the finished wing with wax.
  function drawWingFrame(ctx, row, time, look) {
    LM.draw.drawOutlinedRoundRect(ctx, { x: 350, y: 300, width: 580, height: 190 }, 16, 'rgba(255, 247, 224, 0.85)', 3);
    D.drawLine(ctx, SLOT_LEFT - 40, BASE_Y + 14, slotX(row.order.length - 1) + 40, BASE_Y + 14, P.outline, 12);
    D.drawLine(ctx, SLOT_LEFT - 40, BASE_Y + 14, slotX(row.order.length - 1) + 40, BASE_Y + 14, '#f2c442', 7);
    row.order.forEach(function (length, index) {
      const lift = look === 'arranging' && index === row.heldIndex ? -18 : 0;
      drawLongFeather(ctx, slotX(index), BASE_Y + lift, length);
      if (look === 'arranging' && index === row.cursor) {
        D.drawOutlinedPolygon(ctx, [[slotX(index) - 12, BASE_Y + 40], [slotX(index) + 12, BASE_Y + 40], [slotX(index), BASE_Y + 24]], P.selection, 2);
      }
    });
    if (look === 'glued') {
      LM.workshopArt.drawWaxPot(ctx, 880, 470, time);
    }
  }

  LM.featherOrder = { createFeatherRow, drawWingFrame, isAscending };
}(window.LM = window.LM || {}));
