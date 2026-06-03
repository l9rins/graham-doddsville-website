const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const INDEX_PATH = path.join(__dirname, '../public/index.html');
const SUMMARIES_DIR = path.join(__dirname, '../xlsx/Summaries');
const DATA_JS_PATH = path.join(__dirname, '../public/js/book-summaries-data.js');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function run() {
    let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

    // 1. Extract books from index.html
    const books = [];
    const amazonRegex = /<a[^>]*href="(https?:\/\/(?:www\.)?amazon[^"]+)"[^>]*>(.*?)<\/a>/gi;
    
    let match;
    while ((match = amazonRegex.exec(indexHtml)) !== null) {
        let amazonUrl = match[1];
        let originalText = match[2];
        
        // Remove inner HTML tags if any, to get raw text
        let title = originalText.replace(/<[^>]+>/g, '').trim();
        
        // Skip empty or non-book links
        if (!title || title.toLowerCase() === 'amazon' || title.toLowerCase() === 'buy here') continue;

        let slug = slugify(title);
        
        // Only add if not exists
        if (!books.find(b => b.slug === slug)) {
            books.push({
                originalHtml: match[0],
                amazonUrl: amazonUrl,
                title: title,
                slug: slug,
                originalText: originalText,
                summaryHtml: "", // To be populated
                category: "General"
            });
        }
    }
    console.log(`Found ${books.length} unique book links in index.html.`);

    // 2. Parse all docx files
    const categories = fs.readdirSync(SUMMARIES_DIR).filter(f => fs.statSync(path.join(SUMMARIES_DIR, f)).isDirectory());
    
    let matchedCount = 0;
    
    for (const category of categories) {
        const catPath = path.join(SUMMARIES_DIR, category);
        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.docx'));
        
        for (const file of files) {
            // Ignore duplicated _1 files if the non _1 file exists
            if (file.endsWith('_1.docx')) {
                const baseFile = file.replace('_1.docx', '.docx');
                if (files.includes(baseFile)) {
                    continue; // Skip duplicate
                }
            }

            let docTitle = file
                .replace(/^Book Summary - /i, '')
                .replace(/_1\.docx$/i, '')
                .replace(/\.docx$/i, '')
                .trim();
                
            let docSlug = slugify(docTitle);

            // Attempt to find a matching book from index.html
            // Fuzzy match: If the index.html title is a substring of the docTitle, or vice versa
            let matchedBook = books.find(b => docSlug.includes(b.slug) || b.slug.includes(docSlug));
            
            if (!matchedBook) {
                // Try aggressive matching (first 3 words)
                let docWords = docSlug.split('-').slice(0, 3).join('-');
                matchedBook = books.find(b => b.slug.startsWith(docWords) || docWords.startsWith(b.slug.split('-').slice(0,3).join('-')));
            }

            if (matchedBook) {
                try {
                    const result = await mammoth.convertToHtml({path: path.join(catPath, file)});
                    matchedBook.summaryHtml = result.value;
                    matchedBook.category = category;
                    matchedCount++;
                } catch (e) {
                    console.error(`Error parsing ${file}:`, e);
                }
            } else {
                console.log(`No match found in index.html for docx: ${docTitle}`);
            }
        }
    }
    
    console.log(`Matched ${matchedCount} summaries to index.html books.`);

    // 3. Generate book-summaries-data.js
    const dataObj = {};
    for (const b of books) {
        dataObj[b.slug] = {
            title: b.title,
            category: b.category,
            amazonUrl: b.amazonUrl,
            summaryHtml: b.summaryHtml
        };
    }
    
    const jsContent = `const bookSummariesData = ${JSON.stringify(dataObj, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = bookSummariesData;\n}`;
    fs.writeFileSync(DATA_JS_PATH, jsContent, 'utf8');
    console.log(`Wrote data to ${DATA_JS_PATH}`);
    
    // 4. Rewrite index.html links
    // We replace the href to point to book-summary.html
    let newIndexHtml = indexHtml;
    for (const b of books) {
        // We must replace only the href attribute of the specific links.
        // A simple string replace of the originalHtml might fail if there are duplicates with the exact same HTML, which is fine (we want to replace all).
        let newLinkHtml = b.originalHtml.replace(b.amazonUrl, `book-summary.html?book=${b.slug}`);
        // ensure target is not _blank if we want it to open in same tab. Wait, user hasn't specified yet. I'll leave target="_blank" as it was originally.
        // If we want same tab, we could remove target="_blank"
        
        // Escape special regex characters in originalHtml for global replace
        let escapedHtml = b.originalHtml.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\\\$&');
        let replaceRegex = new RegExp(escapedHtml, 'g');
        
        newIndexHtml = newIndexHtml.replace(replaceRegex, newLinkHtml);
    }
    
    fs.writeFileSync(INDEX_PATH, newIndexHtml, 'utf8');
    console.log('Rewrote index.html links successfully.');
}

run().catch(console.error);
