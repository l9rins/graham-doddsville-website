const fetch = require('node-fetch');

const titles = [
    "The Essays of Warren Buffett",
    "Warren Buffett and the Value Investing Mindset",
    "A Few Lessons for Investors and Managers",
    "The Warren Buffett Stock Portfolio",
    "Charlie Munger: The Complete Investor",
    "Warren Buffett: 43 Lessons for Business & Life",
    "Value Investing: Tools and Techniques"
];

async function getCovers() {
    for (const title of titles) {
        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=1`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    const links = data.items[0].volumeInfo.imageLinks;
                    if (links && (links.thumbnail || links.smallThumbnail)) {
                        const thumb = links.thumbnail || links.smallThumbnail;
                        console.log(`"${title}": "${thumb.replace('http://', 'https://')}",`);
                        continue;
                    }
                }
            }
            console.log(`"${title}": null, // Not found`);
        } catch (err) {
            console.error(`Error for "${title}": ${err.message}`);
        }
    }
}

getCovers();
