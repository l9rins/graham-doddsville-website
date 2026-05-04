const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const targetedFixes = [
    {
        file: 'warren-buffett-books.html',
        title: "Warren Buffett's 3 Favorite Books",
        src: "https://covers.openlibrary.org/b/id/7775343-L.jpg"
    },
    {
        file: 'warren-buffett-books.html',
        title: "Warren Buffett: 43 Lessons for Business & Life",
        src: "https://m.media-amazon.com/images/I/51uU838i6YL._SY445_SX342_.jpg"
    },
    {
        file: 'value-investing-books.html',
        title: "Value Investing: Tools and Techniques",
        src: "https://m.media-amazon.com/images/I/41D8VbQ6RcL._SY445_SX342_.jpg"
    },
    {
        file: 'share-investing-books.html',
        title: "How to Make Money in Stocks (Beginner's Guide)",
        src: "https://m.media-amazon.com/images/I/51rP49H5u8L._SY445_SX342_.jpg"
    },
    {
        file: 'business-management-books.html',
        title: "From the Trash Man to the Cash Man",
        src: "https://m.media-amazon.com/images/I/518Q00q4q1L._SY445_SX342_.jpg"
    }
];

targetedFixes.forEach(({ file, title, src }) => {
    const filePath = path.join(__dirname, 'public', file);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    $('.book-card').each((i, el) => {
        const bookTitle = $(el).find('.book-title').text().trim();
        const img = $(el).find('img.book-cover');
        
        // Match either the plain title or a substring
        if (bookTitle.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(bookTitle.toLowerCase())) {
            console.log(`Matching card "${bookTitle}" -> applying cover.`);
            img.attr('src', src);
            img.attr('onerror', "this.src='images/G&D Logo (for black background).png'");
        }
    });

    fs.writeFileSync(filePath, $.html());
    console.log(`Successfully updated ${file} with the cover for "${title}".`);
});
