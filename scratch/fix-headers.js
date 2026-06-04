const fs = require('fs');
const path = require('path');

const dirs = [
    __dirname,
    path.join(__dirname, 'public')
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.html')) {
            const p = path.join(dir, file);
            let content = fs.readFileSync(p, 'utf8');
            
            const target = 'html, body, .container, .header, .header-content, .page-title-section, .collapsible-content, .article-detail-header {';
            const replacement = 'html, body, .container, .header, .header-content, .page-title-section, .collapsible-content {';
            
            if (content.includes(target)) {
                let newContent = content.replace(target, replacement);
                fs.writeFileSync(p, newContent);
                console.log('Fixed ' + p);
            }
        }
    });
});
