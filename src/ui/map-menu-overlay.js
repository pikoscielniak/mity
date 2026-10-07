// The menu opened from the map with Esc: achievements, results history, jukebox, settings, change player.
(function (LM) {
  'use strict';

  const ITEMS = [
    { id: 'achievements', label: 'Osiągnięcia' },
    { id: 'history', label: 'Historia wyników' },
    { id: 'jukebox', label: 'Szafa grająca' },
    { id: 'settings', label: 'Ustawienia' },
    { id: 'profiles', label: 'Zmień gracza' },
    { id: 'close', label: 'Wróć na mapę' },
  ];

  function createMapMenuOverlay(game) {
    const menu = LM.menu.createMenu(ITEMS, { x: 460, y: 170, width: 360, itemHeight: 54, gap: 12, fontSize: 22, playSound: game.sfx });
    const overlay = {
      kind: 'menu',
      update: function (dt, input) {
        const chosen = menu.update(input);
        if ((chosen && chosen.id === 'close') || input.wasPressed('back')) {
          game.scenes.popOverlay(overlay);
        } else if (chosen) {
          game.show(chosen.id, { returnTo: 'map' });
        }
      },
      render: function (ctx) {
        LM.ui.drawDimmer(ctx);
        LM.ui.drawTitledPanel(ctx, { x: 420, y: 100, width: 440, height: 520 }, 'Menu');
        menu.render(ctx);
      },
    };
    return overlay;
  }

  LM.mapMenu = { createMapMenuOverlay };
}(window.LM = window.LM || {}));
