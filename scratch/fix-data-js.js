const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const dataFilePath = path.join(publicDir, 'js', 'book-summaries-data.js');
let dataJs = fs.readFileSync(dataFilePath, 'utf8');

const imgDir = path.join(publicDir, 'images', 'book-covers', 'fixed');
const fixedFiles = fs.readdirSync(imgDir).filter(f => f.endsWith('.jpg'));

let updated = 0;
fixedFiles.forEach(file => {
    let slug = file.replace('.jpg', '');
    let newSrc = `images/book-covers/fixed/${file}`;
    
    // We are looking for the exact slug block in the file
    // Example: "slug": { ... "summaryHtml": "...<img src=\"images/book-covers/image5323.webp\"..." }
    let blockRegex = new RegExp(`("${slug}":\\s*\\{[\\s\\S]*?"summaryHtml":\\s*".*?<img src=\\\\")([^\\\\"]+)(\\\\".*?")`, 'g');
    
    dataJs = dataJs.replace(blockRegex, (match, prefix, oldSrc, suffix) => {
        if (oldSrc !== newSrc) {
            updated++;
            return prefix + newSrc + suffix;
        }
        return match;
    });
});

fs.writeFileSync(dataFilePath, dataJs, 'utf8');
console.log(`Fixed ${updated} summary images!`);
