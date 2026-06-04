const fs = require('fs');
const path = require('path');

// 1. Fix book-summaries-data.js
const DATA_PATH = path.join(__dirname, '../public/js/book-summaries-data.js');
let dataJs = fs.readFileSync(DATA_PATH, 'utf8');

// Replace &amp; with & in amazonUrl
dataJs = dataJs.replace(/&amp;/g, '&');
fs.writeFileSync(DATA_PATH, dataJs, 'utf8');
console.log('Fixed amazonUrls in book-summaries-data.js');

// 2. Fix target="_blank" in index.html for book-summary.html links
const INDEX_PATH = path.join(__dirname, '../public/index.html');
let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

// We want to find links that have href="book-summary.html?..." and target="_blank"
// Let's use regex to replace target="_blank" with target="_self" for these specific links
const regex = /(<a\s+href="book-summary\.html\?book=[^"]+"\s+)target="_blank"/g;
indexHtml = indexHtml.replace(regex, '$1target="_self"');

// Just in case the order is different: target="_blank" ... href="book-summary..."
const regex2 = /target="_blank"(\s+class="recommended-book-link"\s+style="[^"]+"\s+)href="book-summary\.html\?book=/g;
// Actually, it's safer to just remove target="_blank" from any a tag that has href="book-summary.html
// Let's do a simple regex:
const linkRegex = /<a\s+([^>]*href="book-summary\.html[^>]+)>/g;
indexHtml = indexHtml.replace(linkRegex, (match, p1) => {
    // Remove target="_blank"
    let newAttr = p1.replace(/\s*target="_blank"\s*/, ' ');
    return `<a ${newAttr}>`;
});

fs.writeFileSync(INDEX_PATH, indexHtml, 'utf8');
console.log('Removed target="_blank" from book summary links in index.html');
