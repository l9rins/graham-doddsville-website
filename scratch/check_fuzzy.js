const fs = require('fs');

const indexContent = fs.readFileSync('index.html', 'utf8');

// Extract inline keys of buffettTopicsData from index.html
const startTopicsData = indexContent.indexOf('const buffettTopicsData = {');
const endTopicsData = indexContent.indexOf('};', startTopicsData);
const topicsDataBlock = indexContent.substring(startTopicsData, endTopicsData + 2);

const keyRegex = /"([^"]+)":\s*`/g;
const inlineKeys = [];
let kMatch;
while ((kMatch = keyRegex.exec(topicsDataBlock)) !== null) {
    inlineKeys.push(kMatch[1].trim());
}

// Find all <a> elements inside ul.buffett-topics or similar containers
const links = [];
const ulRegex = /<ul class="buffett-topics"[\s\S]*?>([\s\S]*?)<\/ul>/g;
let ulMatch;
while ((ulMatch = ulRegex.exec(content = indexContent)) !== null) {
    const block = ulMatch[1];
    const linkRegex = /<a[^>]*>([\s\S]*?)<\/a>/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(block)) !== null) {
        const text = linkMatch[1].trim().replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
        if (text && text !== 'See more') {
            links.push(text);
        }
    }
}

const mobileBlockRegex = /<div class="buffett-content-mobile"[\s\S]*?>([\s\S]*?)<\/div>/;
const mobileBlockMatch = indexContent.match(mobileBlockRegex);
if (mobileBlockMatch) {
    const block = mobileBlockMatch[1];
    const linkRegex = /<a[^>]*>([\s\S]*?)<\/a>/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(block)) !== null) {
        const text = linkMatch[1].trim().replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
        if (text && text !== 'See more' && !links.includes(text)) {
            links.push(text);
        }
    }
}

console.log('Total links:', links.length);
console.log('Total inline keys in buffettTopicsData:', inlineKeys.length);

console.log('\n--- Checking if any inline keys can match links with fuzzy matching ---');
const fuzz = s => s.toLowerCase().replace(/[-.]/g, '').replace(/\s+/g, ' ').trim();

inlineKeys.forEach(key => {
    let matchedLink = null;
    links.forEach(link => {
        if (fuzz(link) === fuzz(key)) {
            matchedLink = link;
        }
    });
    
    const exactMatch = links.includes(key) || links.map(l => l.toLowerCase()).includes(key.toLowerCase());
    
    if (matchedLink && !exactMatch) {
        console.log(`Fuzzy Match: Key "${key}" matches Link "${matchedLink}"`);
    } else if (!matchedLink) {
        console.log(`Unmatched Key (no matching link in index.html): "${key}"`);
    }
});
