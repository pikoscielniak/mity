// A ballad with karaoke over a picture from its myth. Enter skips; a song heard to the end counts for an achievement.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const SKIP_ALLOWED_AFTER_SECONDS = 1;

  function backgroundIllustration(song) {
    const myth = LM.data.myths[song.myth];
    return myth.endingPages[myth.endingPages.length - 1].illustration;
  }

  // params: { songId, onFinished() }
  function createSongScene(game, params) {
    const song = LM.data.songs[params.songId];
    let playback = null;
    let elapsed = 0;
    let wasHeardToTheEnd = false;
    let earnedAchievements = [];

    function startSinging() {
      game.music.stop(0.4);
      LM.klattVoice.prepare(game.audio.context()).then(function () {
        playback = LM.songPlayer.playSong(game.audio, song);
      });
    }

    function recordHeardToTheEnd() {
      const profile = game.profile();
      LM.profiles.recordBalladHeard(profile, params.songId);
      earnedAchievements = LM.achievements.awardAchievements(profile, {
        run: LM.missionRun.createMissionRun('jukebox'), isPassed: false, profile: profile,
      });
      game.persist();
    }

    function update(dt, input) {
      elapsed += dt;
      const isOver = playback !== null && playback.currentTime() > playback.endTime;
      if (isOver && !wasHeardToTheEnd) {
        wasHeardToTheEnd = true;
        recordHeardToTheEnd();
      }
      const wantsToLeave = input.wasPressed('confirm') || input.wasPressed('back') || input.pointer.wasPressed;
      if (wantsToLeave && elapsed > SKIP_ALLOWED_AFTER_SECONDS) {
        params.onFinished();
      }
    }

    function render(ctx) {
      LM.illustrations[backgroundIllustration(song)](ctx, elapsed);
      LM.ui.drawDimmer(ctx);
      LM.ui.drawTitleText(ctx, song.title, 640, 150, 60);
      LM.ui.drawMeanderBand(ctx, { x: 290, y: 172, width: 700, height: 20 }, P.gold);
      LM.draw.fillRoundRect(ctx, { x: 80, y: 290, width: 1120, height: 190 }, 18, 'rgba(5, 10, 30, 0.6)');
      if (playback) {
        LM.karaokeView.drawKaraoke(ctx, playback.karaoke, playback.currentTime(), 640, 380);
      }
      earnedAchievements.forEach(function (achievement, index) {
        LM.ui.drawShadowText(ctx, '★ Nowe osiągnięcie: ' + game.say(achievement.title), 640, 560 + index * 34, 22, P.gold, 'center');
      });
      LM.ui.drawKeyHintBar(ctx, [{ keys: ['Enter'], label: 'dalej' }], 'Śpiewa robotyczny aojda, czyli grecki pieśniarz');
    }

    return {
      enter: startSinging,
      update: update,
      render: render,
      exit: function () {
        if (playback) {
          playback.stop();
        }
      },
    };
  }

  LM.sceneFactories.song = createSongScene;
}(window.LM = window.LM || {}));
