const fs = require('fs');
const path = require('path');

const newHtmlDir = path.join(__dirname, '..', 'public');
const mappingFile = path.join(__dirname, 'final_mapping.json');

const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
const htmlFiles = fs.readdirSync(newHtmlDir).filter(f => f.endsWith('books.html'));

let replacedCount = 0;

for (const file of htmlFiles) {
    let html = fs.readFileSync(path.join(newHtmlDir, file), 'utf8');
    
    // Replace <img src="images/book-covers/fixed/<slug>.jpg" with <img src="images/book-covers/imageXXXX.webp"
    for (const [newImg, oldImg] of Object.entries(mapping)) {
        if (html.includes(`images/book-covers/fixed/${newImg}`)) {
            html = html.replace(`images/book-covers/fixed/${newImg}`, `images/book-covers/${oldImg}`);
            replacedCount++;
        }
    }
    
    fs.writeFileSync(path.join(newHtmlDir, file), html);
}

console.log(`Replaced ${replacedCount} image paths in HTML files!`);

// Also update book-summaries-data.js
const dataPath = path.join(newHtmlDir, 'js', 'book-summaries-data.js');
let dataJs = fs.readFileSync(dataPath, 'utf8');

for (const [newImg, oldImg] of Object.entries(mapping)) {
    if (dataJs.includes(`images/book-covers/fixed/${newImg}`)) {
        // use regex to replace all instances
        dataJs = dataJs.split(`images/book-covers/fixed/${newImg}`).join(`images/book-covers/${oldImg}`);
    }
}
fs.writeFileSync(dataPath, dataJs);
console.log(`Updated book-summaries-data.js!`);
