const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directoryPath = path.join(__dirname, '../public');
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(directoryPath, file);
    let fileContent = fs.readFileSync(filePath, 'utf8');

    if (!fileContent.includes('class="drawer-link"')) {
        continue;
    }

    const $ = cheerio.load(fileContent);
    let modified = false;

    $('.drawer-link').each((i, elem) => {
        const titleSpan = $(elem).find('.drawer-title');
        if (titleSpan.length > 0) {
            const titleText = titleSpan.text();
            $(elem).text(titleText); // replace inner html with just the text
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log(`Reverted drawer menu in ${file}`);
    }
}
