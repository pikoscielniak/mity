// Match pairs: choose an item in one column, then its partner in the other. A coloured line joins each pair.
(function (LM) {
  'use strict';

  const ROW_HEIGHT = 54;
  const ROW_GAP = 10;
  const PAIR_COLORS = ['#e8202a', '#2f9e44', '#2f6fd8', '#c0660f', '#8a3ab8'];
  const LEFT = 0;
  const RIGHT = 1;
  const SUBMIT = 2;

  // Responds with { pairs: { leftText: rightText } } once every left item has a partner.
  function createMatchView(pairs, area, rng, playSound) {
    const lefts = pairs.map(function (pair) { return pair.left; });
    const rights = LM.random.shuffle(pairs.map(function (pair) { return pair.right; }), rng);
    const partnerOfLeft = lefts.map(function () { return null; });
    let cursor = { column: LEFT, index: 0 };
    let pending = null;
    const columnWidth = area.width * 0.42;

    function itemRect(column, index) {
      const x = column === LEFT ? area.x : area.x + area.width - columnWidth;
      return { x: x, y: area.y + index * (ROW_HEIGHT + ROW_GAP), width: columnWidth, height: ROW_HEIGHT };
    }

    function submitRect() {
      return { x: area.x + area.width / 2 - 150, y: area.y + lefts.length * (ROW_HEIGHT + ROW_GAP) + 8, width: 300, height: 52 };
    }

    function isComplete() {
      return partnerOfLeft.every(function (partner) { return partner !== null; });
    }

    function leftPartnerOfRight(rightIndex) {
      return partnerOfLeft.indexOf(rightIndex);
    }

    function link(leftIndex, rightIndex) {
      const previousLeft = leftPartnerOfRight(rightIndex);
      if (previousLeft >= 0) {
        partnerOfLeft[previousLeft] = null;
      }
      partnerOfLeft[leftIndex] = rightIndex;
      playSound('choose');
    }

    // Choosing an item either starts a pair or completes the pair started in the other column.
    function chooseItem(column, index) {
      if (pending && pending.column !== column) {
        const leftIndex = column === LEFT ? index : pending.index;
        const rightIndex = column === RIGHT ? index : pending.index;
        link(leftIndex, rightIndex);
        pending = null;
        return;
      }
      pending = { column: column, index: index };
      playSound('move');
    }

    function moveCursor(input) {
      if (cursor.column === SUBMIT && input.wasPressed('up')) {
        cursor = { column: LEFT, index: lefts.length - 1 };
      } else if (input.wasPressed('down') && cursor.column !== SUBMIT) {
        cursor = cursor.index === lefts.length - 1 ? { column: SUBMIT, index: 0 } : { column: cursor.column, index: cursor.index + 1 };
      } else if (input.wasPressed('up') && cursor.column !== SUBMIT) {
        cursor = { column: cursor.column, index: Math.max(0, cursor.index - 1) };
      } else if (input.wasPressed('left') && cursor.column === RIGHT) {
        cursor = { column: LEFT, index: cursor.index };
      } else if (input.wasPressed('right') && cursor.column === LEFT) {
        cursor = { column: RIGHT, index: cursor.index };
      }
    }

    function response() {
      const chosen = {};
      lefts.forEach(function (left, index) { chosen[left] = rights[partnerOfLeft[index]]; });
      return { pairs: chosen };
    }

    function itemAtPointer(pointer) {
      for (let index = 0; index < lefts.length; index += 1) {
        if (LM.ui.isPointInRect(pointer, itemRect(LEFT, index))) {
          return { column: LEFT, index: index };
        }
        if (LM.ui.isPointInRect(pointer, itemRect(RIGHT, index))) {
          return { column: RIGHT, index: index };
        }
      }
      return null;
    }

    function update(input) {
      moveCursor(input);
      const clicked = input.pointer.wasPressed ? itemAtPointer(input.pointer) : null;
      if (clicked) {
        cursor = clicked;
        chooseItem(clicked.column, clicked.index);
      }
      const clickedSubmit = input.pointer.wasPressed && LM.ui.isPointInRect(input.pointer, submitRect());
      const confirmedSubmit = input.wasPressed('confirm') && cursor.column === SUBMIT;
      if ((clickedSubmit || confirmedSubmit) && isComplete()) {
        return response();
      }
      if (input.wasPressed('confirm') && cursor.column !== SUBMIT) {
        chooseItem(cursor.column, cursor.index);
      }
      return null;
    }

    function pairColorOf(column, index) {
      const leftIndex = column === LEFT ? index : leftPartnerOfRight(index);
      const isPaired = leftIndex >= 0 && partnerOfLeft[leftIndex] !== null;
      return isPaired ? PAIR_COLORS[leftIndex % PAIR_COLORS.length] : null;
    }

    function drawItem(ctx, column, index, text) {
      const rect = itemRect(column, index);
      const isCursor = cursor.column === column && cursor.index === index;
      const isPending = pending !== null && pending.column === column && pending.index === index;
      LM.ui.drawOptionRow(ctx, rect, null, text, isCursor || isPending ? 'selected' : 'normal');
      if (isPending) {
        LM.draw.roundRectPath(ctx, { x: rect.x - 5, y: rect.y - 5, width: rect.width + 10, height: rect.height + 10 }, 12);
        ctx.strokeStyle = LM.palette.gold;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      const color = pairColorOf(column, index);
      if (color) {
        const dotX = column === LEFT ? rect.x + rect.width + 14 : rect.x - 14;
        LM.draw.drawOutlinedCircle(ctx, dotX, rect.y + ROW_HEIGHT / 2, 9, color, 2);
      }
    }

    function drawLinks(ctx) {
      partnerOfLeft.forEach(function (rightIndex, leftIndex) {
        if (rightIndex === null) {
          return;
        }
        const from = itemRect(LEFT, leftIndex);
        const to = itemRect(RIGHT, rightIndex);
        LM.draw.drawLine(ctx, from.x + from.width + 14, from.y + ROW_HEIGHT / 2, to.x - 14, to.y + ROW_HEIGHT / 2, PAIR_COLORS[leftIndex % PAIR_COLORS.length], 4);
      });
    }

    function render(ctx) {
      drawLinks(ctx);
      lefts.forEach(function (text, index) { drawItem(ctx, LEFT, index, text); });
      rights.forEach(function (text, index) { drawItem(ctx, RIGHT, index, text); });
      const submitState = isComplete() ? (cursor.column === SUBMIT ? 'selected' : 'normal') : 'disabled';
      LM.ui.drawButton(ctx, submitRect(), 'Sprawdź pary', submitState, 22);
    }

    return {
      update: update,
      render: render,
      keyHints: [
        { keys: ['←', '→', '↑', '↓'], label: 'wybór' },
        { keys: ['Enter'], label: 'połącz w parę' },
      ],
      dispose: function () {},
    };
  }

  LM.matchView = { createMatchView };
}(window.LM = window.LM || {}));
