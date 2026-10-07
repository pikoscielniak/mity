// Hosts one mini-game stage: hearts, questions, pause, and the return to the last checkpoint after losing all hearts.
// A stage (LM.stageFactories[type](context)) provides: update, render, hud(), keyHints(), restoreCheckpoint(), debugAdvance().
// Its update is not called while an overlay (question, pause, hint) is open or while the hero is fainted.
(function (LM) {
  'use strict';

  const MAX_HEARTS = 3;
  const FAINT_SECONDS = 2.2;
  const GRACE_SECONDS = 1.6;

  function createStageScene(game, params) {
    const runner = params.runner;
    let heartsLeft = MAX_HEARTS;
    let faintTimer = 0;
    let graceSeconds = 0;
    let stage = null;

    function askQuestion(slot, options, onAnswered) {
      const question = runner.nextQuestion(slot);
      if (!question) {
        onAnswered(true);
        return;
      }
      game.scenes.pushOverlay(LM.questionOverlay.createQuestionOverlay(game, {
        question: question,
        header: options.header,
        attemptPolicy: options.attemptPolicy || 'retryUntilCorrect',
        run: runner.run,
        rng: runner.rng,
        onClosed: function (result) { onAnswered(result.isFirstAttemptCorrect); },
      }));
    }

    // After a lost heart the hero is safe for a moment (and blinks), so one obstacle never costs two hearts.
    function loseHeart() {
      if (faintTimer > 0 || graceSeconds > 0) {
        return;
      }
      heartsLeft -= 1;
      graceSeconds = GRACE_SECONDS;
      LM.missionRun.recordHeartLost(runner.run);
      game.sfx('heartLost');
      if (heartsLeft <= 0) {
        faintTimer = FAINT_SECONDS;
      }
    }

    function recoverAtCheckpoint() {
      heartsLeft = MAX_HEARTS;
      graceSeconds = GRACE_SECONDS;
      stage.restoreCheckpoint();
    }

    const context = {
      game: game,
      runner: runner,
      rng: runner.rng,
      run: runner.run,
      askQuestion: askQuestion,
      remainingQuestions: runner.remainingQuestions,
      loseHeart: loseHeart,
      isRecovering: function () { return graceSeconds > 0; },
      isBlinking: function () { return graceSeconds > 0 && Math.floor(graceSeconds * 10) % 2 === 0; },
      completeStage: function () { runner.completeStage(); },
    };

    function update(dt, input) {
      graceSeconds = Math.max(0, graceSeconds - dt);
      if (faintTimer > 0) {
        faintTimer -= dt;
        if (faintTimer <= 0) {
          recoverAtCheckpoint();
        }
        return;
      }
      if (input.wasPressed('back')) {
        game.scenes.pushOverlay(LM.pauseOverlay.createPauseOverlay(game));
        return;
      }
      stage.update(dt, input);
    }

    function drawFaintBanner(ctx) {
      LM.ui.drawDimmer(ctx);
      const rect = { x: 290, y: 260, width: 700, height: 170 };
      LM.ui.drawTitledPanel(ctx, rect, 'Ojej!');
      LM.text.drawWrappedText(ctx, game.say('Stracił{eś|aś} wszystkie serca. Wracasz do ostatniego punktu kontrolnego, a odpowiedzi zostają zapisane.'), 640, 354, 620, {
        font: LM.text.boldFont(22), color: LM.palette.ink, lineHeight: 30, align: 'center',
      });
    }

    function render(ctx) {
      stage.render(ctx);
      const hud = stage.hud();
      LM.ui.drawHud(ctx, { title: hud.title, heartsLeft: heartsLeft, heartsMax: MAX_HEARTS, rightText: hud.rightText });
      LM.ui.drawKeyHintBar(ctx, stage.keyHints().concat([{ keys: ['Esc'], label: 'pauza' }]), hud.bottomText);
      if (faintTimer > 0) {
        drawFaintBanner(ctx);
      }
    }

    stage = LM.stageFactories[params.stageType](context);

    return {
      update: update,
      render: render,
      stageType: params.stageType,
      stage: function () { return stage; },
    };
  }

  LM.sceneFactories.stage = createStageScene;
}(window.LM = window.LM || {}));
