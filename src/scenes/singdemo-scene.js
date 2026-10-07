// Developer view (?scene=singdemo): one ballad sung by the robot voice with karaoke.
(function (LM) {
  'use strict';

  function createSingDemoScene(game, params) {
    const song = LM.data.songs[params.songId || 'theseus'];
    let playback = null;
    let elapsed = 0;

    function startSinging() {
      game.onFirstGesture();
      game.music.stop(0.3);
      LM.klattVoice.prepare(game.audio.context()).then(function () {
        playback = LM.songPlayer.playSong(game.audio, song);
      });
    }

    function update(dt, input) {
      elapsed += dt;
      const isFinished = playback && playback.currentTime() > playback.endTime;
      if ((input.wasPressed('confirm') || input.pointer.wasPressed) && (!playback || isFinished)) {
        startSinging();
      }
    }

    function render(ctx) {
      LM.scenery.drawSky(ctx, { x: 0, y: 0, width: 1280, height: 720 }, '#0b1838', '#3a2a6a');
      LM.ui.drawTitleText(ctx, song.title, 640, 150, 64);
      LM.ui.drawMeanderBand(ctx, { x: 290, y: 176, width: 700, height: 20 }, LM.palette.gold);
      if (playback) {
        LM.karaokeView.drawKaraoke(ctx, playback.karaoke, playback.currentTime(), 640, 400);
      } else {
        const pulse = Math.sin(elapsed * 4) > 0 ? 'selected' : 'normal';
        LM.ui.drawButton(ctx, { x: 440, y: 360, width: 400, height: 60 }, 'Enter: zaśpiewaj!', pulse, 26);
      }
    }

    function exit() {
      if (playback) {
        playback.stop();
      }
    }

    return { update, render, exit };
  }

  LM.sceneFactories.singdemo = createSingDemoScene;
}(window.LM = window.LM || {}));
