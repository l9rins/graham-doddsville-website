const fs = require('fs');

const cssPath = 'public/css/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newCss = `
/* Comma separated inline list styling for Warren Buffett sections */
.comma-separated-list a {
    display: inline !important;
    text-decoration: none !important;
    color: #333 !important;
}

.comma-separated-list a:hover {
    color: #d4af37 !important;
    text-decoration: none !important;
}

.comma-separated-list a::before {
    content: ", ";
    color: #333;
    pointer-events: none;
}

.comma-separated-list a:first-child::before {
    content: "";
}

.comma-separated-list .desktop-buffett-item {
    font-family: Georgia, serif;
    font-size: 14px;
    font-weight: 600;
}
`;

if (!css.includes('.comma-separated-list a')) {
    css += newCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Updated styles.css');
} else {
    console.log('styles.css already has comma-separated-list rules');
}
