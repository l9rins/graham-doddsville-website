const fs = require('fs');
const path = require('path');

const dirs = [__dirname, path.join(__dirname, 'public')];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        if (!file.endsWith('.html')) return;
        
        let p = path.join(dir, file);
        let content = fs.readFileSync(p, 'utf8');
        let modified = false;

        // Try using string replacement
        let block1 = `        .collapsible-header, .collapsible-header:hover {
            background: #ffffff !important;
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            color: #1e3a8a !important;
            box-shadow: none !important;
            transform: none !important;
        }`;

        let block2 = `        .collapsible-title, .collapsible-arrow, .article-detail-title, .article-detail-close {
            color: #1e3a8a !important;
        }`;

        // Normalizing line endings for robust replacement
        let lines = content.split(/\r?\n/);
        let newLines = [];
        let skip = false;
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.includes('.collapsible-header, .collapsible-header:hover {') && line.includes('background: #ffffff !important') === false) {
                // If it's the start of the block we want to remove
                if (i + 1 < lines.length && lines[i+1].includes('background: #ffffff !important')) {
                    skip = true;
                    modified = true;
                }
            }
            if (line.includes('.collapsible-title, .collapsible-arrow, .article-detail-title, .article-detail-close {')) {
                skip = true;
                modified = true;
            }
            
            if (!skip) {
                newLines.push(line);
            }
            
            if (skip && line.trim() === '}') {
                skip = false;
            }
        }
        
        content = newLines.join('\r\n');

        // Check if legal-taxation.html is truncated
        if (file === 'legal-taxation.html' && !content.includes('</html>')) {
            content += '\r\n    </script>\r\n</body>\r\n</html>\r\n';
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(p, content, 'utf8');
            console.log('Fixed ' + p);
        }
    });
});
