const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const bookFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('-books.html'));

let titleToImage = {};

bookFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
    const cards = content.split('<div class="book-card">');
    cards.forEach(card => {
        if (!card.includes('class="book-title"')) return;
        
        const titleMatch = card.match(/<h3 class="book-title">(.*?)<\/h3>/);
        const imgMatch = card.match(/<img src="(.*?)"/);
        
        if (titleMatch && imgMatch) {
            let title = titleMatch[1].trim();
            title = title.replace(/&amp;/g, '&');
            let imgSrc = imgMatch[1];
            titleToImage[title] = imgSrc;
        }
    });
});

console.log('Found ' + Object.keys(titleToImage).length + ' images mapped from HTML.');

const summariesFile = path.join(publicDir, 'js', 'book-summaries-data.js');
let summariesContent = fs.readFileSync(summariesFile, 'utf8');

const regex = /("title":\s*"(.*?)",[\s\S]*?"summaryHtml":\s*"(.*?)")/g;
let replacedCount = 0;
let missingImages = [];

let newContent = summariesContent.replace(regex, (match, fullMatch, title, html) => {
    title = title.replace(/\\"/g, '"').trim();
    let img = titleToImage[title];
    if (!img) {
        const key = Object.keys(titleToImage).find(k => k.toLowerCase() === title.toLowerCase() || title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(title.toLowerCase()));
        if (key) img = titleToImage[key];
    }
    
    // Default image if still not found
    if (!img) {
        img = 'images/G&amp;D-Logo-(for-black-background).png';
        missingImages.push(title);
    }
    
    // Find <p>Pages: ...</p>
    const pagesRegex = /(<p>Pages:[^<]*<\/p>)/i;
    if (pagesRegex.test(html) && !html.includes('<img src=')) {
        const imgHtml = `<p style=\\"text-align: center;\\"><img src=\\"${img}\\" alt=\\"${title.replace(/"/g, '&quot;')}\\" class=\\"book-cover-summary\\" style=\\"max-width: 200px; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);\\"></p>`;
        html = html.replace(pagesRegex, `$1${imgHtml}`);
        replacedCount++;
        return fullMatch.replace(/"summaryHtml":\s*".*?"/, `"summaryHtml": "${html}"`);
    }

    return match;
});

fs.writeFileSync(summariesFile, newContent, 'utf8');
console.log('Replaced ' + replacedCount + ' summaries with images.');
console.log('Using default image for ' + missingImages.length + ' books.');
