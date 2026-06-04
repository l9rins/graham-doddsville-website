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

        // Remove the CSS block forcing collapsible headers to be white
        const cssRegex = /[ \t]*\.collapsible-header,\s*\.collapsible-header:hover\s*\{[\s\S]*?\}/g;
        if (cssRegex.test(content)) {
            content = content.replace(cssRegex, '');
            modified = true;
        }

        // Remove the CSS block for title colors
        const cssTitleRegex = /[ \t]*\.collapsible-title,\s*\.collapsible-arrow,\s*\.article-detail-title,\s*\.article-detail-close\s*\{\s*color:\s*#[0-9a-fA-F]+\s*!important;\s*\}/g;
        if (cssTitleRegex.test(content)) {
            content = content.replace(cssTitleRegex, '');
            modified = true;
        }

        // Check if legal-taxation.html is truncated
        if (file === 'legal-taxation.html' && !content.includes('</html>')) {
            content += '\n    </script>\n</body>\n</html>\n';
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(p, content, 'utf8');
            console.log('Fixed ' + p);
        }
    });
});
