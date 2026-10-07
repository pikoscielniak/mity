(function (LM) {
  'use strict';

  const KEY_ACTIONS = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    Enter: 'confirm', NumpadEnter: 'confirm', Space: 'confirm',
    Escape: 'back',
    KeyH: 'hint',
    Digit1: 'option1', Numpad1: 'option1',
    Digit2: 'option2', Numpad2: 'option2',
    Digit3: 'option3', Numpad3: 'option3',
    Digit4: 'option4', Numpad4: 'option4',
    Digit5: 'option5', Numpad5: 'option5',
  };

  const OPTION_ACTIONS = ['option1', 'option2', 'option3', 'option4', 'option5'];

  function isTextField(target) {
    return Boolean(target) && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
  }

  function createInput(view, hostWindow) {
    const heldActions = new Set();
    const pressedActions = new Set();
    const pointer = { x: 0, y: 0, isDown: false, wasPressed: false, wasReleased: false, hasMoved: false };
    let anyKeyWasPressed = false;

    function onKeyDown(event) {
      if (isTextField(event.target)) {
        return;
      }
      const action = KEY_ACTIONS[event.code];
      if (!event.repeat) {
        anyKeyWasPressed = true;
      }
      if (!action) {
        return;
      }
      event.preventDefault();
      if (!event.repeat) {
        pressedActions.add(action);
      }
      heldActions.add(action);
    }

    function onKeyUp(event) {
      const action = KEY_ACTIONS[event.code];
      if (action) {
        heldActions.delete(action);
      }
    }

    function movePointer(event) {
      const point = view.toLogicalPoint(event.clientX, event.clientY);
      pointer.x = point.x;
      pointer.y = point.y;
    }

    function onPointerDown(event) {
      movePointer(event);
      pointer.isDown = true;
      pointer.wasPressed = true;
      pointer.hasMoved = true;
    }

    function onPointerMove(event) {
      movePointer(event);
      pointer.hasMoved = true;
    }

    function onPointerUp(event) {
      movePointer(event);
      pointer.isDown = false;
      pointer.wasReleased = true;
    }

    hostWindow.addEventListener('keydown', onKeyDown);
    hostWindow.addEventListener('keyup', onKeyUp);
    hostWindow.addEventListener('blur', function () { heldActions.clear(); });
    view.canvas.addEventListener('pointerdown', onPointerDown);
    hostWindow.addEventListener('pointermove', onPointerMove);
    hostWindow.addEventListener('pointerup', onPointerUp);

    function pressedOptionIndex() {
      return OPTION_ACTIONS.findIndex(function (action) { return pressedActions.has(action); });
    }

    function endUpdate() {
      pressedActions.clear();
      anyKeyWasPressed = false;
      pointer.wasPressed = false;
      pointer.wasReleased = false;
      pointer.hasMoved = false;
    }

    // -1, 0 or 1 along an axis, e.g. pressedStep('left', 'right') for one step through a list.
    function pressedStep(negativeAction, positiveAction) {
      return (pressedActions.has(positiveAction) ? 1 : 0) - (pressedActions.has(negativeAction) ? 1 : 0);
    }

    function heldStep(negativeAction, positiveAction) {
      return (heldActions.has(positiveAction) ? 1 : 0) - (heldActions.has(negativeAction) ? 1 : 0);
    }

    return {
      pointer,
      isHeld: function (action) { return heldActions.has(action); },
      wasPressed: function (action) { return pressedActions.has(action); },
      pressedStep,
      heldStep,
      wasAnyKeyPressed: function () { return anyKeyWasPressed; },
      pressedOptionIndex,
      endUpdate,
    };
  }

  LM.input = { createInput, OPTION_ACTIONS };
}(window.LM = window.LM || {}));
