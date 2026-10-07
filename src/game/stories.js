// Looks up story pages across all myths (hints point at the page that contains the answer).
(function (LM) {
  'use strict';

  function allMyths() {
    const myths = LM.data.myths || {};
    return Object.keys(myths).map(function (mythId) { return myths[mythId]; });
  }

  function findStoryPage(pageId) {
    for (const myth of allMyths()) {
      const page = myth.storyPages.concat(myth.endingPages).find(function (candidate) { return candidate.id === pageId; });
      if (page) {
        return page;
      }
    }
    return null;
  }

  LM.stories = { allMyths, findStoryPage };
}(window.LM = window.LM || {}));
