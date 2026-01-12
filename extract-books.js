const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('warren-buffett-books.html', 'utf8');
const $ = cheerio.load(html);

const books = [];

$('.book-mobile-card').each((i, elem) => {
    const title = $(elem).find('.book-mobile-title').text().trim();
    const author = $(elem).find('.book-mobile-author').text().trim();
    const price = $(elem).find('.book-mobile-price').text().trim();
    if (title && author && price) {
        books.push({ title, author, price });
    }
});

fs.writeFileSync('books.json', JSON.stringify(books, null, 2));