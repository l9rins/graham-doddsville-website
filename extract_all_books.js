const fs = require('fs');

const content = fs.readFileSync('warren-buffett-books.html', 'utf8');

// Extract table rows
const trRegex = /<tr>\s*<td>\s*<div class="book-title">(.*?)<\/div>\s*<\/td>\s*<td>\s*<div class="book-author">(.*?)<\/div>\s*<\/td>\s*<td>\s*<div class="book-price">(.*?)<\/div>\s*<\/td>\s*<\/tr>/g;
let matches = [];
let match;
while ((match = trRegex.exec(content)) !== null) {
    matches.push({
        title: match[1],
        author: match[2],
        price: match[3]
    });
}

// Extract mobile cards
const cardRegex = /<div class="book-mobile-card">\s*<div class="book-mobile-title"><a[^>]*>(.*?)<\/a><\/div>\s*<div class="book-mobile-author">(.*?)<\/div>\s*<div class="book-mobile-price">(.*?)<\/div>\s*<\/div>/g;
while ((match = cardRegex.exec(content)) !== null) {
    matches.push({
        title: match[1],
        author: match[2],
        price: match[3]
    });
}

// Remove duplicates
const uniqueBooks = matches.filter((book, index, self) =>
    index === self.findIndex(b => b.title === book.title && b.author === book.author)
);

console.log(JSON.stringify(uniqueBooks, null, 2));