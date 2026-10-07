(function (LM) {
  'use strict';

  // One base scene plus a stack of overlays (pause, question, hint). Only the top layer receives updates.
  // A layer may define cover()/uncover() to react when an overlay opens above it or closes again.
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

    function topLayer() {
      return overlays.length > 0 ? overlays[overlays.length - 1] : baseScene;
    }

    function pushOverlay(overlay) {
      const covered = topLayer();
      if (covered && covered.cover) {
        covered.cover();
      }
      overlays.push(overlay);
      enter(overlay);
    }

    function popOverlay(overlay) {
      const index = overlays.indexOf(overlay);
      if (index < 0) {
        return;
      }
      const wasOnTop = overlay === topLayer();
      overlays.splice(index, 1);
      exit(overlay);
      const uncovered = topLayer();
      if (wasOnTop && uncovered && uncovered.uncover) {
        uncovered.uncover();
      }
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
