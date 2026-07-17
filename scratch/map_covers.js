const fs = require('fs');
const path = require('path');

const docPath = path.join(__dirname, 'docx_extracted', 'word', 'document.xml');
const relsPath = path.join(__dirname, 'docx_extracted', 'word', '_rels', 'document.xml.rels');
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(docPath)) {
    console.error("docx_extracted/word/document.xml not found! Waiting for extraction...");
    process.exit(1);
}

const docXml = fs.readFileSync(docPath, 'utf8');
const relsXml = fs.readFileSync(relsPath, 'utf8');

// Parse rels
const relsRegex = /<Relationship Id="([^"]+)" Type="([^"]+)" Target="([^"]+)"/g;
let relMatch;
const rels = {};
while ((relMatch = relsRegex.exec(relsXml)) !== null) {
    rels[relMatch[1]] = relMatch[3]; // rId -> target (e.g., media/image1.jpeg)
}

// Parse document.xml
// The structure usually has <w:drawing> and <w:hyperlink> in close proximity.
// Let's extract all images and hyperlinks in order of appearance.
const elementRegex = /<a:blip r:embed="([^"]+)"|<w:hyperlink[^>]*?r:id="([^"]+)"|<w:t(?: xml:space="preserve")?>(.*?)<\/w:t>/g;

let elements = [];
let currentLink = "";
let currentImage = null;

const pRegex = /<w:p(?: .*?)?>(.*?)<\/w:p>/g;
let pMatch;
while ((pMatch = pRegex.exec(docXml)) !== null) {
    const pContent = pMatch[1];
    
    // Check for images
    const imgRegex = /<a:blip r:embed="([^"]+)"/g;
    let imgMatch = imgRegex.exec(pContent);
    if (imgMatch) {
        currentImage = rels[imgMatch[1]];
    }
    
    // Extract text
    const textRegex = /<w:t(?: xml:space="preserve")?>(.*?)<\/w:t>/g;
    let textContent = "";
    let tMatch;
    while ((tMatch = textRegex.exec(pContent)) !== null) {
        textContent += tMatch[1];
    }
    
    if (textContent.includes("amazon.") || textContent.includes("magshop.com.au")) {
        currentLink = textContent.trim();
    }
    
    if (currentImage && currentLink) {
        elements.push({ img: currentImage, link: currentLink });
        currentImage = null;
        currentLink = null;
    }
}

// Write the intermediate mapping
fs.writeFileSync(path.join(__dirname, 'image_mapping.json'), JSON.stringify(elements, null, 2));

// Parse HTML files to find Amazon links
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('books.html'));
let urlToSlug = {};

for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
    
    // A book card looks like:
    // <img src="images/book-covers/fixed/<slug>.jpg" ...>
    // ... <a href="<amazonUrl>" ...>BUY NOW</a>
    
    const cardRegex = /<div class="book-card[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    let cardMatch;
    while ((cardMatch = cardRegex.exec(html)) !== null) {
        const cardContent = cardMatch[1];
        
        const imgMatch = cardContent.match(/<img src="images\/book-covers\/fixed\/([^"]+)\.jpg"/);
        const linkMatch = cardContent.match(/<a href="([^"]+)"[^>]*>BUY NOW<\/a>/);
        
        if (imgMatch && linkMatch) {
            const slug = imgMatch[1];
            let url = linkMatch[1];
            urlToSlug[url] = slug;
        }
    }
}

// Cross-reference
let mapping = {}; // slug -> image file
for (const item of elements) {
    // Try to find the matching URL
    // DOCX URLs might be slightly different from HTML URLs (e.g. tracking tags)
    // HTML uses /s?k=Search+Term sometimes, while DOCX uses direct links
    // Wait, earlier I found that HTML uses /s?k= and DOCX uses direct links!
    // So exact match on URL won't work perfectly.
    
    // Let's try matching ASIN if possible
    const asinMatch = item.link.match(/\/dp\/([A-Z0-9]+)/);
    const htmlUrls = Object.keys(urlToSlug);
    
    let matchedSlug = null;
    if (asinMatch) {
        const asin = asinMatch[1];
        // Maybe some HTML links have ASIN?
        const match = htmlUrls.find(u => u.includes(asin));
        if (match) {
            matchedSlug = urlToSlug[match];
        }
    }
    
    if (!matchedSlug) {
        // Fallback: Use the book title extracted from the Amazon URL!
        // https://www.amazon.com/Secrets-Millionaire-Mind-Mastering-Wealth/dp/...
        const titleMatch = item.link.match(/amazon\.com\/(.*?)\/dp\//);
        if (titleMatch) {
            const urlTitle = titleMatch[1].toLowerCase().replace(/-/g, ' ').replace(/[^\w\s]/g, '');
            // fuzzy match against slug
            for (const slug of Object.values(urlToSlug)) {
                const cleanSlug = slug.replace(/-/g, ' ');
                if (urlTitle.includes(cleanSlug) || cleanSlug.includes(urlTitle)) {
                    matchedSlug = slug;
                    break;
                }
            }
        }
    }
    
    if (matchedSlug) {
        mapping[matchedSlug] = item.img;
    } else {
        console.log("Could not find slug for: " + item.link);
    }
}

console.log(`Matched ${Object.keys(mapping).length} books out of ${elements.length} images.`);
fs.writeFileSync(path.join(__dirname, 'slug_to_image.json'), JSON.stringify(mapping, null, 2));

