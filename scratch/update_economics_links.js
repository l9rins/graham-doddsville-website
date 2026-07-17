const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const files = fs.readdirSync(publicDir).filter(file => file.endsWith('.html'));

let filesUpdated = 0;

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    let updated = false;

    if (html.includes('href="economics.html" class="drawer-link"')) {
        html = html.replace(/href="economics.html" class="drawer-link"/g, 'href="sidebar-economics.html" class="drawer-link"');
        updated = true;
    }

    if (html.includes('href="economics.html" class="nav-link"')) {
        html = html.replace(/href="economics.html" class="nav-link"/g, 'href="sidebar-economics.html" class="nav-link"');
        updated = true;
    }

    if (updated) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`Updated links in ${file}`);
        filesUpdated++;
    }
});

console.log(`Finished updating links. Total files updated: ${filesUpdated}`);
