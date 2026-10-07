// The hub: a map of the myths. Pick a destination (←/→ or the mouse), and the ship sails there to start
// the mission. Locked destinations hide in fog. Hovering any place shows a fact about it. Esc opens the menu.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const MP = LM.mapPainter;
  const VOYAGE_SECONDS = 1.6;
  const DESTINATIONS = [
    { placeId: 'crete', icon: 'labyrinth' },
    { placeId: 'icaria', icon: 'wings' },
    { placeId: 'thrace', icon: 'lute' },
    { placeId: 'delphi', icon: 'oracle' },
  ];
  const INFO_PANEL = { x: 16, y: 516, width: 600, height: 136 };

  function isPlainPlace(place) {
    return !place.missionId && !place.isExam;
  }

  function placeById(placeId) {
    return LM.data.mapPlaces.find(function (place) { return place.id === placeId; });
  }

  // 'locked' | 'open' | 'passed'
  function destinationStatus(profile, destination) {
    const place = placeById(destination.placeId);
    if (place.isExam) {
      if (profile.progress.isExamPassed) {
        return 'passed';
      }
      return LM.profiles.isExamUnlocked(profile) ? 'open' : 'locked';
    }
    if (LM.profiles.hasPassedMission(profile, place.missionId)) {
      return 'passed';
    }
    return LM.profiles.isMissionUnlocked(profile, place.missionId) ? 'open' : 'locked';
  }

  function destinationTitle(place) {
    if (place.isExam) {
      return 'Egzamin: ' + LM.data.exam.title;
    }
    const mission = LM.missions.byId(place.missionId);
    return 'Misja ' + mission.number + ': ' + mission.title;
  }

  const STATUS_TEXT = { locked: 'Zasnute mgłą: najpierw zalicz poprzednią misję.', open: 'Gotowe do wyprawy! Enter: płyniemy.', passed: '✔ Zaliczone. Możesz zagrać jeszcze raz.' };

  function createMapScene(game) {
    const profile = game.profile();
    let selectedIndex = Math.max(0, DESTINATIONS.findIndex(function (destination) { return destinationStatus(profile, destination) === 'open'; }));
    let hoveredPlace = null;
    let voyage = null;
    let message = null;
    let elapsed = 0;

    function shipPlace() {
      return placeById(game.shipPlaceId || LM.data.mapStart);
    }

    function setSail(destination) {
      voyage = { from: shipPlace(), to: placeById(destination.placeId), progress: 0 };
      game.sfx('choose');
    }

    function arrive() {
      game.shipPlaceId = voyage.to.id;
      if (voyage.to.isExam) {
        game.startExam();
      } else {
        game.startMission(voyage.to.missionId);
      }
    }

    function choose(destination) {
      if (destinationStatus(profile, destination) === 'locked') {
        message = { text: 'Ta wyprawa jest jeszcze zasnuta mgłą. Najpierw zalicz poprzednią misję!', seconds: 2.5 };
        game.sfx('back');
        return;
      }
      setSail(destination);
    }

    function placeAtPointer(pointer) {
      return LM.data.mapPlaces.find(function (place) { return Math.hypot(pointer.x - place.x, pointer.y - place.y) < 34; }) || null;
    }

    function updatePointer(pointer) {
      if (pointer.hasMoved) {
        hoveredPlace = placeAtPointer(pointer);
      }
      const destinationIndex = hoveredPlace ? DESTINATIONS.findIndex(function (destination) { return destination.placeId === hoveredPlace.id; }) : -1;
      if (destinationIndex >= 0) {
        selectedIndex = destinationIndex;
      }
      if (pointer.wasPressed && destinationIndex >= 0) {
        choose(DESTINATIONS[destinationIndex]);
      }
    }

    function updateSelection(input) {
      const step = input.pressedStep('left', 'right') + input.pressedStep('up', 'down');
      if (step !== 0) {
        selectedIndex = (selectedIndex + step + DESTINATIONS.length) % DESTINATIONS.length;
        hoveredPlace = null;
        game.sfx('move');
      }
      if (input.wasPressed('confirm')) {
        choose(DESTINATIONS[selectedIndex]);
      }
    }

    function update(dt, input) {
      elapsed += dt;
      message = LM.timed.tick(message, dt);
      if (voyage) {
        voyage.progress += dt / VOYAGE_SECONDS;
        if (voyage.progress >= 1) {
          arrive();
        }
        return;
      }
      if (input.wasPressed('back')) {
        game.scenes.pushOverlay(LM.mapMenu.createMapMenuOverlay(game));
        return;
      }
      updateSelection(input);
      updatePointer(input.pointer);
    }

    function shipPosition() {
      if (!voyage) {
        return shipPlace();
      }
      const t = Math.min(1, voyage.progress);
      const bend = Math.sin(t * Math.PI) * 40;
      return { x: voyage.from.x + (voyage.to.x - voyage.from.x) * t, y: voyage.from.y + (voyage.to.y - voyage.from.y) * t - bend };
    }

    function drawDestinations(ctx) {
      DESTINATIONS.forEach(function (destination, index) {
        const place = placeById(destination.placeId);
        const status = destinationStatus(profile, destination);
        MP.drawMedallion(ctx, place.x, place.y, destination.icon, index === selectedIndex ? 'selected' : 'idle', elapsed);
        MP.drawDestinationLabel(ctx, place);
        if (status === 'locked') {
          MP.drawFog(ctx, place.x, place.y, elapsed);
        } else if (status === 'passed') {
          LM.draw.drawOutlinedCircle(ctx, place.x + 26, place.y - 24, 12, P.correct, 2);
          LM.text.drawTextLine(ctx, '✔', place.x + 26, place.y - 18, { font: LM.text.boldFont(15), color: P.white, align: 'center' });
        }
      });
    }

    function drawInfoPanel(ctx) {
      const isDestinationInfo = !hoveredPlace || hoveredPlace.missionId || hoveredPlace.isExam;
      const place = isDestinationInfo ? placeById(DESTINATIONS[selectedIndex].placeId) : hoveredPlace;
      LM.ui.drawParchmentPanel(ctx, INFO_PANEL);
      const title = isDestinationInfo ? place.name + ' · ' + destinationTitle(place) : place.name;
      LM.text.drawTextLine(ctx, title, INFO_PANEL.x + 18, INFO_PANEL.y + 30, { font: LM.text.boldFont(20), color: P.ink });
      let y = INFO_PANEL.y + 58;
      if (isDestinationInfo) {
        LM.text.drawTextLine(ctx, STATUS_TEXT[destinationStatus(profile, DESTINATIONS[selectedIndex])], INFO_PANEL.x + 18, y, { font: LM.text.boldFont(16), color: '#a8500a' });
        y += 24;
      }
      LM.text.drawWrappedText(ctx, place.fact, INFO_PANEL.x + 18, y, INFO_PANEL.width - 36, { font: LM.text.regularFont(17), color: P.inkSoft, lineHeight: 22 });
    }

    function render(ctx) {
      MP.drawMapBase(ctx, elapsed);
      LM.data.mapPlaces.filter(isPlainPlace).forEach(function (place) {
        MP.drawPlaceLabel(ctx, place, place === hoveredPlace ? 'highlighted' : 'normal');
      });
      drawDestinations(ctx);
      const ship = shipPosition();
      LM.scenery.drawShip(ctx, ship.x + 34, ship.y + 40, 0.3, '#f4eee0', elapsed);
      drawInfoPanel(ctx);
      if (message) {
        LM.ui.drawStoryBanner(ctx, message.text);
      }
      const earned = Object.keys(profile.achievements).length;
      LM.ui.drawHud(ctx, { title: game.say('Mapa mitów · ' + profile.name), rightText: '★ ' + earned + '/' + LM.data.achievements.length });
      LM.ui.drawKeyHintBar(ctx, [
        { keys: ['←', '→'], label: 'wybierz wyprawę' },
        { keys: ['Enter'], label: 'płyń' },
        { keys: ['Esc'], label: 'menu' },
      ], 'Najedź myszą na miejsce: ciekawostka');
    }

    return {
      enter: function () { game.playTheme('map'); },
      update: update,
      render: render,
    };
  }

  LM.sceneFactories.map = createMapScene;
}(window.LM = window.LM || {}));
