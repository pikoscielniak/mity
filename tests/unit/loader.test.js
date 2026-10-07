const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, loadGame, listScriptSources } = require('../helpers/load-game');

test('every script listed in index.html exists', function () {
  listScriptSources().forEach(function (source) {
    assert.ok(fs.existsSync(path.join(ROOT, source)), source + ' is missing');
  });
});

test('every game script under src/ is listed in index.html', function () {
  const listed = new Set(listScriptSources());
  const onDisk = [];
  (function collect(directory) {
    fs.readdirSync(path.join(ROOT, directory), { withFileTypes: true }).forEach(function (entry) {
      const relative = directory + '/' + entry.name;
      if (entry.isDirectory()) {
        collect(relative);
      } else if (entry.name.endsWith('.js')) {
        onDisk.push(relative);
      }
    });
  }('src'));
  onDisk.forEach(function (source) {
    assert.ok(listed.has(source), source + ' is not loaded by index.html');
  });
});

test('all game scripts load without a DOM', function () {
  const LM = loadGame();
  assert.equal(typeof LM.view.createCanvasView, 'function');
  assert.equal(typeof LM.sceneFactories.title, 'function');
});
