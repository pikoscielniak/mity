(function (LM) {
  'use strict';

  const WIDTH = 1280;
  const HEIGHT = 720;

  function createCanvasView(canvas, hostWindow) {
    const ctx = canvas.getContext('2d');

    function fitToWindow() {
      const scale = Math.min(hostWindow.innerWidth / WIDTH, hostWindow.innerHeight / HEIGHT);
      const cssWidth = Math.floor(WIDTH * scale);
      const cssHeight = Math.floor(HEIGHT * scale);
      const pixelRatio = hostWindow.devicePixelRatio || 1;
      canvas.style.width = cssWidth + 'px';
      canvas.style.height = cssHeight + 'px';
      canvas.width = Math.round(cssWidth * pixelRatio);
      canvas.height = Math.round(cssHeight * pixelRatio);
    }

    function beginFrame() {
      ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function toLogicalPoint(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * WIDTH / rect.width,
        y: (clientY - rect.top) * HEIGHT / rect.height,
      };
    }

    function logicalRectToCss(logicalRect) {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width / WIDTH;
      return {
        left: rect.left + logicalRect.x * scale,
        top: rect.top + logicalRect.y * scale,
        width: logicalRect.width * scale,
        height: logicalRect.height * scale,
        scale: scale,
      };
    }

    fitToWindow();
    hostWindow.addEventListener('resize', fitToWindow);

    return { canvas, ctx, beginFrame, toLogicalPoint, logicalRectToCss, fitToWindow };
  }

  LM.view = { WIDTH, HEIGHT, createCanvasView };
}(window.LM = window.LM || {}));
