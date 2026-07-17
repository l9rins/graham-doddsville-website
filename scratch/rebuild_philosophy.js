const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/philosophy.html');
let html = fs.readFileSync(filePath, 'utf8');

// The new subtitle
const newSubtitle = 'A collection of Warren Buffett’s insightful quotes on investment philosophy, principles and rational thinking.';

// Replace the subtitle
html = html.replace(
    /<p class="page-subtitle">.*?<\/p>/s,
    `<p class="page-subtitle">${newSubtitle}</p>`
);

const categories = [
    "Investment Philosophy",
    "Investment Objectives",
    "Modern Portfolio Theory",
    "Value Investing",
    "Successful Investing",
    "Intrinsic Value",
    "Wall Street and Mr Market",
    "Circle of Competence",
    "Long Term Investing",
    "Conservatism",
    "Security Analyst",
    "Margin of Safety",
    "Market Forecasting",
    "Market Timing",
    "Speculation",
    "Performance Standards",
    "Performance Measurement",
    "Mistakes",
    "Frictional Costs",
    "Capital Allocation",
    "Market Bubble",
    "Market Downturn",
    "Exit Strategy",
    "Berkshire Disclosure",
    "Value Investors"
];

let accordionHtml = '<div class="quotes-accordion-container" style="margin-top: 32px;">\n';

categories.forEach((cat, index) => {
    const id = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    accordionHtml += `
            <div class="collapsible-section" id="${id}-section">
                <div class="collapsible-header" onclick="toggleCollapsible('${id}')" style="padding: 16px; cursor: pointer; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="collapsible-title" style="font-size: 18px; font-weight: 600; color: #1e3a8a; margin: 0;">${cat}</h2>
                    <span class="collapsible-arrow" id="${id}-arrow" style="color: #1e3a8a; font-size: 14px; font-weight: bold; transition: transform 0.2s;">+</span>
                </div>
                <div class="collapsible-content collapsed" id="${id}-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: #fafafa;">
                    <div style="padding: 24px 16px; color: #4b5563; font-style: italic;">
                        Quotes for ${cat} will be added here soon.
                    </div>
                </div>
            </div>
`;
});

accordionHtml += '        </div>\n';

// We need to replace everything from <section class="subcategory-section"> to the end of the <main> block
// Let's find the main content block to replace
const mainRegex = /(<div class="page-title-section">.*?<\/div>\s*)(<section class="subcategory-section">.*)(<\/main>)/s;
html = html.replace(mainRegex, `$1${accordionHtml}    $3`);

fs.writeFileSync(filePath, html, 'utf8');
console.log('philosophy.html updated with flat accordion layout successfully!');
