// Flight physics for the Icarus mission: altitude, the golden-mean zone, melting wax and soaking feathers.
// Pure numbers (y in screen pixels, bigger = lower), so it is unit-tested with a simple autopilot.
(function (LM) {
  'use strict';

  const SKY_TOP = 90;
  const HOT_LIMIT = 210;
  const WET_LIMIT = 500;
  const SEA_LEVEL = 600;
  const SAFE_MIDDLE_Y = (HOT_LIMIT + WET_LIMIT) / 2;
  const CLIMB_SPEED = 230;
  const RESPONSIVENESS = 6;
  const SECONDS_TO_MELT = 2.6;
  const SECONDS_TO_SOAK = 2.6;
  const RECOVERY_RATE = 0.5;

  function createFlyer(y) {
    return { y: y, velocity: 0, wax: 0, wetness: 0 };
  }

  function altitudeZone(y) {
    if (y < HOT_LIMIT) {
      return 'tooHigh';
    }
    return y > WET_LIMIT ? 'tooLow' : 'safe';
  }

  // steer: -1 (up) … 1 (down); the flyer eases towards the wanted speed.
  function steerFlyer(flyer, steer, dt) {
    const wanted = steer * CLIMB_SPEED;
    flyer.velocity += (wanted - flyer.velocity) * Math.min(1, RESPONSIVENESS * dt);
    flyer.y = Math.min(SEA_LEVEL - 20, Math.max(SKY_TOP, flyer.y + flyer.velocity * dt));
  }

  // Returns 'waxMelted', 'feathersSoaked' or null. A danger meter fills in its zone and slowly drains outside it.
  function updateDangers(flyer, dt) {
    const zone = altitudeZone(flyer.y);
    flyer.wax = zone === 'tooHigh' ? flyer.wax + dt / SECONDS_TO_MELT : Math.max(0, flyer.wax - dt * RECOVERY_RATE);
    flyer.wetness = zone === 'tooLow' ? flyer.wetness + dt / SECONDS_TO_SOAK : Math.max(0, flyer.wetness - dt * RECOVERY_RATE);
    if (flyer.wax >= 1) {
      flyer.wax = 0;
      flyer.y = SAFE_MIDDLE_Y;
      return 'waxMelted';
    }
    if (flyer.wetness >= 1) {
      flyer.wetness = 0;
      flyer.y = SAFE_MIDDLE_Y;
      return 'feathersSoaked';
    }
    return null;
  }

  LM.flightModel = { SKY_TOP, HOT_LIMIT, WET_LIMIT, SEA_LEVEL, SAFE_MIDDLE_Y, createFlyer, altitudeZone, steerFlyer, updateDangers };
}(window.LM = window.LM || {}));
