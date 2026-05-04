const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dirs = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'html')
];

const targetedUpdates = [
    {
        title: "Thinking, Fast and Slow",
        src: "https://books.google.com/books/content?id=mZ9YDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "Never Finished",
        src: "https://books.google.com/books/content?id=f_G_EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "The Pivot Year",
        src: "https://books.google.com/books/content?id=vS-wEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "How to Make Money in Stocks",
        src: "https://books.google.com/books/content?id=L8XzZfO5_94C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "Where Are the Customers' Yachts?",
        src: "https://books.google.com/books/content?id=ZunODwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "From the Trash Man to the Cash Man",
        src: "https://books.google.com/books/content?id=B5G7DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "Mosaic: Perspectives on Investing",
        src: "https://images-na.ssl-images-amazon.com/images/P/0974797413.01.LZZZZZZZ.jpg"
    },
    {
        title: "How to Become Rich and Successful",
        src: "https://images-na.ssl-images-amazon.com/images/P/198115668X.01.LZZZZZZZ.jpg"
    },
    {
        title: "Warren Buffett: 43 Lessons for Business & Life",
        src: "https://images-na.ssl-images-amazon.com/images/P/1979929837.01.LZZZZZZZ.jpg"
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
            
            const match = targetedUpdates.find(u => 
                bookTitle.toLowerCase().includes(u.title.toLowerCase()) || 
                u.title.toLowerCase().includes(bookTitle.toLowerCase())
            );

            if (match) {
                console.log(`Updating cover in ${dir}/${file} for "${bookTitle}"`);
                img.attr('src', match.src);
                img.attr('onerror', dir.endsWith('html') ? "this.src='../images/G&D Logo (for black background).png'" : "this.src='images/G&D Logo (for black background).png'");
                updated = true;
            }
        });

        if (updated) {
            fs.writeFileSync(filePath, $.html());
            console.log(`Successfully updated covers in ${file}`);
        }
    });
});

console.log('Successfully completed applying exact covers for the 10 problematic books.');
