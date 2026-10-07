// Things shown for a while, like a warning: { text, seconds } that disappears when its time runs out.
(function (LM) {
  'use strict';

  // Returns the same object while time is left, otherwise null.
  function tick(timed, dt) {
    if (!timed) {
      return null;
    }
    timed.seconds -= dt;
    return timed.seconds > 0 ? timed : null;
  }

  LM.timed = { tick };
}(window.LM = window.LM || {}));
