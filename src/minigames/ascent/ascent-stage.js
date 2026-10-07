// Stage 2 of mission 3: the way up from the underworld. Hold → to climb; Eurydice and Hermes follow unseen.
// Voices tempt Orpheus to look back (←) — which Hades forbade. Echo stones ask questions on the way.
// At the exit the myth plays out as written, then Orpheus laments in Thrace (two last questions).
(function (LM) {
  'use strict';

  const A = LM.ascentArt;
  const WALK_SPEED = 5;
  const EXIT_DISTANCE = 97;
  const ECHO_DISTANCES = [20, 40, 60, 80];
  const TEMPTATION_SECONDS = 4.5;
  const SCRIPT_SECONDS = { lookBack: 6, lament: 3 };
  const STEP_SOUND_SECONDS = 0.55;
  const TEMPTATIONS = [
    { at: 11, speaker: 'eurydice', text: 'Orfeuszu… czy ja naprawdę idę za tobą?', isTempting: true },
    { at: 30, speaker: 'eurydice', text: 'Nie słyszę swoich kroków… Może zostałam w ciemności?', isTempting: true },
    { at: 50, speaker: 'narrator', text: 'Za plecami coś cicho zaszeleściło…', isTempting: true },
    { at: 70, speaker: 'hermes', text: 'Cienie zmarłych stąpają bezgłośnie. Idź dalej i nie oglądaj się.', isTempting: false },
    { at: 88, speaker: 'eurydice', text: 'Spójrz na mnie choć raz, Orfeuszu!', isTempting: true },
  ];
  const LOOK_BACK_STORY = 'Byli już prawie u wyjścia, gdy w micie Orfeusz nie wytrzymał i obejrzał się. Eurydyka zniknęła w ciemności na zawsze.';
  const LAMENT_STORY = 'Orfeusz wyszedł na świat sam i długo śpiewał smutne pieśni w górach Tracji.';

  function createAscentStage(context) {
    const game = context.game;
    const echoCount = Math.min(ECHO_DISTANCES.length, context.remainingQuestions('echo'));
    const echoes = ECHO_DISTANCES.slice(0, echoCount).map(function (distance) { return { distance: distance, state: 'waiting' }; });
    let distance = 0;
    let checkpoint = 0;
    let phase = 'climbing';
    let phaseSeconds = 0;
    let temptation = null;
    let nextTemptation = 0;
    let warning = null;
    let stepClock = 0;
    let isQuestionOpen = false;
    let elapsed = 0;

    function enterPhase(nextPhase) {
      phase = nextPhase;
      phaseSeconds = 0;
    }

    function startTemptation(entry) {
      temptation = { entry: entry, seconds: TEMPTATION_SECONDS };
      if (game.profile().settings.isNarrationEnabled) {
        game.speech.speak(entry.text, entry.speaker);
      }
    }

    function lookBack() {
      LM.missionRun.addToStat(context.run, 'lookBacks', 1);
      warning = { text: 'Nie wolno się oglądać! Taki warunek postawił Hades.', seconds: 2.5 };
      game.sfx('wrong');
      context.loseHeart();
    }

    function askEcho(echo) {
      isQuestionOpen = true;
      const number = echoes.indexOf(echo) + 1;
      context.askQuestion('echo', { header: 'Echo w ciemności ' + number + '/' + echoes.length }, function () {
        isQuestionOpen = false;
        echo.state = 'answered';
        checkpoint = echo.distance;
      });
    }

    function walk(dt, input) {
      const isWalking = input.isHeld('right') || input.isHeld('up');
      const nextEcho = echoes.find(function (echo) { return echo.state === 'waiting'; });
      const limit = nextEcho ? nextEcho.distance : EXIT_DISTANCE;
      if (isWalking) {
        distance = Math.min(limit, distance + WALK_SPEED * dt);
        stepClock += dt;
        if (stepClock > STEP_SOUND_SECONDS) {
          stepClock = 0;
          game.sfx('softStep');
        }
      }
      if (nextEcho && distance >= nextEcho.distance) {
        askEcho(nextEcho);
      } else if (!nextEcho && distance >= EXIT_DISTANCE) {
        game.speech.cancel();
        enterPhase('lookBack');
      }
    }

    function updateTemptation(dt) {
      if (temptation) {
        temptation.seconds -= dt;
        temptation = temptation.seconds > 0 ? temptation : null;
      }
      const due = TEMPTATIONS[nextTemptation];
      if (due && distance >= due.at) {
        nextTemptation += 1;
        startTemptation(due);
      }
    }

    function askLamentQuestions(left) {
      if (left <= 0 || context.remainingQuestions('ending') === 0) {
        context.completeStage();
        return;
      }
      context.askQuestion('ending', { header: 'Lament Orfeusza' }, function () { askLamentQuestions(left - 1); });
    }

    function update(dt, input) {
      elapsed += dt;
      phaseSeconds += dt;
      if (warning) {
        warning.seconds -= dt;
        warning = warning.seconds > 0 ? warning : null;
      }
      if (phase === 'climbing' && !isQuestionOpen) {
        if (input.wasPressed('left')) {
          lookBack();
        }
        walk(dt, input);
        updateTemptation(dt);
      } else if (phase === 'lookBack' && phaseSeconds > SCRIPT_SECONDS.lookBack) {
        enterPhase('lament');
      } else if (phase === 'lament' && phaseSeconds > SCRIPT_SECONDS.lament) {
        enterPhase('lamentQuestions');
        askLamentQuestions(2);
      }
    }

    function drawFollowers(ctx) {
      const fade = Math.max(0, 1 - phaseSeconds / 3.5);
      const groundAt = A.groundY(distance - 6);
      ctx.save();
      ctx.globalAlpha = 0.35 + 0.65 * fade;
      LM.characters.drawPerson(ctx, A.HERO_SCREEN_X - 150 - phaseSeconds * 20, groundAt, 1.6, LM.characters.looks.eurydice, 'mourn');
      ctx.restore();
      LM.characters.drawPerson(ctx, A.HERO_SCREEN_X - 260 - phaseSeconds * 30, groundAt + 10, 1.6, LM.characters.looks.hermes, 'stand');
    }

    function drawClimb(ctx) {
      A.drawTunnel(ctx, distance, elapsed);
      echoes.forEach(function (echo) { A.drawEchoStone(ctx, echo.distance, distance, elapsed, echo.state); });
      if (phase === 'lookBack') {
        drawFollowers(ctx);
      }
      const bob = phase === 'climbing' ? Math.abs(Math.sin(distance * 1.4)) * 4 : 0;
      LM.characters.drawPerson(ctx, A.HERO_SCREEN_X, A.groundY(distance) - bob, 1.9, LM.characters.looks.orpheus, 'stand');
    }

    function drawTemptation(ctx) {
      const entry = temptation.entry;
      LM.ui.drawStoryBanner(ctx, entry.text);
      if (entry.isTempting) {
        const pulse = 1 + 0.08 * Math.sin(elapsed * 10);
        LM.draw.withTransform(ctx, 150, 200, pulse, function () {
          LM.draw.drawOutlinedRoundRect(ctx, { x: -100, y: -34, width: 200, height: 68 }, 14, 'rgba(200, 40, 40, 0.8)', 3);
          LM.text.drawTextLine(ctx, '← obejrzeć się?', 0, 9, { font: LM.text.boldFont(22), color: '#ffffff', align: 'center' });
        });
      }
    }

    function render(ctx) {
      if (phase === 'lament' || phase === 'lamentQuestions') {
        A.drawThraceAtDusk(ctx, elapsed);
        LM.characters.drawPerson(ctx, 640, 520, 2.2, LM.characters.looks.orpheus, 'mourn');
        LM.ui.drawStoryBanner(ctx, LAMENT_STORY);
        return;
      }
      drawClimb(ctx);
      if (phase === 'lookBack') {
        LM.ui.drawStoryBanner(ctx, LOOK_BACK_STORY);
      } else if (warning) {
        LM.ui.drawStoryBanner(ctx, warning.text);
      } else if (temptation) {
        drawTemptation(ctx);
      }
    }

    function debugAdvance() {
      if (phase !== 'climbing') {
        phaseSeconds = 99;
        return;
      }
      const nextEcho = echoes.find(function (echo) { return echo.state === 'waiting'; });
      if (nextEcho) {
        distance = nextEcho.distance;
        askEcho(nextEcho);
      } else {
        distance = EXIT_DISTANCE;
        enterPhase('lookBack');
      }
    }

    return {
      update: update,
      render: render,
      hud: function () { return { title: 'Droga z podziemi', rightText: 'Do wyjścia: ' + Math.max(0, Math.round(EXIT_DISTANCE - distance)) + ' kroków' }; },
      keyHints: function () { return [{ keys: ['→'], label: 'idź w górę (trzymaj)' }, { keys: ['←'], label: 'tego nie naciskaj: obejrzenie się!' }]; },
      restoreCheckpoint: function () { distance = checkpoint; },
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.ascent = createAscentStage;
}(window.LM = window.LM || {}));
