// The end of the game after passing the exam: the heroes celebrate and the player's achievements are counted.
(function (LM) {
  'use strict';

  const P = LM.palette;

  function createEndingScene(game) {
    const profile = game.profile();
    const earned = Object.keys(profile.achievements).length;
    const message = game.say('Gratulacje, ' + profile.name + '! Prze{szedłeś|szłaś} labirynt Minotaura, ' +
      'przeleciał{eś|aś} nad morzem z Dedalem i wyprowadził{eś|aś} Orfeusza z podziemi. Pytia ogłasza cię znawc{ą|zynią} mitów!');
    let elapsed = 0;

    function update(dt, input) {
      elapsed += dt;
      if (elapsed > 1.5 && (input.wasPressed('confirm') || input.wasPressed('back') || input.pointer.wasPressed)) {
        game.show('map');
      }
    }

    function render(ctx) {
      LM.illustrations.finale(ctx, elapsed);
      LM.ui.drawTitleText(ctx, game.say('Znawc{a|zyni} mitów!'), 640, 130, 76);
      LM.ui.drawParchmentPanel(ctx, { x: 150, y: 500, width: 980, height: 150 });
      LM.text.drawWrappedText(ctx, message, 640, 540, 920, { font: LM.text.boldFont(22), color: P.ink, lineHeight: 30, align: 'center' });
      LM.text.drawTextLine(ctx, 'Zdobyte osiągnięcia: ' + earned + ' z ' + LM.data.achievements.length, 640, 632, { font: LM.text.boldFont(20), color: '#a8500a', align: 'center' });
      LM.ui.drawKeyHintBar(ctx, [{ keys: ['Enter'], label: 'wróć na mapę' }], 'Mity według „Mitologii” Jana Parandowskiego');
    }

    return {
      enter: function () {
        game.playTheme('title');
        game.sfx('achievement');
      },
      update: update,
      render: render,
    };
  }

  LM.sceneFactories.ending = createEndingScene;
}(window.LM = window.LM || {}));
