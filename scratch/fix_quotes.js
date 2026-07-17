const fs = require('fs');
const path = require('path');

const files = [
  'public/philosophy.html',
  'public/investing.html',
  'public/businesses.html',
  'public/governance.html',
  'public/accounting.html',
  'public/economics.html',
  'public/miscellaneous.html'
];

let filesFixed = [];

files.forEach(f => {
  const filePath = path.join(__dirname, '..', f);
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  if (content.includes('? Back to Home')) {
    content = content.replace(/\? Back to Home/g, '← Back to Home');
    changed = true;
  }
  
  if (content.includes('\uFFFD')) {
    content = content.replace(/\uFFFD/g, "'");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesFixed.push(f);
  }
});

console.log('Fixed files:', filesFixed);
