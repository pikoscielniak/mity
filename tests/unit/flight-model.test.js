const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load-game');

const LM = loadGame();
const F = LM.flightModel;
const STEP = 1 / 60;

function middleOfSafeZone() {
  return (F.HOT_LIMIT + F.WET_LIMIT) / 2;
}

test('altitude zones follow the father\'s advice: not too high, not too low', function () {
  assert.equal(F.altitudeZone(F.HOT_LIMIT - 1), 'tooHigh');
  assert.equal(F.altitudeZone(middleOfSafeZone()), 'safe');
  assert.equal(F.altitudeZone(F.WET_LIMIT + 1), 'tooLow');
});

test('an autopilot that keeps to the middle flies a minute without any danger', function () {
  const flyer = F.createFlyer(F.HOT_LIMIT + 10);
  for (let frame = 0; frame < 60 * 60; frame += 1) {
    const steer = Math.max(-1, Math.min(1, (middleOfSafeZone() - flyer.y) / 60));
    F.steerFlyer(flyer, steer, STEP);
    assert.equal(F.updateDangers(flyer, STEP), null);
  }
  assert.ok(Math.abs(flyer.y - middleOfSafeZone()) < 5);
});

test('climbing towards the sun melts the wax after a few seconds, not at once', function () {
  const flyer = F.createFlyer(middleOfSafeZone());
  let event = null;
  let seconds = 0;
  while (!event && seconds < 10) {
    F.steerFlyer(flyer, -1, STEP);
    event = F.updateDangers(flyer, STEP);
    seconds += STEP;
  }
  assert.equal(event, 'waxMelted');
  assert.ok(seconds > 2.5, 'there is time to react: ' + seconds.toFixed(2) + ' s');
  assert.equal(F.altitudeZone(flyer.y), 'safe', 'the flyer is put back in the safe zone');
});

test('skimming the sea soaks the feathers', function () {
  const flyer = F.createFlyer(middleOfSafeZone());
  let event = null;
  for (let frame = 0; frame < 60 * 10 && !event; frame += 1) {
    F.steerFlyer(flyer, 1, STEP);
    event = F.updateDangers(flyer, STEP);
  }
  assert.equal(event, 'feathersSoaked');
});

test('a short trip into danger is forgiven as the meter drains', function () {
  const flyer = F.createFlyer(F.HOT_LIMIT - 20);
  for (let frame = 0; frame < 60; frame += 1) {
    F.updateDangers(flyer, STEP);
  }
  flyer.y = middleOfSafeZone();
  for (let frame = 0; frame < 60 * 4; frame += 1) {
    F.updateDangers(flyer, STEP);
  }
  assert.equal(flyer.wax, 0);
});
