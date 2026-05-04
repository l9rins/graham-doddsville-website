const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// The two directories where books are served
const dirs = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'html')
];

// Pre-defined manual overrides for the remaining hard-to-find books
const overrides = {
    // Exact or partial book title matching
    "Warren Buffett and the Value Investing Mindset": "https://m.media-amazon.com/images/I/41D8VbQ6RcL._SY445_SX342_.jpg",
    "The Essays of Warren Buffett": "https://m.media-amazon.com/images/I/41bIksR+pBL._SY445_SX342_.jpg",
    "A Few Lessons for Investors and Managers": "https://m.media-amazon.com/images/I/41c4yO6B1mL._SY445_SX342_.jpg",
    "Charlie Munger: The Complete Investor": "https://m.media-amazon.com/images/I/41Jk91m+2cL._SY445_SX342_.jpg",
    "Thinking, Fast and Slow": "https://m.media-amazon.com/images/I/41shxS7mN8L._SY445_SX342_.jpg",
    "Never Finished": "https://m.media-amazon.com/images/I/41Yv9H9wWVL._SY445_SX342_.jpg",
    "The Pivot Year": "https://m.media-amazon.com/images/I/41E9i13R+xL._SY445_SX342_.jpg",
    "Where Are the Customers' Yachts?": "https://m.media-amazon.com/images/I/51Bqj9W1x8L._SY445_SX342_.jpg",
    "Ca$hvertising": "https://images-na.ssl-images-amazon.com/images/P/1601630328.01.LZZZZZZZ.jpg",
    "Super Duper Profitable Ads": "https://images-na.ssl-images-amazon.com/images/P/B0CNSWBBJT.01.LZZZZZZZ.jpg",
    "Secrets of Successful Selling Habits": "https://images-na.ssl-images-amazon.com/images/P/1722501219.01.LZZZZZZZ.jpg",
    "The Secrets of Value Investing You Need to Know": "https://images-na.ssl-images-amazon.com/images/P/B09K4SG7C5.01.LZZZZZZZ.jpg",
    "Mosaic: Perspectives on Investing": "https://images-na.ssl-images-amazon.com/images/P/0974797413.01.LZZZZZZZ.jpg",
    "Value.able": "https://images-na.ssl-images-amazon.com/images/P/B017HWLFAC.01.LZZZZZZZ.jpg",
    "How to Become Rich and Successful": "https://images-na.ssl-images-amazon.com/images/P/198115668X.01.LZZZZZZZ.jpg",
    "A 9-Step Path To Financial Independence": "https://images-na.ssl-images-amazon.com/images/P/1507818009.01.LZZZZZZZ.jpg",
    "Valuepreneurs": "https://images-na.ssl-images-amazon.com/images/P/B0CLT7ZGBX.01.LZZZZZZZ.jpg",
    "Seeking Wisdom: From Darwin to Munger": "https://covers.openlibrary.org/b/id/9671797-L.jpg",
    "The Warren Buffett Stock Portfolio": "https://m.media-amazon.com/images/I/516m1f+0FAL._SY445_SX342_.jpg",
    "Warren Buffett's 3 Favorite Books": "https://covers.openlibrary.org/b/id/7775343-L.jpg",
    "Warren Buffett’s 3 Favorite Books": "https://covers.openlibrary.org/b/id/7775343-L.jpg",
    "Warren Buffett\u0027s 3 Favorite Books": "https://covers.openlibrary.org/b/id/7775343-L.jpg"
};

async function fetchCover(title, author = '') {
    const cleanTitle = title.replace(/\\u[0-9a-fA-F]{4}/g, '').trim();
    
    // Check manual override first
    let overrideSrc = overrides[title] || overrides[cleanTitle];
    if (!overrideSrc) {
        for (const key of Object.keys(overrides)) {
            if (title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(title.toLowerCase())) {
                overrideSrc = overrides[key];
                break;
            }
        }
    }
    if (overrideSrc) {
        return overrideSrc;
    }

    // Attempt Google Books search
    try {
        const query = `${title} ${author}`.trim();
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
        console.log(`Searching Google Books for: "${query}"`);
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                const book = data.items[0];
                const links = book.volumeInfo.imageLinks;
                if (links && (links.thumbnail || links.smallThumbnail)) {
                    const src = links.thumbnail || links.smallThumbnail;
                    return src.replace('http://', 'https://');
                }
            }
        }
    } catch (err) {
        console.error(`Google Books error: ${err.message}`);
    }

    // Attempt OpenLibrary search
    try {
        const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`;
        console.log(`Searching OpenLibrary for: "${title}"`);
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data.docs && data.docs.length > 0) {
                const doc = data.docs[0];
                if (doc.cover_i) {
                    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
                }
            }
        }
    } catch (err) {
        console.error(`OpenLibrary error: ${err.message}`);
    }

    return null;
}

async function processFiles() {
    let totalUpdated = 0;

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('books.html'));
        console.log(`\nScanning directory: ${dir}`);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const html = fs.readFileSync(filePath, 'utf-8');
            const $ = cheerio.load(html);
            let fileUpdated = false;

            const cards = $('.book-card').toArray();
            for (const card of cards) {
                const $card = $(card);
                const img = $card.find('img.book-cover');
                const src = img.attr('src');
                const title = $card.find('.book-title').text().trim();
                const author = $card.find('.book-author').text().trim();
                
                // If the src contains placeholder OR if we have an explicit override for this title, let's update it
                const cleanTitle = title.replace(/\\u[0-9a-fA-F]{4}/g, '').trim();
                const isPlaceholder = src && (src.includes('placehold.co') || src.includes('Cover+Not+Found') || src.includes('text='));
                const hasOverride = overrides[title] || overrides[cleanTitle] || Object.keys(overrides).some(key => title.toLowerCase().includes(key.toLowerCase()));

                if (isPlaceholder || hasOverride) {
                    const newSrc = await fetchCover(title, author);
                    if (newSrc && newSrc !== src) {
                        console.log(`Applying cover for "${title}": ${newSrc}`);
                        img.attr('src', newSrc);
                        // Make sure paths are correct depending on directory
                        const isSubDir = dir.endsWith('html');
                        img.attr('onerror', `this.src='${isSubDir ? '../images/G&D Logo (for black background).png' : 'images/G&D Logo (for black background).png'}'`);
                        fileUpdated = true;
                        totalUpdated++;
                    }
                }
            }

            if (fileUpdated) {
                fs.writeFileSync(filePath, $.html());
                console.log(`Updated ${file}`);
            }
        }
    }

    console.log(`\nFinished. Total covers updated across all directories: ${totalUpdated}`);
}

processFiles().catch(console.error);
