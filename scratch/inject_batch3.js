const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/js/book-summaries-data.js');
let fileContent = fs.readFileSync(dataPath, 'utf8');
fileContent = fileContent.replace('const bookSummariesData =', 'global.bookSummariesData =');
eval(fileContent);

const batch3 = {
  "sell-like-crazy": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Sell Like Crazy</em> by Sabri Suby is a high-energy, actionable guide to digital marketing and sales funnel optimization, designed to help businesses acquire customers at scale.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book details a specific, multi-phase system for generating leads and converting them into high-paying clients. It covers everything from crafting compelling offers and writing persuasive copy to structuring automated sales funnels.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Suby advocates for the "Halo Strategy," a method of attracting the 97% of the market that isn't ready to buy *yet* by offering high-value content upfront. The core of the system relies on identifying a starving crowd, creating an irresistible 'Godfather Offer', and driving traffic through highly optimized landing pages. The book emphasizes aggressive, metrics-driven marketing where every dollar spent must prove its ROI.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A modern playbook for customer acquisition. Sabri Suby breaks down complex digital marketing strategies into a system anyone can follow." - Digital Marketer</p>
    <p>"Incredibly practical. This isn't theory; it's the exact blueprint used by one of the fastest-growing agencies in the world." - Foundr Magazine</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $19.99 for the paperback edition.</p>
</div>`,
  "way-of-the-wolf": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Way of the Wolf: Straight Line Selling</em> by Jordan Belfort (the real 'Wolf of Wall Street') details his step-by-step system for persuading anyone to do anything, ethically.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book cracks the code on how to persuade people to buy. It provides a structured framework for managing the sales conversation from opening to close, maintaining control, and creating massive certainty in the buyer's mind.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The "Straight Line System" is built on the premise that every sale is the same: you must move the prospect from a state of uncertainty to a state of absolute certainty across three areas (the "Three Tens"): the product, the salesperson, and the company. Belfort details techniques for tonality, body language, gathering intelligence, and looping back to address objections without breaking rapport.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"Love him or hate him, Belfort is a master of sales. This system is remarkably effective when applied ethically." - Entrepreneur</p>
    <p>"The concepts of tonality and state management alone are worth the price of the book. A must-read for high-ticket closers." - Sales Gravy</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $26.00 for the hardcover edition.</p>
</div>`,
  "new-sales-simplified": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>New Sales. Simplified.</em> by Mike Weinberg is a practical, no-nonsense guide focused entirely on the most challenging aspect of sales: prospecting and acquiring *new* business.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Weinberg identifies the common mistakes salespeople make that hinder new business development and provides a simple, foolproof framework for targeting accounts, crafting a compelling "sales story," and executing proactive sales calls.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The book emphasizes that acquiring new business requires a distinct mindset and skill set compared to managing existing accounts. Weinberg advocates for creating a strategic target list, dedicating blocked time for prospecting, and perfecting a customer-centric "sales story" rather than relying on standard corporate pitches. He emphasizes execution and taking ownership of pipeline generation.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"The best book on prospecting and new business development I have ever read. It's practical, direct, and incredibly effective." - Jeb Blount</p>
    <p>"Weinberg cuts through the complexity of modern sales methodology and brings it back to the fundamentals that actually work." - Hubspot Sales</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $21.99 for the paperback edition.</p>
</div>`,
  "the-let-them-theory": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The Let Them Theory</em> (popularized by Mel Robbins) is a powerful psychological framework for reducing anxiety, letting go of control, and improving interpersonal relationships.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The concept centers on a simple but profound mindset shift: instead of trying to control other people's actions, expectations, or opinions, you simply "let them." This frees up emotional energy and creates healthier boundaries.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The theory posits that much of our daily frustration stems from unmet expectations of how others *should* behave. By adopting the "let them" mindset—whether it's letting a coworker take credit, letting a friend be late, or letting a family member hold a different opinion—you detach from the outcome. This radical acceptance allows you to focus solely on your own reactions and choices, leading to profound inner peace.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A brilliantly simple concept that provides immediate relief from everyday anxiety and relationship stress." - Psychology Today</p>
    <p>"The ultimate tool for emotional detachment and boundary setting. It completely changes how you interact with difficult people." - MindBodyGreen</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $24.00 for the hardcover edition.</p>
</div>`,
  "success-no-excuses": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>No Excuses!: The Power of Self-Discipline</em> by Brian Tracy demonstrates how self-discipline is the single most important factor for achieving success in any area of life.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book provides a step-by-step guide to developing the habit of self-discipline in three major areas: personal success, business/money, and overall happiness. It offers practical exercises to eliminate excuse-making.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Tracy argues that talent and intelligence are useless without the discipline to apply them consistently. He defines self-discipline as "the ability to do what you should do, when you should do it, whether you feel like it or not." The book covers strategies for goal setting, time management, delayed gratification, and taking absolute responsibility for one's life circumstances.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"Brian Tracy delivers a powerful kick in the pants. A masterful guide to taking control of your destiny." - Success Magazine</p>
    <p>"The foundational text on self-discipline. It strips away all the reasons we fail and leaves only the path to success." - Personal Growth Blog</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $17.99 for the paperback edition.</p>
</div>`
};

for (const [slug, html] of Object.entries(batch3)) {
  if (global.bookSummariesData[slug]) {
    global.bookSummariesData[slug].summaryHtml = html;
  }
}

const newFileContent = `const bookSummariesData = ${JSON.stringify(global.bookSummariesData, null, 2)};\n`;
fs.writeFileSync(dataPath, newFileContent, 'utf8');
console.log('Batch 3 injected successfully.');
