const fs = require('fs');

const html = fs.readFileSync('value-investing-books.html', 'utf8');

// Extract from table rows
const trRegex = /<tr>\s*<td>\s*<div class="book-title">(?:<a[^>]*>)?([^<]+)<\/a>?\s*<\/div>\s*<\/td>\s*<td>\s*<div class="book-author">([^<]+)<\/div>\s*<\/td>\s*<td>\s*<div class="book-price">([^<]+)<\/div>\s*<\/td>\s*<\/tr>/g;

const books = [];
let match;
while ((match = trRegex.exec(html)) !== null) {
  books.push({
    title: match[1].trim(),
    author: match[2].trim(),
    price: match[3].trim()
  });
}

fs.writeFileSync('books_value.json', JSON.stringify(books, null, 2));