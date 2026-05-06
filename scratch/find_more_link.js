const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const searchStr = 'market-quotes.html';
let idx = 0;
while ((idx = content.indexOf(searchStr, idx)) !== -1) {
  console.log(`\nOccurrence at index ${idx}:`);
  console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 200)).replace(/\n/g, ' '));
  idx += searchStr.length;
}
