const fs = require('fs');

const cssPath = 'public/css/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Remove the literal \n strings that got accidentally injected
css = css.replace(/\\n\\n\/\* Recommended Book Link Font \*\/\\n\.recommended-book-link \{\\n    font-family: Georgia, serif !important;\\n    font-size: 15px !important;\\n    font-weight: 550 !important;\\n    color: #000 !important;\\n\}\\n\.recommended-book-link:hover \{\\n    text-decoration: underline !important;\\n    color: #d4af37 !important;\\n\}\\n/g, '');

const correctCss = `

/* Recommended Book Link Font */
.recommended-book-link {
    font-family: Georgia, serif !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    color: #000 !important;
}
.recommended-book-link:hover {
    text-decoration: underline !important;
    color: #d4af37 !important;
}
`;

if (!css.includes('font-weight: 600 !important;')) {
    css += correctCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Fixed CSS');
} else {
    console.log('CSS already fixed');
}
