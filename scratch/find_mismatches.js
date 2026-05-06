const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Parse buffettTopicsData keys in index.html
let keys = [];
const match = content.match(/const\s+buffettTopicsData\s*=\s*(\{[\s\S]*?\});/);
if (match) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
        const keyMatch = line.match(/^\s*['"]?([^'"]+)['"]?\s*:/);
        if (keyMatch) {
            keys.push(keyMatch[1].trim().toLowerCase());
        }
    });
}

// Find all <a> elements inside ul.buffett-topics or similar containers
const links = [];
// A regex to find all <a href="#" ...>Link Text</a> inside index.html
// We'll search for <ul class="buffett-topics"...>...</ul> blocks and extract all link texts
const ulRegex = /<ul class="buffett-topics"[\s\S]*?>([\s\S]*?)<\/ul>/g;
let ulMatch;
while ((ulMatch = ulRegex.exec(content)) !== null) {
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

// Also check .buffett-content-mobile links
const mobileBlockRegex = /<div class="buffett-content-mobile"[\s\S]*?>([\s\S]*?)<\/div>/;
const mobileBlockMatch = content.match(mobileBlockRegex);
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

console.log('Total unique links found in Buffett sections:', links.length);

const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[-.]/g, ' ');

const normalizedKeys = keys.map(k => normalize(k));

const missing = [];
links.forEach(link => {
    const normLink = normalize(link);
    if (!normalizedKeys.includes(normLink)) {
        missing.push(link);
    }
});

console.log('--- Links missing from buffettTopicsData (Stay Tuned) ---');
console.log(missing);
