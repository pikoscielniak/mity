// Every attempt of the current player, newest first: date, mission, score and whether it passed.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const ROW_HEIGHT = 40;
  const LIST_TOP = 196;
  const VISIBLE_ROWS = 10;
  const COLUMNS = [{ x: 150, title: 'Data' }, { x: 380, title: 'Wyprawa' }, { x: 860, title: 'Wynik' }, { x: 1010, title: 'Zaliczona' }];

  function pad(number) {
    return String(number).padStart(2, '0');
  }

  function formatDateTime(iso) {
    const date = new Date(iso);
    return pad(date.getDate()) + '.' + pad(date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function missionTitle(missionId) {
    if (missionId === LM.data.exam.id) {
      return LM.data.exam.title;
    }
    return LM.missions.byId(missionId).title;
  }

  function createHistoryScene(game) {
    const entries = game.profile().history.slice().reverse();
    let firstRow = 0;
    let elapsed = 0;

    function drawRow(ctx, entry, row) {
      const y = LIST_TOP + row * ROW_HEIGHT;
      const style = { font: LM.text.regularFont(19), color: P.ink };
      LM.text.drawTextLine(ctx, formatDateTime(entry.dateIso), COLUMNS[0].x, y, style);
      LM.text.drawTextLine(ctx, missionTitle(entry.missionId), COLUMNS[1].x, y, style);
      LM.text.drawTextLine(ctx, entry.percent + '%', COLUMNS[2].x, y, style);
      LM.text.drawTextLine(ctx, entry.isPassed ? '✔ tak' : '✘ nie', COLUMNS[3].x, y, { font: LM.text.boldFont(19), color: entry.isPassed ? P.correct : P.wrong });
    }

    function render(ctx) {
      LM.mapPainter.drawMapBase(ctx, elapsed);
      LM.ui.drawDimmer(ctx);
      LM.ui.drawTitledPanel(ctx, { x: 110, y: 90, width: 1060, height: 560 }, 'Historia wyników: ' + game.profile().name);
      COLUMNS.forEach(function (column) {
        LM.text.drawTextLine(ctx, column.title, column.x, 166, { font: LM.text.boldFont(19), color: P.inkSoft });
      });
      if (entries.length === 0) {
        LM.text.drawTextLine(ctx, 'Jeszcze nic tu nie ma. Wypłyń na pierwszą wyprawę!', 640, 300, { font: LM.text.boldFont(22), color: P.ink, align: 'center' });
      }
      entries.slice(firstRow, firstRow + VISIBLE_ROWS).forEach(function (entry, row) { drawRow(ctx, entry, row); });
      LM.ui.drawHud(ctx, { title: 'Historia wyników', rightText: entries.length + ' podejść' });
      LM.ui.drawKeyHintBar(ctx, [{ keys: ['↑', '↓'], label: 'przewijanie' }, { keys: ['Esc'], label: 'wróć na mapę' }]);
    }

    return {
      update: function (dt, input) {
        elapsed += dt;
        const maxFirstRow = Math.max(0, entries.length - VISIBLE_ROWS);
        if (input.wasPressed('down')) {
          firstRow = Math.min(maxFirstRow, firstRow + 1);
        }
        if (input.wasPressed('up')) {
          firstRow = Math.max(0, firstRow - 1);
        }
        if (input.wasPressed('back') || input.wasPressed('confirm')) {
          game.show('map');
        }
      },
      render: render,
    };
  }

  LM.sceneFactories.history = createHistoryScene;
}(window.LM = window.LM || {}));
