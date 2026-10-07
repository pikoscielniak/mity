// Opens the game from disk (file://) in headless Edge and records page errors.
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { ROOT } = require('../helpers/load-game');

const SCREENSHOT_DIR = path.join(ROOT, 'test-results');

async function openGame(options) {
  const settings = Object.assign({ htmlFile: 'index.html', query: '', width: 1280, height: 720 }, options);
  const browser = await chromium.launch({
    channel: 'msedge',
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage({ viewport: { width: settings.width, height: settings.height } });
  const errors = [];
  page.on('pageerror', function (error) { errors.push(error.message); });
  page.on('console', function (message) {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  const url = pathToFileURL(path.join(ROOT, settings.htmlFile)).href + settings.query;
  await page.goto(url);
  await page.waitForFunction(function () { return Boolean(window.LM && window.LM.game); });
  return { browser, page, errors };
}

async function saveScreenshot(page, name) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, name + '.png') });
}

module.exports = { openGame, saveScreenshot };
