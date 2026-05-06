const fs = require('fs');
const path = require('path');

// Paths
const indexPath = path.join(__dirname, '..', 'index.html');
const dataPath = path.join(__dirname, 'buffett_data.json');

// Read files
const indexContent = fs.readFileSync(indexPath, 'utf8');
const dataJson = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Extract all link texts under different tabs in index.html
// Desktop tabs
const tabs = {
    philosophy: [],
    investing: [],
    businesses: [],
    governance: [],
    accounting: [],
    economics: [],
    miscellaneous: []
};

// We will parse out each tab block from index.html
Object.keys(tabs).forEach(tab => {
    const startId = `id="${tab}-tab"`;
    const startIndex = indexContent.indexOf(startId);
    if (startIndex === -1) return;
    const endIndex = indexContent.indexOf('</div>', startIndex + 500); // approximate end of tab block
    const block = indexContent.substring(startIndex, endIndex);
    
    const linkRegex = /<li><a href="#"[^>]*>([^<]+)<\/a>/g;
    let match;
    while ((match = linkRegex.exec(block)) !== null) {
        tabs[tab].push(match[1].trim());
    }
});

// Extract buffettTopicsData inline dictionary keys
const startTopicsData = indexContent.indexOf('const buffettTopicsData = {');
const endTopicsData = indexContent.indexOf('};', startTopicsData);
const topicsDataBlock = indexContent.substring(startTopicsData, endTopicsData + 2);

const keyRegex = /"([^"]+)":\s*`/g;
const inlineKeys = [];
let kMatch;
while ((kMatch = keyRegex.exec(topicsDataBlock)) !== null) {
    inlineKeys.push(kMatch[1].trim());
}

const masterKeys = Object.keys(dataJson);

console.log('=== DETAILED WARREN BUFFETT PORTAL AUDIT ===\n');

let totalLinksChecked = 0;
let totalMismatched = 0;
let totalMissing = 0;

Object.keys(tabs).forEach(tab => {
    console.log(`\n--- Category: ${tab.toUpperCase()} ---`);
    tabs[tab].forEach(link => {
        totalLinksChecked++;
        const normLink = link.toLowerCase().trim().replace(/\s+/g, ' ');
        const hasInline = inlineKeys.includes(normLink);
        
        let masterMatch = null;
        let exactMasterMatch = false;
        
        // Find in master data
        masterKeys.forEach(mk => {
            const normMk = mk.toLowerCase().trim().replace(/\s+/g, ' ');
            if (normMk === normLink) {
                masterMatch = mk;
                exactMasterMatch = true;
            }
        });
        
        if (!exactMasterMatch) {
            const fuzz = s => s.replace(/[-.]/g, '').replace(/\s+/g, ' ');
            masterKeys.forEach(mk => {
                if (fuzz(mk.toLowerCase()) === fuzz(normLink)) {
                    masterMatch = mk;
                }
            });
        }
        
        if (!hasInline) {
            if (masterMatch) {
                totalMismatched++;
                console.log(`[MISMATCH] Link "${link}" -> normalizes to "${normLink}"`);
                console.log(`           No key in buffettTopicsData, but key exists in buffett_data.json as "${masterMatch}"`);
            } else {
                totalMissing++;
                console.log(`[MISSING]  Link "${link}" -> normalizes to "${normLink}"`);
                console.log(`           No entry exists in either buffettTopicsData or buffett_data.json`);
            }
        }
    });
});

console.log('\n======================================');
console.log(`Audit Summary:`);
console.log(`  Total links checked: ${totalLinksChecked}`);
console.log(`  Total mismatch errors (formatting/punctuation): ${totalMismatched}`);
console.log(`  Total missing topics (no data at all): ${totalMissing}`);
console.log('======================================');
