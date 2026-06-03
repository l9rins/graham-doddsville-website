const fs = require('fs');

const htmlPath = 'public/warren-buffett-books.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const regex = /<div class="book-card">([\s\S]*?)<\/div>\s*<\/div>/g;

let count = 0;
// Wait, the regex might over-match if there are nested divs. 
// A safer way is to use cheerio since it's a Node environment, maybe cheerio is installed?
// Let's check if cheerio is available, if not, write a simple parser.
