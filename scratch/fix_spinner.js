const fs = require('fs');
const path = require('path');

const directories = [
    path.join(__dirname, '../public'),
    path.join(__dirname, '..') // root
];

directories.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (!file.endsWith('.html')) return;
        
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let modified = false;
        
        if (content.includes('<div class="loading-spinner">Loading article...</div>')) {
            content = content.replace(/<div class="loading-spinner">Loading article...<\/div>/g, '<div class="article-loading">Loading article...</div>');
            modified = true;
        }
        
        if (content.includes('.loading-spinner {')) {
            // Need to only replace the inline CSS .loading-spinner that is related to text
            content = content.replace(/\.loading-spinner\s*{\s*text-align:\s*center;\s*padding:\s*40px;\s*color:\s*var\(--text-secondary\);\s*}/g, '.article-loading {\n            text-align: center;\n            padding: 40px;\n            color: var(--text-secondary);\n        }');
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed ' + filePath);
        }
    });
});
