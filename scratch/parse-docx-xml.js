const fs = require('fs');
const path = require('path');

async function main() {
    const docPath = path.join(__dirname, 'docx_extracted', 'word', 'document.xml');
    const relsPath = path.join(__dirname, 'docx_extracted', 'word', '_rels', 'document.xml.rels');
    
    if (!fs.existsSync(docPath)) {
        console.log("Not extracted yet");
        return;
    }

    const docXml = fs.readFileSync(docPath, 'utf8');
    const relsXml = fs.readFileSync(relsPath, 'utf8');
    
    // Parse rels
    const relsRegex = /<Relationship Id="([^"]+)" Type="([^"]+)" Target="([^"]+)"/g;
    let relMatch;
    const rels = {};
    while ((relMatch = relsRegex.exec(relsXml)) !== null) {
        rels[relMatch[1]] = relMatch[3]; // rId -> target
    }
    
    // Parse docXml looking for paragraphs
    const pRegex = /<w:p(?: .*?)?>(.*?)<\/w:p>/g;
    let pMatch;
    
    const items = [];
    let currentImage = null;
    let currentLink = null;
    
    while ((pMatch = pRegex.exec(docXml)) !== null) {
        const pContent = pMatch[1];
        
        // check for image
        const imgRegex = /<a:blip r:embed="([^"]+)"/g;
        let imgMatch = imgRegex.exec(pContent);
        if (imgMatch) {
            currentImage = rels[imgMatch[1]];
        }
        
        // check for hyperlink (sometimes links are just text)
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
            items.push({ img: currentImage, link: currentLink });
            currentImage = null;
            currentLink = null;
        }
    }
    
    console.log(`Found ${items.length} mapped items!`);
    for(let i=0; i<10; i++) {
        if (items[i]) console.log(items[i]);
    }
    
    fs.writeFileSync(path.join(__dirname, 'image_mapping.json'), JSON.stringify(items, null, 2));
}

main();
