// Pause during a stage: continue, mute or unmute all sound, or leave the mission.
(function (LM) {
  'use strict';

  function createPauseOverlay(game) {
    let isConfirmingExit = false;
    const items = [
      { id: 'resume', label: 'Graj dalej' },
      { id: 'sound', label: '' },
      { id: 'exit', label: '' },
    ];
    const menu = LM.menu.createMenu(items, { x: 440, y: 270, width: 400, itemHeight: 56, gap: 14, fontSize: 22, playSound: game.sfx });
    const overlay = { kind: 'pause', update: update, render: render };

    function refreshLabels() {
      items[1].label = game.audio.isMuted() ? 'Włącz dźwięki' : 'Wycisz dźwięki';
      items[2].label = isConfirmingExit ? 'Na pewno? Postęp misji przepadnie' : 'Przerwij misję';
    }

    function update(dt, input) {
      const chosen = menu.update(input);
      if ((chosen && chosen.id === 'resume') || input.wasPressed('back')) {
        game.scenes.popOverlay(overlay);
      } else if (chosen && chosen.id === 'sound') {
        game.audio.setMuted(!game.audio.isMuted());
      } else if (chosen && chosen.id === 'exit' && isConfirmingExit) {
        game.show('map');
      } else if (chosen && chosen.id === 'exit') {
        isConfirmingExit = true;
      }
      refreshLabels();
    }

    function render(ctx) {
      LM.ui.drawDimmer(ctx);
      LM.ui.drawTitledPanel(ctx, { x: 400, y: 190, width: 480, height: 320 }, 'Pauza');
      menu.render(ctx);
    }

    refreshLabels();
    return overlay;
  }

  LM.pauseOverlay = { createPauseOverlay };
}(window.LM = window.LM || {}));
