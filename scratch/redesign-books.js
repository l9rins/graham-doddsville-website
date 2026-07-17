const fs = require('fs');
const path = require('path');
const vm = require('vm');

const publicDir = path.join(__dirname, '..', 'public');
const summaryDataPath = path.join(publicDir, 'js', 'book-summaries-data.js');

// 1. Load and parse bookSummaries
const summaryDataContent = fs.readFileSync(summaryDataPath, 'utf8');
const script = new vm.Script(summaryDataContent + '\nbookSummariesData;');
const context = vm.createContext({});
let bookSummaries = {};
try {
    bookSummaries = script.runInContext(context);
} catch (e) {
    console.error("Failed to parse book-summaries-data.js", e);
    process.exit(1);
}

function extractShortSummary(html) {
    if (!html) return "Click summary to read more details and explore this book.";
    
    let text = "";
    const aboutMatch = html.match(/About\s*<\/strong><\/p><p>([\s\S]*?)<\/p>/i);
    if (aboutMatch) {
        text = aboutMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    } else {
        text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    if (text.length > 150) {
        text = text.substring(0, 150);
        const lastSpace = text.lastIndexOf(' ');
        if (lastSpace > 0) {
            text = text.substring(0, lastSpace) + '...';
        } else {
            text += '...';
        }
    }
    
    if (!text || text.length < 10) {
        return "Click summary to read more details and explore this book.";
    }
    
    return text;
}

function generateSlug(title) {
    return title.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
}

// 2. Process all -books.html
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('-books.html'));

let filesModified = 0;

for (const file of htmlFiles) {
    if (file === 'warren-buffett-books.html') {
        continue; // Already styled
    }
    
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    let wasModified = false;
    
    // 2a. Add detailed-grid class
    if (html.includes('<div class="books-grid" id="books-grid">')) {
        html = html.replace(/<div class="books-grid" id="books-grid">/g, '<div class="books-grid detailed-grid" id="books-grid">');
        wasModified = true;
    }
    
    // 2b. Make sure books-unified.css is linked
    if (!html.includes('books-unified.css')) {
        html = html.replace(/<link rel="stylesheet" href="css\/styles\.css">/, '<link rel="stylesheet" href="css/styles.css">\n    <link rel="stylesheet" href="css/books-unified.css">');
        wasModified = true;
    }
    
    // 2c. Rewrite book cards
    const cardRegex = /<div class="book-card[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    
    html = html.replace(cardRegex, (match, cardInner) => {
        wasModified = true;
        // Extract elements
        const linkMatch = cardInner.match(/<a\s+href="([^"]+)"[^>]*class="book-cover-link"[^>]*>([\s\S]*?)<\/a>/);
        const titleMatch = cardInner.match(/<h3 class="book-title">([^<]+)<\/h3>/);
        const authorMatch = cardInner.match(/<div class="book-author">([^<]+)<\/div>/);
        const priceMatch = cardInner.match(/<span class="book-price">([^<]+)<\/span>/);
        const buyMatch = cardInner.match(/<a\s+href="([^"]+)"[^>]*class="btn-buy"[^>]*>BUY NOW<\/a>/);
        
        if (!linkMatch || !titleMatch) {
            return match; // Skip if we can't parse
        }
        
        const coverLinkHtml = linkMatch[0];
        const title = titleMatch[1].trim();
        const authorHtml = authorMatch ? `<div class="book-author">${authorMatch[1].trim()}</div>` : '';
        const price = priceMatch ? priceMatch[1].trim() : '$0.00';
        const buyUrl = buyMatch ? buyMatch[1] : linkMatch[1];
        
        const slug = generateSlug(title);
        let summaryHtml = "";
        
        // Find summary
        if (bookSummaries[slug]) {
            summaryHtml = bookSummaries[slug].summaryHtml;
        } else {
            // fuzzy match
            const exactKey = Object.keys(bookSummaries).find(k => k.includes(slug) || slug.includes(k));
            if (exactKey) {
                summaryHtml = bookSummaries[exactKey].summaryHtml;
            }
        }
        
        const shortSummary = extractShortSummary(summaryHtml);
        
        return `<div class="book-card-detailed">
    <div class="book-card-top">
        ${coverLinkHtml}
        <div class="book-card-actions">
            <span class="book-price">${price}</span>
            <a href="${buyUrl}" class="btn-buy" target="_blank" rel="noopener noreferrer">BUY NOW</a>
            <a href="#" class="btn-summary">SUMMARY</a>
        </div>
    </div>
    <div class="book-card-summary">
        <p>${shortSummary}</p>
    </div>
    <div class="book-card-bottom">
        <h3 class="book-title">${title}</h3>
        ${authorHtml}
    </div>
</div>`;
    });
    
    if (wasModified) {
        fs.writeFileSync(filePath, html);
        filesModified++;
    }
}

console.log(`Successfully redesigned ${filesModified} book pages!`);
