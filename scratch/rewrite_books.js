const fs = require('fs');
const cheerio = require('cheerio');

const htmlPath = 'public/warren-buffett-books.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(html, { decodeEntities: false });

let count = 0;

$('#books-grid .book-card').each(function() {
    const card = $(this);
    
    // Extract info
    const coverLink = card.find('a.book-cover-link');
    const img = coverLink.find('img.book-cover');
    const title = card.find('.book-title').text().trim();
    const author = card.find('.book-author').text().trim();
    const price = card.find('.book-price').text().trim();
    let buyHref = card.find('.btn-buy').attr('href');
    
    if (buyHref) {
        if (buyHref.includes('tag=')) {
            buyHref = buyHref.replace(/tag=[^&]+/, 'tag=carl0c72-20');
        } else {
            buyHref += (buyHref.includes('?') ? '&' : '?') + 'tag=carl0c72-20';
        }
    }
    
    // Create new structure
    const newHtml = `
<div class="book-card-detailed">
    <div class="book-card-top">
        <a href="${buyHref}" class="book-cover-link" target="_blank" rel="noopener noreferrer">
            ${$.html(img)}
        </a>
        <div class="book-card-actions">
            <span class="book-price">${price}</span>
            <a href="${buyHref}" class="btn-buy" target="_blank" rel="noopener noreferrer">BUY NOW</a>
            <a href="#" class="btn-summary">SUMMARY</a>
        </div>
    </div>
    <div class="book-card-summary">
        <p>In this third volume of The Deals of Warren Buffett, we trace Warren Buffett's journey as he made Berkshire Hathaway the largest company in America. This enthralling instalment follows ...</p>
    </div>
    <div class="book-card-bottom">
        <h3 class="book-title">${title}</h3>
        <div class="book-author">${author}</div>
    </div>
</div>`;

    card.replaceWith(newHtml);
    count++;
});

fs.writeFileSync(htmlPath, $.html(), 'utf8');
console.log('Updated ' + count + ' book cards');
