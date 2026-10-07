// Decides whether a response is correct, per question type.
// Responses: choice { optionIndex }, truefalse { value }, order { items }, match { pairs: { left: right } }, typed { text }.
(function (LM) {
  'use strict';

  function sameSequence(first, second) {
    return first.length === second.length && first.every(function (item, index) { return item === second[index]; });
  }

  const CHECKERS = {
    choice: function (question, response) {
      return response.optionIndex === question.correctIndex;
    },
    truefalse: function (question, response) {
      return response.value === question.statementIsTrue;
    },
    order: function (question, response) {
      return sameSequence(response.items, question.itemsInOrder);
    },
    match: function (question, response) {
      return question.pairs.every(function (pair) { return response.pairs[pair.left] === pair.right; });
    },
    typed: function (question, response) {
      return question.acceptedAnswers.some(function (accepted) {
        return LM.textNormalize.isCloseEnough(response.text, accepted);
      });
    },
  };

  function isAnswerCorrect(question, response) {
    return CHECKERS[question.type](question, response);
  }

  // The answer shown after a mistake, as one readable line.
  function correctAnswerText(question) {
    if (question.type === 'choice') {
      return question.options[question.correctIndex];
    }
    if (question.type === 'truefalse') {
      return question.statementIsTrue ? 'Prawda' : 'Fałsz';
    }
    if (question.type === 'order') {
      return question.itemsInOrder.join(' → ');
    }
    if (question.type === 'match') {
      return question.pairs.map(function (pair) { return pair.left + ' – ' + pair.right; }).join('; ');
    }
    return question.acceptedAnswers[0];
  }

  LM.answerCheck = { isAnswerCorrect, correctAnswerText };
}(window.LM = window.LM || {}));
