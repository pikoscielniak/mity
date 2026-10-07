// Places on the map of the myths. Destinations start a mission or the exam; the others only teach a fact.
(function (LM) {
  'use strict';

  LM.data.mapPlaces = [
    { id: 'athens', name: 'Ateny', x: 585, y: 352, fact: 'Ateny: miasto króla Egeusza i Tezeusza. Stąd wypłynął statek z czarnym żaglem.' },
    { id: 'crete', name: 'Kreta', x: 720, y: 572, missionId: 'theseus', fact: 'Na Krecie rządził król Minos, a w labiryncie zbudowanym przez Dedala mieszkał Minotaur.' },
    { id: 'naxos', name: 'Naksos', x: 760, y: 448, fact: 'Na wyspie Naksos Tezeusz zostawił śpiącą Ariadnę. Znalazł ją tam bóg Dionizos.' },
    { id: 'paros', name: 'Paros', x: 705, y: 462, fact: 'Nad wyspą Paros przelatywali Dedal i Ikar.' },
    { id: 'delos', name: 'Delos', x: 728, y: 404, fact: 'Nad maleńką wyspą Delos przelatywali Dedal i Ikar.' },
    { id: 'samos', name: 'Samos', x: 975, y: 352, fact: 'Wyspę Samos minęli Dedal i Ikar w czasie lotu.' },
    { id: 'icaria', name: 'Ikaria', x: 900, y: 372, missionId: 'icarus', fact: 'Od imienia Ikara nazwano wyspę Ikarię i otaczające ją Morze Ikaryjskie.' },
    { id: 'lesbos', name: 'Lesbos', x: 955, y: 196, fact: 'Według mitu fale zaniosły na Lesbos głowę Orfeusza, która wciąż śpiewała imię Eurydyki.' },
    { id: 'thrace', name: 'Tracja', x: 800, y: 108, missionId: 'orpheus', fact: 'W górzystej Tracji królował Orfeusz, najwspanialszy śpiewak mitów.' },
    { id: 'delphi', name: 'Delfy', x: 452, y: 292, isExam: true, fact: 'W Delfach była słynna wyrocznia boga Apollina. Przepowiednie głosiła kapłanka Pytia.' },
    { id: 'sicily', name: 'Sycylia', x: 120, y: 470, fact: 'Na Sycylię doleciał samotny Dedal i został budowniczym tamtejszego króla.' },
  ];

  LM.data.mapStart = 'athens';
}(window.LM = window.LM || {}));
