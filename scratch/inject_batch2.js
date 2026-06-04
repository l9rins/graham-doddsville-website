const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/js/book-summaries-data.js');
let fileContent = fs.readFileSync(dataPath, 'utf8');
fileContent = fileContent.replace('const bookSummariesData =', 'global.bookSummariesData =');
eval(fileContent);

const batch2 = {
  "the-psychology-of-selling": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The Psychology of Selling</em> by Brian Tracy is a classic in sales literature, focusing on the mental game of selling. It provides strategies to overcome the psychological barriers that hinder both salespeople and buyers.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book acts as a comprehensive guide to mastering the internal dialogue necessary for sales success. It covers setting goals, building self-esteem, understanding buyer motivations, and employing proven closing techniques based on human psychology.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Tracy emphasizes that success in sales is 80% psychological and 20% technical. He explores the concept of the "winning edge," where small, continuous improvements in key areas lead to disproportionate gains in income. The book details how to harness the power of suggestion, overcome the fear of rejection, and align the sales process with the deep-seated emotional needs of the prospect.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A timeless masterpiece on the art of selling. Tracy understands the human mind better than anyone else in the field." - Success Magazine</p>
    <p>"Mandatory reading for anyone whose income depends on persuading others. It's practical, profound, and highly effective." - Sales & Marketing Management</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $18.99 for the paperback edition.</p>
</div>`,
  "selling-101": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Selling 101</em> by Zig Ziglar is a concise, powerful primer on the fundamentals of salesmanship from one of the most celebrated motivational speakers of our time.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>This compact guide distills Ziglar's decades of experience into essential lessons for anyone starting in sales or looking for a back-to-basics refresher. It focuses on honesty, integrity, and building lasting customer relationships.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Ziglar's core philosophy is that "you can have everything in life you want, if you will just help other people get what they want." He provides practical advice on finding prospects, overcoming objections, and closing the sale without using manipulative tactics. The emphasis is on adopting a mindset of service and providing genuine value to the customer.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"Bite-sized wisdom from the master of sales. It's quick to read but packed with lifelong lessons." - Entrepreneur.com</p>
    <p>"Ziglar's positive approach to selling is refreshing and effective. A great starting point for any sales career." - The Sales Blog</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $12.50 for the hardcover edition.</p>
</div>`,
  "secrets-of-closing-the-sale": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Secrets of Closing the Sale</em> by Zig Ziglar is an extensive, in-depth manual dedicated entirely to the most critical part of the sales process: the close.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book details over 100 successful closings for every kind of persuasion. It provides salespeople with the specific scripts, strategies, and psychological insights needed to turn a 'no' into a 'yes' ethically.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Ziglar breaks down the anatomy of a close, explaining that closing is not a singular event but a continuous process that begins the moment you meet the prospect. He provides actionable techniques for handling common objections, reading buying signals, and creating a sense of urgency. Crucially, he reinforces that strong closing techniques must be built on a foundation of absolute belief in the product's value.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"The undisputed bible of closing techniques. If you want to increase your closing rate, study this book." - Brian Tracy</p>
    <p>"Ziglar provides a veritable encyclopedia of closes. It's a resource every serious salesperson should keep on their desk." - Sales Hacker</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $21.00 for the paperback edition.</p>
</div>`,
  "go-pro": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Go Pro: 7 Steps to Becoming a Network Marketing Professional</em> by Eric Worre is widely considered the definitive guide to success in the network marketing and direct sales industry.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book provides a systematic approach to building a successful network marketing business. It moves away from amateur tactics and focuses on developing professional skills that generate sustainable income.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Worre outlines seven fundamental skills required to 'go pro': finding prospects, inviting them to understand your product/opportunity, presenting the product, following up, helping them become customers/distributors, helping them get started right, and promoting events. The core message is that network marketing is a profession that requires dedicated skill acquisition and consistent practice, rather than relying on luck or 'get rich quick' schemes.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"The textbook for our profession. Eric Worre distills decades of experience into a simple, actionable system." - Network Marketing Pro</p>
    <p>"If you are serious about building a large organization, you must read this book and teach its principles." - Direct Selling News</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $15.00 for the paperback edition.</p>
</div>`,
  "the-22-immutable-laws-of-marketing": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The 22 Immutable Laws of Marketing</em> by Al Ries and Jack Trout is a classic business text that outlines the definitive rules for marketing success, warning against common pitfalls that lead to failure.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The authors argue that marketing is not a battle of products, but a battle of perceptions. They provide 22 concise 'laws'—such as the Law of Leadership, the Law of the Category, and the Law of the Mind—that dictate how brands succeed or fail in the marketplace.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The book emphasizes the importance of being first in a category, rather than trying to be better than established competitors. It highlights the dangers of line extension (diluting a brand by putting its name on everything) and the necessity of focusing on a single, powerful word or concept in the consumer's mind. The laws act as a strategic filter for evaluating any marketing campaign.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A brilliant, no-nonsense guide to marketing strategy. The laws are as relevant today as when they were first written." - Forbes</p>
    <p>"Required reading for any marketer. It challenges conventional wisdom and provides a clear framework for building dominant brands." - BusinessWeek</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $16.99 for the paperback edition.</p>
</div>`
};

for (const [slug, html] of Object.entries(batch2)) {
  if (global.bookSummariesData[slug]) {
    global.bookSummariesData[slug].summaryHtml = html;
  }
}

const newFileContent = `const bookSummariesData = ${JSON.stringify(global.bookSummariesData, null, 2)};\n`;
fs.writeFileSync(dataPath, newFileContent, 'utf8');
console.log('Batch 2 injected successfully.');
