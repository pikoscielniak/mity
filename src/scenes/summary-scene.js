// After a mission or the exam: the score, new achievements, the mistakes with corrections, and "Warto zapamiętać".
(function (LM) {
  'use strict';

  const P = LM.palette;
  const PANEL = { x: 90, y: 74, width: 1100, height: 572 };
  const ITEM_GAP = 18;

  function questionText(question) {
    return question.type === 'truefalse' ? '„' + question.statement + '”' : question.prompt;
  }

  function drawScoreBar(ctx, percent, x, y, width) {
    const thresholdPercent = Math.round(LM.missionRun.PASS_THRESHOLD * 100);
    LM.ui.drawMeter(ctx, { x: x, y: y, width: width, height: 34 }, percent / 100, percent >= thresholdPercent ? P.correct : P.wrong);
    const thresholdX = x + width * LM.missionRun.PASS_THRESHOLD;
    LM.draw.drawLine(ctx, thresholdX, y - 8, thresholdX, y + 42, P.ink, 3);
    LM.text.drawTextLine(ctx, 'próg ' + thresholdPercent + '%', thresholdX, y + 64, { font: LM.text.boldFont(16), color: P.inkSoft, align: 'center' });
  }

  function attemptDetails(run) {
    const hearts = 'Utracone serca: ' + run.heartsLost;
    return run.hintBudget > 0 ? 'Użyte zwoje: ' + run.hintsUsed + ' z ' + run.hintBudget + '     ' + hearts : hearts;
  }

  // params: { scoreTitle, run, isPassed, newAchievements, concepts, backgroundIllustration, choices: [{ label, onChoose() }] }
  function createSummaryScene(game, params) {
    const run = params.run;
    const mistakes = LM.missionRun.wrongAnswers(run);
    const pages = ['score'].concat(mistakes.length > 0 ? ['mistakes'] : [], params.concepts.length > 0 ? ['concepts'] : []);
    let pageIndex = 0;
    let scroll = 0;
    let elapsed = 0;
    let finalMenu = null;

    function drawScorePage(ctx, content) {
      const percent = LM.missionRun.scorePercent(run);
      const title = params.isPassed ? 'Zaliczone! Brawo, ' + game.profile().name + '!' : 'Tym razem się nie udało, ale spróbuj jeszcze raz!';
      LM.text.drawWrappedText(ctx, title, 640, content.y + 30, content.width, { font: LM.text.boldFont(30), color: params.isPassed ? P.correct : P.wrong, lineHeight: 36, align: 'center' });
      LM.text.drawTextLine(ctx, 'Dobre odpowiedzi za pierwszym razem: ' + LM.missionRun.correctCount(run) + ' z ' + run.answers.length + ' (' + percent + '%)', 640, content.y + 100, { font: LM.text.boldFont(22), color: P.ink, align: 'center' });
      drawScoreBar(ctx, percent, 290, content.y + 124, 700);
      LM.text.drawTextLine(ctx, attemptDetails(run), 640, content.y + 236, { font: LM.text.regularFont(20), color: P.inkSoft, align: 'center' });
      drawNewAchievements(ctx, content.y + 280);
    }

    // Up to three rows in two columns, so the list never reaches the button below.
    function drawNewAchievements(ctx, top) {
      if (params.newAchievements.length > 0) {
        LM.text.drawTextLine(ctx, 'Nowe osiągnięcia:', 640, top, { font: LM.text.boldFont(21), color: P.ink, align: 'center' });
      }
      params.newAchievements.forEach(function (achievement, index) {
        const x = 170 + (index % 2) * 480;
        const y = top + 22 + Math.floor(index / 2) * 44;
        LM.draw.drawStar(ctx, x, y + 14, 17, 7.5, P.gold, 2.5);
        LM.text.drawTextLine(ctx, game.say(achievement.title), x + 28, y + 22, { font: LM.text.boldFont(20), color: P.ink });
      });
    }

    function drawList(ctx, content, entries) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(content.x, content.y, content.width, content.height - 70);
      ctx.clip();
      let y = content.y + 24 - scroll;
      entries.forEach(function (entry) {
        y += LM.text.drawWrappedText(ctx, entry.title, content.x, y, content.width, { font: LM.text.boldFont(20), color: P.ink, lineHeight: 26 });
        y += LM.text.drawWrappedText(ctx, entry.body, content.x + 20, y, content.width - 20, { font: LM.text.regularFont(19), color: entry.bodyColor || P.inkSoft, lineHeight: 25 }) + ITEM_GAP;
      });
      ctx.restore();
    }

    function mistakeEntries() {
      return mistakes.map(function (question) {
        return {
          title: game.say(questionText(question)),
          body: '✔ ' + LM.answerCheck.correctAnswerText(question) + ' — ' + game.say(question.explanation),
          bodyColor: '#2a6a2a',
        };
      });
    }

    function conceptEntries() {
      return params.concepts.map(function (concept) { return { title: concept.term, body: concept.definition }; });
    }

    const PAGE_TITLES = { score: params.scoreTitle, mistakes: 'Twoje błędy i poprawne odpowiedzi', concepts: 'Warto zapamiętać' };

    function isLastPage() {
      return pageIndex === pages.length - 1;
    }

    function buildFinalMenu() {
      const width = 380;
      const left = 640 - (params.choices.length * (width + 20) - 20) / 2;
      return params.choices.map(function (choice, index) {
        return Object.assign({ rect: { x: left + index * (width + 20), y: 578, width: width, height: 54 } }, choice);
      });
    }

    function updateFinalMenu(input) {
      if (input.wasPressed('left') || input.wasPressed('right')) {
        finalMenu.selected = (finalMenu.selected + 1) % finalMenu.items.length;
      }
      const clicked = finalMenu.items.find(function (item) { return input.pointer.wasPressed && LM.ui.isPointInRect(input.pointer, item.rect); });
      if (clicked || input.wasPressed('confirm')) {
        (clicked || finalMenu.items[finalMenu.selected]).onChoose();
      }
    }

    function update(dt, input) {
      elapsed += dt;
      if (input.isHeld('down')) {
        scroll += dt * 300;
      }
      if (input.isHeld('up')) {
        scroll = Math.max(0, scroll - dt * 300);
      }
      if (finalMenu) {
        updateFinalMenu(input);
      } else if (input.wasPressed('confirm') || input.pointer.wasPressed) {
        game.sfx('page');
        if (isLastPage()) {
          finalMenu = { items: buildFinalMenu(), selected: 0 };
        } else {
          pageIndex += 1;
          scroll = 0;
        }
      }
    }

    function drawFooter(ctx) {
      if (!finalMenu) {
        LM.ui.drawButton(ctx, { x: 450, y: 578, width: 380, height: 54 }, 'Dalej', 'selected', 24);
        return;
      }
      finalMenu.items.forEach(function (item, index) {
        LM.ui.drawButton(ctx, item.rect, item.label, index === finalMenu.selected ? 'selected' : 'normal', 22);
      });
    }

    function render(ctx) {
      LM.illustrations[params.backgroundIllustration](ctx, elapsed);
      LM.ui.drawDimmer(ctx);
      const content = LM.ui.drawTitledPanel(ctx, PANEL, PAGE_TITLES[pages[pageIndex]] + '  (' + (pageIndex + 1) + '/' + pages.length + ')');
      if (pages[pageIndex] === 'score') {
        drawScorePage(ctx, content);
      } else {
        drawList(ctx, content, pages[pageIndex] === 'mistakes' ? mistakeEntries() : conceptEntries());
      }
      drawFooter(ctx);
      LM.ui.drawKeyHintBar(ctx, [{ keys: ['Enter'], label: 'dalej' }, { keys: ['↑', '↓'], label: 'przewijanie' }]);
    }

    return { update: update, render: render };
  }

  LM.sceneFactories.summary = createSummaryScene;
}(window.LM = window.LM || {}));
