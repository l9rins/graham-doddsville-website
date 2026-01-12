const fs = require('fs');

let data = fs.readFileSync('books.json', 'utf8');

if (data.charCodeAt(0) === 0xFEFF) {

  data = data.slice(1);

}

fs.writeFileSync('books_clean.json', data);