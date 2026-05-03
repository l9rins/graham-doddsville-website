const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('C:/Users/Mark Lorenz/Desktop/LibraryWebsite/to-review/parsed_structure.json', 'utf8'));

function generateSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const filePath = 'C:/Users/Mark Lorenz/Desktop/LibraryWebsite/Greatest-Investors.html';
let htmlContent = fs.readFileSync(filePath, 'utf8');

const category = data['5'];
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
        // Note: Greatest-Investors uses openArticle instead of loadArticle
        newCategoriesHtml += `                            <li><a href="#" class="collapsible-link" onclick="openArticle('${topicSlug}')">${topic}</a></li>\n`;
    }
    
    newCategoriesHtml += `                        </ul>\n`;
    newCategoriesHtml += `                    </div>\n`;
    newCategoriesHtml += `                </div>\n`;
}
newCategoriesHtml += `            </div>`;

const regex = /<div class="collapsible-categories">[\s\S]*?<\/div>\s*<\/div>\s*<div class="article-detail-panel" id="article-detail-panel">/;
if (regex.test(htmlContent)) {
    htmlContent = htmlContent.replace(
        regex, 
        newCategoriesHtml + '\n    <div class="article-detail-panel" id="article-detail-panel">'
    );
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log('Updated Greatest-Investors.html');
} else {
    console.log('Could not match pattern in Greatest-Investors.html');
}
