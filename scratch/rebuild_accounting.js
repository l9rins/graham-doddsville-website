const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/accounting.html');
let html = fs.readFileSync(filePath, 'utf8');

// Fix the title from "Evaluation" to "Valuation"
html = html.replace(/Accounting and Evaluation/g, 'Accounting and Valuation');

// Also fix <title> tag if needed
html = html.replace(
    /<title>.*?<\/title>/,
    '<title>Warren Buffett on Accounting and Valuation - Graham and Doddsville</title>'
);

// The new subtitle
const newSubtitle = 'A collection of Warren Buffett\u2019s insightful quotes on accounting creativity, valuation and various accounting concepts.';

// Replace the subtitle
html = html.replace(
    /<p class="page-subtitle">.*?<\/p>/s,
    `<p class="page-subtitle">${newSubtitle}</p>`
);

const categories = [
    "Accounting Creativity",
    "Accounting Ratios",
    "Accounting Goodwill",
    "Amortization",
    "Book Value",
    "Capital Base",
    "Capital Gain",
    "Cash Flow",
    "Compounding",
    "Debt",
    "Depreciation",
    "Earnings",
    "Earnings Per Share",
    "EBITDA",
    "Economic Goodwill",
    "Fraud",
    "Full and Fair Reporting",
    "Intangibles",
    "GAAP",
    "Leverage",
    "Liquidation",
    "Look Through Earnings",
    "Owner Earnings",
    "PE Ratio",
    "Pro Forma Reporting",
    "Realised Gains and Losses",
    "Retention of Earning",
    "Return on Capital",
    "Return on Equity",
    "Valuation"
];

let accordionHtml = '        <div class="quotes-accordion-container" style="margin-top: 32px;">\n';

categories.forEach((cat) => {
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

const mainRegex = /(<div class="page-title-section">[\s\S]*?<\/div>\s*)([\s\S]*?)(<\/main>)/;
const match = html.match(mainRegex);
if (match) {
    html = html.replace(mainRegex, `$1\n\n${accordionHtml}\n    $3`);
    console.log('accounting.html updated with flat accordion layout successfully!');
} else {
    console.error('ERROR: Could not find the main content block to replace.');
}

fs.writeFileSync(filePath, html, 'utf8');
