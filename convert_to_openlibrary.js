const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dirs = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'html')
];

const openLibraryReplacements = [
    {
        title: "How to Become Rich and Successful",
        src: "https://covers.openlibrary.org/b/isbn/9781981156689-L.jpg"
    },
    {
        title: "A 9-Step Path To Financial Independence",
        src: "https://covers.openlibrary.org/b/isbn/9781507818008-L.jpg"
    },
    {
        title: "A Few Lessons for Investors and Managers",
        src: "https://covers.openlibrary.org/b/isbn/9780615822921-L.jpg"
    },
    {
        title: "Warren Buffett: 43 Lessons for Business & Life",
        src: "https://covers.openlibrary.org/b/isbn/9781979929837-L.jpg"
    },
    {
        title: "Value Investing: Tools and Techniques",
        src: "https://covers.openlibrary.org/b/isbn/9780470683590-L.jpg"
    },
    {
        title: "The Secrets of Value Investing You Need to Know",
        src: "https://covers.openlibrary.org/b/id/12431713-L.jpg"
    },
    {
        title: "Mosaic: Perspectives on Investing",
        src: "https://covers.openlibrary.org/b/isbn/9780974797410-L.jpg"
    },
    {
        title: "Value.able",
        src: "https://covers.openlibrary.org/b/id/8372675-L.jpg"
    },
    {
        title: "Super Duper Profitable Ads",
        src: "https://covers.openlibrary.org/b/id/14589999-L.jpg"
    },
    {
        title: "Ca$hvertising",
        src: "https://covers.openlibrary.org/b/isbn/9781601630322-L.jpg"
    },
    {
        title: "Secrets of Successful Selling Habits",
        src: "https://covers.openlibrary.org/b/isbn/9781722501211-L.jpg"
    },
    {
        title: "Valuepreneurs",
        src: "https://covers.openlibrary.org/b/id/14467777-L.jpg"
    }
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const html = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(html);
        let updated = false;

        $('.book-card').each((i, el) => {
            const bookTitle = $(el).find('.book-title').text().trim();
            const img = $(el).find('img.book-cover');
            
            const match = openLibraryReplacements.find(u => 
                bookTitle.toLowerCase().includes(u.title.toLowerCase()) || 
                u.title.toLowerCase().includes(bookTitle.toLowerCase())
            );

            if (match) {
                console.log(`Updating in ${dir}/${file} for "${bookTitle}"`);
                img.attr('src', match.src);
                img.attr('onerror', dir.endsWith('html') ? "this.src='../images/G&D Logo (for black background).png'" : "this.src='images/G&D Logo (for black background).png'");
                updated = true;
            }
        });

        if (updated) {
            fs.writeFileSync(filePath, $.html());
            console.log(`Successfully updated ${file}`);
        }
    });
});

console.log('Successfully completed the OpenLibrary URL conversion.');
