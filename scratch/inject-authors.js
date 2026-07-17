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

function extractAuthor(html) {
    if (!html) return "Unknown Author";
    const authorMatch = html.match(/<p><strong>[^<]+<\/strong><\/p>\s*<p><strong>([^<]+)<\/strong><\/p>/);
    if (authorMatch) {
        return authorMatch[1].trim();
    }
    // Try without strong on second p
    const authorMatch2 = html.match(/<p><strong>[^<]+<\/strong><\/p>\s*<p>([^<]+)<\/p>/);
    if (authorMatch2) {
        return authorMatch2[1].trim();
    }
    return "Unknown Author";
}

function generateSlug(title) {
    return title.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
}

// 2. Process all -books.html
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('-books.html'));

let filesModified = 0;

for (const file of htmlFiles) {
    if (file === 'warren-buffett-books.html') {
        continue;
    }
    
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    let wasModified = false;
    
    // Find all book-card-detailed
    const cardRegex = /<div class="book-card-bottom">\s*<h3 class="book-title">([^<]+)<\/h3>\s*<\/div>/g;
    
    html = html.replace(cardRegex, (match, title) => {
        const titleStr = title.trim();
        const slug = generateSlug(titleStr);
        let summaryHtml = "";
        
        if (bookSummaries[slug]) {
            summaryHtml = bookSummaries[slug].summaryHtml;
        } else {
            const exactKey = Object.keys(bookSummaries).find(k => k.includes(slug) || slug.includes(k));
            if (exactKey) {
                summaryHtml = bookSummaries[exactKey].summaryHtml;
            }
        }
        
        const author = extractAuthor(summaryHtml);
        
        wasModified = true;
        return `<div class="book-card-bottom">\n        <h3 class="book-title">${titleStr}</h3>\n        <div class="book-author">${author}</div>\n    </div>`;
    });
    
    if (wasModified) {
        fs.writeFileSync(filePath, html);
        filesModified++;
    }
}

console.log(`Successfully injected authors into ${filesModified} book pages!`);
