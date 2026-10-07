// Drives a whole mission through the debug hook: skips stories, answers questions, skips mini-game action.
const { saveScreenshot } = require('./browser');

async function describe(page) {
  return page.evaluate(function () { return window.LM_DEBUG.describe(); });
}

async function handleQuestion(page, state, answerCorrectly) {
  if (state.isShowingFeedback) {
    await page.evaluate(function () { window.LM_DEBUG.continueFeedback(); });
    return;
  }
  await page.evaluate(function (isCorrect) { window.LM_DEBUG.answer(isCorrect); }, answerCorrectly(state));
}

// Wrong on the first try at every question, right on the retry (doors only open after a right answer).
function wrongFirstTime() {
  const tried = new Set();
  return function (state) {
    const isRetry = tried.has(state.questionId);
    tried.add(state.questionId);
    return isRetry;
  };
}

// options: { answerCorrectly: (state) => boolean, screenshotPrefix, stopWhen: (state) => boolean }
async function playUntil(page, options) {
  const seenScenes = new Set();
  for (let step = 0; step < 800; step += 1) {
    const state = await describe(page);
    if (process.env.PLAYTHROUGH_LOG) {
      console.log(JSON.stringify(state));
    }
    const sceneKey = state.scene + (state.stageType ? '-' + state.stageType : '');
    if (options.screenshotPrefix && !seenScenes.has(sceneKey)) {
      seenScenes.add(sceneKey);
      await page.waitForTimeout(250);
      await saveScreenshot(page, options.screenshotPrefix + '-' + sceneKey);
    }
    if (options.stopWhen(state)) {
      return state;
    }
    if (state.overlay === 'question') {
      await handleQuestion(page, state, options.answerCorrectly);
    } else if (state.scene === 'stage') {
      await page.evaluate(function () { window.LM_DEBUG.advanceStage(); });
    } else if (state.scene === 'cutscene') {
      await page.keyboard.press('Escape');
    } else {
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(state.scene === 'song' ? 1300 : 120);
  }
  throw new Error('The mission did not finish');
}

module.exports = { playUntil, describe, wrongFirstTime };
