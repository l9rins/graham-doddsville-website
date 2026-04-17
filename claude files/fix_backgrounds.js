const fs = require('fs');
const path = require('path');

const files = [
    'public/html/legal-taxation.html',
    'public/html/financial-markets.html',
    'public/html/share-investing.html',
    'public/html/Greatest-Investors.html',
    'public/html/events.html'
];

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) return;
    
    console.log(`Fixing background for ${file}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace grey/off-white background colors with #ffffff
    // Targeted common grey values found in those files
    content = content.replace(/background:\s*#f5f5f5;/g, 'background: #ffffff;');
    content = content.replace(/background-color:\s*#f0f0f0;/g, 'background-color: #ffffff;');
    content = content.replace(/background:\s*linear-gradient\(135deg,\s*#f8f9fa\s*0%,\s*#e9ecef\s*100%\);/g, 'background: #ffffff;');
    
    // Also the root body background if it's set to silver or grey
    content = content.replace(/body\s*{[^}]*background:\s*var\(--secondary-gray\);/g, (match) => match.replace('var(--secondary-gray)', '#ffffff'));

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Background fixes complete.');
