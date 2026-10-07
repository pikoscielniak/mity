(function (LM) {
  'use strict';

  function playSfx(hub, name) {
    const effect = LM.data.soundEffects[name];
    if (!hub.isReady() || !effect) {
      return;
    }
    const context = hub.context();
    LM.music.scheduleThemeOnce(context, hub.bus('sfx'), effect, context.currentTime + 0.01);
  }

  LM.sfx = { playSfx };
}(window.LM = window.LM || {}));
