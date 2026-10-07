// Stage 2 of mission 1: the duel in the heart of the labyrinth. Each round the Minotaur charges (dodge with the
// shown arrow), then a question: a right answer is a strike, a wrong one is blocked. After the last round Theseus wins.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const MAX_ROUNDS = 5;
  const INTRO_SECONDS = 2.2;
  const DODGE_WINDOW_SECONDS = 1.8;
  const ANIMATION_SECONDS = 0.9;
  const FINALE_SECONDS = 2.6;

  function createDuelStage(context) {
    const game = context.game;
    const rounds = Math.min(MAX_ROUNDS, context.remainingQuestions('duel'));
    let round = 1;
    let minotaurHealth = rounds;
    let phase = 'intro';
    let phaseTime = 0;
    let dodgeDirection = 'left';
    let heroOffset = 0;
    let message = 'W samym środku labiryntu czeka Minotaur!';
    let elapsed = 0;

    function enterPhase(nextPhase, nextMessage) {
      phase = nextPhase;
      phaseTime = 0;
      message = nextMessage;
    }

    function startCharge() {
      dodgeDirection = context.rng() < 0.5 ? 'left' : 'right';
      heroOffset = 0;
      enterPhase('charge', 'Minotaur szarżuje! Uskocz w bok!');
    }

    function onAnswered(isCorrect) {
      if (isCorrect) {
        minotaurHealth -= 1;
        game.sfx('strike');
        enterPhase('strike', 'Celny cios!');
      } else {
        enterPhase('block', 'Minotaur odparł cios…');
      }
    }

    function askRoundQuestion() {
      enterPhase('question', '');
      context.askQuestion('duel', { header: 'Pojedynek z Minotaurem · runda ' + round + '/' + rounds, attemptPolicy: 'singleAttempt' }, onAnswered);
    }

    function finishDodge(isDodged) {
      if (isDodged) {
        heroOffset = dodgeDirection === 'left' ? -150 : 150;
        game.sfx('choose');
      } else {
        context.loseHeart();
      }
      enterPhase('afterCharge', isDodged ? 'Unik!' : 'Ała! Minotaur cię trącił.');
    }

    function updateCharge(input) {
      const pressedSide = ['left', 'right'].find(function (side) { return input.wasPressed(side); });
      if (pressedSide) {
        finishDodge(pressedSide === dodgeDirection);
      } else if (phaseTime > DODGE_WINDOW_SECONDS) {
        finishDodge(false);
      }
    }

    function nextRound() {
      if (round >= rounds) {
        game.sfx('strike');
        enterPhase('finale', 'Tezeusz pokonał Minotaura!');
        return;
      }
      round += 1;
      startCharge();
    }

    function update(dt, input) {
      elapsed += dt;
      phaseTime += dt;
      if (phase === 'intro' && phaseTime > INTRO_SECONDS) {
        startCharge();
      } else if (phase === 'charge') {
        updateCharge(input);
      } else if (phase === 'afterCharge' && phaseTime > ANIMATION_SECONDS) {
        askRoundQuestion();
      } else if ((phase === 'strike' || phase === 'block') && phaseTime > ANIMATION_SECONDS) {
        nextRound();
      } else if (phase === 'finale' && phaseTime > FINALE_SECONDS) {
        context.completeStage();
      }
      heroOffset *= Math.pow(0.08, dt);
    }

    function minotaurPose() {
      if (phase === 'finale') {
        return { x: 900, y: 520, scale: 1.6, armRaise: 0, isAngry: false };
      }
      const lunge = phase === 'charge' ? Math.min(1, phaseTime / DODGE_WINDOW_SECONDS) * 220 : 0;
      const flinch = phase === 'strike' ? Math.sin(phaseTime * 30) * 8 : 0;
      return { x: 880 - lunge + flinch, y: 490, scale: 1.8, armRaise: phase === 'charge' ? 1 : 0.4, isAngry: true };
    }

    function drawHealthBar(ctx) {
      LM.ui.drawShadowText(ctx, 'Minotaur', 880, 92, 20, P.white, 'center');
      for (let segment = 0; segment < rounds; segment += 1) {
        const color = segment < minotaurHealth ? '#c8281a' : '#3a2a2a';
        LM.draw.drawOutlinedRoundRect(ctx, { x: 760 + segment * 50, y: 102, width: 42, height: 16 }, 4, color, 2);
      }
    }

    function drawDodgePrompt(ctx) {
      const pulse = 1 + 0.08 * Math.sin(elapsed * 14);
      LM.draw.withTransform(ctx, 640, 360, pulse, function () {
        LM.draw.drawOutlinedRoundRect(ctx, { x: -70, y: -60, width: 140, height: 120 }, 18, P.keyCap, 4);
        LM.text.drawTextLine(ctx, dodgeDirection === 'left' ? '←' : '→', 0, 30, { font: LM.text.boldFont(84), color: P.keyCapText, align: 'center' });
      });
      const timeLeft = Math.max(0, 1 - phaseTime / DODGE_WINDOW_SECONDS);
      LM.draw.drawOutlinedRoundRect(ctx, { x: 540, y: 440, width: 200 * timeLeft + 2, height: 12 }, 4, P.gold, 2);
    }

    function render(ctx) {
      LM.backdrops.drawLabyrinthHall(ctx, elapsed);
      const pose = minotaurPose();
      LM.creatures.drawMinotaur(ctx, pose.x, pose.y, pose.scale, pose.armRaise, pose.isAngry);
      const heroLook = LM.characters.looks.theseus;
      const heroPose = phase === 'strike' || phase === 'finale' ? 'point' : 'stand';
      LM.characters.drawPerson(ctx, 400 + heroOffset + (phase === 'strike' ? 120 : 0), 500, 2.2, heroLook, heroPose);
      drawHealthBar(ctx);
      if (message) {
        LM.ui.drawParchmentPanel(ctx, { x: 290, y: 566, width: 700, height: 70 });
        LM.text.drawTextLine(ctx, message, 640, 611, { font: LM.text.boldFont(28), color: phase === 'finale' ? '#a8500a' : P.ink, align: 'center' });
      }
      if (phase === 'charge') {
        drawDodgePrompt(ctx);
      }
    }

    function restoreCheckpoint() {
      startCharge();
    }

    function debugAdvance() {
      if (phase === 'charge') {
        finishDodge(true);
      } else if (phase === 'intro') {
        startCharge();
      } else if (phase === 'finale') {
        context.completeStage();
      }
    }

    return {
      update: update,
      render: render,
      hud: function () { return { title: 'Pojedynek z Minotaurem', rightText: 'Runda ' + round + '/' + rounds }; },
      keyHints: function () { return [{ keys: ['←', '→'], label: 'unik, gdy Minotaur szarżuje' }]; },
      restoreCheckpoint: restoreCheckpoint,
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.duel = createDuelStage;
}(window.LM = window.LM || {}));
