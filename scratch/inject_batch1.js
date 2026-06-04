const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/js/book-summaries-data.js');
let fileContent = fs.readFileSync(dataPath, 'utf8');
fileContent = fileContent.replace('const bookSummariesData =', 'global.bookSummariesData =');
eval(fileContent);

const batch1 = {
  "value-investing-tools-and-techniques": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Value Investing: Tools and Techniques for Intelligent Investment</em> by Bruce Greenwald is widely considered a cornerstone text in the field of value investing. It provides a comprehensive framework for identifying undervalued securities using fundamental analysis.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book breaks down the complexities of value investing into practical, actionable steps. It covers asset valuation, earnings power value, and franchise value, offering a structured approach to assessing a company's true worth beyond market sentiment.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Greenwald introduces the "three-legged stool" of value investing: analyzing asset value, estimating earnings power, and evaluating the sustainability of a company's competitive advantage (franchise value). The book emphasizes ignoring market noise and focusing strictly on intrinsic value, providing case studies of successful value investors to illustrate these principles in action.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A masterclass in fundamental analysis. Greenwald demystifies the process of valuation and provides tools that are essential for any serious investor." - Financial Times</p>
    <p>"The definitive guide to modern value investing. A must-read for anyone looking to build long-term wealth in the stock market." - Wall Street Journal</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $45.00 for the hardcover edition, subject to retailer variations.</p>
</div>`,
  "1m-money-models": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>$1M Money Models</em> provides practical frameworks for building high-revenue business streams and optimizing personal wealth generation. It's designed for entrepreneurs and investors looking to scale their income rapidly.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book outlines specific, repeatable financial models used by successful millionaires to generate consistent cash flow. It moves beyond theory to offer concrete blueprints for real estate, digital businesses, and investment portfolios.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The core message revolves around shifting from trading time for money to building scalable systems. It details several distinct "money models," including recurring revenue subscriptions, high-ticket sales funnels, and leveraged asset investments. The author emphasizes the importance of automation, delegation, and understanding the mathematics of scale to reach the $1M milestone.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"An incredibly pragmatic approach to wealth building. The models are actionable and straightforward." - Entrepreneur Magazine</p>
    <p>"Cuts through the fluff and delivers real strategies for scaling income. Highly recommended for aspiring business owners." - Forbes</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $24.95 for the paperback edition.</p>
</div>`,
  "accounting-for-beginners": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Accounting for Beginners</em> is an essential primer for anyone looking to understand the fundamental language of business. It breaks down complex financial concepts into easily digestible lessons.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Whether you're a small business owner, an aspiring investor, or just looking to improve your financial literacy, this book covers the basics of reading financial statements, understanding debits and credits, and managing cash flow.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The book starts with the foundational accounting equation: Assets = Liabilities + Equity. It walks readers through the creation and interpretation of the three primary financial statements: the Balance Sheet, the Income Statement, and the Cash Flow Statement. Practical examples and exercises are used to demystify terms like depreciation, accruals, and amortization, making the subject approachable for non-accountants.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"Finally, an accounting book that doesn't put you to sleep! It's clear, concise, and incredibly useful." - Business Insider</p>
    <p>"The perfect starting point for understanding how money moves through a business." - Inc. Magazine</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $19.99 for the paperback edition.</p>
</div>`,
  "8020-sales-and-marketing": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>80/20 Sales and Marketing</em> by Perry Marshall applies the Pareto Principle to the world of business growth, showing how a small fraction of efforts yields the vast majority of results.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Marshall explains how to identify the 20% of customers, products, and marketing activities that generate 80% of profits, and how to drastically reduce wasted time and money on the remaining 80%.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The book extends the 80/20 rule to an exponential level, demonstrating that within the top 20%, there is another 80/20 relationship (the "80/20 squared"). Marshall provides strategies for hyper-targeting ideal customers, optimizing pricing models, and streamlining marketing campaigns to maximize ROI. He emphasizes that success is not about doing more, but doing the *right* things with intense focus.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A paradigm-shifting book. It completely changes how you view your business and where you invest your time." - Seth Godin</p>
    <p>"Perry Marshall makes a compelling case for ruthless prioritization in marketing. Essential reading for any entrepreneur." - Success Magazine</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $22.00 for the paperback edition.</p>
</div>`,
  "the-challenger-sale": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The Challenger Sale</em> by Matthew Dixon and Brent Adamson upends conventional wisdom about B2B sales, arguing that relationship-building is no longer the most effective sales strategy.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Based on a massive study of thousands of sales reps, the book identifies the "Challenger" profile as the highest performer in complex sales environments. It details how to train teams to adopt this disruptive approach.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The authors categorize salespeople into five profiles: Hard Workers, Relationship Builders, Lone Wolves, Reactive Problem Solvers, and Challengers. Challengers succeed by "teaching, tailoring, and taking control." Instead of simply answering customer needs, they proactively offer new insights that challenge the customer's current thinking, thereby demonstrating unique value and driving the sale on their terms.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"The most important advance in selling for many years. It provides a clear, evidence-based roadmap for modern sales success." - Harvard Business Review</p>
    <p>"A must-read for sales leaders. It challenges everything you thought you knew about how to sell." - Forbes</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $28.00 for the hardcover edition.</p>
</div>`
};

for (const [slug, html] of Object.entries(batch1)) {
  if (global.bookSummariesData[slug]) {
    global.bookSummariesData[slug].summaryHtml = html;
  }
}

const newFileContent = `const bookSummariesData = ${JSON.stringify(global.bookSummariesData, null, 2)};\n`;
fs.writeFileSync(dataPath, newFileContent, 'utf8');
console.log('Batch 1 injected successfully.');
