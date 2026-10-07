// A real HTML <input> laid over the canvas, so typing Polish letters (AltGr, IME, paste) just works.
(function (LM) {
  'use strict';

  const BASE_FONT_SIZE = 26;

  function noop() {}

  function createTextInputOverlay(view, element, hostWindow) {
    let request = null;

    function reposition() {
      if (!request) {
        return;
      }
      const css = view.logicalRectToCss(request.rect);
      element.style.left = css.left + 'px';
      element.style.top = css.top + 'px';
      element.style.width = css.width + 'px';
      element.style.height = css.height + 'px';
      element.style.fontSize = Math.round(BASE_FONT_SIZE * css.scale) + 'px';
    }

    function onKeyDown(event) {
      if (!request) {
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        request.onSubmit(element.value);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        request.onCancel();
      }
    }

    element.addEventListener('keydown', onKeyDown);
    hostWindow.addEventListener('resize', reposition);

    // rect is in logical (1280×720) coordinates; options: { placeholder, maxLength, onSubmit(text), onCancel() }
    function show(rect, options) {
      request = { rect: rect, onSubmit: options.onSubmit, onCancel: options.onCancel || noop };
      element.value = '';
      element.placeholder = options.placeholder || '';
      element.maxLength = options.maxLength || 40;
      element.hidden = false;
      reposition();
      element.focus();
    }

    function hide() {
      request = null;
      element.hidden = true;
      element.blur();
    }

    // Clicking the canvas steals focus; scenes call this every update while the field is shown.
    function keepFocus() {
      if (request && hostWindow.document.activeElement !== element) {
        element.focus();
      }
    }

    return {
      show,
      hide,
      keepFocus,
      isVisible: function () { return request !== null; },
    };
  }

  LM.textInput = { createTextInputOverlay };
}(window.LM = window.LM || {}));
