const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const SUMMARIES_DIR = path.join(__dirname, '../xlsx/Summaries');
const DATA_JS_PATH = path.join(__dirname, '../public/js/book-summaries-data.js');

let content = fs.readFileSync(DATA_JS_PATH, 'utf8');
content = content.replace('const bookSummariesData =', 'global.bookSummariesData =');
eval(content);

const manualMap = {
    "the-snowball": "Snowball Warren Buffett and the Business of Life.docx",
    "security-analysis-1940": "Security Analysis The Classic 1940 Edition.docx",
    "security-analysis-2008": "Security Analysis Sixth Edition, Foreword by Warren Buffett.docx",
    "secrets-of-the-millionaire-mind": "Secrets of the Millionaire Mind.docx",
    "the-interpretation-of-financial-statements": "The Interpretation of Financial Statements.docx",
    "damodaran-on-valuation": "Damodaran on Valuation.docx",
    "build-to-sell": "Built to Sell.docx"
};

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

    for (const slug in manualMap) {
        let filenameToMatch = manualMap[slug];
        let book = bookSummariesData[slug];
        
        let foundPath = allDocxFiles.find(p => path.basename(p) === filenameToMatch || path.basename(p) === 'Book Summary - ' + filenameToMatch);
        
        if (foundPath) {
            console.log(`Manually Matched: "${book.title}" ---> "${path.basename(foundPath)}"`);
            try {
                const result = await mammoth.convertToHtml({path: foundPath});
                book.summaryHtml = result.value;
                book.category = path.basename(path.dirname(foundPath));
                matchedCount++;
            } catch (e) {
                console.error(`Error parsing ${foundPath}:`, e);
            }
        } else {
            console.log(`Could not find file for mapping: ${filenameToMatch}`);
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
