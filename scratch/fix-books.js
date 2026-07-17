const fs = require('fs');
const path = require('path');

const dirs = [process.cwd(), path.join(process.cwd(), 'public')];

dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('books.html')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace the breadcrumb link content
            const newContent = content.replace(
                /<a href="index\.html" class="breadcrumb-link">[^<]+<\/a>/g,
                '<a href="index.html" class="breadcrumb-link">&larr; Home</a>'
            );
            
            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Fixed ${filePath}`);
            }
        }
    });
});
