const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'public', 'index.html');
const marketPath = path.join(__dirname, 'public', 'html', 'market-quotes.html');
const htmlDir = path.join(__dirname, 'public', 'html');

// 1. Surgical fix for public/index.html
if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf-8');
    
    // Fix headers
    content = content.replace(/<h2>###### CLASSIC READINGS<\/h2>/g, '<h2>CLASSIC READINGS</h2>');
    content = content.replace(/<h2>###### WARREN BUFFETT ON EVERYTHING<\/h2>/g, '<h2>WARREN BUFFETT ON EVERYTHING</h2>');
    
    // Fix See more button block
    // We'll use a regex that matches the block described by the user
    const seeMoreRegex = /<div style="text-align: center; margin-top: 30px; padding-bottom: 20px;">[\s\S]*?warren-buffett-philosophy\.html[\s\S]*?See\s+more[\s\S]*?<\/div>/gi;
    content = content.replace(seeMoreRegex, '');
    
    // Fix images for Around the World if missing
    const regionalHeadings = [
        { name: 'North America', img: 'images/image7.jpeg' },
        { name: 'Europe', img: 'images/image8.jpeg' },
        { name: 'Asia', img: 'images/image9.jpeg' },
        { name: 'Elsewhere', img: 'images/image10.jpeg' }
    ];
    
    regionalHeadings.forEach(h => {
        const headingTag = `<h3 class="sub-category-title">${h.name}</h3>`;
        const imgTag = `<img src="${h.img}" alt="${h.name}" style="width: 100%; height: auto; margin-bottom: 12px; border-radius: 8px;">`;
        if (content.includes(headingTag) && !content.includes(h.img)) {
            content = content.replace(headingTag, headingTag + '\n' + imgTag);
        }
    });

    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log('Surgically fixed index.html');
}

// 2. Fix Author redundancy in book pages
const bookFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
bookFiles.forEach(f => {
    const fPath = path.join(htmlDir, f);
    let content = fs.readFileSync(fPath, 'utf-8');
    
    // Remove duplicate Author options within any select
    // Matches <option value="author">Author</option> and similar
    // We use a regex to look for multiple occurrences in a row or within the same select
    if (content.includes('value="author"')) {
        // Clean up: if there are multiple <option value="author">... items
        // This regex finds the entire <select> and deduplicates the Author option
        content = content.replace(/<select[\s\S]*?<\/select>/gi, (select) => {
            let authorMatches = 0;
            return select.replace(/<option[^>]*?author[^>]*?>[\s\S]*?<\/option>/gi, (match) => {
                authorMatches++;
                return (authorMatches === 1) ? match : '';
            });
        });
        fs.writeFileSync(fPath, content, 'utf-8');
        console.log(`Cleaned up Author options in ${f}`);
    }
});

// 3. Fix market-quotes.html
if (fs.existsSync(marketPath)) {
    let content = fs.readFileSync(marketPath, 'utf-8');
    
    // Deep clean corruption
    content = content.replace(/<parameter name="filePath">[\s\S]*?<\/parameter>/gi, '');
    
    // Ensure JS is there exactly once
    const jsSnippet = `
<script id="quoteHighlightLogic">
    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.hash) {
            setTimeout(() => {
                const el = document.querySelector(window.location.hash);
                if (el) {
                    el.scrollIntoView({behavior: 'smooth', block: 'center'});
                    el.style.transition = 'box-shadow 0.5s';
                    el.style.boxShadow = '0 0 15px 5px #1e3a8a';
                    setTimeout(() => el.style.boxShadow = '', 2000);
                }
            }, 500);
        }
    });
</script>`;

    if (!content.includes('id="quoteHighlightLogic"')) {
        content = content.replace('</body>', jsSnippet + '\n</body>');
    } else {
        // If it exists, replace it to ensure it's clean (not wrapped in weird tags)
        content = content.replace(/<script id="quoteHighlightLogic">[\s\S]*?<\/script>/gi, jsSnippet);
    }
    
    fs.writeFileSync(marketPath, content, 'utf-8');
    console.log('Cleaned market-quotes.html');
}
