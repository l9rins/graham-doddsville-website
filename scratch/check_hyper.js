const fs = require('fs');
const doc = fs.readFileSync('scratch/docx_extracted/word/document.xml', 'utf8');
const regex = /<w:hyperlink[^>]*?r:id=\"([^\"]+)\"[^>]*>([\s\S]*?)<\/w:hyperlink>/g;
let count = 0;
let m;
while(m = regex.exec(doc)) {
    if (m[2].includes('<w:drawing')) count++;
}
console.log('Hyperlinked images:', count);
