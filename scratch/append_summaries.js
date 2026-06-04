const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const SUMMARIES_DIR = path.join(__dirname, '../xlsx/Summaries');
const DATA_JS_PATH = path.join(__dirname, '../public/js/book-summaries-data.js');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-')         
        .replace(/^-+/, '')             
        .replace(/-+$/, '');            
}

async function run() {
    // 1. Read existing database
    let rawData = fs.readFileSync(DATA_JS_PATH, 'utf8');
    
    // Extract just the JSON object from the file
    let jsonStr = rawData.replace(/^const bookSummariesData = /, '').replace(/;\s*if\s*\(typeof module[^]*$/, '');
    let db = JSON.parse(jsonStr);

    let dbKeys = Object.keys(db);
    let matchedCount = 0;

    // 2. Parse all docx files in ALL directories (to catch any missed ones)
    const categories = fs.readdirSync(SUMMARIES_DIR).filter(f => fs.statSync(path.join(SUMMARIES_DIR, f)).isDirectory());
    
    for (const category of categories) {
        const catPath = path.join(SUMMARIES_DIR, category);
        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.docx'));
        
        for (const file of files) {
            // Ignore duplicated _1 files
            if (file.endsWith('_1.docx')) {
                const baseFile = file.replace('_1.docx', '.docx');
                if (files.includes(baseFile)) continue;
            }

            let docTitle = file
                .replace(/^Book Summary - /i, '')
                .replace(/_1\.docx$/i, '')
                .replace(/\.docx$/i, '')
                .trim();
                
            let docSlug = slugify(docTitle);

            // Fuzzy match against existing keys in the db
            let matchedKey = dbKeys.find(k => docSlug.includes(k) || k.includes(docSlug));
            
            if (!matchedKey) {
                // Try aggressive matching (first 3 words)
                let docWords = docSlug.split('-').slice(0, 3).join('-');
                matchedKey = dbKeys.find(k => k.startsWith(docWords) || docWords.startsWith(k.split('-').slice(0,3).join('-')));
            }

            if (matchedKey) {
                // Only parse if we haven't already extracted a long summary for this book
                // Wait, it's safer to just overwrite or update if it's currently empty
                if (!db[matchedKey].summaryHtml || db[matchedKey].summaryHtml.trim() === "") {
                    try {
                        const result = await mammoth.convertToHtml({path: path.join(catPath, file)});
                        db[matchedKey].summaryHtml = result.value;
                        db[matchedKey].category = category;
                        matchedCount++;
                        console.log(`Matched and parsed newly added: ${docTitle} -> ${matchedKey}`);
                    } catch (e) {
                        console.error(`Error parsing ${file}:`, e);
                    }
                }
            }
        }
    }
    
    console.log(`Successfully added ${matchedCount} new summaries to the database.`);

    // 3. Write back to file
    const jsContent = `const bookSummariesData = ${JSON.stringify(db, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = bookSummariesData;\n}`;
    fs.writeFileSync(DATA_JS_PATH, jsContent, 'utf8');
    console.log(`Updated ${DATA_JS_PATH}`);
}

run().catch(console.error);
