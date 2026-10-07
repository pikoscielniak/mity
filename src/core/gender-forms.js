// Polish verbs agree with the player's gender: "Zdobył{eś|aś}" → "Zdobyłeś" (boy) or "Zdobyłaś" (girl).
(function (LM) {
  'use strict';

  const ALTERNATIVE = /\{([^|{}]*)\|([^|{}]*)\}/g;

  function applyGenderForms(text, gender) {
    return text.replace(ALTERNATIVE, function (match, boyForm, girlForm) {
      return gender === 'girl' ? girlForm : boyForm;
    });
  }

  LM.genderForms = { applyGenderForms };
}(window.LM = window.LM || {}));
