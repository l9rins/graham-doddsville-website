const fs = require('fs');
let css = fs.readFileSync('public/css/styles.css', 'utf8');

// The file currently has literal characters '\' followed by 'n'.
// Let's remove them completely.
const badString1 = "\\n\\n/* Recommended Book Link Font */\\n.recommended-book-link {\\n    font-family: Georgia, serif !important;\\n    font-size: 15px !important;\\n    font-weight: 550 !important;\\n    color: #000 !important;\\n}\\n.recommended-book-link:hover {\\n    text-decoration: underline !important;\\n    color: #d4af37 !important;\\n}\\n";
const badString2 = "\\n\\n/* Recommended Book Link Font */\\n.recommended-book-link {\\n    font-family: Georgia, serif !important;\\n    font-size: 15px !important;\\n    font-weight: 600 !important;\\n    color: #000 !important;\\n}\\n.recommended-book-link:hover {\\n    text-decoration: underline !important;\\n    color: #d4af37 !important;\\n}\\n";

css = css.replace(badString1, '');
css = css.replace(badString2, '');

// Also use regex just in case there are other variations
css = css.replace(/\\n/g, ''); 

// Now append the correct block with actual newlines
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

if (!css.includes('.recommended-book-link {')) {
    css += correctCss;
}

fs.writeFileSync('public/css/styles.css', css, 'utf8');
console.log('Fixed styles.css properly');
