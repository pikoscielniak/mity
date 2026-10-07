// Volumes, mute, narration and full screen. ←/→ change the selected setting, Enter toggles, Esc returns.
(function (LM) {
  'use strict';

  const VOLUME_STEP = 0.1;
  const VOLUME_SETTINGS = { music: 'musicVolume', sfx: 'sfxVolume', voice: 'voiceVolume' };

  function percentLabel(value) {
    return '◄  ' + Math.round(value * 100) + '%  ►';
  }

  function isFullscreen() {
    return Boolean(document.fullscreenElement);
  }

  function toggleFullscreen() {
    if (isFullscreen()) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  function createSettingsScene(game) {
    const settings = game.profile().settings;
    let elapsed = 0;
    const items = [
      { id: 'music', label: '' },
      { id: 'sfx', label: '' },
      { id: 'voice', label: '' },
      { id: 'mute', label: '' },
      { id: 'narration', label: '' },
      { id: 'fullscreen', label: '' },
      { id: 'back', label: 'Wróć' },
    ];
    const menu = LM.menu.createMenu(items, { x: 300, y: 180, width: 680, itemHeight: 50, gap: 10, fontSize: 22, playSound: game.sfx });

    function refreshLabels() {
      items[0].label = 'Muzyka:  ' + percentLabel(settings.musicVolume);
      items[1].label = 'Efekty dźwiękowe:  ' + percentLabel(settings.sfxVolume);
      items[2].label = 'Lektor i śpiew:  ' + percentLabel(settings.voiceVolume);
      items[3].label = 'Wszystkie dźwięki wyciszone:  ' + (settings.isMuted ? 'TAK' : 'NIE');
      items[4].label = 'Lektor czyta opowieści:  ' + (settings.isNarrationEnabled ? 'TAK' : 'NIE');
      items[5].label = isFullscreen() ? 'Wyłącz pełny ekran' : 'Włącz pełny ekran';
    }

    function changeVolume(itemId, direction) {
      const key = VOLUME_SETTINGS[itemId];
      const changed = Math.round((settings[key] + direction * VOLUME_STEP) * 10) / 10;
      settings[key] = Math.min(1, Math.max(0, changed));
      game.applySettings();
      game.sfx('move');
    }

    function leave() {
      game.persist();
      game.show('map');
    }

    function update(dt, input) {
      elapsed += dt;
      const selected = menu.selectedItem();
      if (VOLUME_SETTINGS[selected.id] && input.wasPressed('left')) {
        changeVolume(selected.id, -1);
      }
      if (VOLUME_SETTINGS[selected.id] && input.wasPressed('right')) {
        changeVolume(selected.id, 1);
      }
      const chosen = menu.update(input);
      if (chosen && chosen.id === 'mute') {
        settings.isMuted = !settings.isMuted;
        game.applySettings();
      } else if (chosen && chosen.id === 'narration') {
        settings.isNarrationEnabled = !settings.isNarrationEnabled;
      } else if (chosen && chosen.id === 'fullscreen') {
        toggleFullscreen();
      } else if ((chosen && chosen.id === 'back') || input.wasPressed('back')) {
        leave();
      }
      refreshLabels();
    }

    function render(ctx) {
      LM.scenery.drawSunsetCoast(ctx, elapsed);
      LM.ui.drawTitledPanel(ctx, { x: 260, y: 110, width: 760, height: 500 }, 'Ustawienia');
      menu.render(ctx);
      LM.ui.drawKeyHintBar(ctx, [
        { keys: ['↑', '↓'], label: 'wybór' },
        { keys: ['←', '→'], label: 'zmiana' },
        { keys: ['Enter'], label: 'przełącz' },
        { keys: ['Esc'], label: 'wróć' },
      ]);
    }

    refreshLabels();
    return { update, render };
  }

  LM.sceneFactories.settings = createSettingsScene;
}(window.LM = window.LM || {}));
