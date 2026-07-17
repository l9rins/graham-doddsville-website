const fs = require('fs');

const diffText = fs.readFileSync('scratch/diff_html.txt', 'utf16le');

const lines = diffText.split('\n');

let mapping = {}; // slug -> imageXXXX.webp
let currentOldImage = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('-') && line.includes('images/book-covers/image')) {
        const match = line.match(/images\/book-covers\/(image\d+\.webp)/);
        if (match) {
            currentOldImage = match[1];
        }
    } else if (line.startsWith('+') && line.includes('images/book-covers/fixed/') && currentOldImage) {
        const match = line.match(/images\/book-covers\/fixed\/([^"]+)\.jpg/);
        if (match) {
            mapping[match[1]] = currentOldImage;
            currentOldImage = null; // reset
        }
    } else if (!line.startsWith('-') && !line.startsWith('+')) {
        currentOldImage = null;
    }
}

console.log(`Found ${Object.keys(mapping).length} mappings!`);
fs.writeFileSync('scratch/slug_to_webp.json', JSON.stringify(mapping, null, 2));

let existingCount = 0;
for (const [slug, webp] of Object.entries(mapping)) {
    if (fs.existsSync(`public/images/book-covers/${webp}`)) {
        existingCount++;
    }
}
console.log(`Found ${existingCount} of the WebP files on disk.`);
