// All achievements: earned ones shine gold with the date, the others show what to do to earn them.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const CARD_WIDTH = 520;
  const CARD_HEIGHT = 82;
  const CARDS_TOP = 72;

  function formatDate(iso) {
    const date = new Date(iso);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  }

  function createAchievementsScene(game) {
    const profile = game.profile();
    let elapsed = 0;

    function drawCard(ctx, achievement, index) {
      const x = 90 + (index % 2) * (CARD_WIDTH + 60);
      const y = CARDS_TOP + Math.floor(index / 2) * (CARD_HEIGHT + 14);
      const earnedAt = profile.achievements[achievement.id];
      LM.ui.drawButton(ctx, { x: x, y: y, width: CARD_WIDTH, height: CARD_HEIGHT }, '', earnedAt ? 'normal' : 'disabled');
      LM.draw.drawStar(ctx, x + 40, y + CARD_HEIGHT / 2, 24, 10, earnedAt ? P.gold : '#a8a29a', 2.5);
      LM.text.drawTextLine(ctx, game.say(achievement.title), x + 78, y + 28, { font: LM.text.boldFont(19), color: earnedAt ? P.ink : '#6a645a' });
      const detail = earnedAt ? 'Zdobyte ' + formatDate(earnedAt) : achievement.description;
      LM.text.drawWrappedText(ctx, game.say(detail), x + 78, y + 50, CARD_WIDTH - 96, { font: LM.text.regularFont(15), color: earnedAt ? '#2a6a2a' : '#6a645a', lineHeight: 18 });
    }

    return {
      update: function (dt, input) {
        elapsed += dt;
        if (input.wasPressed('back') || input.wasPressed('confirm') || input.pointer.wasPressed) {
          game.show('map');
        }
      },
      render: function (ctx) {
        LM.mapPainter.drawMapBase(ctx, elapsed);
        LM.ui.drawDimmer(ctx);
        LM.data.achievements.forEach(function (achievement, index) { drawCard(ctx, achievement, index); });
        const earned = Object.keys(profile.achievements).length;
        LM.ui.drawHud(ctx, { title: 'Osiągnięcia', rightText: '★ ' + earned + '/' + LM.data.achievements.length });
        LM.ui.drawKeyHintBar(ctx, [{ keys: ['Esc'], label: 'wróć na mapę' }]);
      },
    };
  }

  LM.sceneFactories.achievements = createAchievementsScene;
}(window.LM = window.LM || {}));
