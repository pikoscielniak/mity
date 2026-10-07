// Achievements: the only reward in the game. Titles use {boy|girl} verb forms. rule names live in src/game/achievements.js.
(function (LM) {
  'use strict';

  function achievement(id, title, description, rule) {
    return { id: id, title: title, description: description, rule: rule };
  }

  LM.data.achievements = [
    achievement('bez-bledu', 'Bez jednego błędu', 'Wszystkie odpowiedzi w misji dobre za pierwszym razem.', 'flawlessMission'),
    achievement('bez-podpowiedzi', 'Bez podpowiedzi', 'Misja zaliczona bez zaglądania do zwoju.', 'noHints'),
    achievement('nietkniety', 'Nietknięt{y|a} przez Minotaura', 'Labirynt przebyty tak, że Minotaur ani razu cię nie dotknął.', 'untouchedByMinotaur'),
    achievement('nic-nie-pekla', 'Nić nie pękła', 'Ucieczka po nici bez utraty serca.', 'escapeWithoutLoss'),
    achievement('zloty-srodek', 'Złoty środek', 'Cały lot w bezpiecznej strefie: ani za wysoko, ani za nisko.', 'stayedInGoldenMean'),
    achievement('wszystkie-piora', 'Wszystkie pióra zebrane', 'W czasie lotu nie umknęło ci ani jedno pióro.', 'collectedAllFeathers'),
    achievement('mistrz-lutni', 'Mistrz lutni', 'Wszystkie nuty zagrane bez pomyłki.', 'playedEveryNote'),
    achievement('nie-obejrzal', 'Nie obejrzał{eś|aś} się ani razu', 'Cała droga z podziemi bez spojrzenia za siebie.', 'neverLookedBack'),
    achievement('mol-ksiazkowy', 'Mól książkowy', 'Wysłuchane wszystkie trzy opowieści, bez pomijania.', 'heardEveryStory'),
    achievement('spiewak-z-tracji', 'Śpiewak z Tracji', 'Wszystkie trzy ballady wysłuchane do końca.', 'heardEveryBallad'),
    achievement('znawca-mitow', 'Znawca mitów', 'Egzamin u Pytii w Delfach zdany.', 'passedExam'),
    achievement('wyrocznia', 'Wyrocznia pod wrażeniem', 'Egzamin bez jednego błędu.', 'flawlessExam'),
  ];
}(window.LM = window.LM || {}));
