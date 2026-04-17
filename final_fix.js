const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'html', 'value-investing-books.html');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Deduplicate Author options within each select
    content = content.replace(/<select class="book-sort"[\s\S]*?<\/select>/gi, (select) => {
        let seenAuthor = false;
        // Keep only first <option value="author">Author</option>
        return select.replace(/<option value="author">Author<\/option>/gi, (match) => {
            if (!seenAuthor) {
                seenAuthor = true;
                return match;
            }
            return ''; // delete duplicate within same select
        });
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Explicitly deduplicated Author options in value-investing-books.html');
}
