// The missions in play order. Stage types refer to LM.stageFactories; question slots say how many
// questions of each slot are drawn from the myth's pool for one play-through.
(function (LM) {
  'use strict';

  LM.data.missions = [
    {
      id: 'theseus',
      number: 1,
      title: 'Tezeusz i Ariadna',
      mapPlaceId: 'crete',
      themeId: 'crete',
      songId: 'theseus',
      stages: [],
      questionSlots: {},
    },
    {
      id: 'icarus',
      number: 2,
      title: 'Dedal i Ikar',
      mapPlaceId: 'icaria',
      themeId: 'sky',
      songId: 'icarus',
      stages: [],
      questionSlots: {},
    },
    {
      id: 'orpheus',
      number: 3,
      title: 'Orfeusz i Eurydyka',
      mapPlaceId: 'thrace',
      themeId: 'underworld',
      songId: 'orpheus',
      stages: [],
      questionSlots: {},
    },
  ];

  LM.data.exam = { id: 'exam', title: 'Wyrocznia w Delfach', mapPlaceId: 'delphi', questionCount: 15 };

  LM.missions = {
    byId: function (missionId) {
      return LM.data.missions.find(function (mission) { return mission.id === missionId; }) || null;
    },
  };
}(window.LM = window.LM || {}));
