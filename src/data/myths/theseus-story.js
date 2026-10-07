// Mit o Tezeuszu i Ariadnie, opowiedziany własnymi słowami na podstawie „Mitologii” Jana Parandowskiego.
// Pages are read by the narrator (or a character); illustrations are drawn in src/render/illustrations-theseus.js.
(function (LM) {
  'use strict';

  LM.data.myths = LM.data.myths || {};
  LM.data.myths.theseus = {
    id: 'theseus',
    title: 'Tezeusz i Ariadna',
    storyPages: [
      {
        id: 'tez-s01', speaker: 'narrator', illustration: 'athens',
        text: 'Posłuchaj mitu, czyli starożytnej opowieści o bogach i herosach. Herosem nazywano bohatera o nadludzkiej sile i odwadze. ' +
          'Takim herosem był Tezeusz, syn Egeusza, króla Aten. (U Parandowskiego król nazywa się Ajgeus.) Już w drodze do Aten Tezeusz pokonał wielu groźnych zbójców.',
      },
      {
        id: 'tez-s02', speaker: 'narrator', illustration: 'tribute',
        text: 'Ateny musiały płacić straszny haracz potężnemu królowi Krety, Minosowi. Na Kretę wysyłano siedmiu chłopców i siedem dziewcząt, wybranych losem. ' +
          'U Parandowskiego działo się to co roku, a w innych opowieściach co dziewięć lat.',
      },
      {
        id: 'tez-s03', speaker: 'narrator', illustration: 'minotaur',
        text: 'Na Krecie czekał na nich Minotaur, potwór o głowie byka i ciele człowieka. Mieszkał w labiryncie: ogromnej budowli z plątaniną korytarzy, ' +
          'z której nikt nie umiał się wydostać. Labirynt zbudował dla Minosa genialny budowniczy Dedal.',
      },
      {
        id: 'tez-s04', speaker: 'theseus', illustration: 'volunteer',
        text: 'Ojcze, sam zgłaszam się na ochotnika! Popłynę na Kretę razem z innymi, zabiję Minotaura i uwolnię Ateny od haraczu.',
      },
      {
        id: 'tez-s05', speaker: 'aegeus', illustration: 'farewell',
        text: 'Synu, statek odpływa pod czarnym żaglem, znakiem żałoby. Jeśli zwyciężysz, w drodze powrotnej wciągnij żagiel szkarłatny. ' +
          'Będę go wypatrywał ze skały nad morzem.',
      },
      {
        id: 'tez-s06', speaker: 'narrator', illustration: 'ship-black-sail',
        text: 'Statek z czarnym żaglem odpłynął na Kretę. W niektórych opowieściach żagiel zwycięstwa jest biały, a nie szkarłatny, ' +
          'ale we wszystkich czarny oznacza nieszczęście.',
      },
      {
        id: 'tez-s07', speaker: 'narrator', illustration: 'ariadne',
        text: 'Na Krecie młodych Ateńczyków zobaczyła Ariadna, córka króla Minosa. Gdy spojrzała na dzielnego Tezeusza, zakochała się w nim ' +
          'i postanowiła go ocalić.',
      },
      {
        id: 'tez-s08', speaker: 'ariadne', illustration: 'thread-gift',
        text: 'Weź ten kłębek nici. Przywiąż jej koniec u wejścia do labiryntu i rozwijaj ją, idąc korytarzami. ' +
          'Gdy pokonasz potwora, nić zaprowadzi cię z powrotem do wyjścia.',
      },
      {
        id: 'tez-s09', speaker: 'narrator', illustration: 'labyrinth-entrance',
        text: 'Według Parandowskiego ten pomysł wymyśliła sama Ariadna. Tezeusz przywiązał nić u wejścia i ruszył w ciemne korytarze, a kłębek rozwijał się za nim. ' +
          'Dziś „nicią Ariadny” nazywamy coś, co pomaga znaleźć wyjście z trudnej sytuacji.',
      },
      {
        id: 'tez-s10', speaker: 'narrator', illustration: 'fight',
        text: 'W samym środku labiryntu czekał Minotaur. Walka była straszna, ale Tezeusz pokonał potwora. ' +
          'Potem, trzymając się nici, odnalazł drogę do wyjścia.',
      },
      {
        id: 'tez-s11', speaker: 'narrator', illustration: 'escape',
        text: 'Tezeusz uwolnił młodych Ateńczyków i potajemnie odpłynął z Krety. Razem z nim popłynęła Ariadna.',
      },
      {
        id: 'tez-s12', speaker: 'narrator', illustration: 'naxos',
        text: 'W drodze do Aten statek zatrzymał się na wyspie Naksos. Gdy Ariadna zasnęła na brzegu, Tezeusz odpłynął bez niej. ' +
          'Parandowski nie wyjaśnia dokładnie dlaczego, pisze tylko, że coś się między nimi zmieniło.',
      },
      {
        id: 'tez-s13', speaker: 'narrator', illustration: 'dionysus',
        text: 'Ariadna nie została sama na długo. Znalazł ją bóg wina Dionizos i wziął ją za żonę.',
      },
      {
        id: 'tez-s14', speaker: 'narrator', illustration: 'ship-black-sail',
        text: 'Tezeusz był tak zamyślony, że zapomniał zmienić żagiel. Statek wracał do Aten pod czarnym żaglem.',
      },
      {
        id: 'tez-s15', speaker: 'narrator', illustration: 'aegeus-cliff',
        text: 'Stary król Egeusz wypatrywał syna ze skały nad morzem. Gdy zobaczył czarny żagiel, pomyślał, że Tezeusz zginął, i z rozpaczy rzucił się w morskie fale. ' +
          'Od jego imienia to morze nazywa się Egejskie.',
      },
      {
        id: 'tez-s16', speaker: 'narrator', illustration: 'athens-king',
        text: 'Tezeusz został królem Aten. Rządził mądrze i połączył całą krainę Attykę w jedno państwo.',
      },
    ],
    endingPages: [
      {
        id: 'tez-e01', speaker: 'narrator', illustration: 'aegeus-cliff',
        text: 'Tak skończyła się wyprawa na Kretę: zapomniany czarny żagiel kosztował życie króla Egeusza, a morze do dziś nosi jego imię.',
      },
      {
        id: 'tez-e02', speaker: 'narrator', illustration: 'athens-king',
        text: 'Ty też był{eś|aś} dzieln{y|a}: prze{szedłeś|szłaś} labirynt, pokonał{eś|aś} Minotaura i wrócił{eś|aś} po nici Ariadny. Czas na balladę o Tezeuszu!',
      },
    ],
    concepts: [
      { id: 'mit', term: 'mit', definition: 'starożytna opowieść o bogach i herosach, która tłumaczyła ludziom świat' },
      { id: 'heros', term: 'heros', definition: 'bohater o nadludzkiej sile i odwadze, często syn boga i śmiertelnej kobiety' },
      { id: 'labirynt', term: 'labirynt', definition: 'budowla z plątaniną korytarzy; w przenośni: zawiła, trudna sytuacja' },
      { id: 'nic-ariadny', term: 'nić Ariadny', definition: 'coś, co pomaga znaleźć wyjście z trudnej sytuacji' },
      { id: 'minotaur', term: 'Minotaur', definition: 'potwór o głowie byka i ciele człowieka, zamknięty w labiryncie na Krecie' },
      { id: 'morze-egejskie', term: 'Morze Egejskie', definition: 'morze u wybrzeży Grecji; według mitu nazwane od króla Egeusza' },
      { id: 'po-nitce', term: 'po nitce do kłębka', definition: 'dochodzić do czegoś krok po kroku, idąc po śladach' },
    ],
  };
}(window.LM = window.LM || {}));
