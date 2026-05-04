const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dirs = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'html')
];

const targetedUpdates = [
    {
        title: "The Essays of Warren Buffett",
        src: "https://books.google.com/books/content?id=njy3PQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    },
    {
        title: "Warren Buffett and the Value Investing Mindset",
        src: "https://books.google.com/books/content?id=KerLEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "The Warren Buffett Stock Portfolio",
        src: "https://books.google.com/books/content?id=Q1hlAW14l6IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    {
        title: "Charlie Munger: The Complete Investor",
        src: "https://books.google.com/books/content?id=xSBDzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    },
    {
        title: "Value Investing: Tools and Techniques",
        src: "https://images-na.ssl-images-amazon.com/images/P/0470683597.01.LZZZZZZZ.jpg"
    },
    {
        title: "A Few Lessons for Investors and Managers",
        src: "https://images-na.ssl-images-amazon.com/images/P/0615822924.01.LZZZZZZZ.jpg"
    },
    {
        title: "Warren Buffett: 43 Lessons for Business & Life",
        src: "https://images-na.ssl-images-amazon.com/images/P/1979929837.01.LZZZZZZZ.jpg"
    }
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('books.html'));

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
                console.log(`Updating in ${dir}/${file}: "${bookTitle}" -> ${match.src}`);
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
