// Shared registries. Every other file adds itself to window.LM, so tests can load them all in a bare vm context.
(function (LM) {
  'use strict';

  LM.data = LM.data || {};
  LM.sceneFactories = LM.sceneFactories || {};
  LM.stageFactories = LM.stageFactories || {};
  LM.illustrations = LM.illustrations || {};
}(window.LM = window.LM || {}));
