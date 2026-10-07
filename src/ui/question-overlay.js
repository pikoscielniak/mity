// Asks one question over the current scene: the answer view, then feedback with the myth's explanation.
// With 'retryUntilCorrect' a wrong answer is followed by another try (only the first try is scored).
(function (LM) {
  'use strict';

  const P = LM.palette;
  const PANEL = { x: 110, y: 36, width: 1060, height: 612 };
  const PROMPT_STYLE = { font: LM.text.boldFont(25), color: P.ink, lineHeight: 33 };
  const PRAISE = ['Dobrze!', 'Brawo!', 'Świetnie!', 'Tak jest!', 'Znakomicie!'];

  function promptText(question) {
    if (question.type === 'truefalse') {
      return 'Prawda czy fałsz?\n„' + question.statement + '”';
    }
    return question.prompt;
  }

  // Choice options are shown in a fresh random order every time, so the right answer is never always first.
  function shuffledOptionOrder(question, rng) {
    const indices = question.type === 'choice' ? question.options.map(function (option, index) { return index; }) : [];
    return LM.random.shuffle(indices, rng);
  }

  // request: { question, header, attemptPolicy: 'retryUntilCorrect' | 'singleAttempt', run (or null), rng?, onClosed({ isFirstAttemptCorrect }) }
  function createQuestionOverlay(game, request) {
    const question = request.question;
    const rng = request.rng || Math.random;
    const prompt = game.say(promptText(question));
    const contentX = PANEL.x + 30;
    const contentWidth = PANEL.width - 60;
    const promptHeight = LM.text.measureWrappedHeight(game.view.ctx, prompt, contentWidth, PROMPT_STYLE);
    const viewTop = PANEL.y + 60 + promptHeight + 20;
    const viewArea = { x: contentX + 20, y: viewTop, width: contentWidth - 40, height: PANEL.y + PANEL.height - viewTop - 20 };
    const optionOrder = shuffledOptionOrder(question, rng);
    const wrongOptions = [];
    const praise = PRAISE[Math.floor(rng() * PRAISE.length)];
    let firstAttemptCorrect = null;
    let lastAttemptCorrect = false;
    let phase = 'asking';
    let hintWasUsed = false;
    let view = null;
    const overlay = {
      kind: 'question',
      question: question,
      update: update,
      render: render,
      exit: exit,
      cover: function () { forwardToView('cover'); },
      uncover: function () { forwardToView('uncover'); },
      answerWith: function (questionResponse) { submit(questionResponse); },
      shownOptionNumber: function (optionIndex) { return optionOrder.indexOf(optionIndex) + 1; },
      isShowingFeedback: function () { return phase === 'feedback'; },
      continueAfterFeedback: function () { continueAfterFeedback(); },
    };

    function createView() {
      if (question.type === 'choice') {
        const labels = optionOrder.map(function (index) { return question.options[index]; });
        return LM.choiceView.createChoiceView(labels, viewArea, wrongOptions, game.sfx);
      }
      if (question.type === 'truefalse') {
        return LM.choiceView.createChoiceView(['Prawda', 'Fałsz'], viewArea, wrongOptions, game.sfx);
      }
      if (question.type === 'order') {
        return LM.orderView.createOrderView(question.itemsInOrder, viewArea, rng, game.sfx);
      }
      if (question.type === 'match') {
        return LM.matchView.createMatchView(question.pairs, viewArea, rng, game.sfx);
      }
      return LM.typedView.createTypedView(viewArea, game, openHint);
    }

    // Views answer in what they display (a shown option number); the answer check needs the question's terms.
    function toQuestionResponse(viewResponse) {
      if (question.type === 'choice') {
        return { optionIndex: optionOrder[viewResponse.optionIndex] };
      }
      if (question.type === 'truefalse') {
        return { value: viewResponse.optionIndex === 0 };
      }
      return viewResponse;
    }

    function answerFromView(viewResponse) {
      const isCorrect = submit(toQuestionResponse(viewResponse));
      if (!isCorrect && viewResponse.optionIndex !== undefined) {
        wrongOptions.push(viewResponse.optionIndex);
      }
    }

    function submit(questionResponse) {
      const isCorrect = LM.answerCheck.isAnswerCorrect(question, questionResponse);
      if (firstAttemptCorrect === null) {
        firstAttemptCorrect = isCorrect;
        if (request.run) {
          LM.missionRun.recordAnswer(request.run, question, isCorrect);
        }
      }
      lastAttemptCorrect = isCorrect;
      view.dispose();
      phase = 'feedback';
      game.sfx(isCorrect ? 'correct' : 'wrong');
      return isCorrect;
    }

    // Only the typed view owns something outside the canvas (its text field), so only it reacts to cover/uncover.
    function forwardToView(method) {
      if (view && view[method]) {
        view[method]();
      }
    }

    const allowsHints = Boolean(request.run && request.run.hintBudget > 0 && question.hintPageId);
    const hintPage = allowsHints ? LM.stories.findStoryPage(question.hintPageId) : null;

    // One hint per question costs one of the mission's scrolls; reopening the same scroll is free.
    function openHint() {
      if (!hintPage || (!hintWasUsed && LM.missionRun.hintsLeft(request.run) <= 0)) {
        game.sfx('back');
        return;
      }
      if (!hintWasUsed) {
        LM.missionRun.recordHintUse(request.run);
        hintWasUsed = true;
      }
      game.sfx('page');
      game.scenes.pushOverlay(LM.hintScroll.createHintScrollOverlay(game, hintPage, LM.missionRun.hintsLeft(request.run)));
    }

    function close() {
      game.scenes.popOverlay(overlay);
      request.onClosed({ isFirstAttemptCorrect: firstAttemptCorrect });
    }

    function continueAfterFeedback() {
      if (lastAttemptCorrect || request.attemptPolicy === 'singleAttempt') {
        close();
        return;
      }
      view = createView();
      phase = 'asking';
    }

    function update(dt, input) {
      if (phase === 'feedback') {
        if (input.wasPressed('confirm') || input.pointer.wasPressed) {
          continueAfterFeedback();
        }
        return;
      }
      if (input.wasPressed('hint')) {
        openHint();
        return;
      }
      // In the typed view Esc never gets here: the text field takes it as "nie wiem".
      if (input.wasPressed('back')) {
        game.scenes.pushOverlay(LM.pauseOverlay.createPauseOverlay(game));
        return;
      }
      const viewResponse = view.update(input);
      if (viewResponse) {
        answerFromView(viewResponse);
      }
    }

    function feedbackTitle() {
      return lastAttemptCorrect ? game.say(praise) : 'Nie tym razem…';
    }

    function drawFeedback(ctx) {
      const centerX = viewArea.x + viewArea.width / 2;
      let y = viewArea.y + 40;
      LM.text.drawTextLine(ctx, feedbackTitle(), centerX, y, {
        font: LM.text.boldFont(38), color: lastAttemptCorrect ? P.correct : P.wrong, align: 'center',
      });
      y += 50;
      if (!lastAttemptCorrect) {
        y += LM.text.drawWrappedText(ctx, 'Poprawna odpowiedź: ' + LM.answerCheck.correctAnswerText(question), centerX, y, viewArea.width, {
          font: LM.text.boldFont(23), color: P.ink, lineHeight: 30, align: 'center',
        }) + 12;
      }
      LM.text.drawWrappedText(ctx, game.say(question.explanation || ''), centerX, y, viewArea.width - 40, {
        font: LM.text.regularFont(22), color: P.inkSoft, lineHeight: 30, align: 'center',
      });
      const willRetry = !lastAttemptCorrect && request.attemptPolicy !== 'singleAttempt';
      LM.ui.drawButton(ctx, { x: centerX - 190, y: PANEL.y + PANEL.height - 86, width: 380, height: 56 }, willRetry ? 'Spróbuj jeszcze raz' : 'Dalej', 'selected', 24);
    }

    function keyHints() {
      if (phase === 'feedback') {
        return [{ keys: ['Enter'], label: 'dalej' }];
      }
      const hints = view.keyHints.slice();
      if (hintPage) {
        hints.push({ keys: [question.type === 'typed' ? 'Tab' : 'H'], label: 'zwój (' + LM.missionRun.hintsLeft(request.run) + ')' });
      }
      if (question.type !== 'typed') {
        hints.push({ keys: ['Esc'], label: 'pauza' });
      }
      return hints;
    }

    function render(ctx) {
      LM.ui.drawDimmer(ctx);
      LM.ui.drawTitledPanel(ctx, PANEL, request.header);
      LM.text.drawWrappedText(ctx, prompt, contentX, PANEL.y + 88, contentWidth, PROMPT_STYLE);
      if (phase === 'feedback') {
        drawFeedback(ctx);
      } else {
        view.render(ctx);
      }
      LM.ui.drawKeyHintBar(ctx, keyHints());
    }

    function exit() {
      if (view) {
        view.dispose();
      }
    }

    view = createView();
    return overlay;
  }

  LM.questionOverlay = { createQuestionOverlay };
}(window.LM = window.LM || {}));
