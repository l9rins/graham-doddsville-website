const fs = require('fs');
const path = require('path');

const booksFiles = [
    'sales-marketing-books.html',
    'miscellaneous-books.html',
    'value-investing-books.html',
    'share-investing-books.html',
    'wealth-creation-books.html',
    'financial-analysis-books.html',
    'business-management-books.html',
    'self-improvement-books.html',
    'warren-buffett-books.html'
];

function extractBooksFromTable(content) {
    const books = [];
    const tbodyMatch = content.match(/<tbody>(.*?)<\/tbody>/s);

    if (tbodyMatch) {
        const tbodyContent = tbodyMatch[1];
        const rowMatches = tbodyContent.match(/<tr>.*?<\/tr>/gs);

        if (rowMatches) {
            rowMatches.forEach(row => {
                const titleMatch = row.match(/<a[^>]*>(.*?)<\/a>/);
                const authorMatch = row.match(/<div class="book-author">(.*?)<\/div>/);
                const priceMatch = row.match(/<div class="book-price">(.*?)<\/div>/);

                if (titleMatch && authorMatch && priceMatch) {
                    const titleLinkMatch = row.match(/<a[^>]*href="([^"]*)">/);
                    books.push({
                        title: titleMatch[1],
                        link: titleLinkMatch ? titleLinkMatch[1] : '#',
                        author: authorMatch[1],
                        price: priceMatch[1]
                    });
                }
            });
        }
    }

    return books;
}

function generateMobileCards(books) {
    let cardsHtml = '            <!-- Mobile Cards Layout (hidden on desktop, visible on mobile) -->\n';
    cardsHtml += '            <div class="books-mobile-cards" style="display: none;">\n';

    books.forEach(book => {
        cardsHtml += `                <div class="book-mobile-card">
                    <div class="book-mobile-title"><a href="${book.link}" target="_blank" rel="noopener noreferrer">${book.title}</a></div>
                    <div class="book-mobile-author">${book.author}</div>
                    <div class="book-mobile-price">${book.price}</div>
                </div>\n`;
    });

    cardsHtml += '            </div>\n\n';

    return cardsHtml;
}

booksFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log('Processing:', file);

        let content = fs.readFileSync(filePath, 'utf8');

        // Extract all books from the table
        const books = extractBooksFromTable(content);
        console.log(`Found ${books.length} books in ${file}`);

        // Generate mobile cards HTML
        const mobileCardsHtml = generateMobileCards(books);

        // Replace the existing mobile cards section
        const existingCardsPattern = /<!-- Mobile Cards Layout.*?-->\s*<div class="books-mobile-cards[^>]*>[\s\S]*?<\/div>\s*<!-- Add more mobile cards here as needed -->\s*<\/div>/;
        const simplePattern = /<div class="books-mobile-cards[^>]*>[\s\S]*?<\/div>/;

        if (existingCardsPattern.test(content)) {
            content = content.replace(existingCardsPattern, mobileCardsHtml.trim());
        } else if (simplePattern.test(content)) {
            content = content.replace(simplePattern, mobileCardsHtml.trim());
        } else {
            // Fallback: replace after table
            const tableEndPattern = /(<\/table>\s*<\/div>)\s*<div class="books-description">/;
            content = content.replace(tableEndPattern, '$1\n\n' + mobileCardsHtml + '<div class="books-description">');
        }

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file} with ${books.length} mobile cards`);
    } else {
        console.log('File not found:', file);
    }
});

console.log('All files processed!');