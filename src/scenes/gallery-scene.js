// Developer view (?scene=gallery&myth=theseus): every story and ending page of one myth, in order.
(function (LM) {
  'use strict';

  function createGalleryScene(game, params) {
    const myth = LM.data.myths[params.myth || 'theseus'];
    return LM.sceneFactories.cutscene(game, {
      title: myth.title,
      pages: myth.storyPages.concat(myth.endingPages),
      onFinished: function () { game.show('gallery', params); },
    });
  }

  LM.sceneFactories.gallery = createGalleryScene;
}(window.LM = window.LM || {}));
