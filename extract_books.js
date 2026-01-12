const fs = require('fs');
const path = 'c:\\Users\\Mark Lorenz\\Desktop\\LibraryWebsite\\warren-buffett-books.html';

const content = fs.readFileSync(path, 'utf8');

const regex = /<div class="book-mobile-title"><a href="https:\/\/www\.amazon\.com\/s\?k=([^"]+)" target="_blank" rel="noopener noreferrer">([^<]+)<\/a><\/div>\s*<div class="book-mobile-author">([^<]+)<\/div>\s*<div class="book-mobile-price">([^<]+)<\/div>/g;

let match;
const books = [];
while ((match = regex.exec(content)) !== null) {
    const href = decodeURIComponent(match[1]);
    const title = match[2];
    const author = match[3];
    const price = match[4];
    books.push({ title, author, price });
}

console.log(JSON.stringify(books, null, 2));