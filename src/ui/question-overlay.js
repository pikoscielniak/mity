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

  // The views answer with an option index; a true/false question needs a boolean.
  function toAnswer(question, response) {
    return question.type === 'truefalse' ? { value: response.optionIndex === 0 } : response;
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
    const wrongOptions = [];
    const praise = PRAISE[Math.floor(rng() * PRAISE.length)];
    let firstAttemptCorrect = null;
    let lastAttemptCorrect = false;
    let phase = 'asking';
    let hintWasUsed = false;
    let view = null;
    const overlay = { update: update, render: render, exit: exit };

    function createView() {
      if (question.type === 'choice') {
        return LM.choiceView.createChoiceView(question.options, viewArea, wrongOptions, game.sfx);
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

    function submit(response) {
      const isCorrect = LM.answerCheck.isAnswerCorrect(question, toAnswer(question, response));
      if (firstAttemptCorrect === null) {
        firstAttemptCorrect = isCorrect;
        if (request.run) {
          LM.missionRun.recordAnswer(request.run, question, isCorrect);
        }
      }
      if (!isCorrect && response.optionIndex !== undefined) {
        wrongOptions.push(response.optionIndex);
      }
      lastAttemptCorrect = isCorrect;
      view.dispose();
      phase = 'feedback';
      game.sfx(isCorrect ? 'correct' : 'wrong');
    }

    function hintPage() {
      return request.run && question.hintPageId ? LM.stories.findStoryPage(question.hintPageId) : null;
    }

    // One hint per question costs one of the mission's scrolls; reopening the same scroll is free.
    function openHint() {
      const page = hintPage();
      if (!page || (!hintWasUsed && LM.missionRun.hintsLeft(request.run) <= 0)) {
        game.sfx('back');
        return;
      }
      if (!hintWasUsed) {
        LM.missionRun.recordHintUse(request.run);
        hintWasUsed = true;
      }
      view.dispose();
      phase = 'reopenAfterHint';
      game.sfx('page');
      game.scenes.pushOverlay(LM.hintScroll.createHintScrollOverlay(game, page, LM.missionRun.hintsLeft(request.run)));
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
      if (phase === 'reopenAfterHint') {
        view = createView();
        phase = 'asking';
        return;
      }
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
      const response = view.update(input);
      if (response) {
        submit(response);
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
      if (hintPage()) {
        hints.push({ keys: [question.type === 'typed' ? 'Tab' : 'H'], label: 'zwój (' + LM.missionRun.hintsLeft(request.run) + ')' });
      }
      return hints;
    }

    function render(ctx) {
      if (phase === 'reopenAfterHint') {
        return;
      }
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
