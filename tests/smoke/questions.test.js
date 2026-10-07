const test = require('node:test');
const assert = require('node:assert/strict');
const { openGame, saveScreenshot } = require('./browser');

async function press(page, key, times) {
  for (let count = 0; count < (times || 1); count += 1) {
    await page.keyboard.press(key);
    await page.waitForTimeout(60);
  }
}

test('every question type can be answered with the keyboard', async function () {
  const { browser, page, errors } = await openGame({ query: '?scene=questions' });
  try {
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'question-choice');
    await press(page, 'Digit1');
    await saveScreenshot(page, 'question-choice-wrong');
    await press(page, 'Enter');
    await press(page, 'Digit2');
    await saveScreenshot(page, 'question-choice-correct');
    await press(page, 'Enter');

    await saveScreenshot(page, 'question-truefalse');
    await press(page, 'Digit2');
    await saveScreenshot(page, 'question-truefalse-correct');
    await press(page, 'Enter');

    await saveScreenshot(page, 'question-order');
    await press(page, 'Enter');
    await press(page, 'ArrowDown');
    await saveScreenshot(page, 'question-order-moving');
    await press(page, 'Enter');
    await press(page, 'ArrowDown', 5);
    await press(page, 'Enter');
    await saveScreenshot(page, 'question-order-feedback');
    await press(page, 'Enter');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('match pairs and typed answers work with the keyboard', async function () {
  const { browser, page, errors } = await openGame({ query: '?scene=questions' });
  try {
    await page.evaluate(function () {
      LM.game.show('styleguide');
    });
    await page.evaluate(function () {
      LM.game.scenes.pushOverlay(LM.questionOverlay.createQuestionOverlay(LM.game, {
        question: { id: 'm', type: 'match', prompt: 'Połącz:', pairs: [{ left: 'Ariadna', right: 'córka Minosa' }, { left: 'Dedal', right: 'budowniczy labiryntu' }], explanation: 'x' },
        header: 'test', attemptPolicy: 'singleAttempt', run: null, rng: function () { return 0.99; }, onClosed: function () { window.closedWith = 'match'; },
      }));
    });
    await press(page, 'Enter');
    await press(page, 'ArrowRight');
    await press(page, 'Enter');
    await saveScreenshot(page, 'question-match');
    await press(page, 'ArrowLeft');
    await press(page, 'ArrowDown');
    await press(page, 'Enter');
    await press(page, 'ArrowRight');
    await press(page, 'Enter');
    await press(page, 'ArrowDown');
    await press(page, 'Enter');
    await saveScreenshot(page, 'question-match-feedback');
    await press(page, 'Enter');
    assert.equal(await page.evaluate('window.closedWith'), 'match');

    await page.evaluate(function () {
      LM.game.scenes.pushOverlay(LM.questionOverlay.createQuestionOverlay(LM.game, {
        question: { id: 't', type: 'typed', prompt: 'Na jakiej wyspie Tezeusz zostawił Ariadnę?', acceptedAnswers: ['Naksos'], explanation: 'Na Naksos.' },
        header: 'test', attemptPolicy: 'singleAttempt', run: null,
        onClosed: function (result) { window.typedResult = result; },
      }));
    });
    await page.keyboard.type('naksoss');
    await saveScreenshot(page, 'question-typed');
    await press(page, 'Enter');
    await saveScreenshot(page, 'question-typed-feedback');
    await press(page, 'Enter');
    const result = await page.evaluate('window.typedResult');
    assert.equal(result.isFirstAttemptCorrect, true);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
