// Pytania do mitu o Tezeuszu i Ariadnie. Slots: door (labyrinth seals), duel (Minotaur), ship (journey home).
// Only facts confirmed in Parandowski's version are asked (no tribute frequency, no weapon, no colour of the victory sail).
(function (LM) {
  'use strict';

  LM.data.questions = LM.data.questions || {};
  LM.data.questions.theseus = [
    {
      id: 'tez-q01', myth: 'theseus', slot: 'door', type: 'choice', hintPageId: 'tez-s01',
      prompt: 'Kim był Egeusz (u Parandowskiego: Ajgeus)?',
      options: ['Królem Aten i ojcem Tezeusza', 'Królem Krety', 'Budowniczym labiryntu', 'Bogiem morza'], correctIndex: 0,
      explanation: 'Egeusz był królem Aten, a Tezeusz był jego synem.',
    },
    {
      id: 'tez-q02', myth: 'theseus', slot: 'door', type: 'choice', hintPageId: 'tez-s02',
      prompt: 'Jaki haracz Ateny musiały płacić królowi Krety?',
      options: ['Siedmiu chłopców i siedem dziewcząt', 'Sto worków złota', 'Najlepsze statki z portu', 'Dziesięciu wojowników'], correctIndex: 0,
      explanation: 'Na Kretę wysyłano siedmiu chłopców i siedem dziewcząt, którzy mieli zginąć w labiryncie.',
    },
    {
      id: 'tez-q03', myth: 'theseus', slot: 'door', type: 'truefalse', hintPageId: 'tez-s02',
      statement: 'Młodych Ateńczyków, których wysyłano na Kretę, wybierano losem.', statementIsTrue: true,
      explanation: 'Tak, o tym, kto popłynie na Kretę, decydowało losowanie.',
    },
    {
      id: 'tez-q04', myth: 'theseus', slot: 'door', type: 'choice', hintPageId: 'tez-s03',
      prompt: 'Jak wyglądał Minotaur?',
      options: ['Miał głowę byka i ciało człowieka', 'Miał trzy psie głowy', 'Był ogromnym wężem', 'Miał głowę lwa i skrzydła'], correctIndex: 0,
      explanation: 'Minotaur był potworem o głowie byka i ciele człowieka.',
    },
    {
      id: 'tez-q05', myth: 'theseus', slot: 'door', type: 'typed', hintPageId: 'tez-s03',
      prompt: 'Kto zbudował labirynt dla króla Minosa? Wpisz imię.',
      acceptedAnswers: ['Dedal'],
      explanation: 'Labirynt zbudował genialny ateński budowniczy Dedal, bohater mitu o Ikarze.',
    },
    {
      id: 'tez-q06', myth: 'theseus', slot: 'door', type: 'choice', hintPageId: 'tez-s03',
      prompt: 'Czym był labirynt?',
      options: ['Budowlą z plątaniną korytarzy, z której trudno wyjść', 'Świątynią Zeusa', 'Portem na Krecie', 'Ogrodem króla Minosa'], correctIndex: 0,
      explanation: 'Labirynt to budowla z tak zawiłymi korytarzami, że nikt nie umiał z niej wyjść.',
    },
    {
      id: 'tez-q07', myth: 'theseus', slot: 'door', type: 'truefalse', hintPageId: 'tez-s04',
      statement: 'Tezeusza wylosowano wbrew jego woli.', statementIsTrue: false,
      explanation: 'Nieprawda: Tezeusz sam zgłosił się na ochotnika, żeby zabić Minotaura.',
    },
    {
      id: 'tez-q08', myth: 'theseus', slot: 'door', type: 'choice', hintPageId: 'tez-s05',
      prompt: 'Pod jakim żaglem statek z młodymi Ateńczykami płynął na Kretę?',
      options: ['Pod czarnym', 'Pod zielonym', 'Pod złotym', 'Bez żagla, tylko na wiosłach'], correctIndex: 0,
      explanation: 'Statek płynął pod czarnym żaglem, znakiem żałoby.',
    },
    {
      id: 'tez-q09', myth: 'theseus', slot: 'door', type: 'choice', hintPageId: 'tez-s07',
      prompt: 'Kim była Ariadna?',
      options: ['Córką króla Minosa', 'Siostrą Tezeusza', 'Boginią mądrości', 'Żoną króla Egeusza'], correctIndex: 0,
      explanation: 'Ariadna była córką Minosa, króla Krety. Zakochała się w Tezeuszu.',
    },
    {
      id: 'tez-q10', myth: 'theseus', slot: 'door', type: 'typed', hintPageId: 'tez-s08',
      prompt: 'Uzupełnij: Ariadna dała Tezeuszowi kłębek …',
      acceptedAnswers: ['nici', 'nić', 'nitki'],
      explanation: 'Ariadna dała Tezeuszowi kłębek nici.',
    },
    {
      id: 'tez-q11', myth: 'theseus', slot: 'door', type: 'choice', hintPageId: 'tez-s09',
      prompt: 'Gdzie Tezeusz przywiązał koniec nici?',
      options: ['U wejścia do labiryntu', 'Do rogów Minotaura', 'Do masztu statku', 'Do tronu Minosa'], correctIndex: 0,
      explanation: 'Przywiązał nić u wejścia i rozwijał ją, idąc w głąb labiryntu.',
    },
    {
      id: 'tez-q12', myth: 'theseus', slot: 'door', type: 'match', hintPageId: 'tez-s07',
      prompt: 'Połącz postać z jej opisem:',
      pairs: [
        { left: 'Tezeusz', right: 'ateński heros' },
        { left: 'Ariadna', right: 'córka Minosa' },
        { left: 'Minos', right: 'król Krety' },
        { left: 'Dedal', right: 'budowniczy labiryntu' },
      ],
      explanation: 'Tezeusz to heros z Aten, Ariadna to córka Minosa, Minos rządził Kretą, a Dedal zbudował labirynt.',
    },
    {
      id: 'tez-q13', myth: 'theseus', slot: 'door', type: 'order', hintPageId: 'tez-s04',
      prompt: 'Ułóż początek mitu we właściwej kolejności:',
      itemsInOrder: ['Ateny płacą Krecie haracz', 'Tezeusz zgłasza się na ochotnika', 'Statek z czarnym żaglem płynie na Kretę', 'Ariadna daje Tezeuszowi kłębek nici'],
      explanation: 'Najpierw haracz, potem zgłoszenie Tezeusza, podróż pod czarnym żaglem i pomoc Ariadny.',
    },
    {
      id: 'tez-q14', myth: 'theseus', slot: 'duel', type: 'choice', hintPageId: 'tez-s03',
      prompt: 'Gdzie mieszkał Minotaur?',
      options: ['W labiryncie na Krecie', 'W jaskini pod Atenami', 'Na wyspie Naksos', 'Na górze Olimp'], correctIndex: 0,
      explanation: 'Minotaur był zamknięty w labiryncie na Krecie.',
    },
    {
      id: 'tez-q15', myth: 'theseus', slot: 'duel', type: 'truefalse', hintPageId: 'tez-s03',
      statement: 'Labirynt zbudował sam król Minos.', statementIsTrue: false,
      explanation: 'Nieprawda: labirynt zbudował dla Minosa Dedal.',
    },
    {
      id: 'tez-q16', myth: 'theseus', slot: 'duel', type: 'choice', hintPageId: 'tez-s09',
      prompt: 'Co znaczy dziś wyrażenie „nić Ariadny”?',
      options: ['Coś, co pomaga wyjść z trudnej sytuacji', 'Coś bardzo cienkiego i słabego', 'Zaplątana, beznadziejna sprawa', 'Prezent od zakochanej osoby'], correctIndex: 0,
      explanation: 'Nić Ariadny to pomoc albo wskazówka, dzięki której znajdujemy wyjście z kłopotów.',
    },
    {
      id: 'tez-q17', myth: 'theseus', slot: 'duel', type: 'choice', hintPageId: 'tez-s03',
      prompt: 'Co znaczy w przenośni słowo „labirynt”?',
      options: ['Zawiła, trudna do rozwiązania sytuacja', 'Wielka radość', 'Szybka podróż', 'Tajemniczy prezent'], correctIndex: 0,
      explanation: 'W przenośni labirynt to coś bardzo zawiłego, w czym łatwo się zgubić.',
    },
    {
      id: 'tez-q18', myth: 'theseus', slot: 'duel', type: 'choice', hintPageId: 'tez-s01',
      prompt: 'Kim był heros?',
      options: ['Bohaterem o nadludzkiej sile i odwadze', 'Nieśmiertelnym bogiem z Olimpu', 'Królem Krety', 'Potworem z labiryntu'], correctIndex: 0,
      explanation: 'Heros to bohater o nadludzkiej sile i odwadze, często syn boga i śmiertelnej kobiety.',
    },
    {
      id: 'tez-q19', myth: 'theseus', slot: 'duel', type: 'truefalse', hintPageId: 'tez-s09',
      statement: 'W wersji Parandowskiego pomysł z kłębkiem nici wymyśliła sama Ariadna.', statementIsTrue: true,
      explanation: 'Tak. W niektórych innych wersjach mitu podpowiada go Dedal, ale u Parandowskiego to pomysł Ariadny.',
    },
    {
      id: 'tez-q20', myth: 'theseus', slot: 'duel', type: 'choice', hintPageId: 'tez-s08',
      prompt: 'Po co Tezeusz rozwijał nić, idąc przez labirynt?',
      options: ['Żeby po niej wrócić do wyjścia', 'Żeby związać nią Minotaura', 'Żeby zmierzyć korytarze', 'Żeby dać znak Minosowi'], correctIndex: 0,
      explanation: 'Nić prowadziła z powrotem do wyjścia, więc Tezeusz nie zgubił się w labiryncie.',
    },
    {
      id: 'tez-q21', myth: 'theseus', slot: 'duel', type: 'typed', hintPageId: 'tez-s03',
      prompt: 'Jak nazywał się potwór o głowie byka zamknięty w labiryncie?',
      acceptedAnswers: ['Minotaur'],
      explanation: 'To był Minotaur.',
    },
    {
      id: 'tez-q22', myth: 'theseus', slot: 'duel', type: 'choice', hintPageId: 'tez-s01',
      prompt: 'Czym jest mit?',
      options: ['Starożytną opowieścią o bogach i herosach', 'Prawdziwą kroniką wojen', 'Wierszem o miłości', 'Instrukcją budowy świątyni'], correctIndex: 0,
      explanation: 'Mit to starożytna opowieść o bogach i herosach, która tłumaczyła ludziom świat.',
    },
    {
      id: 'tez-q23', myth: 'theseus', slot: 'duel', type: 'match', hintPageId: 'tez-s09',
      prompt: 'Połącz pojęcie z jego znaczeniem:',
      pairs: [
        { left: 'nić Ariadny', right: 'pomoc w wyjściu z kłopotów' },
        { left: 'labirynt', right: 'plątanina korytarzy' },
        { left: 'heros', right: 'bohater o nadludzkiej odwadze' },
      ],
      explanation: 'Nić Ariadny pomaga wyjść z kłopotów, labirynt to plątanina korytarzy, a heros to nadludzko odważny bohater.',
    },
    {
      id: 'tez-q24', myth: 'theseus', slot: 'duel', type: 'truefalse', hintPageId: 'tez-s10',
      statement: 'Tezeusz spotkał Minotaura w samym środku labiryntu.', statementIsTrue: true,
      explanation: 'Tak, potwór czekał w samym środku labiryntu.',
    },
    {
      id: 'tez-q25', myth: 'theseus', slot: 'duel', type: 'choice', hintPageId: 'tez-s08',
      prompt: 'Komu Tezeusz zawdzięczał wyjście z labiryntu?',
      options: ['Ariadnie', 'Dedalowi', 'Minosowi', 'Egeuszowi'], correctIndex: 0,
      explanation: 'Wyjście z labiryntu zawdzięczał Ariadnie i jej kłębkowi nici.',
    },
    {
      id: 'tez-q26', myth: 'theseus', slot: 'ship', type: 'typed', hintPageId: 'tez-s12',
      prompt: 'Na jakiej wyspie Tezeusz zostawił śpiącą Ariadnę?',
      acceptedAnswers: ['Naksos', 'Naxos'],
      explanation: 'Ariadna została na wyspie Naksos.',
    },
    {
      id: 'tez-q27', myth: 'theseus', slot: 'ship', type: 'choice', hintPageId: 'tez-s13',
      prompt: 'Kto poślubił Ariadnę, gdy została na wyspie?',
      options: ['Bóg wina Dionizos', 'Król Minos', 'Dedal', 'Bóg morza Posejdon'], correctIndex: 0,
      explanation: 'Ariadnę znalazł i poślubił bóg wina Dionizos.',
    },
    {
      id: 'tez-q28', myth: 'theseus', slot: 'ship', type: 'choice', hintPageId: 'tez-s14',
      prompt: 'Czego zapomniał zrobić Tezeusz w drodze do domu?',
      options: ['Zmienić czarny żagiel', 'Zabrać łupów z Krety', 'Podziękować bogom', 'Zamknąć labiryntu'], correctIndex: 0,
      explanation: 'Zamyślony Tezeusz zapomniał zmienić czarny żagiel.',
    },
    {
      id: 'tez-q29', myth: 'theseus', slot: 'ship', type: 'choice', hintPageId: 'tez-s15',
      prompt: 'Dlaczego król Egeusz rzucił się do morza?',
      options: ['Zobaczył czarny żagiel i myślał, że syn zginął', 'Bał się Minotaura', 'Minos wygnał go z Aten', 'Chciał dopłynąć na Kretę'], correctIndex: 0,
      explanation: 'Czarny żagiel oznaczał śmierć, więc Egeusz pomyślał, że stracił syna.',
    },
    {
      id: 'tez-q30', myth: 'theseus', slot: 'ship', type: 'typed', hintPageId: 'tez-s15',
      prompt: 'Uzupełnij nazwę: według mitu od imienia króla Egeusza pochodzi nazwa Morza …',
      acceptedAnswers: ['Egejskiego', 'Egejskie', 'Morza Egejskiego'],
      explanation: 'To Morze Egejskie, nazwane od króla Egeusza.',
    },
    {
      id: 'tez-q31', myth: 'theseus', slot: 'ship', type: 'order', hintPageId: 'tez-s14',
      prompt: 'Ułóż zakończenie mitu po kolei:',
      itemsInOrder: ['Tezeusz pokonuje Minotaura', 'Ariadna zostaje na wyspie Naksos', 'Statek wraca pod czarnym żaglem', 'Egeusz rzuca się do morza'],
      explanation: 'Zwycięstwo w labiryncie, postój na Naksos, powrót pod czarnym żaglem i rozpacz Egeusza.',
    },
    {
      id: 'tez-q32', myth: 'theseus', slot: 'ship', type: 'truefalse', hintPageId: 'tez-s16',
      statement: 'Po powrocie Tezeusz został królem Aten.', statementIsTrue: true,
      explanation: 'Tak, Tezeusz został królem Aten i połączył Attykę w jedno państwo.',
    },
  ];
}(window.LM = window.LM || {}));
