const fs = require('fs');
const path = require('path');

const replacements = {
  '—': '—',
  '–': '–',
  '’': '’',
  '‘': '‘',
  '“': '“',
  '”': '”',
  '←': '←',
  '▼': '▼',
  '▲': '▲',
  '•': '•',
  '✅': '✅',
  '⚠️': '⚠️',
  '🚨': '🚨',
  '📋': '📋',
  '🧹': '🧹',
  '💥': '💥',
  '❌': '❌',
  '…': '…',
  '▼': '▼'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed mojibake in', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'images' || file === 'fonts') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.md')) {
      fixFile(fullPath);
    }
  }
}

walk('.');
