const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directoryPath = path.join(__dirname, '../public');

const pageDescriptions = {
    'wealth-creation.html': 'The beginner\'s guide to money, saving, managing debt and investing wisely',
    'legal-taxation.html': 'Legal structures, asset protection, taxation, estates, duties & insurance',
    'financial-markets.html': 'Understand how global financial markets work and the forces that drive them',
    'share-investing.html': 'Learn how shares work, how to think like an investor and build strong portfolios',
    'Greatest-Investors.html': 'Discover the legendary figures who shaped the world of value investing',
    'investment-analysis.html': 'Understand industries, business quality, corporate actions and accounting tricks',
    'financial-statement-analysis.html': 'How to read and analyse balance sheets, P&Ls and cash flow statements',
    'stock-valuation.html': 'How to value stocks based on revenue, earnings, dividends, assets and cash flow',
    'sidebar-economics.html': 'Insights into the global and domestic economy, policies, inflation and indicators',
    'professional-advisers.html': 'The ultimate guides to the experts who can help you navigate the world of investing',
    'financial-products.html': 'The most comprehensive guides to every asset you can possibly invest in',
    'resources.html': 'Handy tools, screeners, forums, glossaries, and links to boost your learning',
    'events.html': 'Discover courses, webinars, podcasts and training to grow your investing skills'
};

for (const [filename, newSubtitle] of Object.entries(pageDescriptions)) {
    const filePath = path.join(directoryPath, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filename}`);
        continue;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(fileContent);
    let modified = false;

    // We only want to update the .page-subtitle that are direct descriptions of the page,
    // which are generally right under .page-title or h1
    
    // There can be multiple .page-subtitle in a file (e.g. wealth-creation.html has 2)
    // We update all of them if they are near the top or look like the main subtitle.
    // In our case, all .page-subtitle in these specific files are for the main page header.
    $('.page-subtitle').each((i, elem) => {
        $(elem).text(newSubtitle);
        modified = true;
    });

    if (modified) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log(`Updated subtitles in ${filename}`);
    }
}
