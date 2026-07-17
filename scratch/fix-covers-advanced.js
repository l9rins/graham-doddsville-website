const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const fixedDir = path.join(publicDir, 'images', 'book-covers', 'fixed');

async function getOpenLibraryUrl(title, author) {
    try {
        let url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
        if (author) url += `&author=${encodeURIComponent(author)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.docs && data.docs.length > 0) {
            // Find the first doc that HAS a cover
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
        if (buffer.byteLength < 100) return false; // OpenLibrary 1x1 GIF
        
        fs.writeFileSync(destPath, Buffer.from(buffer));
        return true;
    } catch(e) {
        return false;
    }
}

async function main() {
    const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('books.html'));
    
    let toProcess = [];
    
    for (const file of htmlFiles) {
        const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
        
        const cardRegex = /<div class="book-card[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
        let cardMatch;
        while ((cardMatch = cardRegex.exec(html)) !== null) {
            const cardContent = cardMatch[1];
            
            const imgMatch = cardContent.match(/<img\s+src="images\/book-covers\/fixed\/([^"]+)\.jpg"/);
            if (imgMatch) {
                const slug = imgMatch[1];
                const titleMatch = cardContent.match(/<h3 class="book-title">([^<]+)<\/h3>/);
                const authorMatch = cardContent.match(/<div class="book-author">([^<]+)<\/div>/);
                
                if (titleMatch) {
                    toProcess.push({
                        slug: slug,
                        title: titleMatch[1].trim(),
                        author: authorMatch ? authorMatch[1].trim() : null
                    });
                }
            }
        }
    }
    
    const uniqueMap = {};
    for (const b of toProcess) uniqueMap[b.slug] = b;
    toProcess = Object.values(uniqueMap);
    
    console.log(`Found ${toProcess.length} books using fixed/<slug>.jpg that need highly accurate covers.`);
    
    let successCount = 0;
    
    for (let i = 0; i < toProcess.length; i++) {
        const book = toProcess[i];
        console.log(`[${i+1}/${toProcess.length}] Processing ${book.title}${book.author ? ' by ' + book.author : ''}...`);
        
        const destPath = path.join(fixedDir, `${book.slug}.jpg`);
        
        let imgUrl = await getOpenLibraryUrl(book.title, book.author);
        let success = false;
        
        if (imgUrl) {
            success = await downloadImage(imgUrl, destPath);
        }
        
        if (success) {
            console.log(`  -> Successfully downloaded from OpenLibrary.`);
            successCount++;
        } else {
            console.log(`  -> OpenLibrary failed.`);
            if (book.author) {
                console.log(`  -> Trying title-only fallback...`);
                imgUrl = await getOpenLibraryUrl(book.title, null);
                if (imgUrl) {
                    success = await downloadImage(imgUrl, destPath);
                    if (success) {
                        console.log(`  -> Successfully downloaded from OpenLibrary (title-only).`);
                        successCount++;
                    }
                }
            }
        }
        // Small delay to be polite
        await new Promise(r => setTimeout(r, 100));
    }
    
    console.log(`\nFinished! Successfully updated ${successCount} out of ${toProcess.length} covers.`);
}

main();
