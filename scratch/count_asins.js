const fs = require('fs');

const docXml = fs.readFileSync('scratch/docx_extracted/word/document.xml', 'utf8');

const textRegex = /<w:t(?: xml:space="preserve")?>(.*?)<\/w:t>/g;
let docText = "";
let tMatch;
while ((tMatch = textRegex.exec(docXml)) !== null) {
    docText += tMatch[1];
}

const urlRegex = /https:\/\/www\.(?:amazon|magshop)[^\s<]+/g;
let urlMatch;
let asins = new Set();
let titles = new Set();
let links = [];

while ((urlMatch = urlRegex.exec(docText)) !== null) {
    const link = urlMatch[0];
    links.push(link);
    const asinMatch = link.match(/\/dp\/([A-Z0-9]+)/);
    if (asinMatch) asins.add(asinMatch[1]);
    
    const titleMatch = link.match(/amazon\.com\/(.*?)\/dp\//);
    if (titleMatch) titles.add(titleMatch[1]);
}

console.log(`Found ${links.length} total links.`);
console.log(`Found ${asins.size} unique ASINs.`);
console.log(`Found ${titles.size} unique Titles.`);

