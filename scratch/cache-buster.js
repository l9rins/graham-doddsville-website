const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add ?v=2 to article-image-resolver.js
    content = content.replace(/src="js\/article-image-resolver\.js"/g, 'src="js/article-image-resolver.js?v=2"');
    content = content.replace(/src="js\/article-image-resolver\.js\?v=\d+"/g, 'src="js/article-image-resolver.js?v=3"'); // just in case
    
    // Also add ?v=2 to styles.css just in case we need to update CSS
    content = content.replace(/href="css\/styles\.css"/g, 'href="css/styles.css?v=2"');
    content = content.replace(/href="css\/styles\.css\?v=\d+"/g, 'href="css/styles.css?v=3"');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
}
