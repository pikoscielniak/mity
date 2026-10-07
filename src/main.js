(function (LM) {
  'use strict';

  function readUrlOptions() {
    const params = new URLSearchParams(window.location.search);
    return {
      isDebug: params.get('debug') === '1',
      startSceneName: params.get('scene'),
      seed: params.get('seed'),
    };
  }

  function createGame() {
    const canvas = document.getElementById('game');
    const view = LM.view.createCanvasView(canvas, window);
    const game = {
      view: view,
      input: LM.input.createInput(view, window),
      options: readUrlOptions(),
    };
    game.scenes = LM.sceneManager.createSceneManager(game);
    game.audio = LM.audioHub.createAudioHub();
    game.music = LM.music.createMusicPlayer(game.audio);
    game.show = function (sceneName, params) {
      game.scenes.replaceScene(LM.sceneFactories[sceneName](game, params || {}));
    };
    game.sfx = function (name) {
      LM.sfx.playSfx(game.audio, name);
    };
    game.playTheme = function (themeId) {
      game.music.play(LM.data.themes[themeId]);
    };
    game.onFirstGesture = function () {
      game.audio.unlock();
      if (game.audio.isReady()) {
        LM.klattVoice.prepare(game.audio.context());
      }
      game.playTheme('title');
    };
    return game;
  }

  function updateGame(game, dt) {
    game.scenes.update(dt, game.input);
    game.input.endUpdate();
  }

  function renderGame(game) {
    game.view.beginFrame();
    game.scenes.render(game.view.ctx);
  }

  function start() {
    const game = createGame();
    LM.game = game;
    game.show(game.options.startSceneName || 'title');
    LM.loop.startGameLoop(
      function (dt) { updateGame(game, dt); },
      function () { renderGame(game); }
    );
  }

  window.addEventListener('load', start);
}(window.LM = window.LM || {}));
