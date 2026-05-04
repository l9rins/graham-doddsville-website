const fs = require('fs');
const path = require('path');

const dirs = [
    { path: path.join(__dirname, 'public'), fallback: "images/G&D Logo (for black background).png" },
    { path: path.join(__dirname, 'public', 'html'), fallback: "../images/G&D Logo (for black background).png" }
];

let totalFixed = 0;

dirs.forEach(({ path: dirPath, fallback }) => {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        // Regex to match onerror that uses placehold.co
        const regex = /onerror=["']this\.src=['"]https:\/\/placehold\.co\/[^'"]+['"]["']/g;
        if (regex.test(content)) {
            console.log(`Fixing onerrors in ${file}`);
            content = content.replace(regex, `onerror="this.src='${fallback}'"`);
            fs.writeFileSync(filePath, content);
            totalFixed++;
        }
    });
});

console.log(`Successfully removed all placehold.co fallbacks in ${totalFixed} files.`);
