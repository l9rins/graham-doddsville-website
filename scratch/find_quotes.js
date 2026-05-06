const fs = require('fs');
const path = require('path');

const files = ['index.html', 'public/index.html', 'server.js'];

files.forEach(file => {
  const filePath = path.join('c:\\Users\\Mark Lorenz\\Desktop\\LibraryWebsite', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n--- File: ${file} ---`);
    console.log(`Length: ${content.length} characters`);
    
    // Find all occurrences of "quotes" (case insensitive)
    const regex = /quote/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(content)) && count < 10) {
      count++;
      const index = match.index;
      const snippet = content.substring(Math.max(0, index - 50), Math.min(content.length, index + 50)).replace(/\n/g, ' ');
      console.log(`Match ${count} at index ${index}: ...${snippet}...`);
    }
    console.log(`Total occurrences in ${file}: ${count >= 10 ? '10+' : count}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
