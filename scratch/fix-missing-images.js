const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const fixedDir = path.join(publicDir, 'images', 'book-covers', 'fixed');
const coversDir = path.join(publicDir, 'images', 'book-covers');

async function getOpenLibraryUrl(title, author) {
    try {
        let url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
        if (author && author !== 'Unknown Author') url += `&author=${encodeURIComponent(author)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.docs && data.docs.length > 0) {
            const docWithCover = data.docs.find(d => d.cover_i);
            if (docWithCover) {
                return `https://covers.openlibrary.org/b/id/${docWithCover.cover_i}-L.jpg`;
            }
        }
        return null;
    } catch(e) {
        return null;
    }
}

async function downloadImage(url, destPath) {
    try {
        const res = await fetch(url);
        if (!res.ok) return false;
        
        const buffer = await res.arrayBuffer();
        if (buffer.byteLength < 100) return false;
        
        fs.writeFileSync(destPath, Buffer.from(buffer));
        return true;
    } catch(e) {
        return false;
    }
}

function generateSlug(title) {
    return title.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
    const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('books.html'));
    
    let toProcess = [];
    
    for (const file of htmlFiles) {
        const filePath = path.join(publicDir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        
        // This regex will match everything from book-card start to the author div
        const cardRegex = /<div class="book-card(?:-detailed)?">([\s\S]*?)<h3 class="book-title">([^<]+)<\/h3>(?:\s*<div class="book-author">([^<]+)<\/div>)?/g;
        let cardMatch;
        while ((cardMatch = cardRegex.exec(html)) !== null) {
            const cardInner = cardMatch[1];
            
            const imgMatch = cardInner.match(/<img\s+src="images\/book-covers\/(image\d+\.webp)"/);
            if (imgMatch) {
                const imgName = imgMatch[1];
                const imgPath = path.join(coversDir, imgName);
                
                if (!fs.existsSync(imgPath)) {
                    const title = cardMatch[2].trim();
                    const author = cardMatch[3] ? cardMatch[3].trim() : null;
                    const slug = generateSlug(title);
                    toProcess.push({
                        file: filePath,
                        originalImg: imgName,
                        title: title,
                        slug: slug,
                        author: author
                    });
                }
            }
        }
    }
    
    // Deduplicate array
    const uniqueToProcess = [];
    const seen = new Set();
    for (const item of toProcess) {
        if (!seen.has(item.originalImg)) {
            seen.add(item.originalImg);
            uniqueToProcess.push(item);
        } else {
            // Wait, we need to update HTML for ALL instances of this image!
            uniqueToProcess.push(item);
        }
    }
    
    console.log(`Found ${uniqueToProcess.length} missing image references across HTML files.`);
    
    for (let i = 0; i < uniqueToProcess.length; i++) {
        const book = uniqueToProcess[i];
        console.log(`[${i+1}/${uniqueToProcess.length}] Fixing ${book.title}...`);
        
        const destPath = path.join(fixedDir, `${book.slug}.jpg`);
        
        let success = false;
        if (!fs.existsSync(destPath)) {
            let imgUrl = await getOpenLibraryUrl(book.title, book.author);
            if (imgUrl) success = await downloadImage(imgUrl, destPath);
            
            if (!success && book.author) {
                imgUrl = await getOpenLibraryUrl(book.title, null);
                if (imgUrl) success = await downloadImage(imgUrl, destPath);
            }
        } else {
            success = true; // Already downloaded
        }
        
        if (success) {
            let html = fs.readFileSync(book.file, 'utf8');
            const oldSrc = `images/book-covers/${book.originalImg}`;
            const newSrc = `images/book-covers/fixed/${book.slug}.jpg`;
            html = html.replace(new RegExp(oldSrc, 'g'), newSrc);
            fs.writeFileSync(book.file, html);
            console.log(`  -> Fixed HTML pointing to ${newSrc}`);
        } else {
            console.log(`  -> Failed to find cover for ${book.title}`);
        }
        
        await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`Finished fixing missing images!`);
}

main();
