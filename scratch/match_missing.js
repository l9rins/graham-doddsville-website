const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const SUMMARIES_DIR = path.join(__dirname, '../xlsx/Summaries');
const DATA_JS_PATH = path.join(__dirname, '../public/js/book-summaries-data.js');

let content = fs.readFileSync(DATA_JS_PATH, 'utf8');
content = content.replace('const bookSummariesData =', 'global.bookSummariesData =');
eval(content);

const missingSlugs = [];
for (const slug in bookSummariesData) {
    if (!bookSummariesData[slug].summaryHtml || bookSummariesData[slug].summaryHtml.trim() === '') {
        missingSlugs.push(slug);
    }
}

function getWords(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(w => w !== '');
}

async function run() {
    let matchedCount = 0;
    
    // get all docx files recursively
    let allDocxFiles = [];
    function readDir(dir) {
        const files = fs.readdirSync(dir);
        for(let f of files) {
            let fullPath = path.join(dir, f);
            if (fs.statSync(fullPath).isDirectory()) {
                readDir(fullPath);
            } else if (f.endsWith('.docx') && !f.endsWith('_1.docx') && !f.startsWith('~$')) {
                allDocxFiles.push(fullPath);
            }
        }
    }
    readDir(SUMMARIES_DIR);

    for (const slug of missingSlugs) {
        let book = bookSummariesData[slug];
        let titleWords = getWords(slug);
        
        let bestMatch = null;
        let bestScore = 0;
        
        for (const docPath of allDocxFiles) {
            let filename = path.basename(docPath).replace('.docx', '').replace(/^Book Summary - /i, '');
            let docWords = getWords(filename);
            
            let score = 0;
            // Ignore common stop words for scoring if they artificially inflate scores
            let stopWords = ['the', 'and', 'of', 'in', 'to', 'a', 'for'];
            for (let w of titleWords) {
                if (docWords.includes(w) && !stopWords.includes(w)) {
                    score++;
                }
            }
            // Add tiny bonus for stop words so they can break ties
            for (let w of titleWords) {
                if (docWords.includes(w) && stopWords.includes(w)) {
                    score += 0.1;
                }
            }
            
            if (score > 0) {
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = docPath;
                } else if (score === bestScore) {
                    let currentDiff = Math.abs(docWords.length - titleWords.length);
                    let bestDocWords = getWords(path.basename(bestMatch).replace('.docx', '').replace(/^Book Summary - /i, ''));
                    let bestDiff = Math.abs(bestDocWords.length - titleWords.length);
                    if (currentDiff < bestDiff) {
                        bestMatch = docPath;
                    }
                }
            }
        }
        
        if (bestScore > 0 && bestMatch) {
            console.log(`Matched: "${book.title}" ---> "${path.basename(bestMatch)}" (Score: ${bestScore})`);
            try {
                const result = await mammoth.convertToHtml({path: bestMatch});
                book.summaryHtml = result.value;
                book.category = path.basename(path.dirname(bestMatch));
                matchedCount++;
            } catch (e) {
                console.error(`Error parsing ${bestMatch}:`, e);
            }
        } else {
            console.log(`No match found for: "${book.title}"`);
        }
    }

    if (matchedCount > 0) {
        const jsContent = `const bookSummariesData = ${JSON.stringify(bookSummariesData, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = bookSummariesData;\n}`;
        fs.writeFileSync(DATA_JS_PATH, jsContent, 'utf8');
        console.log(`\nUpdated ${matchedCount} missing summaries in book-summaries-data.js`);
    } else {
        console.log('\nNo new summaries matched.');
    }
}

run().catch(console.error);
