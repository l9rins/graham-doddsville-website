const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('C:/Users/Mark Lorenz/Desktop/LibraryWebsite/to-review/parsed_structure.json', 'utf8'));

const fileMap = {
    '1': 'wealth-creation.html',
    '2': 'legal-taxation.html',
    '3': 'financial-markets.html',
    '4': 'share-investing.html',
    '5': 'Greatest-Investors.html',
    '6': 'investment-analysis.html',
    '7': 'financial-statement-analysis.html',
    '8': 'stock-valuation.html',
    '9': 'economics.html',
    '10': 'professional-advisers.html',
    '11': 'financial-products.html',
    '12': 'resources.html',
    '13': 'events.html'
};

function generateSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

for (const [key, category] of Object.entries(data)) {
    const filename = fileMap[key];
    if (!filename) continue;
    
    const filePath = path.join('C:/Users/Mark Lorenz/Desktop/LibraryWebsite', filename);
    if (!fs.existsSync(filePath)) {
        console.log('Not found:', filePath);
        continue;
    }
    
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    let newCategoriesHtml = '<div class="collapsible-categories">\n';
    
    for (const tab of category.tabs) {
        const tabSlug = generateSlug(tab.name);
        newCategoriesHtml += `                <div class="collapsible-section">\n`;
        newCategoriesHtml += `                    <div class="collapsible-header" onclick="toggleCollapsible('${tabSlug}')">\n`;
        newCategoriesHtml += `                        <h3 class="collapsible-title">${tab.name}</h3>\n`;
        newCategoriesHtml += `                        <span class="collapsible-arrow" id="${tabSlug}-arrow">?</span>\n`;
        newCategoriesHtml += `                    </div>\n`;
        newCategoriesHtml += `                    <div class="collapsible-content collapsed" id="${tabSlug}-content">\n`;
        newCategoriesHtml += `                        <ul class="collapsible-links">\n`;
        
        for (const topic of tab.topics) {
            const topicSlug = generateSlug(topic);
            newCategoriesHtml += `                            <li><a href="#" class="collapsible-link" onclick="loadArticle('${topicSlug}')">${topic}</a></li>\n`;
        }
        
        newCategoriesHtml += `                        </ul>\n`;
        newCategoriesHtml += `                    </div>\n`;
        newCategoriesHtml += `                </div>\n`;
    }
    newCategoriesHtml += `            </div>`;
    
    // Replace the block
    const regex = /<div class="collapsible-categories">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Article Detail Panel -->/;
    if (regex.test(htmlContent)) {
        htmlContent = htmlContent.replace(
            /<div class="collapsible-categories">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Article Detail Panel -->/, 
            newCategoriesHtml + '\n        </div>\n    </div>\n\n    <!-- Article Detail Panel -->'
        );
        fs.writeFileSync(filePath, htmlContent, 'utf8');
        console.log('Updated:', filename);
    } else {
        console.log('Could not match pattern in:', filename);
    }
}
