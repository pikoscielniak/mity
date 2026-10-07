// Loads the game's classic scripts (in index.html order) into a bare vm context, so logic can be unit-tested in Node.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');

function listScriptSources() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  return Array.from(html.matchAll(/<script src="([^"]+)"><\/script>/g), function (match) { return match[1]; });
}

function isBrowserOnlyScript(source) {
  return source.endsWith('src/main.js') || source.includes('src/debug/');
}

function listGameScripts() {
  return listScriptSources().filter(function (source) { return !isBrowserOnlyScript(source); });
}

function loadGame(extraGlobals) {
  const context = vm.createContext(Object.assign({ console: console }, extraGlobals));
  context.window = context;
  listGameScripts().forEach(function (source) {
    const code = fs.readFileSync(path.join(ROOT, source), 'utf8');
    vm.runInContext(code, context, { filename: source });
  });
  return context.LM;
}

// Objects from the vm realm have foreign prototypes, which breaks deepStrictEqual.
function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = { ROOT, loadGame, toPlain, listScriptSources, listGameScripts };
