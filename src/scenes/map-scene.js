// The hub between missions. (Simple list for now; the animated Aegean map replaces it later.)
(function (LM) {
  'use strict';

  function missionItems(profile) {
    const items = LM.data.missions.map(function (mission) {
      const isUnlocked = LM.profiles.isMissionUnlocked(profile, mission.id);
      const isPassed = LM.profiles.hasPassedMission(profile, mission.id);
      const mark = isPassed ? '  ✔' : '';
      return { id: 'mission', missionId: mission.id, label: 'Misja ' + mission.number + ': ' + mission.title + mark, isEnabled: isUnlocked };
    });
    items.push({ id: 'exam', label: LM.data.exam.title, isEnabled: LM.profiles.isExamUnlocked(profile) });
    items.push({ id: 'settings', label: 'Ustawienia' });
    items.push({ id: 'profiles', label: 'Zmień gracza' });
    return items;
  }

  function createMapScene(game) {
    const profile = game.profile();
    let elapsed = 0;
    const menu = LM.menu.createMenu(missionItems(profile), { x: 340, y: 170, width: 600, itemHeight: 54, gap: 12, fontSize: 22, playSound: game.sfx });

    function update(dt, input) {
      elapsed += dt;
      const chosen = menu.update(input);
      if (!chosen) {
        return;
      }
      if (chosen.id === 'mission') {
        game.startMission(chosen.missionId);
      } else if (chosen.id === 'exam') {
        game.startExam();
      } else {
        game.show(chosen.id);
      }
    }

    function render(ctx) {
      LM.scenery.drawSunsetCoast(ctx, elapsed);
      LM.ui.drawTitledPanel(ctx, { x: 300, y: 90, width: 680, height: 560 }, game.say('Witaj, ' + profile.name + '! Dokąd płyniemy?'));
      menu.render(ctx);
    }

    return { update, render };
  }

  LM.sceneFactories.map = createMapScene;
}(window.LM = window.LM || {}));
