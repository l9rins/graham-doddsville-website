const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '../public/index.html');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-')         
        .replace(/^-+/, '')             
        .replace(/-+$/, '');            
}

async function run() {
    let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

    const amazonRegex = /<a[^>]*href="(https?:\/\/(?:www\.)?amazon[^"]+)"[^>]*>(.*?)<\/a>/gi;
    
    let match;
    let books = [];
    while ((match = amazonRegex.exec(indexHtml)) !== null) {
        let amazonUrl = match[1];
        let originalText = match[2];
        let title = originalText.replace(/<[^>]+>/g, '').trim();
        
        if (!title || title.toLowerCase() === 'amazon' || title.toLowerCase() === 'buy here') continue;

        let slug = slugify(title);
        books.push({
            originalHtml: match[0],
            amazonUrl: amazonUrl,
            slug: slug
        });
    }

    let newIndexHtml = indexHtml;
    let replacementCount = 0;
    
    for (const b of books) {
        let newLinkHtml = b.originalHtml.replace(b.amazonUrl, `book-summary.html?book=${b.slug}`);
        // Use string replacement. If replaceAll is available, use it, else fallback to looping split/join
        if (typeof newIndexHtml.replaceAll === 'function') {
            newIndexHtml = newIndexHtml.replaceAll(b.originalHtml, newLinkHtml);
            replacementCount++;
        } else {
            newIndexHtml = newIndexHtml.split(b.originalHtml).join(newLinkHtml);
            replacementCount++;
        }
    }
    
    fs.writeFileSync(INDEX_PATH, newIndexHtml, 'utf8');
    console.log(`Replaced links for ${replacementCount} matches in index.html!`);
}

run().catch(console.error);
