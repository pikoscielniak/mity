// Comparing typed answers: case, Polish diacritics and small typos must not matter.
(function (LM) {
  'use strict';

  // "Łódź" → "lodz". NFD splits most accented letters; ł has no decomposition, so it is mapped by hand.
  function normalizeAnswerText(text) {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/ł/g, 'l')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function levenshteinDistance(first, second) {
    let previousRow = Array.from({ length: second.length + 1 }, function (unused, index) { return index; });
    for (let row = 1; row <= first.length; row += 1) {
      const currentRow = [row];
      for (let column = 1; column <= second.length; column += 1) {
        const substitutionCost = first[row - 1] === second[column - 1] ? 0 : 1;
        currentRow.push(Math.min(
          previousRow[column] + 1,
          currentRow[column - 1] + 1,
          previousRow[column - 1] + substitutionCost
        ));
      }
      previousRow = currentRow;
    }
    return previousRow[second.length];
  }

  // Short words must be exact ("Styks" vs "Stos"); longer ones forgive one or two slips.
  function allowedTypos(answerLength) {
    if (answerLength <= 4) {
      return 0;
    }
    return answerLength <= 8 ? 1 : 2;
  }

  function isCloseEnough(typedText, acceptedText) {
    const typed = normalizeAnswerText(typedText);
    const accepted = normalizeAnswerText(acceptedText);
    return levenshteinDistance(typed, accepted) <= allowedTypos(accepted.length);
  }

  LM.textNormalize = { normalizeAnswerText, levenshteinDistance, allowedTypos, isCloseEnough };
}(window.LM = window.LM || {}));
