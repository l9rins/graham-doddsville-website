const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/investing.html');
let html = fs.readFileSync(filePath, 'utf8');

// The new subtitle
const newSubtitle = 'A collection of Warren Buffett\u2019s insightful quotes on stock market investing, portfolio construction and corporate actions.';

// Replace the subtitle
html = html.replace(
    /<p class="page-subtitle">.*?<\/p>/s,
    `<p class="page-subtitle">${newSubtitle}</p>`
);

const categories = [
    "Stock Market",
    "Portfolio Allocation",
    "Buying Criteria",
    "Selling Criteria",
    "Investment Strategy",
    "Investment Advice",
    "Investment Risk",
    "Volatility Rumours",
    "Technical Analysis",
    "Share Buybacks",
    "Share Issues",
    "Stock Splits",
    "Stock Options",
    "Book Recommendations",
    "Indexing",
    "Arbitrage",
    "Cigar Butt Investing",
    "Mergers and Acquisitions",
    "Workouts",
    "Derivatives",
    "The Dow",
    "Fees",
    "Bonds",
    "Gold",
    "Diversification",
    "Initial Public Offering",
    "Convertible Preferred Stock",
    "Junk Bonds",
    "Private Equity",
    "Real Estate"
];

let accordionHtml = '        <div class="quotes-accordion-container" style="margin-top: 32px;">\n';

categories.forEach((cat, index) => {
    const id = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
    accordionHtml += `
            <div class="collapsible-section" id="${id}-section">
                <div class="collapsible-header" onclick="toggleCollapsible('${id}')"
                    style="padding: 16px; cursor: pointer; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="collapsible-title" style="font-size: 18px; font-weight: 600; color: #1e3a8a; margin: 0;">
                        ${cat}</h2>
                    <span class="collapsible-arrow" id="${id}-arrow"
                        style="color: #1e3a8a; font-size: 14px; font-weight: bold; transition: transform 0.2s;">+</span>
                </div>
                <div class="collapsible-content collapsed" id="${id}-content"
                    style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: #fafafa;">
                    <div style="padding: 24px 16px; color: #4b5563; font-style: italic;">
                        Quotes for ${cat} will be added here soon.
                    </div>
                </div>
            </div>
`;
});

accordionHtml += '        </div>\n';

// Replace everything from <section class="subcategory-section"> to just before </main>
const mainRegex = /(<div class="page-title-section">[\s\S]*?<\/div>\s*)([\s\S]*?)(<\/main>)/;
const match = html.match(mainRegex);
if (match) {
    html = html.replace(mainRegex, `$1\n\n${accordionHtml}\n    $3`);
    console.log('investing.html updated with flat accordion layout successfully!');
} else {
    console.error('ERROR: Could not find the main content block to replace.');
}

fs.writeFileSync(filePath, html, 'utf8');
