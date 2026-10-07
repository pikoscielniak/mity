// "Szafa grająca": replay the ballads unlocked by passing missions.
(function (LM) {
  'use strict';

  function createJukeboxScene(game) {
    const profile = game.profile();
    let elapsed = 0;
    const items = LM.data.missions.map(function (mission) {
      const song = LM.data.songs[mission.songId];
      const isUnlocked = profile.unlockedSongs.indexOf(mission.songId) >= 0;
      const label = isUnlocked ? song.title : 'Zalicz misję „' + mission.title + '”';
      return { id: 'song', songId: mission.songId, label: label, isEnabled: isUnlocked };
    });
    items.push({ id: 'back', label: 'Wróć na mapę' });
    const menu = LM.menu.createMenu(items, { x: 340, y: 230, width: 600, itemHeight: 58, gap: 14, fontSize: 22, playSound: game.sfx });

    function update(dt, input) {
      elapsed += dt;
      const chosen = menu.update(input);
      if ((chosen && chosen.id === 'back') || input.wasPressed('back')) {
        game.show('map');
      } else if (chosen) {
        game.show('song', { songId: chosen.songId, onFinished: function () { game.show('jukebox'); } });
      }
    }

    function render(ctx) {
      LM.mapPainter.drawMapBase(ctx, elapsed);
      LM.ui.drawDimmer(ctx);
      LM.ui.drawTitledPanel(ctx, { x: 300, y: 120, width: 680, height: 470 }, 'Szafa grająca');
      LM.text.drawWrappedText(ctx, 'Ballady śpiewa robotyczny aojda. Zaśpiewaj razem z nim!', 640, 196, 600, {
        font: LM.text.regularFont(19), color: LM.palette.inkSoft, lineHeight: 24, align: 'center',
      });
      menu.render(ctx);
      LM.ui.drawHud(ctx, { title: 'Szafa grająca' });
      LM.ui.drawKeyHintBar(ctx, [{ keys: ['↑', '↓'], label: 'wybierz' }, { keys: ['Enter'], label: 'zagraj' }, { keys: ['Esc'], label: 'wróć' }]);
    }

    return { update: update, render: render };
  }

  LM.sceneFactories.jukebox = createJukeboxScene;
}(window.LM = window.LM || {}));
