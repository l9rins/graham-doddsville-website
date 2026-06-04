const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/js/book-summaries-data.js');
let content = fs.readFileSync(dataPath, 'utf8');

eval(content);

let missingSummaries = [];
let totalBooks = Object.keys(bookSummariesData).length;

for (const slug in bookSummariesData) {
    const book = bookSummariesData[slug];
    if (!book.summaryHtml || book.summaryHtml.trim() === '') {
        missingSummaries.push(book.title);
    }
}

console.log(`\nFound ${missingSummaries.length} books without summaries (out of ${totalBooks} total books):\n`);
missingSummaries.forEach(title => {
    console.log(`- ${title}`);
});
