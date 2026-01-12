const fs = require('fs');

let html = fs.readFileSync('value-investing-books.html', 'utf8');

const newContent = fs.readFileSync('books_content_value.html', 'utf8');

// Find the section
const start = html.indexOf('<section class="books-content">');
const end = html.indexOf('</section>', start) + 10; // include </section>

const oldSection = html.substring(start, end);

const newSection = '<section class="books-content">\n' + newContent + '</section>';

html = html.replace(oldSection, newSection);

fs.writeFileSync('value-investing-books_fixed.html', html);