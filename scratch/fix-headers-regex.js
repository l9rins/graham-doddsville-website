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
            
            // Regex to find the bad selector and remove .article-detail-header
            const regex = /html,\s*body,\s*\.container,\s*\.header,\s*\.header-content,\s*\.page-title-section,\s*\.collapsible-content,\s*\.article-detail-header\s*\{/g;
            const replacement = 'html, body, .container, .header, .header-content, .page-title-section, .collapsible-content {';
            
            if (regex.test(content)) {
                let newContent = content.replace(regex, replacement);
                fs.writeFileSync(p, newContent);
                console.log('Fixed ' + p);
            }
        }
    });
});
