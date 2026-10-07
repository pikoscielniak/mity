// Pytania do mitu o Dedalu i Ikarze. Slots: workshop (Daedalus on Crete), flight (the flight), ending (after the fall).
// Only facts confirmed in Parandowski's version are asked (not where Icarus fell, no imprisonment, no name of the Sicilian king).
(function (LM) {
  'use strict';

  LM.data.questions = LM.data.questions || {};
  LM.data.questions.icarus = [
    {
      id: 'ika-q01', myth: 'icarus', slot: 'workshop', type: 'choice', hintPageId: 'ika-s01',
      prompt: 'Skąd pochodził Dedal?',
      options: ['Z Aten', 'Z Krety', 'Ze Sparty', 'Z Troi'], correctIndex: 0,
      explanation: 'Dedal był Ateńczykiem. Na Kretę, do króla Minosa, przybył później.',
    },
    {
      id: 'ika-q02', myth: 'icarus', slot: 'workshop', type: 'truefalse', hintPageId: 'ika-s01',
      statement: 'Według mitu Dedal wymyślił między innymi świder i poziomicę.', statementIsTrue: true,
      explanation: 'Tak, Dedalowi przypisywano wiele wynalazków, między innymi świder i poziomicę.',
    },
    {
      id: 'ika-q03', myth: 'icarus', slot: 'workshop', type: 'match', hintPageId: 'ika-s01',
      prompt: 'Połącz dzieło Dedala z jego opisem:',
      pairs: [
        { left: 'świder', right: 'wierci otwory' },
        { left: 'poziomica', right: 'pokazuje, czy coś leży prosto' },
        { left: 'posągi Dedala', right: 'wyglądały jak żywe' },
      ],
      explanation: 'Świder wierci otwory, poziomica pokazuje, czy coś leży prosto, a posągi Dedala wyglądały jak żywe.',
    },
    {
      id: 'ika-q04', myth: 'icarus', slot: 'workshop', type: 'choice', hintPageId: 'ika-s02',
      prompt: 'Dla kogo Dedal zbudował labirynt?',
      options: ['Dla króla Minosa', 'Dla króla Egeusza', 'Dla Tezeusza', 'Dla boga Posejdona'], correctIndex: 0,
      explanation: 'Dedal zbudował labirynt na Krecie dla króla Minosa. Zamknięto w nim Minotaura.',
    },
    {
      id: 'ika-q05', myth: 'icarus', slot: 'workshop', type: 'typed', hintPageId: 'ika-s02',
      prompt: 'Jak nazywał się król Krety, u którego mieszkał Dedal? Wpisz imię.',
      acceptedAnswers: ['Minos', 'Minosa', 'król Minos'],
      explanation: 'To był Minos, mądry król Krety, którego okręty panowały nad morzami.',
    },
    {
      id: 'ika-q06', myth: 'icarus', slot: 'workshop', type: 'truefalse', hintPageId: 'ika-s03',
      statement: 'Dedal chciał zostać na Krecie na zawsze.', statementIsTrue: false,
      explanation: 'Nieprawda: Dedal tęsknił za ojczyzną i chciał wrócić do Aten.',
    },
    {
      id: 'ika-q07', myth: 'icarus', slot: 'workshop', type: 'choice', hintPageId: 'ika-s04',
      prompt: 'Dlaczego Minos nie pozwolił Dedalowi wrócić do Aten?',
      options: ['Bał się, że Dedal zdradzi tajemnice jego królestwa', 'Dedal był mu winien dużo złota', 'Dedal miał najpierw pokonać Minotaura', 'Ateny wypowiedziały Krecie wojnę'],
      correctIndex: 0,
      explanation: 'Dedal znał tajemnice pałacu i królestwa Minosa, a król bał się, że zdradzi je jego wrogom.',
    },
    {
      id: 'ika-q08', myth: 'icarus', slot: 'workshop', type: 'choice', hintPageId: 'ika-s06',
      prompt: 'Dlaczego Dedal postanowił uciec z Krety drogą powietrzną?',
      options: ['Minos panował nad ziemią i morzem, ale nie nad niebem', 'Bał się choroby morskiej', 'Chciał pierwszy zobaczyć Olimp z góry', 'Bogowie kazali mu latać'],
      correctIndex: 0,
      explanation: 'Ziemia i morze należały do Minosa, ale nad niebem król nie miał władzy.',
    },
    {
      id: 'ika-q09', myth: 'icarus', slot: 'workshop', type: 'choice', hintPageId: 'ika-s07',
      prompt: 'Z czego Dedal zrobił skrzydła?',
      options: ['Z ptasich piór sklejonych woskiem', 'Z płótna żaglowego i drewna', 'Z cienkich blach z brązu', 'Z liści palmowych i żywicy'], correctIndex: 0,
      explanation: 'Skrzydła były z ptasich piór, które Dedal skleił woskiem.',
    },
    {
      id: 'ika-q10', myth: 'icarus', slot: 'workshop', type: 'typed', hintPageId: 'ika-s07',
      prompt: 'Czym Dedal skleił ptasie pióra? Wpisz jedno słowo.',
      acceptedAnswers: ['wosk', 'woskiem', 'wosku'],
      explanation: 'Pióra skleił woskiem. To właśnie wosk stopiło później słońce.',
    },
    {
      id: 'ika-q11', myth: 'icarus', slot: 'workshop', type: 'order', hintPageId: 'ika-s04',
      prompt: 'Ułóż wydarzenia z Krety po kolei:',
      itemsInOrder: ['Dedal buduje labirynt dla Minosa', 'Dedal zaczyna tęsknić za Atenami', 'Minos nie pozwala mu odpłynąć', 'Dedal robi skrzydła z piór i wosku', 'Dedal uczy Ikara latać'],
      explanation: 'Najpierw labirynt, potem tęsknota za Atenami, odmowa Minosa, budowa skrzydeł i nauka latania.',
    },
    {
      id: 'ika-q12', myth: 'icarus', slot: 'flight', type: 'choice', hintPageId: 'ika-s09',
      prompt: 'Jak Dedal kazał lecieć Ikarowi?',
      options: ['Środkiem: ani za wysoko, ani za nisko', 'Jak najwyżej, blisko słońca', 'Tuż nad samymi falami', 'Daleko przed ojcem'], correctIndex: 0,
      explanation: 'Dedal przestrzegał: leć środkiem, bo za wysoko grozi słońce, a za nisko morze.',
    },
    {
      id: 'ika-q13', myth: 'icarus', slot: 'flight', type: 'choice', hintPageId: 'ika-s09',
      prompt: 'Co by się stało, gdyby Ikar wzniósł się za wysoko?',
      options: ['Słońce roztopiłoby wosk', 'Skrzydła zamarzłyby w chmurach', 'Porwałby go orzeł', 'Zgubiłby drogę we mgle'], correctIndex: 0,
      explanation: 'Wysoko słońce grzeje mocniej i mogło roztopić wosk, który trzymał pióra.',
    },
    {
      id: 'ika-q14', myth: 'icarus', slot: 'flight', type: 'choice', hintPageId: 'ika-s09',
      prompt: 'Dlaczego nie wolno było lecieć zbyt nisko?',
      options: ['Woda zmoczyłaby pióra i stałyby się ciężkie', 'Wosk zamarzłby od zimnej wody', 'Mewy wyrwałyby pióra', 'Fale zgasiłyby słońce'], correctIndex: 0,
      explanation: 'Tuż nad morzem woda zmoczyłaby pióra, a mokre pióra są ciężkie.',
    },
    {
      id: 'ika-q15', myth: 'icarus', slot: 'flight', type: 'truefalse', hintPageId: 'ika-s13',
      statement: 'Ikar posłuchał ojca i przez cały lot trzymał się środka.', statementIsTrue: false,
      explanation: 'Nieprawda: zachwycony lotem Ikar zapomniał o przestrodze i wzbijał się coraz wyżej.',
    },
    {
      id: 'ika-q16', myth: 'icarus', slot: 'flight', type: 'typed', hintPageId: 'ika-s11',
      prompt: 'Wpisz nazwę jednej z wysp, obok których przelatywali Dedal i Ikar.',
      acceptedAnswers: ['Samos', 'Paros', 'Delos'],
      explanation: 'Dedal i Ikar minęli wyspy Samos, Paros i Delos.',
    },
    {
      id: 'ika-q17', myth: 'icarus', slot: 'flight', type: 'choice', hintPageId: 'ika-s11',
      prompt: 'Obok jakich wysp przelatywali Dedal i Ikar?',
      options: ['Samos, Paros i Delos', 'Rodos, Cypr i Malta', 'Itaka, Korfu i Kefalonia', 'Sardynia, Korsyka i Elba'], correctIndex: 0,
      explanation: 'Po drodze minęli wyspy Samos, Paros i Delos na Morzu Egejskim.',
    },
    {
      id: 'ika-q18', myth: 'icarus', slot: 'flight', type: 'order', hintPageId: 'ika-s13',
      prompt: 'Ułóż wydarzenia lotu po kolei:',
      itemsInOrder: ['Dedal ostrzega syna przed słońcem i morzem', 'Ojciec i syn wzbijają się nad Kretę', 'Mijają wyspy Samos, Paros i Delos', 'Ikar wzlatuje coraz wyżej', 'Słońce topi wosk w skrzydłach'],
      explanation: 'Przestroga, start nad Kretą, wyspy po drodze, a potem Ikar leci za wysoko i słońce topi wosk.',
    },
    {
      id: 'ika-q19', myth: 'icarus', slot: 'flight', type: 'choice', hintPageId: 'ika-s10',
      prompt: 'Co znaczy wyrażenie „złoty środek”?',
      options: ['Rozsądna droga bez przesady w żadną stronę', 'Skarb ukryty w środku labiryntu', 'Najcenniejsza rzecz w królestwie', 'Południe, gdy słońce świeci najmocniej'],
      correctIndex: 0,
      explanation: 'Złoty środek to rozsądne wyjście pośrodku, tak jak droga Dedala między słońcem a morzem.',
    },
    {
      id: 'ika-q20', myth: 'icarus', slot: 'flight', type: 'match', hintPageId: 'ika-s13',
      prompt: 'Połącz z tym, co oznacza dziś w przenośni:',
      pairs: [
        { left: 'Ikar', right: 'młodzieńcza śmiałość i marzenia' },
        { left: 'Dedal', right: 'rozsądek i geniusz wynalazcy' },
        { left: 'ikarowy lot', right: 'śmiały, ale ryzykowny plan' },
      ],
      explanation: 'Ikar to symbol młodzieńczej śmiałości, Dedal symbol rozsądku i geniuszu, a ikarowy lot to śmiały, ryzykowny plan.',
    },
    {
      id: 'ika-q21', myth: 'icarus', slot: 'flight', type: 'match', hintPageId: 'ika-s09',
      prompt: 'Połącz sposób lotu z jego skutkiem według przestrogi Dedala:',
      pairs: [
        { left: 'za wysoko', right: 'słońce topi wosk' },
        { left: 'za nisko', right: 'woda moczy pióra' },
        { left: 'środkiem', right: 'bezpieczny lot' },
      ],
      explanation: 'Za wysoko słońce topi wosk, za nisko woda moczy pióra, a lot środkiem jest bezpieczny.',
    },
    {
      id: 'ika-q22', myth: 'icarus', slot: 'flight', type: 'typed', hintPageId: 'ika-s14',
      prompt: 'Co roztopiło wosk w skrzydłach Ikara? Wpisz jedno słowo.',
      acceptedAnswers: ['słońce', 'słońca', 'żar słońca', 'promienie słońca', 'ciepło słońca', 'upał'],
      explanation: 'Wosk roztopiło słońce, do którego Ikar podleciał za blisko.',
    },
    {
      id: 'ika-q23', myth: 'icarus', slot: 'flight', type: 'typed', hintPageId: 'ika-s09',
      prompt: 'Uzupełnij przestrogę Dedala: „Leć zawsze …, ani za wysoko, ani za nisko!”',
      acceptedAnswers: ['środkiem', 'pośrodku', 'po środku', 'w środku'],
      explanation: 'Dedal kazał lecieć środkiem, z dala od słońca i od fal.',
    },
    {
      id: 'ika-q24', myth: 'icarus', slot: 'flight', type: 'choice', hintPageId: 'ika-s14',
      prompt: 'Co się stało, gdy wosk zaczął się topić?',
      options: ['Pióra odpadały i Ikar spadł', 'Skrzydła stały się jeszcze mocniejsze', 'Ikar bezpiecznie wylądował na Sycylii', 'Dedal złapał syna w locie'], correctIndex: 0,
      explanation: 'Bez wosku pióra odpadały jedno po drugim, aż Ikar spadł z wysoka i zginął.',
    },
    {
      id: 'ika-q25', myth: 'icarus', slot: 'flight', type: 'choice', hintPageId: 'ika-s06',
      prompt: 'Jakie odwieczne marzenie ludzi spełnił w tym micie Dedal?',
      options: ['Marzenie o lataniu jak ptaki', 'Marzenie o życiu wiecznym', 'Marzenie o podróży pod wodą', 'Marzenie o zamianie kamieni w złoto'], correctIndex: 0,
      explanation: 'Ludzie od zawsze marzyli o lataniu jak ptaki, a Dedal zbudował skrzydła.',
    },
    {
      id: 'ika-q26', myth: 'icarus', slot: 'ending', type: 'typed', hintPageId: 'ika-s15',
      prompt: 'Jak nazwano wyspę, na której Dedal pochował Ikara?',
      acceptedAnswers: ['Ikaria', 'Ikarią', 'Icaria', 'wyspa Ikaria'],
      explanation: 'Wyspę nazwano od imienia Ikara: Ikaria.',
    },
    {
      id: 'ika-q27', myth: 'icarus', slot: 'ending', type: 'choice', hintPageId: 'ika-s15',
      prompt: 'Które morze nazwano od imienia Ikara?',
      options: ['Morze Ikaryjskie', 'Morze Egejskie', 'Morze Jońskie', 'Morze Czarne'], correctIndex: 0,
      explanation: 'Morze wokół wyspy Ikarii to Morze Ikaryjskie. (Egejskie nazwano od króla Egeusza.)',
    },
    {
      id: 'ika-q28', myth: 'icarus', slot: 'ending', type: 'truefalse', hintPageId: 'ika-s15',
      statement: 'Dedal odnalazł syna i pochował go na wyspie.', statementIsTrue: true,
      explanation: 'Tak, zrozpaczony Dedal odnalazł Ikara i ze łzami go pochował.',
    },
    {
      id: 'ika-q29', myth: 'icarus', slot: 'ending', type: 'choice', hintPageId: 'ika-s16',
      prompt: 'Dokąd dotarł Dedal po śmierci Ikara?',
      options: ['Na Sycylię', 'Z powrotem do Aten', 'Na Olimp', 'Do Egiptu'], correctIndex: 0,
      explanation: 'Dedal dotarł na Sycylię i został budowniczym tamtejszego króla.',
    },
    {
      id: 'ika-q30', myth: 'icarus', slot: 'ending', type: 'choice', hintPageId: 'ika-s16',
      prompt: 'Co spotkało króla Minosa?',
      options: ['Wyruszył z flotą za Dedalem i zginął na wojnie','Pokonał go Minotaur', 'Utonął, szukając Ikara', 'Został budowniczym na Sycylii'], correctIndex: 0,
      explanation: 'Minos ruszył z wielką flotą za Dedalem na Sycylię i zginął w tej wojnie.',
    },
    {
      id: 'ika-q31', myth: 'icarus', slot: 'ending', type: 'typed', hintPageId: 'ika-s13',
      prompt: 'Uzupełnij: śmiały, ale ryzykowny plan, który może skończyć się porażką, to … lot.',
      acceptedAnswers: ['ikarowy', 'ikaryjski', 'ikarowy lot', 'ikaryjski lot'],
      explanation: 'Taki plan nazywamy ikarowym lotem, od Ikara, który chciał dolecieć do słońca.',
    },
    {
      id: 'ika-q32', myth: 'icarus', slot: 'ending', type: 'order', hintPageId: 'ika-s16',
      prompt: 'Ułóż zakończenie mitu po kolei:',
      itemsInOrder: ['Słońce topi wosk i Ikar spada', 'Dedal grzebie syna', 'Dedal dociera na Sycylię', 'Minos płynie z flotą za Dedalem'],
      explanation: 'Upadek Ikara, pogrzeb, ucieczka Dedala na Sycylię i pościg Minosa, który zginął w tej wojnie.',
    },
  ];
}(window.LM = window.LM || {}));
