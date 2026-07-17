
const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('scratch/berkshire.html', 'utf8');
const q = cheerio.load(html);
const links = [];
q('a').each((i, el) => {
    const text = q(el).text().trim();
    const href = q(el).attr('href');
    if (text.length > 20) {
        links.push({ text, href });
    }
});
console.log(links.slice(0, 5));

