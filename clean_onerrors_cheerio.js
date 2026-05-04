const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dirs = [
    { path: path.join(__dirname, 'public'), fallback: "images/G&D Logo (for black background).png" },
    { path: path.join(__dirname, 'public', 'html'), fallback: "../images/G&D Logo (for black background).png" }
];

dirs.forEach(({ path: dirPath, fallback }) => {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const html = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(html);
        let updated = false;

        $('img.book-cover').each((i, el) => {
            const onerror = $(el).attr('onerror') || '';
            // If the onerror contains placehold.co or is missing, or has any placeholder, update it.
            if (!onerror || onerror.includes('placehold.co') || onerror.includes('Cover+Not+Found') || onerror.includes('fallback')) {
                $(el).attr('onerror', `this.src='${fallback}'`);
                updated = true;
            }
        });

        if (updated) {
            fs.writeFileSync(filePath, $.html());
            console.log(`Cheerio cleaned up all onerrors in ${file}`);
        }
    });
});

console.log('Successfully completed the robust onerror cleanup.');
