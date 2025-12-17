const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlDir = path.join(__dirname, 'public', 'html');
const indexFile = path.join(__dirname, 'public', 'index.html');

function fixHtml(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(content);

        // Cheerio automatically handles self-closing tags and balances tags
        const fixed = $.html();

        fs.writeFileSync(filePath, fixed);
        console.log(`✅ Fixed: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

console.log('🔧 Starting HTML syntax fix...');

// Fix index.html
if (fs.existsSync(indexFile)) {
    fixHtml(indexFile);
} else {
    console.log('⚠️  index.html not found');
}

// Fix all HTML files in public/html/
if (fs.existsSync(htmlDir)) {
    const files = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
    console.log(`📁 Found ${files.length} HTML files in public/html/`);

    let fixedCount = 0;
    files.forEach(file => {
        const filePath = path.join(htmlDir, file);
        if (fixHtml(filePath)) {
            fixedCount++;
        }
    });

    console.log(`✅ Fixed ${fixedCount}/${files.length} HTML files`);
} else {
    console.log('⚠️  public/html/ directory not found');
}

console.log('🎉 HTML syntax fix complete!');