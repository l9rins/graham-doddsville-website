const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const regex = /class="market-quote-item"/g;
let count = 0;
while (regex.exec(content)) count++;
console.log('Number of market-quote-items on homepage:', count);

// Check if there is any link to market-quotes.html on the homepage
const linkRegex = /href="market-quotes\.html"/gi;
console.log('References to market-quotes.html:', content.match(linkRegex));
