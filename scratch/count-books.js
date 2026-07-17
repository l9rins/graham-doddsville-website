const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('books.html'));

let totalBooks = 0;
let bookTitles = new Set();

files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const regex = /<h3 class="book-title">([^<]+)<\/h3>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        bookTitles.add(match[1].trim());
        totalBooks++;
    }
});

console.log(`Total books found in HTML: ${totalBooks}`);
console.log(`Unique book titles: ${bookTitles.size}`);

// Check against data.js
const dataJs = fs.readFileSync(path.join(dir, 'js', 'book-summaries-data.js'), 'utf8');
const slugRegex = /"([^"]+)":\s*\{/g;
let dataJsKeys = new Set();
let match2;
while ((match2 = slugRegex.exec(dataJs)) !== null) {
    dataJsKeys.add(match2[1]);
}

console.log(`Total keys in book-summaries-data.js: ${dataJsKeys.size}`);

// Create slug function similar to modal script
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

let missing = [];
for (let title of bookTitles) {
    let slug = createSlug(title);
    if (!dataJsKeys.has(slug)) {
        missing.push(title);
    }
}

console.log(`Missing summaries: ${missing.length}`);
console.log(`First 10 missing:`, missing.slice(0, 10));
