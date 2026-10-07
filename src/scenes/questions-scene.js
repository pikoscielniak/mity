// Developer view (?scene=questions): one sample question of every type, asked one after another.
(function (LM) {
  'use strict';

  const SAMPLES = [
    {
      id: 'sample-choice', type: 'choice', prompt: 'Co Ariadna dała Tezeuszowi, zanim wszedł do labiryntu?',
      options: ['Miecz z brązu', 'Kłębek nici', 'Mapę labiryntu', 'Lampę oliwną'], correctIndex: 1,
      explanation: 'Ariadna dała mu kłębek nici. Tezeusz przywiązał nić u wejścia i po niej wrócił.',
    },
    {
      id: 'sample-truefalse', type: 'truefalse', statement: 'Minotaur miał głowę lwa i ciało człowieka.', statementIsTrue: false,
      explanation: 'Minotaur miał głowę byka i ciało człowieka.',
    },
    {
      id: 'sample-order', type: 'order', prompt: 'Ułóż wydarzenia w kolejności, w jakiej się wydarzyły:',
      itemsInOrder: ['Tezeusz zgłasza się na ochotnika', 'Ariadna daje mu kłębek nici', 'Tezeusz pokonuje Minotaura', 'Ariadna zostaje na Naksos'],
      explanation: 'Najpierw zgłoszenie w Atenach, potem pomoc Ariadny, walka w labiryncie i postój na Naksos.',
    },
    {
      id: 'sample-match', type: 'match', prompt: 'Połącz postać z jej opisem:',
      pairs: [
        { left: 'Ariadna', right: 'córka króla Minosa' },
        { left: 'Egeusz', right: 'król Aten, ojciec Tezeusza' },
        { left: 'Dedal', right: 'budowniczy labiryntu' },
      ],
      explanation: 'Ariadna to córka Minosa, Egeusz rządził Atenami, a Dedal zbudował labirynt.',
    },
    {
      id: 'sample-typed', type: 'typed', prompt: 'Na jakiej wyspie Tezeusz zostawił śpiącą Ariadnę?',
      acceptedAnswers: ['Naksos', 'Naxos'], explanation: 'Na wyspie Naksos. Potem Ariadnę poślubił bóg Dionizos.',
    },
  ];

  function createQuestionsScene(game) {
    let elapsed = 0;
    let sampleIndex = 0;

    function askNext() {
      const question = SAMPLES[sampleIndex % SAMPLES.length];
      sampleIndex += 1;
      game.scenes.pushOverlay(LM.questionOverlay.createQuestionOverlay(game, {
        question: question,
        header: 'Pieczęć Minosa · pytanie ' + sampleIndex,
        attemptPolicy: 'retryUntilCorrect',
        run: null,
        onClosed: askNext,
      }));
    }

    return {
      enter: askNext,
      update: function (dt) { elapsed += dt; },
      render: function (ctx) {
        LM.scenery.drawSunsetCoast(ctx, elapsed);
        LM.ui.drawHud(ctx, { title: 'Pokaz pytań', heartsLeft: 3, heartsMax: 3 });
      },
    };
  }

  LM.sceneFactories.questions = createQuestionsScene;
}(window.LM = window.LM || {}));
