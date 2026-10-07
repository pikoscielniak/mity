// Pytania do mitu o Orfeuszu i Eurydyce. Slots: guardian (lyre stage: Charon, Cerberus, Hades),
// echo (the climb out of the underworld), ending (Orpheus's fate and what he stands for).
// Only facts confirmed in Parandowski's version are asked (no parents of Orpheus, Persephone, Tainaron or Tartarus).
(function (LM) {
  'use strict';

  LM.data.questions = LM.data.questions || {};
  LM.data.questions.orpheus = [
    {
      id: 'orf-q01', myth: 'orpheus', slot: 'guardian', type: 'choice', hintPageId: 'orf-s01',
      prompt: 'Skąd pochodził Orfeusz?',
      options: ['Z Tracji', 'Z Krety', 'Z Aten', 'Z Sycylii'], correctIndex: 0,
      explanation: 'Orfeusz był młodym królem i śpiewakiem z górzystej Tracji.',
    },
    {
      id: 'orf-q02', myth: 'orpheus', slot: 'guardian', type: 'typed', hintPageId: 'orf-s01',
      prompt: 'Na jakim instrumencie grał Orfeusz? Wpisz jego nazwę.',
      acceptedAnswers: ['lutnia', 'lutni', 'lutnię', 'na lutni', 'lira', 'liry', 'lirę', 'lirze', 'na lirze', 'lutnia (lira)'],
      explanation: 'Orfeusz grał na lutni. W szkolnych podręcznikach ten instrument często nazywa się lirą.',
    },
    {
      id: 'orf-q03', myth: 'orpheus', slot: 'guardian', type: 'choice', hintPageId: 'orf-s01',
      prompt: 'Co się działo, gdy Orfeusz grał i śpiewał?',
      options: ['Drzewa pochylały gałęzie, a zwierzęta kładły mu się u stóp', 'Zrywała się burza z piorunami', 'Ludzie zasypiali na sto lat', 'Morze zamieniało się w lód'], correctIndex: 0,
      explanation: 'Muzyka Orfeusza miała czarodziejską moc: słuchały jej drzewa, rzeki i dzikie zwierzęta.',
    },
    {
      id: 'orf-q04', myth: 'orpheus', slot: 'guardian', type: 'truefalse', hintPageId: 'orf-s02',
      statement: 'Eurydyka, żona Orfeusza, była nimfą drzewną.', statementIsTrue: true,
      explanation: 'Tak. Eurydyka była nimfą drzewną, czyli boginką przyrody związaną z drzewami.',
    },
    {
      id: 'orf-q05', myth: 'orpheus', slot: 'guardian', type: 'choice', hintPageId: 'orf-s03',
      prompt: 'Kto gonił Eurydykę w dolinie Tempe?',
      options: ['Aristajos, syn Apollina', 'Hades, władca podziemi', 'Charon, przewoźnik zmarłych', 'Hermes, posłaniec bogów'], correctIndex: 0,
      explanation: 'Eurydykę zobaczył i zaczął gonić Aristajos, syn boga Apollina.',
    },
    {
      id: 'orf-q06', myth: 'orpheus', slot: 'guardian', type: 'typed', hintPageId: 'orf-s03',
      prompt: 'W jakiej dolinie Aristajos zobaczył Eurydykę? Wpisz nazwę.',
      acceptedAnswers: ['Tempe', 'dolina Tempe', 'w dolinie Tempe'],
      explanation: 'To była zielona dolina Tempe.',
    },
    {
      id: 'orf-q07', myth: 'orpheus', slot: 'guardian', type: 'choice', hintPageId: 'orf-s04',
      prompt: 'Dlaczego Eurydyka umarła?',
      options: ['Ukąsiła ją żmija', 'Spadła ze skały', 'Trafiła ją strzała', 'Utonęła w rzece'], correctIndex: 0,
      explanation: 'Uciekającą Eurydykę ukąsiła ukryta w trawie żmija.',
    },
    {
      id: 'orf-q08', myth: 'orpheus', slot: 'guardian', type: 'truefalse', hintPageId: 'orf-s05',
      statement: 'Orfeusz zszedł do podziemi uzbrojony w miecz i tarczę.', statementIsTrue: false,
      explanation: 'Nieprawda: zabrał ze sobą tylko lutnię. Jego jedyną bronią była muzyka.',
    },
    {
      id: 'orf-q09', myth: 'orpheus', slot: 'guardian', type: 'choice', hintPageId: 'orf-s08',
      prompt: 'Kim był Cerber?',
      options: ['Psem strzegącym bram podziemi', 'Przewoźnikiem dusz przez Styks', 'Bogiem podziemi', 'Wężem z doliny Tempe'], correctIndex: 0,
      explanation: 'Cerber to ogromny pies o trzech głowach, który strzegł bram podziemnego świata.',
    },
    {
      id: 'orf-q10', myth: 'orpheus', slot: 'guardian', type: 'choice', hintPageId: 'orf-s07',
      prompt: 'Dlaczego Charon przewiózł Orfeusza przez Styks za darmo?',
      options: ['Oczarowała go muzyka Orfeusza', 'Rozkazał mu to Zeus', 'Orfeusz go przechytrzył', 'Orfeusz obiecał mu swoją koronę'], correctIndex: 0,
      explanation: 'Charon zasłuchał się w pieśń Orfeusza i przewiózł go na drugi brzeg bez zapłaty.',
    },
    {
      id: 'orf-q11', myth: 'orpheus', slot: 'guardian', type: 'typed', hintPageId: 'orf-s06',
      prompt: 'Jak miał na imię przewoźnik, który wiózł dusze zmarłych przez Styks?',
      acceptedAnswers: ['Charon', 'Charona'],
      explanation: 'To był Charon, przewoźnik zmarłych.',
    },
    {
      id: 'orf-q12', myth: 'orpheus', slot: 'guardian', type: 'truefalse', hintPageId: 'orf-s08',
      statement: 'Cerber szczekał groźnie i nie chciał przepuścić Orfeusza.', statementIsTrue: false,
      explanation: 'Nieprawda: zasłuchany w muzykę Cerber nie zaszczekał ani razu i przepuścił śpiewaka.',
    },
    {
      id: 'orf-q13', myth: 'orpheus', slot: 'guardian', type: 'choice', hintPageId: 'orf-s09',
      prompt: 'Kim były Erynie, które zapłakały, słuchając Orfeusza?',
      options: ['Surowymi boginiami zemsty', 'Nimfami drzewnymi', 'Muzami z Olimpu', 'Córkami Charona'], correctIndex: 0,
      explanation: 'Erynie były surowymi boginiami zemsty. Pieśń Orfeusza wzruszyła nawet je.',
    },
    {
      id: 'orf-q14', myth: 'orpheus', slot: 'guardian', type: 'match', hintPageId: 'orf-s09',
      prompt: 'Połącz postać z podziemi z jej opisem:',
      pairs: [
        { left: 'Charon', right: 'przewoźnik dusz przez Styks' },
        { left: 'Cerber', right: 'pies strzegący bram podziemi' },
        { left: 'Hades', right: 'władca podziemi' },
        { left: 'Erynie', right: 'boginie zemsty' },
      ],
      explanation: 'Charon przewoził dusze, Cerber strzegł bram, Hades władał podziemiem, a Erynie były boginiami zemsty.',
    },
    {
      id: 'orf-q15', myth: 'orpheus', slot: 'guardian', type: 'order', hintPageId: 'orf-s08',
      prompt: 'Ułóż wydarzenia we właściwej kolejności:',
      itemsInOrder: ['Żmija kąsa Eurydykę', 'Orfeusz schodzi do podziemi z lutnią', 'Charon przewozi go przez Styks', 'Cerber milknie i go przepuszcza', 'Orfeusz śpiewa przed tronem Hadesa'],
      explanation: 'Najpierw śmierć Eurydyki, potem zejście do podziemi, przeprawa przez Styks, cichy Cerber i pieśń przed Hadesem.',
    },
    {
      id: 'orf-q16', myth: 'orpheus', slot: 'echo', type: 'choice', hintPageId: 'orf-s10',
      prompt: 'Jaki warunek postawił Hades Orfeuszowi?',
      options: ['W drodze na górę nie wolno mu się obejrzeć', 'Musi zostawić swoją lutnię w podziemiach', 'Musi grać Hadesowi raz w roku', 'Musi przepłynąć Styks wpław'], correctIndex: 0,
      explanation: 'Orfeuszowi nie wolno było obejrzeć się za siebie, dopóki nie wyjdzie z podziemi.',
    },
    {
      id: 'orf-q17', myth: 'orpheus', slot: 'echo', type: 'typed', hintPageId: 'orf-s10',
      prompt: 'Który bóg, posłaniec bogów, prowadził Eurydykę w drodze na górę? Wpisz imię.',
      acceptedAnswers: ['Hermes', 'Hermesa'],
      explanation: 'Eurydykę prowadził Hermes, posłaniec bogów.',
    },
    {
      id: 'orf-q18', myth: 'orpheus', slot: 'echo', type: 'truefalse', hintPageId: 'orf-s11',
      statement: 'W drodze na górę Eurydyka szła przed Orfeuszem.', statementIsTrue: false,
      explanation: 'Nieprawda: Orfeusz szedł przodem, a Hermes prowadził Eurydykę za nim.',
    },
    {
      id: 'orf-q19', myth: 'orpheus', slot: 'echo', type: 'choice', hintPageId: 'orf-s12',
      prompt: 'Kiedy Orfeusz obejrzał się za siebie?',
      options: ['Gdy byli już prawie u wyjścia', 'Zaraz po wyjściu z pałacu Hadesa', 'Jeszcze na łodzi Charona', 'Dopiero w domu, w Tracji'], correctIndex: 0,
      explanation: 'Orfeusz obejrzał się, gdy byli już prawie na górze, tuż przed wyjściem z podziemi.',
    },
    {
      id: 'orf-q20', myth: 'orpheus', slot: 'echo', type: 'choice', hintPageId: 'orf-s12',
      prompt: 'Dlaczego Orfeusz się obejrzał?',
      options: ['Nie wytrzymał, tak bardzo chciał zobaczyć Eurydykę', 'Usłyszał szczekanie Cerbera', 'Hermes kazał mu się odwrócić', 'Zgubił w ciemności lutnię'], correctIndex: 0,
      explanation: 'Orfeusz nie wytrzymał: tak bardzo chciał zobaczyć ukochaną, że zapomniał o warunku Hadesa.',
    },
    {
      id: 'orf-q21', myth: 'orpheus', slot: 'echo', type: 'truefalse', hintPageId: 'orf-s12',
      statement: 'Gdy Orfeusz się obejrzał, Eurydyka wróciła w ciemność podziemi na zawsze.', statementIsTrue: true,
      explanation: 'Tak. Hermes zatrzymał Eurydykę i poprowadził ją z powrotem w ciemność, a bramy podziemi się zamknęły.',
    },
    {
      id: 'orf-q22', myth: 'orpheus', slot: 'echo', type: 'order', hintPageId: 'orf-s12',
      prompt: 'Ułóż wydarzenia z drogi powrotnej po kolei:',
      itemsInOrder: ['Hades stawia Orfeuszowi warunek', 'Hermes prowadzi Eurydykę za Orfeuszem', 'Orfeusz ogląda się tuż przed wyjściem', 'Eurydyka znika w ciemności', 'Orfeusz wychodzi na świat sam'],
      explanation: 'Warunek Hadesa, wędrówka pod górę, spojrzenie za siebie, zniknięcie Eurydyki i samotny powrót Orfeusza.',
    },
    {
      id: 'orf-q23', myth: 'orpheus', slot: 'echo', type: 'match', hintPageId: 'orf-s08',
      prompt: 'Połącz pojęcie z jego znaczeniem:',
      pairs: [
        { left: 'cerber', right: 'czujny, surowy strażnik' },
        { left: 'Styks', right: 'rzeka podziemnego świata' },
        { left: 'nimfa', right: 'boginka przyrody' },
        { left: 'Hades', right: 'bóg podziemi i jego kraina' },
      ],
      explanation: 'Cerber to surowy strażnik, Styks to rzeka podziemi, nimfa to boginka przyrody, a Hades to bóg i jego królestwo.',
    },
    {
      id: 'orf-q24', myth: 'orpheus', slot: 'echo', type: 'choice', hintPageId: 'orf-s08',
      prompt: 'Co znaczy, że ktoś „pilnuje jak cerber”?',
      options: ['Pilnuje bardzo czujnie i surowo', 'Pilnuje niedbale i często zasypia', 'Pilnuje tylko w nocy', 'Chętnie wpuszcza każdego'], correctIndex: 0,
      explanation: 'Cerberem nazywamy czujnego, surowego strażnika, takiego jak pies strzegący bram podziemi.',
    },
    {
      id: 'orf-q25', myth: 'orpheus', slot: 'echo', type: 'typed', hintPageId: 'orf-s06',
      prompt: 'Uzupełnij: Charon przewoził dusze zmarłych przez rzekę …',
      acceptedAnswers: ['Styks', 'Styksu', 'Styx'],
      explanation: 'To Styks, rzeka podziemnego świata.',
    },
    {
      id: 'orf-q26', myth: 'orpheus', slot: 'ending', type: 'choice', hintPageId: 'orf-s14',
      prompt: 'Co robił Orfeusz po utracie Eurydyki?',
      options: ['Błąkał się po górach i śpiewał żałosne pieśni', 'Wesoło ucztował w swoim pałacu', 'Został przewoźnikiem na Styksie', 'Wyruszył na wojnę z Hadesem'], correctIndex: 0,
      explanation: 'Orfeusz wyszedł z podziemi sam i wypełniał wzgórza Tracji żałosnymi pieśniami.',
    },
    {
      id: 'orf-q27', myth: 'orpheus', slot: 'ending', type: 'choice', hintPageId: 'orf-s15',
      prompt: 'Z czyich rąk zginął Orfeusz?',
      options: ['Menad, towarzyszek Dionizosa', 'Erynii, bogiń zemsty', 'Muz z Olimpu', 'Nimf z doliny Tempe'], correctIndex: 0,
      explanation: 'Orfeusz zginął z rąk menad, dzikich towarzyszek boga Dionizosa.',
    },
    {
      id: 'orf-q28', myth: 'orpheus', slot: 'ending', type: 'typed', hintPageId: 'orf-s15',
      prompt: 'Do jakiej wyspy według mitu dopłynęła głowa Orfeusza, wciąż wołająca Eurydykę?',
      acceptedAnswers: ['Lesbos', 'Lesbosu', 'do Lesbos', 'na Lesbos', 'wyspa Lesbos'],
      explanation: 'Fale zaniosły ją aż do wyspy Lesbos.',
    },
    {
      id: 'orf-q29', myth: 'orpheus', slot: 'ending', type: 'truefalse', hintPageId: 'orf-s16',
      statement: 'Muzy pochowały Orfeusza u stóp Olimpu.', statementIsTrue: true,
      explanation: 'Tak. Muzy, boginie opiekujące się sztuką, pochowały go u stóp Olimpu.',
    },
    {
      id: 'orf-q30', myth: 'orpheus', slot: 'ending', type: 'match', hintPageId: 'orf-s16',
      prompt: 'Połącz postacie z ich opisem:',
      pairs: [
        { left: 'muzy', right: 'boginie opiekujące się sztuką' },
        { left: 'menady', right: 'dzikie towarzyszki Dionizosa' },
        { left: 'Erynie', right: 'boginie zemsty' },
        { left: 'Eurydyka', right: 'nimfa drzewna' },
      ],
      explanation: 'Muzy opiekowały się sztuką, menady towarzyszyły Dionizosowi, Erynie były boginiami zemsty, a Eurydyka była nimfą drzewną.',
    },
    {
      id: 'orf-q31', myth: 'orpheus', slot: 'ending', type: 'choice', hintPageId: 'orf-s16',
      prompt: 'Czego symbolem stał się Orfeusz?',
      options: ['Potęgi muzyki i miłości silniejszej niż śmierć', 'Sprytu i podstępu', 'Siły i odwagi w walce', 'Bogactwa i władzy'], correctIndex: 0,
      explanation: 'Orfeusz to symbol potęgi muzyki i sztuki oraz miłości, która nie poddaje się nawet śmierci.',
    },
    {
      id: 'orf-q32', myth: 'orpheus', slot: 'ending', type: 'order', hintPageId: 'orf-s14',
      prompt: 'Ułóż zakończenie mitu po kolei:',
      itemsInOrder: ['Orfeusz traci Eurydykę na zawsze', 'Orfeusz śpiewa żałosne pieśni w górach Tracji', 'Orfeusz ginie z rąk menad', 'Muzy chowają Orfeusza u stóp Olimpu'],
      explanation: 'Utrata Eurydyki, żałosne pieśni w Tracji, śmierć z rąk menad i pogrzeb u stóp Olimpu.',
    },
  ];
}(window.LM = window.LM || {}));
