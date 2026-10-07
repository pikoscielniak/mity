// Questions linking the three myths, asked only in the final exam at Delphi.
(function (LM) {
  'use strict';

  LM.data.questions = LM.data.questions || {};
  LM.data.crossQuestions = [
    {
      id: 'mix-q01', myth: 'cross', slot: 'exam', type: 'choice', hintPageId: 'ika-s02',
      prompt: 'Kto zbudował labirynt, w którym Tezeusz pokonał Minotaura?',
      options: ['Dedal', 'Minos', 'Hermes', 'Orfeusz'], correctIndex: 0,
      explanation: 'Labirynt zbudował Dedal, ojciec Ikara. Tak łączą się pierwsze dwa mity.',
    },
    {
      id: 'mix-q02', myth: 'cross', slot: 'exam', type: 'choice', hintPageId: 'ika-s04',
      prompt: 'Który król występuje i w micie o Tezeuszu, i w micie o Dedalu i Ikarze?',
      options: ['Minos, król Krety', 'Egeusz, król Aten', 'Hades, król podziemi', 'Dionizos, bóg wina'], correctIndex: 0,
      explanation: 'Minos żądał haraczu od Aten i nie chciał wypuścić Dedala z Krety.',
    },
    {
      id: 'mix-q03', myth: 'cross', slot: 'exam', type: 'match', hintPageId: 'tez-s08',
      prompt: 'Połącz postać z tym, co zrobiła w micie:',
      pairs: [
        { left: 'Ariadna', right: 'dała kłębek nici' },
        { left: 'Ikar', right: 'poleciał za wysoko' },
        { left: 'Charon', right: 'przewiózł Orfeusza przez Styks' },
        { left: 'Egeusz', right: 'wypatrywał żagla ze skały' },
      ],
      explanation: 'Ariadna pomogła nicią, Ikar nie posłuchał ojca, Charon przewiózł śpiewaka, a Egeusz czekał na żagiel.',
    },
    {
      id: 'mix-q04', myth: 'cross', slot: 'exam', type: 'match', hintPageId: 'ika-s16',
      prompt: 'Połącz miejsce z tym, co się tam wydarzyło:',
      pairs: [
        { left: 'Naksos', right: 'została tu śpiąca Ariadna' },
        { left: 'Ikaria', right: 'Dedal pochował tu syna' },
        { left: 'Sycylia', right: 'doleciał tu Dedal' },
        { left: 'Tracja', right: 'królestwo Orfeusza' },
      ],
      explanation: 'Naksos to wyspa Ariadny, Ikaria to wyspa Ikara, na Sycylię doleciał Dedal, a w Tracji królował Orfeusz.',
    },
    {
      id: 'mix-q05', myth: 'cross', slot: 'exam', type: 'choice', hintPageId: 'orf-s12',
      prompt: 'Co łączy losy Tezeusza, Ikara i Orfeusza?',
      options: [
        'Każdy zlekceważył przestrogę albo zapomniał o ważnym znaku',
        'Każdy był synem Zeusa',
        'Każdy pokonał potwora w labiryncie',
        'Każdy umiał latać',
      ],
      correctIndex: 0,
      explanation: 'Tezeusz zapomniał zmienić żagiel, Ikar nie posłuchał ojca, a Orfeusz obejrzał się wbrew warunkowi Hadesa.',
    },
    {
      id: 'mix-q06', myth: 'cross', slot: 'exam', type: 'truefalse', hintPageId: 'orf-s15',
      statement: 'Bóg Dionizos, który poślubił Ariadnę, miał za towarzyszki menady.', statementIsTrue: true,
      explanation: 'Tak. Menady, szalone towarzyszki Dionizosa, pojawiają się w micie o Orfeuszu.',
    },
    {
      id: 'mix-q07', myth: 'cross', slot: 'exam', type: 'typed', hintPageId: 'tez-s13',
      prompt: 'Jak nazywał się bóg wina, który poślubił Ariadnę?',
      acceptedAnswers: ['Dionizos', 'Dionysos'],
      explanation: 'To Dionizos, bóg wina.',
    },
    {
      id: 'mix-q08', myth: 'cross', slot: 'exam', type: 'choice', hintPageId: 'orf-s14',
      prompt: 'Który bohater zszedł do podziemia i wyszedł z niego żywy?',
      options: ['Orfeusz', 'Ikar', 'Egeusz', 'Minos'], correctIndex: 0,
      explanation: 'Orfeusz zszedł do Hadesu i wrócił na świat, choć bez Eurydyki.',
    },
    {
      id: 'mix-q09', myth: 'cross', slot: 'exam', type: 'truefalse', hintPageId: 'tez-s15',
      statement: 'Według mitów Morze Egejskie i Morze Ikaryjskie wzięły nazwy od postaci z mitów.', statementIsTrue: true,
      explanation: 'Tak: Morze Egejskie od króla Egeusza, a Morze Ikaryjskie od Ikara.',
    },
  ];
}(window.LM = window.LM || {}));
