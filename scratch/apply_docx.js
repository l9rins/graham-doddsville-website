const fs = require('fs');
const path = require('path');

const docxMap = JSON.parse(fs.readFileSync('scratch/docx_mapping.json', 'utf8'));
const finalMap = JSON.parse(fs.readFileSync('scratch/final_mapping.json', 'utf8')); // The 250 restored ones

let newMappings = 0;
let mappingToApply = {};

for (const [slug, imgPath] of Object.entries(docxMap)) {
    // If this book is NOT in the restored 250 (final_mapping uses newImg e.g. the-slug.jpg)
    if (!finalMap[slug + '.jpg']) {
        mappingToApply[slug] = imgPath;
        newMappings++;
    }
}

console.log(`Found ${newMappings} new mappings from the DOCX!`);

for (const [slug, imgPath] of Object.entries(mappingToApply)) {
    const src = path.join(__dirname, 'docx_extracted', 'word', imgPath);
    const dest = path.join(__dirname, '..', 'public', 'images', 'book-covers', 'fixed', slug + '.jpg');
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
    }
}
console.log("Copied the new images over the fixed ones!");
