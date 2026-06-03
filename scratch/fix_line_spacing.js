const fs = require('fs');

const cssPath = 'public/css/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fixCss = `
/* Fix line spacing and clamping for classic reading links to match non-link items */
.classic-reading-item-mobile .news-headline a,
.classic-readings-mobile .news-headline a {
    display: inline !important;
    -webkit-line-clamp: unset !important;
    -webkit-box-orient: unset !important;
    max-height: none !important;
    line-height: inherit !important;
    white-space: normal !important;
}
`;

if (!css.includes('Fix line spacing and clamping for classic reading links')) {
    fs.appendFileSync(cssPath, fixCss, 'utf8');
    console.log('Appended fix to styles.css');
} else {
    console.log('Fix already applied');
}
