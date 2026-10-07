// Stage 1 of mission 3: Orpheus plays his lute to Charon, Cerberus and Hades. Notes fall slowly down four
// strings (the arrow keys); playing most of them charms the guardian. Two questions follow each guardian.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const J = LM.rhythmJudge;
  const LANE_X = [470, 560, 650, 740];
  const LANE_KEYS = ['left', 'down', 'up', 'right'];
  const LANE_LABELS = ['←', '↓', '↑', '→'];
  const LANE_COLORS = ['#ffd84a', '#5ad8c8', '#ff8ab0', '#8ad85a'];
  const SPAWN_Y = 110;
  const HIT_Y = 560;
  const LEAD_SECONDS = 2.4;
  const CHARMED_SHARE = 0.6;
  const BANNER_SECONDS = 2.8;
  const QUESTIONS_PER_GUARDIAN = 2;
  const STORY = {
    charon: { intro: 'Charon przewozi przez Styks tylko dusze zmarłych. Zagraj mu na lutni!', charmed: 'Charon, oczarowany muzyką, przewozi Orfeusza za darmo!' },
    cerberus: { intro: 'Bramy pilnuje trójgłowy Cerber. Uśpij go spokojną melodią!', charmed: 'Cerber nie szczeknął ani razu. Brama wolna!' },
    hades: { intro: 'Przed tronem Hadesa zaśpiewaj o swojej miłości i tęsknocie.', charmed: 'Płaczą nawet Erynie. Hades się zgadza!' },
  };

  function createLyreStage(context) {
    const game = context.game;
    const charts = LM.data.lyreCharts;
    let guardianIndex = 0;
    let phase = 'intro';
    let phaseSeconds = 0;
    let songClock = 0;
    let notes = [];
    let popups = [];
    let questionsLeftHere = 0;
    let elapsed = 0;

    function chart() {
      return charts[guardianIndex];
    }

    function enterPhase(nextPhase) {
      phase = nextPhase;
      phaseSeconds = 0;
    }

    function startSong() {
      songClock = 0;
      notes = J.scheduleChart(chart(), LEAD_SECONDS);
      game.audio.duckMusic();
      enterPhase('playing');
    }

    function playString(lane) {
      const audio = game.audio;
      if (audio.isReady()) {
        const frequency = LM.notes.midiToFrequency(LM.notes.noteNameToMidi(LM.data.lyreStrings[lane]));
        LM.instruments.lute(audio.context(), audio.bus('sfx'), frequency, audio.context().currentTime, 1, 0.9);
      }
    }

    function showPopup(lane, text) {
      popups.push({ x: LANE_X[lane], text: text, seconds: 0.8 });
    }

    function pressLanes(input) {
      LANE_KEYS.forEach(function (key, lane) {
        if (!input.wasPressed(key)) {
          return;
        }
        const note = J.judgePress(notes, lane, songClock);
        if (note) {
          playString(lane);
          showPopup(lane, note.result === 'great' ? 'Pięknie!' : 'Dobrze');
        }
      });
    }

    function finishSong() {
      game.audio.restoreMusic();
      if (J.hitShare(notes) >= CHARMED_SHARE) {
        game.sfx('correct');
        enterPhase('charmed');
      } else {
        context.loseHeart();
        enterPhase('failed');
      }
    }

    function updateSong(dt, input) {
      songClock += dt;
      pressLanes(input);
      J.markMissed(notes, songClock).forEach(function (note) {
        LM.missionRun.addToStat(context.run, 'notesMissed', 1);
        showPopup(note.lane, 'Ups');
      });
      if (notes.every(function (note) { return note.result !== null; })) {
        finishSong();
      }
    }

    function askGuardianQuestions() {
      if (questionsLeftHere <= 0 || context.remainingQuestions('guardian') === 0) {
        nextGuardian();
        return;
      }
      questionsLeftHere -= 1;
      const header = chart().title + ' · pytanie ' + (QUESTIONS_PER_GUARDIAN - questionsLeftHere) + '/' + QUESTIONS_PER_GUARDIAN;
      context.askQuestion('guardian', { header: header }, askGuardianQuestions);
    }

    function nextGuardian() {
      guardianIndex += 1;
      if (guardianIndex >= charts.length) {
        context.completeStage();
        return;
      }
      enterPhase('intro');
    }

    function update(dt, input) {
      elapsed += dt;
      phaseSeconds += dt;
      popups.forEach(function (popup) { popup.seconds -= dt; });
      popups = popups.filter(function (popup) { return popup.seconds > 0; });
      if (phase === 'playing') {
        updateSong(dt, input);
      } else if (phase === 'intro' && phaseSeconds > BANNER_SECONDS) {
        startSong();
      } else if (phase === 'failed' && phaseSeconds > BANNER_SECONDS) {
        enterPhase('intro');
      } else if (phase === 'charmed' && phaseSeconds > BANNER_SECONDS) {
        enterPhase('questions');
        questionsLeftHere = QUESTIONS_PER_GUARDIAN;
        askGuardianQuestions();
      }
    }

    function noteY(note) {
      return HIT_Y - (note.time - songClock) * (HIT_Y - SPAWN_Y) / LEAD_SECONDS;
    }

    function drawLanes(ctx) {
      LM.draw.fillRoundRect(ctx, { x: 420, y: 90, width: 370, height: 500 }, 18, 'rgba(10, 5, 25, 0.45)');
      LANE_X.forEach(function (x, lane) {
        LM.draw.drawLine(ctx, x, 100, x, HIT_Y + 20, 'rgba(255, 246, 200, 0.5)', 2);
        LM.draw.drawOutlinedCircle(ctx, x, HIT_Y, 26, 'rgba(255, 255, 255, 0.15)', 3);
        LM.text.drawTextLine(ctx, LANE_LABELS[lane], x, HIT_Y + 10, { font: LM.text.boldFont(26), color: P.white, align: 'center' });
      });
      notes.filter(function (note) { return note.result === null; }).forEach(function (note) {
        const y = noteY(note);
        if (y >= SPAWN_Y - 30) {
          LM.draw.drawOutlinedCircle(ctx, LANE_X[note.lane], y, 22, LANE_COLORS[note.lane], 3);
          LM.text.drawTextLine(ctx, LANE_LABELS[note.lane], LANE_X[note.lane], y + 9, { font: LM.text.boldFont(24), color: P.ink, align: 'center' });
        }
      });
      popups.forEach(function (popup) {
        LM.ui.drawShadowText(ctx, popup.text, popup.x, HIT_Y - 60 - (0.8 - popup.seconds) * 40, 20, P.gold, 'center');
      });
    }

    function charm() {
      if (phase === 'charmed' || phase === 'questions') {
        return 1;
      }
      return phase === 'playing' ? J.hitShare(notes) : 0;
    }

    function bannerText() {
      const story = STORY[chart().guardian];
      if (phase === 'intro') {
        return story.intro;
      }
      if (phase === 'failed') {
        return 'Strażnik jeszcze się nie dał oczarować. Zagraj raz jeszcze, spokojnie!';
      }
      return phase === 'charmed' ? story.charmed : null;
    }

    function render(ctx) {
      LM.underworldArt.drawCavern(ctx, elapsed);
      LM.characters.drawPerson(ctx, 220, 560, 2.1, LM.characters.looks.orpheus, 'offer');
      LM.underworldArt.drawGuardian(ctx, chart().guardian, charm(), elapsed);
      drawLanes(ctx);
      const text = bannerText();
      if (text) {
        LM.ui.drawStoryBanner(ctx, text);
      }
    }

    function debugAdvance() {
      if (phase === 'playing') {
        notes.forEach(function (note) { note.result = 'great'; });
      } else {
        phaseSeconds = BANNER_SECONDS + 1;
      }
    }

    return {
      update: update,
      render: render,
      hud: function () {
        return { title: chart().title, rightText: 'Strażnik ' + (guardianIndex + 1) + '/' + charts.length };
      },
      keyHints: function () { return [{ keys: LANE_LABELS, label: 'graj na strunach, gdy nuta dotknie kółka' }]; },
      restoreCheckpoint: function () { enterPhase('intro'); },
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.lyre = createLyreStage;
}(window.LM = window.LM || {}));
