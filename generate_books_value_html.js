const fs = require('fs');

const categories = JSON.parse(fs.readFileSync('categorized_books_value.json', 'utf8'));

function generateHTML() {
  let html = '';

  for (const [cat, books] of Object.entries(categories)) {
    if (books.length === 0) continue;
    html += `<h2>${cat}</h2>\n`;
    html += `<div class="books-table-container">\n`;
    html += `<table class="books-table">\n`;
    html += `<thead>\n`;
    html += `<tr>\n`;
    html += `<th>📚 Title</th>\n`;
    html += `<th>✍️ Author(s)</th>\n`;
    html += `<th>💰 Price</th>\n`;
    html += `</tr>\n`;
    html += `</thead>\n`;
    html += `<tbody>\n`;
    books.forEach(book => {
      html += `<tr>\n`;
      html += `<td><div class="book-title">${book.title}</div></td>\n`;
      html += `<td><div class="book-author">${book.author}</div></td>\n`;
      html += `<td><div class="book-price">${book.price}</div></td>\n`;
      html += `</tr>\n`;
    });
    html += `</tbody>\n`;
    html += `</table>\n`;
    html += `</div>\n`;
    html += `<div class="books-mobile-cards">\n`;
    books.forEach(book => {
      html += `<div class="book-mobile-card">\n`;
      html += `<div class="book-mobile-title">${book.title}</div>\n`;
      html += `<div class="book-mobile-author">${book.author}</div>\n`;
      html += `<div class="book-mobile-price">${book.price}</div>\n`;
      html += `</div>\n`;
    });
    html += `</div>\n`;
  }

  return html;
}

const htmlContent = generateHTML();
fs.writeFileSync('books_content_value.html', htmlContent);