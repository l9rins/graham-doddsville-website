const fs = require('fs');
const path = require('path');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    if (content.includes('href="styles.css"')) {
        content = content.replace(/href="styles\.css"/g, 'href="css/styles.css"');
        modified = true;
    }
    if (content.includes('href="/css/styles.css')) {
        content = content.replace(/href="\/css\/styles\.css/g, 'href="css/styles.css');
        modified = true;
    }
    if (content.includes('href="mobile-fixes.css"')) {
        content = content.replace(/href="mobile-fixes\.css"/g, 'href="css/mobile-fixes.css"');
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(file, content);
        console.log('Fixed CSS links in ' + file);
    }
}
console.log('Done CSS links!');
