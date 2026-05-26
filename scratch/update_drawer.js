const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directoryPath = path.join(__dirname, '../public');

const descriptions = {
    'Home': '',
    'Wealth Creation': 'The beginner\'s guide to money, saving, managing debt and investing wisely',
    'Legal & Taxation': 'Legal structures, asset protection, taxation, estates, duties & insurance',
    'Financial Markets': 'Understand how global financial markets work and the forces that drive them',
    'Share Investing': 'Learn how shares work, how to think like an investor and build strong portfolios',
    'Greatest Investors': 'Discover the legendary figures who shaped the world of value investing',
    'Investment Analysis': 'Understand industries, business quality, corporate actions and accounting tricks',
    'Financial Statement Analysis': 'How to read and analyse balance sheets, P&Ls and cash flow statements',
    'Stock Valuation': 'How to value stocks based on revenue, earnings, dividends, assets and cash flow',
    'Economics': 'Insights into the global and domestic economy, policies, inflation and indicators',
    'Professional Advisers': 'The ultimate guides to the experts who can help you navigate the world of investing',
    'Financial Products': 'The most comprehensive guides to every asset you can possibly invest in',
    'Resources': 'Handy tools, screeners, forums, glossaries, and links to boost your learning',
    'Events & Seminars': 'Discover courses, webinars, podcasts and training to grow your investing skills'
};

function processFile(filePath) {
    if (path.extname(filePath) !== '.html') return;

    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has a drawer menu
    if (!fileContent.includes('class="drawer-link"')) {
        return;
    }

    const $ = cheerio.load(fileContent);
    let modified = false;

    $('.drawer-link').each((i, elem) => {
        const text = $(elem).text().trim();
        
        // Sometimes the text might already have spans if run twice, so let's be careful
        if ($(elem).find('.drawer-title').length > 0) {
            return; // Already processed
        }

        // Clean up text if needed (e.g. "Legal & Taxation" could be "Legal & Taxation")
        const cleanText = text.replace(/\s+/g, ' ').replace(/&amp;/g, '&');
        
        if (descriptions.hasOwnProperty(cleanText)) {
            const desc = descriptions[cleanText];
            if (desc) {
                $(elem).html(`\n                <span class="drawer-title">${text}</span>\n                <span class="drawer-description">${desc}</span>\n            `);
            } else {
                $(elem).html(`<span class="drawer-title">${text}</span>`);
            }
            modified = true;
        } else {
            console.warn(`Unmatched link text in ${path.basename(filePath)}: "${cleanText}"`);
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            // we don't need to go deep since they are all in public/
        } else {
            processFile(fullPath);
        }
    });
}

walkDir(directoryPath);
