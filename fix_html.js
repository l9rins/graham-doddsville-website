const fs = require('fs');

let html = fs.readFileSync('warren-buffett-books.html', 'utf8');

const newContent = fs.readFileSync('books_content.html', 'utf8');

// Find the section
const start = html.indexOf('<section class="books-content">');
const end = html.indexOf('</section>', start) + 10; // include </section>

const oldSection = html.substring(start, end);

const newSection = '<section class="books-content">\n' + newContent + '</section>';

html = html.replace(oldSection, newSection);

// Now, remove the premature </body></html> and everything after
const bodyEnd = html.indexOf('</body>');
const htmlEnd = html.indexOf('</html>', bodyEnd) + 7;

html = html.substring(0, htmlEnd);

fs.writeFileSync('warren-buffett-books_fixed.html', html);