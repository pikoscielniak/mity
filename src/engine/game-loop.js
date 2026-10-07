(function (LM) {
  'use strict';

  const STEP_SECONDS = 1 / 60;
  const MAX_FRAME_SECONDS = 0.25;

  // Fixed-step updates keep mini-game physics identical on 60 Hz and 144 Hz screens.
  function startGameLoop(update, render) {
    let lastSeconds = null;
    let accumulator = 0;

    function frame(nowMs) {
      const nowSeconds = nowMs / 1000;
      const elapsed = lastSeconds === null ? 0 : nowSeconds - lastSeconds;
      lastSeconds = nowSeconds;
      accumulator += Math.min(elapsed, MAX_FRAME_SECONDS);
      while (accumulator >= STEP_SECONDS) {
        update(STEP_SECONDS);
        accumulator -= STEP_SECONDS;
      }
      render();
      window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  LM.loop = { STEP_SECONDS, startGameLoop };
}(window.LM = window.LM || {}));
