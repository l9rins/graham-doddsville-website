const fs = require('fs');

const data = fs.readFileSync('books_clean.json');

console.log('Bytes:', data.slice(0,10));

console.log('String:', data.toString('utf8').slice(0,10));