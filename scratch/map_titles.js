const fs = require('fs');
const path = require('path');

const oldHtmlDir = path.join(__dirname, 'old_html');
const newHtmlDir = path.join(__dirname, '..', 'public');

const oldHtmlFiles = fs.readdirSync(oldHtmlDir).filter(f => f.endsWith('books.html'));

let titleToOld = {};
let titleToNew = {};

for (const file of oldHtmlFiles) {
    const oldHtml = fs.readFileSync(path.join(oldHtmlDir, file), 'utf8');
    const newHtml = fs.readFileSync(path.join(newHtmlDir, file), 'utf8');
    
    // Parse old HTML for <img src="images/book-covers/imageXXXX.webp" alt="Title" ...>
    const oldRegex = /<img\s+src="images\/book-covers\/(image\d+\.webp)"\s+alt="([^"]+)"/g;
    let oldMatch;
    while ((oldMatch = oldRegex.exec(oldHtml)) !== null) {
        titleToOld[oldMatch[2].toLowerCase().trim()] = oldMatch[1];
    }
    
    // Parse new HTML for <img src="images/book-covers/fixed/<slug>.jpg" alt="Title" ...>
    const newRegex = /<img\s+src="images\/book-covers\/fixed\/([^"]+\.jpg)"\s+alt="([^"]+)"/g;
    let newMatch;
    while ((newMatch = newRegex.exec(newHtml)) !== null) {
        titleToNew[newMatch[2].toLowerCase().trim()] = newMatch[1];
    }
}

let mapping = {}; // new slug.jpg -> old image.webp
for (const [title, newImg] of Object.entries(titleToNew)) {
    if (titleToOld[title]) {
        mapping[newImg] = titleToOld[title];
    }
}

console.log(`Found ${Object.keys(titleToOld).length} old titles.`);
console.log(`Found ${Object.keys(titleToNew).length} new titles.`);
console.log(`Found ${Object.keys(mapping).length} mappings!`);
fs.writeFileSync(path.join(__dirname, 'final_mapping.json'), JSON.stringify(mapping, null, 2));

let existingCount = 0;
for (const [newImg, oldImg] of Object.entries(mapping)) {
    if (fs.existsSync(path.join(newHtmlDir, 'images', 'book-covers', oldImg))) {
        existingCount++;
    }
}
console.log(`Found ${existingCount} of the old WebP files on disk.`);
