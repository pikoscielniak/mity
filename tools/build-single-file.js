// Builds dist/labirynt-mitow.html: the whole game (CSS and every script inlined) in one file to share.
// Usage: npm run build
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'dist', 'labirynt-mitow.html');

function readSource(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

// A literal "</script" inside inlined code would end the script element early.
function inlineScript(source) {
  return '<script>\n' + readSource(source).replace(/<\/script/gi, '<\\/script') + '\n</script>';
}

function buildSingleFile() {
  return readSource('index.html')
    .replace(/<link rel="stylesheet" href="([^"]+)">/g, function (match, href) {
      return '<style>\n' + readSource(href) + '\n</style>';
    })
    .replace(/<script src="([^"]+)"><\/script>/g, function (match, source) {
      return inlineScript(source);
    });
}

function main() {
  const html = buildSingleFile();
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, html);
  console.log(path.relative(ROOT, OUTPUT) + ': ' + Math.round(html.length / 1024) + ' KB');
}

main();
