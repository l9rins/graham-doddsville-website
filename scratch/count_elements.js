const fs = require('fs');
const path = require('path');

const docPath = path.join(__dirname, 'docx_extracted', 'word', 'document.xml');
const relsPath = path.join(__dirname, 'docx_extracted', 'word', '_rels', 'document.xml.rels');

const docXml = fs.readFileSync(docPath, 'utf8');
const relsXml = fs.readFileSync(relsPath, 'utf8');

const relsRegex = /<Relationship Id="([^"]+)" Type="([^"]+)" Target="([^"]+)"/g;
let relMatch;
const rels = {};
while ((relMatch = relsRegex.exec(relsXml)) !== null) {
    rels[relMatch[1]] = relMatch[3];
}

const images = [];
const imgRegex = /<a:blip r:embed="([^"]+)"/g;
let imgMatch;
while ((imgMatch = imgRegex.exec(docXml)) !== null) {
    images.push(rels[imgMatch[1]]);
}

const links = [];
// It is better to extract hyperlinks by their w:hyperlink tag, OR by just regexing for amazon URLs in the raw text
const textRegex = /<w:t(?: xml:space="preserve")?>(.*?)<\/w:t>/g;
let tMatch;
let docText = "";
while ((tMatch = textRegex.exec(docXml)) !== null) {
    docText += tMatch[1];
}

const urlRegex = /https:\/\/www\.(?:amazon|magshop)[^\s<]+/g;
let urlMatch;
while ((urlMatch = urlRegex.exec(docText)) !== null) {
    links.push(urlMatch[0]);
}

console.log(`Found ${images.length} images and ${links.length} links.`);
if (images.length === links.length) {
    console.log("Perfect match!");
} else {
    console.log("Mismatch!");
}
