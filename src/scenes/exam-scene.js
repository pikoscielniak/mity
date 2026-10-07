// The final exam: the Pythia at Delphi asks 15 questions drawn from all three myths, without hints.
(function (LM) {
  'use strict';

  function requiredCorrect(questionCount) {
    return Math.ceil(questionCount * LM.missionRun.PASS_THRESHOLD);
  }

  function drawExam(rng) {
    const pools = LM.data.missions.map(function (mission) { return LM.data.questions[mission.id]; });
    return LM.questionDraw.drawExamQuestions(pools, LM.data.crossQuestions, LM.data.exam.questionCount, rng);
  }

  function createExamScene(game) {
    const seed = game.options.seed ? Number(game.options.seed) : LM.random.randomSeed();
    const rng = LM.random.createRng(seed);
    const run = LM.missionRun.createMissionRun(LM.data.exam.id);
    const questions = drawExam(rng);
    const introText = game.say('Witaj w Delfach, ' + game.profile().name + '! Jestem Pytia, kapłanka wyroczni. Zadam ci ' +
      questions.length + ' pytań o trzech mitach, bez zwojów z podpowiedziami. Aby zdać, odpowiedz dobrze na ' +
      requiredCorrect(questions.length) + '. Naciśnij Enter, gdy będziesz gotow{y|a}.');
    let questionIndex = 0;
    let phase = 'intro';
    let elapsed = 0;

    function finish() {
      const profile = game.profile();
      const isPassed = LM.missionRun.isPassed(run);
      LM.profiles.recordMissionResult(profile, { missionId: run.missionId, percent: LM.missionRun.scorePercent(run), isPassed: isPassed, dateIso: new Date().toISOString() });
      const newAchievements = LM.achievements.awardMissionAchievements(profile, run, isPassed);
      game.persist();
      game.sfx(isPassed ? 'missionComplete' : 'missionFailed');
      game.show('summary', {
        scoreTitle: 'Wynik egzaminu',
        run: run,
        isPassed: isPassed,
        newAchievements: newAchievements,
        concepts: [],
        backgroundIllustration: 'delphi',
        choices: isPassed ? [{ label: 'Zobacz zakończenie!', onChoose: function () { game.show('ending'); } }] : LM.missionRunner.retryChoices(game, game.startExam),
      });
    }

    function askNext() {
      if (questionIndex >= questions.length) {
        finish();
        return;
      }
      game.scenes.pushOverlay(LM.questionOverlay.createQuestionOverlay(game, {
        question: questions[questionIndex],
        header: 'Wyrocznia w Delfach · pytanie ' + (questionIndex + 1) + '/' + questions.length,
        attemptPolicy: 'singleAttempt',
        hintPolicy: 'none',
        run: run,
        rng: rng,
        onClosed: function () {
          questionIndex += 1;
          askNext();
        },
      }));
    }

    function update(dt, input) {
      elapsed += dt;
      if (phase === 'intro' && (input.wasPressed('confirm') || input.pointer.wasPressed)) {
        phase = 'asking';
        game.speech.cancel();
        askNext();
      }
    }

    function render(ctx) {
      LM.illustrations.delphi(ctx, elapsed);
      LM.ui.drawHud(ctx, { title: LM.data.exam.title, rightText: 'Pytanie ' + Math.min(questionIndex + 1, questions.length) + '/' + questions.length });
      if (phase === 'intro') {
        LM.ui.drawParchmentPanel(ctx, { x: 120, y: 500, width: 1040, height: 150 });
        LM.text.drawWrappedText(ctx, introText, 150, 540, 980, { font: LM.text.boldFont(21), color: LM.palette.ink, lineHeight: 28 });
        LM.ui.drawKeyHintBar(ctx, [{ keys: ['Enter'], label: 'zaczynamy' }]);
      }
    }

    return {
      enter: function () {
        game.playTheme('exam');
        if (game.profile().settings.isNarrationEnabled) {
          game.speech.speak(introText, 'pythia');
        }
      },
      update: update,
      render: render,
      exit: function () { game.speech.cancel(); },
    };
  }

  LM.sceneFactories.exam = createExamScene;
}(window.LM = window.LM || {}));
