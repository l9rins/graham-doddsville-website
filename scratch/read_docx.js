const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const filePath = path.join(__dirname, '..', 'xlsx', '2026-05-22  G&D mobile - comments.docx');
const cfb = XLSX.CFB.read(filePath, { type: 'file' });

// Find document.xml (at root level in this docx)
const docEntry = cfb.FileIndex.find(f => f.name === 'document.xml');
if (!docEntry) {
    console.error('document.xml not found');
    process.exit(1);
}

const xmlString = docEntry.content.toString('utf8');

// Parse XML to extract text
const text = xmlString
    .replace(/<w:p[^>]*\/>/g, '\n')
    .replace(/<w:p[^>]*>/g, '\n')
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<w:br[^>]*\/>/g, '\n')
    .replace(/<w:cr[^>]*\/>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

console.log(text);
console.log(`\n--- Total: ${text.length} characters ---`);
