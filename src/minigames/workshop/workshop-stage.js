// Stage 1 of mission 2: in Daedalus's workshop the player hands him the right materials (feathers and wax),
// then lays the feathers from the shortest to the longest. Questions follow each step.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const MATERIALS = [
    { id: 'feathers', name: 'Ptasie pióra', isRight: true, reply: 'Tak! Ptasie pióra, jak u prawdziwych ptaków.' },
    { id: 'wax', name: 'Wosk', isRight: true, reply: 'Właśnie! Woskiem skleję pióra.' },
    { id: 'iron', name: 'Żelazne pręty', isRight: false, reply: 'Żelazo jest za ciężkie, z nim nikt nie poleci.' },
    { id: 'cloth', name: 'Płótno żaglowe', isRight: false, reply: 'Płótno to żagiel na morze, a morza pilnuje Minos.' },
    { id: 'planks', name: 'Deski', isRight: false, reply: 'Drewniane skrzydła byłyby za ciężkie.' },
    { id: 'clay', name: 'Glina', isRight: false, reply: 'Glina się kruszy, a skrzydła muszą być lekkie.' },
  ];
  const CARD_WIDTH = 176;
  const CARD_GAP = 16;
  const CARD_TOP = 500;
  const FEATHER_LENGTHS = [40, 56, 72, 88, 104, 120];
  const BUBBLE = { x: 270, y: 74, width: 600, height: 104 };

  function cardRect(index) {
    return { x: 60 + index * (CARD_WIDTH + CARD_GAP), y: CARD_TOP, width: CARD_WIDTH, height: 140 };
  }

  function createWorkshopStage(context) {
    const game = context.game;
    const materials = LM.random.shuffle(MATERIALS, context.rng).map(function (material) { return Object.assign({ state: 'onShelf' }, material); });
    let phase = 'materials';
    let cursor = 0;
    let bubbleText = 'Pomóż mi zrobić skrzydła! Podaj mi dwie rzeczy, z których je zbuduję.';
    let feathers = null;
    let isWaiting = false;
    let doneSeconds = 0;
    let elapsed = 0;

    function chosenCount() {
      return materials.filter(function (material) { return material.state === 'chosen'; }).length;
    }

    function startFeatherPhase() {
      phase = 'feathers';
      feathers = LM.featherOrder.createFeatherRow(FEATHER_LENGTHS, context.rng, game.sfx);
      bubbleText = 'Teraz ułóż pióra od najkrótszego do najdłuższego, tak jak rosną u ptaka.';
    }

    function askThen(header, next) {
      isWaiting = true;
      context.askQuestion('workshop', { header: header }, function () {
        isWaiting = false;
        next();
      });
    }

    function handMaterial(material) {
      bubbleText = material.reply;
      if (!material.isRight) {
        material.state = 'refused';
        game.sfx('back');
        return;
      }
      material.state = 'chosen';
      game.sfx('pickup');
      askThen('Warsztat Dedala · materiały', function () {
        if (chosenCount() === 2) {
          startFeatherPhase();
        }
      });
    }

    function updateMaterials(input) {
      const step = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
      cursor = (cursor + step + materials.length) % materials.length;
      const pressed = input.pressedOptionIndex();
      const clicked = input.pointer.wasPressed ? materials.findIndex(function (material, index) { return LM.ui.isPointInRect(input.pointer, cardRect(index)); }) : -1;
      const pickedIndex = [pressed, clicked].find(function (index) { return index >= 0 && index < materials.length; });
      if (pickedIndex !== undefined) {
        cursor = pickedIndex;
      }
      if ((pickedIndex !== undefined || input.wasPressed('confirm')) && materials[cursor].state === 'onShelf') {
        handMaterial(materials[cursor]);
      }
    }

    function finishWings() {
      phase = 'done';
      doneSeconds = 0;
      bubbleText = 'Skrzydła gotowe! Teraz nauczę cię latać, synu.';
      game.sfx('achievement');
    }

    function onFeathersSorted() {
      phase = 'gluing';
      bubbleText = 'Pięknie! Od najkrótszego do najdłuższego. Teraz skleję je woskiem.';
      game.sfx('correct');
      askThen('Warsztat Dedala · klejenie', function () {
        askThen('Warsztat Dedala · ostatnie pytanie', finishWings);
      });
    }

    function update(dt, input) {
      elapsed += dt;
      if (isWaiting) {
        return;
      }
      if (phase === 'materials') {
        updateMaterials(input);
      } else if (phase === 'feathers' && feathers.update(input)) {
        onFeathersSorted();
      } else if (phase === 'done') {
        doneSeconds += dt;
        if (doneSeconds > 1.8) {
          context.completeStage();
        }
      }
    }

    function cardState(material, index) {
      if (material.state === 'chosen') {
        return 'correct';
      }
      if (material.state === 'refused') {
        return 'disabled';
      }
      return index === cursor ? 'selected' : 'normal';
    }

    function drawCard(ctx, material, index) {
      const rect = cardRect(index);
      const state = cardState(material, index);
      LM.ui.drawButton(ctx, rect, '', state);
      LM.workshopItems.drawMaterialIcon(ctx, material.id, rect.x + rect.width / 2, rect.y + 78);
      LM.ui.drawNumberBadge(ctx, rect.x + 8, rect.y + 8, String(index + 1));
      const labelColor = state === 'normal' ? P.ink : P.white;
      LM.text.drawTextLine(ctx, material.name, rect.x + rect.width / 2, rect.y + 120, { font: LM.text.boldFont(18), color: labelColor, align: 'center', shadowColor: state === 'normal' ? null : P.textShadow });
    }

    function render(ctx) {
      LM.workshopArt.drawWorkshop(ctx, elapsed);
      LM.characters.drawPerson(ctx, 170, 480, 2.1, LM.characters.looks.daedalus, 'offer');
      LM.characters.drawPerson(ctx, 1150, 480, 1.7, LM.characters.looks.icarus, phase === 'done' ? 'cheer' : 'stand');
      LM.workshopItems.drawSpeechBubble(ctx, bubbleText, BUBBLE, 220, 250);
      if (phase === 'materials') {
        materials.forEach(function (material, index) { drawCard(ctx, material, index); });
      } else {
        LM.featherOrder.drawWingFrame(ctx, feathers, elapsed, phase === 'feathers' ? 'arranging' : 'glued');
      }
    }

    function debugAdvance() {
      if (phase === 'materials') {
        handMaterial(materials.find(function (material) { return material.isRight && material.state === 'onShelf'; }));
      } else if (phase === 'feathers') {
        feathers.sortForTesting();
        onFeathersSorted();
      }
    }

    return {
      update: update,
      render: render,
      hud: function () { return { title: 'Warsztat Dedala', rightText: phase === 'materials' ? 'Materiały: ' + chosenCount() + '/2' : 'Pióra' }; },
      keyHints: function () {
        return phase === 'materials' ?
          [{ keys: ['←', '→'], label: 'wybierz' }, { keys: ['Enter'], label: 'podaj Dedalowi' }] :
          [{ keys: ['←', '→'], label: 'wybierz / przesuń' }, { keys: ['Enter'], label: 'chwyć / upuść pióro' }];
      },
      restoreCheckpoint: function () {},
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.workshop = createWorkshopStage;
}(window.LM = window.LM || {}));
