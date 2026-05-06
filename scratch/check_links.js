const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find all elements with class 'buffett-topics' or inside '.buffett-content'
// Or search for <a href="#" ... or <a href="" ... inside the Warren Buffett section.
// Let's print out all lines containing '<a' inside the Warren Buffett section.
// The Warren Buffett section typically starts with some id or class like "buffett" or "buffett-portal"
const lines = content.split('\n');
let insideBuffett = false;
let buffettLinesCount = 0;

console.log('--- Buffett section links in index.html ---');
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('id="buffett"') || line.toLowerCase().includes('class="buffett"') || line.toLowerCase().includes('id="warren-buffett"')) {
        insideBuffett = true;
    }
    if (insideBuffett) {
        buffettLinesCount++;
        if (line.includes('<a') && (line.includes('#') || !line.includes('href'))) {
            console.log(`Line ${i + 1}: ${line.trim()}`);
        }
        if (buffettLinesCount > 2000) { // Safety limit
            insideBuffett = false;
        }
    }
});
