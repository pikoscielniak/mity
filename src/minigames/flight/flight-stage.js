// Stage 2 of mission 2: the flight from Crete. The player keeps Icarus in the middle of the sky (the father's
// advice), dodges gulls, gathers feathers and catches question scrolls. Then, as in the myth, Icarus climbs too
// high and falls; the player flies on as Daedalus to Sicily.
(function (LM) {
  'use strict';

  const F = LM.flightModel;
  const R = LM.flightRender;
  const FLYER_X = 330;
  const TOUCH_DISTANCE = 52;
  const SCROLL_INTERVAL = 7;
  const SCRIPTED_SECONDS = { climb: 4, fall: 3.2, arrive: 2.6 };
  const ICARUS_ISLANDS = [
    { afterScroll: 2, name: 'Samos', width: 300, height: 90 },
    { afterScroll: 4, name: 'Paros', width: 260, height: 80 },
    { afterScroll: 6, name: 'Delos', width: 220, height: 70 },
  ];
  const DAEDALUS_ISLANDS = [
    { afterScroll: 0, name: 'Ikaria', width: 280, height: 90 },
    { afterScroll: 2, name: 'Sycylia', width: 520, height: 150, hasTemple: true },
  ];
  const BANNERS = {
    climb: 'W micie Ikar, zachwycony lotem, zapomniał o radzie ojca i wzbijał się coraz wyżej…',
    fall: '…słońce stopiło wosk, pióra odpadły i Ikar spadł. Dedal leci dalej sam.',
    daedalus: 'Teraz prowadzisz Dedala na Sycylię. Trzymaj się środka nieba!',
  };

  function distance(firstX, firstY, secondX, secondY) {
    return Math.hypot(firstX - secondX, firstY - secondY);
  }

  function createFlightStage(context) {
    const game = context.game;
    const rng = context.rng;
    const flyer = F.createFlyer(F.SAFE_MIDDLE_Y);
    const legs = {
      icarus: { slot: 'flight', look: LM.characters.looks.icarus, islands: ICARUS_ISLANDS, total: Math.min(6, context.remainingQuestions('flight')) },
      daedalus: { slot: 'ending', look: LM.characters.looks.daedalus, islands: DAEDALUS_ISLANDS, total: Math.min(2, context.remainingQuestions('ending')) },
    };
    let phase = 'icarus';
    let phaseSeconds = 0;
    let scrollsCaught = 0;
    let gulls = [];
    let feathers = [];
    let islands = [];
    let scroll = null;
    let sinceScroll = 0;
    let nextGullIn = 3;
    let nextFeatherIn = 1.5;
    let warning = null;
    let elapsed = 0;

    function leg() {
      return legs[phase];
    }

    function isPlayerFlying() {
      return phase === 'icarus' || phase === 'daedalus';
    }

    function enterPhase(nextPhase) {
      phase = nextPhase;
      phaseSeconds = 0;
      if (isPlayerFlying()) {
        scrollsCaught = 0;
        sinceScroll = SCROLL_INTERVAL - 2;
        islands = [];
        flyer.y = F.SAFE_MIDDLE_Y;
        showIslandsAfter(0);
      }
    }

    function showIslandsAfter(scrollCount) {
      leg().islands.filter(function (island) { return island.afterScroll === scrollCount; }).forEach(function (island) {
        islands.push(Object.assign({ x: 1500 }, island));
      });
    }

    function hurt(message) {
      if (context.isRecovering()) {
        return;
      }
      warning = { text: message, seconds: 2 };
      context.loseHeart();
    }

    function spawnTraffic(dt) {
      nextGullIn -= dt;
      nextFeatherIn -= dt;
      if (nextGullIn <= 0) {
        gulls.push({ x: 1340, y: 160 + rng() * 380, speed: 190 + rng() * 70 });
        nextGullIn = 3.2 + rng() * 2;
      }
      if (nextFeatherIn <= 0 && phase === 'icarus') {
        feathers.push({ x: 1340, y: F.HOT_LIMIT + 30 + rng() * (F.WET_LIMIT - F.HOT_LIMIT - 60) });
        LM.missionRun.addToStat(context.run, 'feathersTotal', 1);
        nextFeatherIn = 2.2 + rng();
      }
    }

    function moveTraffic(dt) {
      gulls.forEach(function (gull) { gull.x -= gull.speed * dt; });
      feathers.forEach(function (feather) { feather.x -= 170 * dt; });
      islands.forEach(function (island) { island.x -= 70 * dt; });
      gulls = gulls.filter(function (gull) { return gull.x > -60; });
      feathers = feathers.filter(function (feather) { return feather.x > -40; });
    }

    function checkTouches() {
      const hitGull = gulls.find(function (gull) { return distance(gull.x, gull.y, FLYER_X, flyer.y) < TOUCH_DISTANCE; });
      if (hitGull) {
        gulls = gulls.filter(function (gull) { return gull !== hitGull; });
        hurt('Uwaga na mewy!');
      }
      const caught = feathers.filter(function (feather) { return distance(feather.x, feather.y, FLYER_X, flyer.y) < TOUCH_DISTANCE; });
      if (caught.length > 0) {
        feathers = feathers.filter(function (feather) { return caught.indexOf(feather) < 0; });
        LM.missionRun.addToStat(context.run, 'feathersCollected', caught.length);
        game.sfx('pickup');
      }
    }

    function catchScroll() {
      scroll = null;
      sinceScroll = 0;
      game.sfx('page');
      context.askQuestion(leg().slot, { header: 'Zwój ' + (scrollsCaught + 1) + '/' + leg().total }, function () {
        scrollsCaught += 1;
        showIslandsAfter(scrollsCaught);
      });
    }

    // Scrolls drift towards the flyer, so catching one never needs precise flying.
    function updateScroll(dt) {
      sinceScroll += dt;
      if (!scroll && scrollsCaught < leg().total && sinceScroll >= SCROLL_INTERVAL) {
        scroll = { x: 1340, y: F.SAFE_MIDDLE_Y };
      }
      if (!scroll) {
        return;
      }
      scroll.x -= 150 * dt;
      if (scroll.x < 900) {
        scroll.y += (flyer.y - scroll.y) * Math.min(1, 2.5 * dt);
      }
      if (distance(scroll.x, scroll.y, FLYER_X, flyer.y) < TOUCH_DISTANCE + 10) {
        catchScroll();
      }
    }

    function finishLegIfDone() {
      const isDone = scrollsCaught >= leg().total && !scroll && sinceScroll > 4;
      if (isDone) {
        gulls = [];
        feathers = [];
        enterPhase(phase === 'icarus' ? 'climb' : 'arrive');
      }
    }

    function fly(dt, input) {
      const steer = input.heldStep('up', 'down');
      F.steerFlyer(flyer, steer, dt);
      const danger = F.updateDangers(flyer, dt);
      if (danger === 'waxMelted') {
        hurt('Za blisko słońca! Wosk się topi.');
      } else if (danger === 'feathersSoaked') {
        hurt('Za nisko! Pióra nasiąkły wodą.');
      }
      if (F.altitudeZone(flyer.y) !== 'safe') {
        LM.missionRun.addToStat(context.run, 'secondsOutsideZone', dt);
      }
      spawnTraffic(dt);
      moveTraffic(dt);
      checkTouches();
      updateScroll(dt);
      finishLegIfDone();
    }

    function playScript(dt) {
      if (phase === 'climb') {
        flyer.y = Math.max(F.SKY_TOP, flyer.y - 70 * dt);
      } else if (phase === 'fall') {
        flyer.y += 260 * dt;
      }
      moveTraffic(dt);
      if (phaseSeconds < SCRIPTED_SECONDS[phase]) {
        return;
      }
      if (phase === 'climb') {
        enterPhase('fall');
      } else if (phase === 'fall') {
        enterPhase('daedalus');
      } else {
        context.completeStage();
      }
    }

    function update(dt, input) {
      elapsed += dt;
      phaseSeconds += dt;
      warning = LM.timed.tick(warning, dt);
      if (isPlayerFlying()) {
        fly(dt, input);
      } else {
        playScript(dt);
      }
    }

    function heroWings() {
      if (phase === 'fall') {
        return { flap: 0.9 + Math.sin(elapsed * 7) * 0.3, tilt: Math.min(2.6, phaseSeconds * 1.2), pose: 'cheer', featherCount: Math.max(0, 6 - Math.floor(phaseSeconds * 3)) };
      }
      const melting = phase === 'climb' || flyer.wax > 0.3;
      return { flap: LM.winged.flapAt(elapsed, 4), tilt: 0.3 + flyer.velocity * 0.0012, isMelting: melting, pose: phase === 'climb' ? 'cheer' : 'stand' };
    }

    function drawFlyers(ctx) {
      const heroLook = phase === 'daedalus' || phase === 'arrive' ? legs.daedalus.look : legs.icarus.look;
      if (phase === 'icarus' || phase === 'climb' || phase === 'fall') {
        LM.winged.drawFlyer(ctx, 700, 300 + Math.sin(elapsed * 1.5) * 18, 0.65, legs.daedalus.look, { flap: LM.winged.flapAt(elapsed, 3), tilt: 0.3 }, elapsed);
      }
      if (!context.isBlinking()) {
        LM.winged.drawFlyer(ctx, FLYER_X, flyer.y, 0.75, heroLook, heroWings(), elapsed);
      }
      if (phase === 'climb' || phase === 'fall') {
        LM.winged.drawFallingFeathers(ctx, { x: FLYER_X - 120, y: flyer.y - 60, width: 260, height: 260 }, 5, elapsed);
      }
    }

    function drawTraffic(ctx) {
      islands.forEach(function (island) { R.drawIslandOnHorizon(ctx, island); });
      feathers.forEach(function (feather) { LM.props.drawFeather(ctx, feather.x, feather.y + Math.sin(elapsed * 3 + feather.x) * 6, 2.6, -0.5); });
      gulls.forEach(function (gull) { LM.winged.drawGull(ctx, gull.x, gull.y, 1.3, elapsed); });
      if (scroll) {
        LM.props.drawQuestionScroll(ctx, scroll.x, scroll.y, 0.8, elapsed);
      }
    }

    function bannerText() {
      if (phase === 'daedalus' && phaseSeconds < 4) {
        return BANNERS.daedalus;
      }
      return BANNERS[phase] || (warning ? warning.text : null);
    }

    function render(ctx) {
      R.drawFlightSky(ctx, elapsed, phase === 'daedalus' || phase === 'arrive' ? 'dusk' : 'day');
      R.drawZones(ctx);
      drawTraffic(ctx);
      R.drawSeaBelow(ctx, elapsed);
      drawFlyers(ctx);
      R.drawAltimeter(ctx, flyer.y);
      R.drawDangerMeter(ctx, FLYER_X, flyer.y - 96, flyer.wax, '#ff7a2a', 'wosk się topi!');
      R.drawDangerMeter(ctx, FLYER_X, flyer.y + 70, flyer.wetness, '#3a8ae8', 'pióra mokną!');
      const text = bannerText();
      if (text) {
        LM.ui.drawStoryBanner(ctx, text);
      }
    }

    function restoreCheckpoint() {
      flyer.y = F.SAFE_MIDDLE_Y;
      flyer.wax = 0;
      flyer.wetness = 0;
      gulls = [];
    }

    function debugAdvance() {
      if (!isPlayerFlying()) {
        phaseSeconds = 99;
      } else if (scrollsCaught < leg().total) {
        catchScroll();
      } else {
        sinceScroll = 99;
      }
    }

    function hud() {
      const title = phase === 'daedalus' || phase === 'arrive' ? 'Dedal leci na Sycylię' : 'Lot nad morzem';
      const total = isPlayerFlying() ? leg().total : 0;
      const stats = context.run.stats;
      return {
        title: title,
        rightText: total > 0 ? 'Zwoje: ' + scrollsCaught + '/' + total : '',
        bottomText: 'Pióra: ' + (stats.feathersCollected || 0) + '/' + (stats.feathersTotal || 0),
      };
    }

    enterPhase('icarus');

    return {
      update: update,
      render: render,
      hud: hud,
      keyHints: function () { return [{ keys: ['↑', '↓'], label: 'leć w górę / w dół, trzymaj się środka' }]; },
      restoreCheckpoint: restoreCheckpoint,
      debugAdvance: debugAdvance,
    };
  }

  LM.stageFactories.flight = createFlightStage;
}(window.LM = window.LM || {}));
