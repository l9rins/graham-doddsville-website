const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

const publicDir = path.join(process.cwd(), 'public');
const fixedDir = path.join(publicDir, 'images', 'book-covers', 'fixed');

if (!fs.existsSync(fixedDir)) {
    fs.mkdirSync(fixedDir, { recursive: true });
}

function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function fetchJson(url) {
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'LibraryWebsiteUpdater/1.0' } });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

async function downloadImage(url, dest) {
    try {
        const response = await fetch(url);
        if (!response.ok) return false;
        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(arrayBuffer));
        return true;
    } catch (e) {
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return false;
    }
}

async function main() {
    console.log("Starting book cover sync...");
    const files = fs.readdirSync(publicDir).filter(f => f.endsWith('books.html'));
    let booksMap = {}; // slug -> { title, author, newSrc: null }
    let htmlAsts = {}; // file -> cheerio AST
    
    // 1. Gather all books using Cheerio
    for (const file of files) {
        const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
        const $ = cheerio.load(content);
        htmlAsts[file] = $;
        
        $('.book-card, .book-card-detailed').each((i, el) => {
            const titleEl = $(el).find('.book-title');
            const authorEl = $(el).find('.book-author');
            const imgEl = $(el).find('.book-cover');
            
            if (titleEl.length > 0 && imgEl.length > 0) {
                let title = titleEl.text().trim();
                let author = authorEl.length > 0 ? authorEl.text().trim() : '';
                let slug = createSlug(title);
                
                if (!booksMap[slug]) {
                    booksMap[slug] = { title, author, newSrc: null };
                }
            }
        });
    }

    const totalBooks = Object.keys(booksMap).length;
    console.log(`Found ${totalBooks} unique books in HTML.`);
    
    let successCount = 0;
    const queue = Object.keys(booksMap);
    let active = 0;
    
    // 2. Fetch and download covers with concurrency of 10
    await new Promise((resolve) => {
        const next = async () => {
            if (queue.length === 0 && active === 0) return resolve();
            if (queue.length === 0) return;
            
            active++;
            const slug = queue.shift();
            const book = booksMap[slug];
            const dest = path.join(fixedDir, `${slug}.jpg`);
            const webPath = `images/book-covers/fixed/${slug}.jpg`;
            
            if (!fs.existsSync(dest)) {
                try {
                    let searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}`;
                    if (book.author) searchUrl += `&author=${encodeURIComponent(book.author)}`;
                    
                    const data = await fetchJson(searchUrl);
                    if (data && data.docs && data.docs.length > 0) {
                        let doc = data.docs.find(d => d.cover_i);
                        if (doc) {
                            let imgUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
                            let ok = await downloadImage(imgUrl, dest);
                            if (ok) {
                                book.newSrc = webPath;
                                successCount++;
                                console.log(`[+] Downloaded: ${book.title}`);
                            } else {
                                console.log(`[-] Failed download: ${book.title}`);
                            }
                        } else {
                            console.log(`[-] No cover found in API: ${book.title}`);
                        }
                    } else {
                        console.log(`[-] Not found in API: ${book.title}`);
                    }
                } catch (e) {
                    console.log(`[-] Error fetching ${book.title}`);
                }
            } else {
                book.newSrc = webPath;
                successCount++;
            }
            
            active--;
            next();
        };
        
        for (let i = 0; i < 10; i++) next();
    });
    
    console.log(`\nSuccessfully acquired ${successCount} covers.`);
    
    // 3. Update HTML files
    let updatedHtmlCount = 0;
    for (const file in htmlAsts) {
        const $ = htmlAsts[file];
        let fileChanged = false;
        
        $('.book-card, .book-card-detailed').each((i, el) => {
            const titleEl = $(el).find('.book-title');
            const imgEl = $(el).find('.book-cover');
            
            if (titleEl.length > 0 && imgEl.length > 0) {
                let slug = createSlug(titleEl.text().trim());
                if (booksMap[slug] && booksMap[slug].newSrc) {
                    let currentSrc = imgEl.attr('src');
                    if (currentSrc !== booksMap[slug].newSrc) {
                        imgEl.attr('src', booksMap[slug].newSrc);
                        fileChanged = true;
                    }
                }
            }
        });
        
        if (fileChanged) {
            fs.writeFileSync(path.join(publicDir, file), $.html(), 'utf8');
            updatedHtmlCount++;
        }
    }
    console.log(`Updated ${updatedHtmlCount} HTML files.`);
    
    // 4. Update book-summaries-data.js
    const dataFilePath = path.join(publicDir, 'js', 'book-summaries-data.js');
    let dataJs = fs.readFileSync(dataFilePath, 'utf8');
    let updatedDataCount = 0;
    
    for (const slug in booksMap) {
        const book = booksMap[slug];
        if (book.newSrc) {
            // Regex to find and replace the image src inside the HTML string in the JS file
            // We find "slug": { ... "summaryHtml": "... <img src="..." ..." }
            const blockRegex = new RegExp(`("${slug}":\\s*\\{[\\s\\S]*?"summaryHtml":\\s*".*?<img src=")([^"]+)(".*?")`, 'g');
            dataJs = dataJs.replace(blockRegex, (match, prefix, oldSrc, suffix) => {
                if (oldSrc !== book.newSrc) {
                    updatedDataCount++;
                    return prefix + book.newSrc + suffix;
                }
                return match;
            });
        }
    }
    
    fs.writeFileSync(dataFilePath, dataJs, 'utf8');
    console.log(`Updated ${updatedDataCount} summaries in book-summaries-data.js`);
}

main();
