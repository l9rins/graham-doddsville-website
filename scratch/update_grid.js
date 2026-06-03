const fs = require('fs');

const htmlPath = 'public/warren-buffett-books.html';
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace(/<div class="books-grid" id="books-grid">/, '<div class="books-grid detailed-grid" id="books-grid">');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Added detailed-grid class');

const cssPath = 'public/css/books-unified.css';
let css = fs.readFileSync(cssPath, 'utf8');

const gridCss = `
/* Detailed grid overrides */
.detailed-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)) !important;
}
@media (max-width: 768px) {
    .detailed-grid {
        grid-template-columns: 1fr !important;
    }
}
`;

if (!css.includes('.detailed-grid')) {
    fs.appendFileSync(cssPath, gridCss, 'utf8');
    console.log('Appended detailed-grid CSS');
}
