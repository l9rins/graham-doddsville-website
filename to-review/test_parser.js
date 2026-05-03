const fs = require('fs');
let content = fs.readFileSync('C:/Users/Mark Lorenz/Desktop/LibraryWebsite/to-review/april24_comments.txt', 'utf8');

content = content.replace(/\d+\.\d+\s*x\s*\d+\.\d+/g, ' '); // remove dimensions
content = content.replace(/[\f\n\t\r\/]+/g, ' '); // collapse all whitespace and slashes

// Insert newline before every numbering
content = content.replace(/\s+(\d+\.(?:\d+\.)?(?:\d+\.)?\s+[A-Za-z])/g, '\n');
// Also handle the case where it's right at the beginning
content = content.replace(/^(\d+\.(?:\d+\.)?(?:\d+\.)?\s+[A-Za-z])/, '\n');

let parts = content.split('\n').map(p => p.trim()).filter(p => p.length > 0);

for (let i = 0; i < 40; i++) {
    console.log(parts[i]);
}
