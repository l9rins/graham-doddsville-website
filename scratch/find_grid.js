const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'market-quotes.html');
const content = fs.readFileSync(filePath, 'utf8');

const index = content.indexOf('<div class="quotes-grid">');
if (index !== -1) {
  console.log(`Found <div class="quotes-grid"> at index ${index}`);
  console.log('Surrounding HTML:');
  console.log(content.substring(Math.max(0, index - 300), Math.min(content.length, index + 300)));
} else {
  console.log('Could not find <div class="quotes-grid">');
}
