const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'html', 'value-investing-books.html');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // First, remove ALL sort control blocks entirely to start fresh
    const sortBlockRegex = /<div class="book-sort-controls"[^>]*>[\s\S]*?<\/div>/gi;
    content = content.replace(sortBlockRegex, '');
    
    // Now, insert ONE sort control at the top of the books-content section
    const sortControl = `
<div class="book-sort-controls" style="margin-bottom:12px; margin-top:20px;">
  <label style="font-size:13px; margin-right:6px;">Sort by:</label>
  <select class="book-sort" onchange="sortBooks(this)" style="font-size:13px; padding:4px 8px; border-radius:4px; border:1px solid #ccc;">
    <option value="default">Default</option>
    <option value="rating">Rating</option>
    <option value="title">Title</option>
    <option value="author">Author</option>
    <option value="date">Date</option>
    <option value="price">Price</option>
  </select>
</div>`;

    // Insert after the books-content start or after the first h2
    if (content.includes('<section class="books-content">')) {
        content = content.replace('<section class="books-content">', '<section class="books-content">\n' + sortControl);
    }
    
    // Ensure the sorting script can handle multiple grids
    // We'll inject/update a robust sortBooks function
    const sortScript = `
    function sortBooks(selectEl) {
        const sortValue = selectEl.value;
        const grids = document.querySelectorAll('.books-grid');
        
        grids.forEach(grid => {
            const cards = Array.from(grid.querySelectorAll('.book-card'));
            
            cards.sort((a, b) => {
                let valA, valB;
                if (sortValue === 'title') {
                    valA = a.querySelector('.book-title').textContent.trim().toLowerCase();
                    valB = b.querySelector('.book-title').textContent.trim().toLowerCase();
                    return valA.localeCompare(valB);
                } else if (sortValue === 'author') {
                    // Extract author from title or summary if not explicit
                    valA = (a.querySelector('.book-author') || a.querySelector('.book-title')).textContent.toLowerCase();
                    valB = (b.querySelector('.book-author') || b.querySelector('.book-title')).textContent.toLowerCase();
                    return valA.localeCompare(valB);
                } else if (sortValue === 'price') {
                    valA = parseFloat(a.querySelector('.book-price').textContent.replace(/[^0-9.]/g, '')) || 0;
                    valB = parseFloat(b.querySelector('.book-price').textContent.replace(/[^0-9.]/g, '')) || 0;
                    return valA - valB;
                }
                return 0;
            });
            
            cards.forEach(card => grid.appendChild(card));
        });
    }
`;

    if (content.includes('</script>')) {
        content = content.replace('</script>', sortScript + '\n    </script>');
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed value-investing-books.html: Consolidated sort controls and added robust sort script.');
}
