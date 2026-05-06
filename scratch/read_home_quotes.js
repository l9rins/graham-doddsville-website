const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const index = content.indexOf('<!-- MARKET QUOTES Section -->');
if (index !== -1) {
  console.log(content.substring(index, index + 3000));
} else {
  console.log('MARKET QUOTES Section comment not found');
}
