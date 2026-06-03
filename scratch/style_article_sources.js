const fs = require('fs');
const cheerio = require('cheerio');

const htmlPath = 'public/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(html, { decodeEntities: false });

let changesMade = 0;

// Find all article items
$('.article-item a').each(function() {
    let text = $(this).text();
    // Match " (Something)" at the end of the text
    const match = text.match(/(.*?)\s+(\([^)]+\))$/);
    
    if (match) {
        const titlePart = match[1];
        const sourcePart = match[2];
        
        // Skip if it's a date like (1940) or (2008) just to be safe
        if (sourcePart === '(1940)' || sourcePart === '(2008)') {
            return;
        }

        // Replace the text with HTML containing the styled span
        $(this).html(`${titlePart} <span class="article-source-inline">${sourcePart}</span>`);
        changesMade++;
    }
});

// Also check any other headline links that might not be in .article-item but are part of news
$('.news-headline, .news-headline a').each(function() {
    let text = $(this).text();
    // If it has children, we only want to process if it's just a text node or we can just process the text
    // Actually, Cheerio's .text() gets all text. It's safer to only modify if it doesn't already have HTML.
    if ($(this).children().length === 0) {
        const match = text.match(/(.*?)\s+(\([^)]+\))$/);
        if (match) {
            const titlePart = match[1];
            const sourcePart = match[2];
            
            if (sourcePart === '(1940)' || sourcePart === '(2008)') {
                return;
            }

            $(this).html(`${titlePart} <span class="article-source-inline">${sourcePart}</span>`);
            changesMade++;
        }
    }
});

if (changesMade > 0) {
    fs.writeFileSync(htmlPath, $.html(), 'utf8');
    console.log(`Updated ${changesMade} article links.`);
} else {
    console.log('No links matched the pattern.');
}
