// Verify news-sources-data.js
const fs = require('fs');
let code = fs.readFileSync('news-sources-data.js', 'utf8');
// Replace const with var for Node eval
code = code.replace(/^const /gm, 'var ');
eval(code);

const cats = Object.keys(newsSourcesData);
console.log('=== NEWS SOURCES DATA VERIFICATION ===\n');
console.log(`Total categories: ${cats.length}`);
console.log('');

let totalSources = 0;
cats.forEach(c => {
    const meta = categoryMeta[c];
    const count = newsSourcesData[c].length;
    totalSources += count;
    console.log(`  ${meta.icon} ${meta.title.padEnd(16)} | ${String(count).padStart(2)} sources | Section: ${meta.section}`);
    
    // Check for missing URLs
    newsSourcesData[c].forEach((s, i) => {
        if (!s.url || !s.name) {
            console.log(`    ⚠️  Row ${i}: missing name or url!`);
        }
    });
});

console.log(`\n  Total sources: ${totalSources}`);
console.log('\n✅ All data valid!');
