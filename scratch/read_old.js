const fs = require('fs');
const data = fs.readFileSync('scratch/old_data.js', 'utf8');
const match = data.match(/"the-essays-of-warren-buffett":\s*\{[\s\S]*?"summaryHtml":\s*"([^"]+)"/);
console.log(match ? match[1] : 'not found');
