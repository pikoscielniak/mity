(function (LM) {
  'use strict';

  function readUrlOptions() {
    const params = new URLSearchParams(window.location.search);
    return {
      isDebug: params.get('debug') === '1',
      startSceneName: params.get('scene'),
      seed: params.get('seed'),
      sceneParams: Object.fromEntries(params.entries()),
    };
  }

  // Reading window.localStorage itself throws in some privacy modes.
  function browserStorage() {
    try {
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }

  function addAudioServices(game) {
    game.audio = LM.audioHub.createAudioHub();
    game.music = LM.music.createMusicPlayer(game.audio);
    game.speech = LM.speech.createSpeech(game.audio);
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
  }

  function addProfileServices(game) {
    game.saveStore = LM.storage.createSaveStore(browserStorage());
    game.save = game.saveStore.load();
    game.persist = function () {
      game.saveStore.save(game.save);
    };
    const guest = LM.profiles.createDetachedProfile(0, 'Gość', 'boy', new Date().toISOString());
    game.profile = function () {
      return LM.profiles.activeProfile(game.save) || guest;
    };
    game.say = function (text) {
      return LM.genderForms.applyGenderForms(text, game.profile().gender);
    };
    game.applySettings = function () {
      const settings = game.profile().settings;
      game.audio.setVolume('music', settings.musicVolume);
      game.audio.setVolume('sfx', settings.sfxVolume);
      game.audio.setVolume('voice', settings.voiceVolume);
    };
  }

  function createGame() {
    const canvas = document.getElementById('game');
    const view = LM.view.createCanvasView(canvas, window);
    const game = {
      view: view,
      input: LM.input.createInput(view, window),
      textInput: LM.textInput.createTextInputOverlay(view, document.getElementById('answer-input'), window),
      options: readUrlOptions(),
    };
    game.scenes = LM.sceneManager.createSceneManager(game);
    game.show = function (sceneName, params) {
      game.scenes.replaceScene(LM.sceneFactories[sceneName](game, params || {}));
    };
    game.startMission = function () {};
    game.startExam = function () {};
    addAudioServices(game);
    addProfileServices(game);
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
    game.show(game.options.startSceneName || 'title', game.options.sceneParams);
    LM.loop.startGameLoop(
      function (dt) { updateGame(game, dt); },
      function () { renderGame(game); }
    );
  }

  window.addEventListener('load', start);
}(window.LM = window.LM || {}));
