(function (LM) {
  'use strict';

  // One base scene plus a stack of overlays (pause, question, hint). Only the top layer receives updates.
  function createSceneManager(game) {
    let baseScene = null;
    const overlays = [];

    function enter(layer) {
      if (layer.enter) {
        layer.enter(game);
      }
    }

    function exit(layer) {
      if (layer.exit) {
        layer.exit();
      }
    }

    function replaceScene(scene) {
      while (overlays.length > 0) {
        exit(overlays.pop());
      }
      if (baseScene) {
        exit(baseScene);
      }
      baseScene = scene;
      enter(scene);
    }

    function pushOverlay(overlay) {
      overlays.push(overlay);
      enter(overlay);
    }

    function popOverlay(overlay) {
      const index = overlays.indexOf(overlay);
      if (index >= 0) {
        overlays.splice(index, 1);
        exit(overlay);
      }
    }

    function topLayer() {
      return overlays.length > 0 ? overlays[overlays.length - 1] : baseScene;
    }

    function update(dt, input) {
      const layer = topLayer();
      if (layer) {
        layer.update(dt, input);
      }
    }

    function render(ctx) {
      if (baseScene) {
        baseScene.render(ctx);
      }
      overlays.forEach(function (overlay) { overlay.render(ctx); });
    }

    return {
      replaceScene,
      pushOverlay,
      popOverlay,
      update,
      render,
      currentScene: function () { return baseScene; },
      topLayer,
    };
  }

  LM.sceneManager = { createSceneManager };
}(window.LM = window.LM || {}));
