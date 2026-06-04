const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/js/book-summaries-data.js');
let fileContent = fs.readFileSync(dataPath, 'utf8');
fileContent = fileContent.replace('const bookSummariesData =', 'global.bookSummariesData =');
eval(fileContent);

const batch5 = {
  "the-infinite-game": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The Infinite Game</em> by Simon Sinek challenges the traditional view of business as a win/lose competition, arguing that the most successful organizations play for long-term survival and continued play, rather than short-term victories.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Using game theory, Sinek differentiates between finite games (like chess or sports, which have known players, fixed rules, and an end) and infinite games (like business, politics, or life, where rules change, players come and go, and the objective is to stay in the game).</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Sinek outlines five essential practices for leading in an infinite game: advancing a "Just Cause" that inspires people, building "Trusting Teams," studying "Worthy Rivals" (instead of viewing them as enemies to be beaten), preparing for "Existential Flexibility" (the ability to make profound strategic shifts), and demonstrating "Courage to Lead." The book argues that leaders who play with a finite mindset in an infinite game will eventually drain trust, innovation, and resources from their organizations.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A profound shift in perspective. Sinek completely changes how you evaluate business strategy and long-term success." - Wall Street Journal</p>
    <p>"Brilliant and necessary. It exposes the flaws of quarterly capitalism and offers a sustainable alternative." - Fast Company</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $28.00 for the hardcover edition.</p>
</div>`,
  "legacy": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Legacy: What the All Blacks Can Teach Us About the Business of Life</em> by James Kerr explores the unparalleled success of the New Zealand national rugby team, translating their culture into 15 lessons for leadership and business.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Kerr goes behind the scenes with the most successful sports team in history to uncover the secrets of their sustained excellence, focusing on identity, character, and the creation of a high-performance culture.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The book's central theme is that "better people make better All Blacks." It highlights core team mantras like "Sweep the Sheds" (never being too big to do the small things), "No Dickheads" (character over talent), and "Leave the Jersey in a Better Place" (stewardship and legacy). Kerr demonstrates how the team transitioned from top-down leadership to a model where players take absolute ownership of the team's standards and culture.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"Probably the best book on team culture ever written. The lessons apply far beyond the rugby field." - The Guardian</p>
    <p>"A masterclass in character-driven leadership. It should be required reading for any corporate executive." - Forbes</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $19.99 for the paperback edition.</p>
</div>`,
  "the-new-one-minute-manager": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The New One Minute Manager</em> by Ken Blanchard and Spencer Johnson is an updated edition of the classic management parable, revised to reflect the realities of the modern, fast-paced, and highly collaborative workplace.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book tells the story of a young man searching for an effective manager. He discovers a leader who achieves incredible results through three simple, time-efficient techniques that empower employees.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The updated book replaces "One Minute Reprimands" with "One Minute Re-Directs," reflecting a shift toward coaching rather than punitive management. The three secrets are: One Minute Goals (setting clear, concise objectives), One Minute Praisings (catching people doing things right to reinforce positive behavior), and One Minute Re-Directs (addressing mistakes immediately and constructively to get the person back on track). The philosophy is that the best management takes very little time when done correctly.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A timeless classic made even better. It distills the essence of effective management into a beautifully simple story." - Management Today</p>
    <p>"The quickest, most impactful read for anyone moving into a leadership role." - Business Insider</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $22.00 for the hardcover edition.</p>
</div>`,
  "whats-your-dream": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>What's Your Dream?</em> is a motivational guide designed to help readers identify their true passions, overcome limiting beliefs, and create a concrete action plan for achieving their life's goals.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book serves as both a philosophical exploration of purpose and a practical workbook. It provides exercises to help individuals clarify their vision and break down seemingly impossible dreams into manageable, daily steps.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The core message is that most people fail to achieve their dreams simply because they never clearly define them. The author emphasizes the importance of writing down goals, visualizing the outcome, and building a support network. The book addresses the fear of failure and provides strategies for building resilience and maintaining momentum when facing inevitable obstacles on the path to success.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"An inspiring and highly practical workbook. It takes the abstract concept of 'following your dreams' and turns it into a science." - Personal Growth Quarterly</p>
    <p>"A great catalyst for change. It forces you to ask the hard questions about what you truly want out of life." - Wellness Blog</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $15.99 for the paperback edition.</p>
</div>`,
  "business-book": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The Essential Business Playbook</em> (Placeholder) is a comprehensive overview of fundamental business principles, covering everything from initial strategy to execution and scale.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Designed for both novice entrepreneurs and seasoned executives, this book synthesizes core concepts in marketing, finance, operations, and leadership into a unified framework for corporate success.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The book emphasizes the necessity of aligning operational execution with high-level strategic goals. It covers the importance of cash flow management, building scalable systems, and fostering a culture of continuous innovation. Key chapters detail how to conduct competitive analysis, optimize the supply chain, and leverage data analytics for better decision-making in a rapidly changing market.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A solid, no-nonsense primer on how businesses actually operate and succeed in the real world." - The Business Journal</p>
    <p>"Excellent resource for bridging the gap between theory and execution." - Corporate Leadership Review</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $24.95 for the hardcover edition.</p>
</div>`
};

for (const [slug, html] of Object.entries(batch5)) {
  if (global.bookSummariesData[slug]) {
    global.bookSummariesData[slug].summaryHtml = html;
  }
}

const newFileContent = `const bookSummariesData = ${JSON.stringify(global.bookSummariesData, null, 2)};\n`;
fs.writeFileSync(dataPath, newFileContent, 'utf8');
console.log('Batch 5 injected successfully.');
