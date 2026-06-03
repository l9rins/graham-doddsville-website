const fs = require('fs');

const terms = {
  philosophy: [
    "Investment Philosophy", "Investment Objectives", "Modern Portfolio Theory", "Value Investing", "Successful Investing", "Intrinsic Value", "Wall Street and Mr Market", "Circle of Competence", "Long Term Investing", "Conservatism", "Security Analyst", "Margin of Safety", "Market Forecasting", "Market Timing", "Speculation", "Performance Standards", "Performance Measurement", "Mistakes", "Frictional Costs", "Capital Allocation", "Market Bubble", "Market Downturn", "Exit Strategy", "Berkshire Disclosure", "Value Investors"
  ],
  investing: [
    "Stock Market", "Portfolio Allocation", "Buying Criteria", "Selling Criteria", "Investment Strategy", "Investment Advice", "Investment Risk", "Volatility Rumours", "Technical Analysis", "Share Buybacks", "Share Issues", "Stock Splits", "Stock Options", "Book Recommendations", "Indexing", "Arbitrage", "Cigar Butt Investing", "Mergers and Acquisitions", "Workouts", "Derivatives", "The Dow", "Fees", "Bonds", "Gold", "Diversification", "Initial Public Offering", "Convertible Preferred Stock", "Junk Bonds", "Private Equity", "Real Estate"
  ],
  businesses: [
    "Good Businesses", "Economic Moat", "Good Managers", "Poor Businesses", "Poor Managers", "Airlines", "Auto Insurance", "Banks", "Berkshire Hathaway", "Controlled Businesses", "Derivatives Business", "Float", "Franchises", "Insurance", "Investment Banks", "Investment Companies", "Investment Managers", "Manufactured Housing", "Paper", "Property Casualty Insurance", "Reinsurance", "Retail", "Retroactive Insurance", "Shoes", "Super Cat Insurance", "Technology", "Television", "Textile", "Transport", "Utilities"
  ],
  governance: [
    "Annual meetings", "Audit Committee", "Auditors", "Berkshire Compensation", "CEO Compensation", "CEO Mistakes", "Corporate Charity", "Corporate Culture", "Corporate Expense", "Corporate Governance", "Corporate Responsibility", "Corporate Strategy", "Director Remuneration", "Directors' Role", "Directors' Weaknesses", "Dividend Policy", "Executive Compensation", "Hiring and Firing", "Independent Directors", "Organisational Structure", "Remuneration Committee", "Shareholders", "Succession"
  ],
  accounting: [
    "Accounting Creativity", "Accounting Ratios", "Accounting Goodwill", "Amortization", "Book Value", "Capital Base", "Capital Gain", "Cash Flow", "Compounding", "Debt", "Depreciation", "Earnings", "Earnings Per Share", "EBITDA", "Economic", "Goodwill", "Fraud", "Full and Fair Reporting", "Intangibles", "GAAP", "Leverage", "Liquidation", "Look through earnings", "Owner Earnings", "PE Ratio", "Pro Forma Reporting", "Realised Gains and Losses", "Retention of Earning", "Return on Capital", "Return on Equity", "Valuation"
  ],
  economics: [
    "Budget Deficit", "Currency", "Globalisation", "Global Economy", "Gross Domestic Product", "Inflation", "Interest Rates", "International Trade", "Macroeconomics", "Recession", "Trade Imbalance", "US Economy"
  ],
  miscellaneous: [
    "Benjamin Graham", "Character", "Charlie Munger", "David Dodd", "Happiness", "Love", "Partnership", "Philanthropy", "Public Pension", "Success", "Taxation", "Unconventional Commitments"
  ]
};

const indexPath = 'public/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// Replace mobile tabs
content = content.replace(/<div class="buffett-tab(?: active)?" id="([a-z]+)-tab-mobile" data-tab="\1">([\s\S]*?)<div class="mobile-books-see-more">/g, (match, tabName) => {
    if (!terms[tabName]) return match;
    const isActive = tabName === 'philosophy' ? ' active' : '';
    const itemsHtml = terms[tabName].map(term => `                        <a href="#" class="buffett-item-mobile">${term}</a>`).join('\n');
    return `<div class="buffett-tab${isActive}" id="${tabName}-tab-mobile" data-tab="${tabName}">
                    <div class="book-links-list" id="${tabName}-buffett-slider">
${itemsHtml}
                    </div>
                    <div class="mobile-books-see-more">`;
});

// Replace desktop tabs
content = content.replace(/<div class="tab-content(?: active)?" id="([a-z]+)-tab">([\s\S]*?)<div style="text-align: center; margin-top: 16px;">/g, (match, tabName) => {
    if (!terms[tabName]) return match;
    const isActive = tabName === 'philosophy' ? ' active' : '';
    const itemsHtml = terms[tabName].map(term => `                            <li><a href="#" style="text-decoration: none; color: #1e3a8a;">${term}</a></li>`).join('\n');
    return `<div class="tab-content${isActive}" id="${tabName}-tab">
                        <ul class="buffett-topics" style="display: block; columns: 1; list-style: none; padding: 0;">
${itemsHtml}
                        </ul>
                        <div style="text-align: center; margin-top: 16px;">`;
});

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Updated index.html');
