const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directoryPath = path.join(__dirname, '../public');

const pageDescriptions = {
    'wealth-creation-books.html': 'The beginner\'s guide to money, saving, managing debt and investing wisely',
    'share-investing-books.html': 'Learn how shares work, how to think like an investor and build strong portfolios',
    'value-investing-books.html': 'Discover the legendary figures who shaped the world of value investing',
    'warren-buffett-books.html': 'Discover the legendary figures who shaped the world of value investing',
    'financial-analysis-books.html': 'How to read and analyse balance sheets, P&Ls and cash flow statements'
};

for (const [filename, newSubtitle] of Object.entries(pageDescriptions)) {
    const filePath = path.join(directoryPath, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filename}`);
        continue;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(fileContent);
    let modified = false;

    // We only want to update the .page-subtitle that are direct descriptions of the page,
    // which are generally right under .page-title or h1
    $('.page-subtitle').each((i, elem) => {
        $(elem).text(newSubtitle);
        modified = true;
    });

    if (modified) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log(`Updated subtitles in ${filename}`);
    }
}
