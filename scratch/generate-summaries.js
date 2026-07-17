const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('books.html'));
const dataFilePath = path.join(publicDir, 'js', 'book-summaries-data.js');

let dataJs = fs.readFileSync(dataFilePath, 'utf8');

function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Find existing keys to avoid duplicates
const slugRegex = /"([^"]+)":\s*\{/g;
let existingKeys = new Set();
let match2;
while ((match2 = slugRegex.exec(dataJs)) !== null) {
    existingKeys.add(match2[1]);
}

let newEntries = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
    
    // Extract Category from filename (e.g. warren-buffett-books.html -> Warren Buffett Books)
    let category = file.replace('-books.html', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const cardRegex = /<div class="book-card-detailed">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    // Actually a simpler approach: regex match the whole card by finding the next <div class="book-card-detailed"> or end of container
    
    // Let's use a simpler match for all titles, authors, prices, and images.
    // They are all in order within the card. We can split by `<div class="book-card-detailed">`
    const cards = content.split('<div class="book-card');
    
    for (let card of cards) {
        let titleMatch = card.match(/<h3 class="book-title">([^<]+)<\/h3>/);
        let authorMatch = card.match(/<div class="book-author">([^<]+)<\/div>/);
        // Sometimes author might be in a <p> tag? In warren-buffett-books it's <div class="book-author">
        if (!authorMatch) authorMatch = card.match(/<p class="book-author">([^<]+)<\/p>/);
        
        let priceMatch = card.match(/<span class="book-price">([^<]+)<\/span>/);
        let imgMatch = card.match(/<img src="([^"]+)" alt="[^"]*" class="book-cover"/);
        let urlMatch = card.match(/<a href="([^"]+)" class="btn-buy"/);
        
        if (titleMatch) {
            let title = titleMatch[1].trim();
            let author = authorMatch ? authorMatch[1].trim() : 'Unknown Author';
            let price = priceMatch ? priceMatch[1].trim() : '$0.00';
            let img = imgMatch ? imgMatch[1].trim() : 'images/G&D-Logo-(for-black-background).png';
            let url = urlMatch ? urlMatch[1].trim() : '#';
            
            // Clean up author ampersand encoding if any
            author = author.replace(/&amp;/g, '&');
            title = title.replace(/&amp;/g, '&');
            
            let slug = createSlug(title);
            if (!existingKeys.has(slug)) {
                let html = `<p><strong>${title}</strong></p><p><strong>${author}</strong></p><p style="text-align: center;"><img src="${img}" alt="${title}" class="book-cover-summary" onerror="this.src='images/G&amp;D-Logo-(for-black-background).png'" style="max-width: 200px; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"></p><p><strong><br />About </strong></p><p>This is an insightful book on ${category}. <em>${title}</em> by ${author} provides readers with valuable lessons and principles for success. The book outlines core concepts and practical strategies for anyone interested in this topic.</p><p><strong>Product Description</strong></p><p>Dive into this comprehensive guide that explores the fundamental aspects of its field. Whether you are a beginner or a seasoned professional, this book offers actionable advice, real-world examples, and timeless wisdom.</p><p><strong>Indicative Price: ${price}</strong></p><p><strong>BUY NOW</strong></p>`;
                
                let entryString = `\n  "${slug}": {
    "title": ${JSON.stringify(title)},
    "category": ${JSON.stringify(category)},
    "amazonUrl": ${JSON.stringify(url)},
    "summaryHtml": ${JSON.stringify(html)}
  }`;
                newEntries.push(entryString);
                existingKeys.add(slug); // prevent duplicates within the run
            }
        }
    }
});

console.log(`Generated ${newEntries.length} new summaries.`);

if (newEntries.length > 0) {
    // Find the last closing brace of the bookSummariesData object
    let lastBraceIndex = dataJs.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
        // We need to add a comma if the object isn't empty, but assuming there are already entries, we can just replace the last brace.
        // Let's insert before the last brace.
        // Wait, the previous last entry might not have a trailing comma.
        // It's safer to use regex to find the last entry and append a comma.
        let contentBefore = dataJs.substring(0, lastBraceIndex).trimEnd();
        if (!contentBefore.endsWith(',')) {
            contentBefore += ',';
        }
        
        let newFileContent = contentBefore + newEntries.join(',') + '\n};\n';
        fs.writeFileSync(dataFilePath, newFileContent, 'utf8');
        console.log('Successfully updated book-summaries-data.js');
    }
}
