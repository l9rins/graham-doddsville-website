const fs = require('fs');
const path = require('path');

const docPath = path.join(__dirname, 'docx_extracted', 'word', 'document.xml');
const relsPath = path.join(__dirname, 'docx_extracted', 'word', '_rels', 'document.xml.rels');
const mediaPath = path.join(__dirname, 'docx_extracted', 'word', 'media');
const publicDir = path.join(__dirname, '..', 'public');

const docXml = fs.readFileSync(docPath, 'utf8');
const relsXml = fs.readFileSync(relsPath, 'utf8');

// Parse rels
const relsRegex = /<Relationship Id="([^"]+)" Type="([^"]+)" Target="([^"]+)"/g;
let relMatch;
const rels = {};
while ((relMatch = relsRegex.exec(relsXml)) !== null) {
    rels[relMatch[1]] = relMatch[3]; 
}

// Map HTML amazonUrls to slugs
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('books.html'));
let urlToSlug = {};

for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
    const cardRegex = /<div class="book-card[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    let cardMatch;
    while ((cardMatch = cardRegex.exec(html)) !== null) {
        const cardContent = cardMatch[1];
        const imgMatch = cardContent.match(/<img\s+src="images\/book-covers\/fixed\/([^"]+)\.jpg"/);
        const linkMatch = cardContent.match(/<a\s+href="([^"]+)"[^>]*>BUY NOW<\/a>/);
        if (imgMatch && linkMatch) {
            urlToSlug[linkMatch[1]] = imgMatch[1];
        }
    }
}

// Parse document.xml sequentially
const pRegex = /<w:p(?: .*?)?>([\s\S]*?)<\/w:p>/g;
let pMatch;
let largeImages = [];
let items = [];

while ((pMatch = pRegex.exec(docXml)) !== null) {
    const pContent = pMatch[1];
    
    // Check for images
    const imgRegex = /<a:blip r:embed="([^"]+)"/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(pContent)) !== null) {
        const target = rels[imgMatch[1]];
        if (target) {
            const imgPath = path.join(__dirname, 'docx_extracted', 'word', target);
            if (fs.existsSync(imgPath)) {
                const stats = fs.statSync(imgPath);
                // Filter out small icons (less than 10KB usually, but covers can be 20KB+)
                if (stats.size > 15000) {
                    largeImages.push(target);
                }
            }
        }
    }
    
    // Extract links
    const textRegex = /<w:t(?: xml:space="preserve")?>(.*?)<\/w:t>/g;
    let textContent = "";
    let tMatch;
    while ((tMatch = textRegex.exec(pContent)) !== null) {
        textContent += tMatch[1];
    }
    
    // Sometimes URLs are split into multiple w:t tags or just plain text
    const urlMatch = textContent.match(/https:\/\/www\.(?:amazon|magshop)[^\s<]+/);
    
    if (urlMatch) {
        const link = urlMatch[0];
        
        // Find matching slug
        const asinMatch = link.match(/\/dp\/([A-Z0-9]+)/);
        const htmlUrls = Object.keys(urlToSlug);
        let matchedSlug = null;
        
        if (asinMatch) {
            const asin = asinMatch[1];
            const match = htmlUrls.find(u => u.includes(asin));
            if (match) matchedSlug = urlToSlug[match];
        }
        
        if (!matchedSlug) {
            const titleMatch = link.match(/amazon\.com\/(.*?)\/dp\//);
            if (titleMatch) {
                const urlTitle = titleMatch[1].toLowerCase().replace(/-/g, ' ').replace(/[^\w\s]/g, '');
                for (const slug of Object.values(urlToSlug)) {
                    const cleanSlug = slug.replace(/-/g, ' ');
                    if (urlTitle.includes(cleanSlug) || cleanSlug.includes(urlTitle)) {
                        matchedSlug = slug;
                        break;
                    }
                }
            }
        }
        
        if (matchedSlug && largeImages.length > 0) {
            // Associate this link with the MOST RECENT large image
            items.push({
                slug: matchedSlug,
                img: largeImages[largeImages.length - 1],
                link: link
            });
            // Clear large images so we don't reuse it for the next link if it doesn't have one
            largeImages = [];
        }
    }
}

// Deduplicate items, keep the first one
let mapping = {};
for (const item of items) {
    if (!mapping[item.slug]) {
        mapping[item.slug] = item.img;
    }
}

console.log(`Mapped ${Object.keys(mapping).length} unique books to large images.`);
fs.writeFileSync(path.join(__dirname, 'docx_mapping.json'), JSON.stringify(mapping, null, 2));

