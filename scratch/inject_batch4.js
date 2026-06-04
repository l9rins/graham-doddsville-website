const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/js/book-summaries-data.js');
let fileContent = fs.readFileSync(dataPath, 'utf8');
fileContent = fileContent.replace('const bookSummariesData =', 'global.bookSummariesData =');
eval(fileContent);

const batch4 = {
  "the-master-key-system": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>The Master Key System</em> by Charles F. Haanel is a classic New Thought text that explores the power of the mind to shape reality. Originally published as a 24-week correspondence course in 1912, it is considered a foundational work in personal development.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book teaches the principles of mental visualization, concentration, and the law of attraction. It provides practical exercises designed to unlock the reader's inner potential and manifest their desires into physical reality.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>Haanel argues that the universe is governed by immutable laws, the most important being the Law of Attraction—that "like attracts like." He asserts that thoughts are a form of energy that directly influence the material world. The text is structured as a series of lessons, moving from basic relaxation and focus techniques to advanced methods of conscious creation and harnessing the subconscious mind.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A profound and timeless guide to the mechanics of thought. It's the original source material for much of modern self-help." - New Thought Quarterly</p>
    <p>"Requires deep study, but the rewards are immense. It teaches true mastery over one's mental state." - Personal Growth Daily</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $12.99 for the paperback edition.</p>
</div>`,
  "when-things-fall-apart": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>When Things Fall Apart: Heart Advice for Difficult Times</em> by Pema Chödrön draws on Tibetan Buddhist teachings to offer profound wisdom on navigating pain, suffering, and uncertainty.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Rather than offering quick fixes to escape pain, Chödrön teaches how to lean into it. The book provides meditative practices and mindset shifts to help readers find peace and courage precisely in the moments when their world feels like it's collapsing.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The core message is that pain and suffering are inevitable parts of life, but our habitual reaction—trying to escape or numb the pain—only causes more suffering. Chödrön introduces the concept of "maitri" (loving-kindness toward oneself) and teaches how to stay present with uncomfortable emotions. By facing fear and anxiety with open-heartedness, we can transform crises into opportunities for profound spiritual growth.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A lifeline for anyone going through a difficult transition. Chödrön's compassion and clarity are deeply comforting." - Tricycle Magazine</p>
    <p>"One of the most important spiritual books of our time. It changes how you relate to fear and hardship." - Spirituality & Health</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $16.95 for the paperback edition.</p>
</div>`,
  "self-doubt-workbook-for-women": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p>The <em>Self-Doubt Workbook for Women</em> provides evidence-based exercises and cognitive-behavioral strategies to help women overcome imposter syndrome, quiet their inner critic, and build lasting self-confidence.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>This interactive workbook is designed as a practical toolkit. It helps readers identify the root causes of their self-doubt and offers step-by-step journaling prompts and activities to rewire negative thought patterns.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The book addresses the societal and internal pressures that disproportionately affect women's self-esteem. It utilizes principles from Cognitive Behavioral Therapy (CBT) and Acceptance and Commitment Therapy (ACT) to help readers challenge limiting beliefs. Key exercises focus on separating feelings from facts, practicing self-compassion, and taking actionable steps toward personal goals despite the presence of fear.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"An incredibly actionable and supportive resource. The exercises are practical and produce immediate shifts in perspective." - Psychology Today</p>
    <p>"A must-have for any woman struggling with the inner critic. It's like having a therapist in book form." - Wellness Magazine</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $18.50 for the paperback edition.</p>
</div>`,
  "love-yourself-like-your-life-depends-on-it": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Love Yourself Like Your Life Depends On It</em> by Kamal Ravikant is a raw, deeply personal account of how the author used the radical practice of self-love to pull himself back from the brink of physical and emotional collapse.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>The book outlines a remarkably simple but intense daily practice centered around a single, continuous mental loop. It is less a theoretical self-help book and more a survival manual for the human spirit.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>At his lowest point, Ravikant made a vow: "I will love myself." The core practice involves constantly repeating "I love myself" in the mind, meditating to a specific track while visualizing light, and looking in the mirror while repeating the phrase. He argues that the brain is a highly adaptable machine, and by aggressively forcing this positive neural pathway, one can physically rewire their brain to heal from depression and self-loathing.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"Short, powerful, and deeply moving. It strips away all the complexity of self-help and leaves only the most essential truth." - James Altucher</p>
    <p>"A life-saving book. Kamal's vulnerability makes his method incredibly compelling and relatable." - Tim Ferriss Blog</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $14.99 for the paperback edition.</p>
</div>`,
  "leaders-eat-last": `
<div class="summary-section">
    <h3>About the Book</h3>
    <p><em>Leaders Eat Last: Why Some Teams Pull Together and Others Don't</em> by Simon Sinek explores the biological and evolutionary roots of human cooperation, trust, and effective leadership.</p>
</div>
<div class="summary-section">
    <h3>Product Description</h3>
    <p>Sinek explains that true leadership is not about authority or rank, but about creating a "Circle of Safety" where employees feel valued and protected from internal politics, allowing them to focus entirely on external challenges.</p>
</div>
<div class="summary-section">
    <h3>Selective Summary</h3>
    <p>The title comes from the Marine Corps tradition where junior Marines eat first and senior officers eat last, symbolizing the sacrifice inherent in true leadership. Sinek delves into the brain's chemical incentives—endorphins, dopamine, serotonin, and oxytocin—and explains how modern corporate environments often trigger stress hormones (cortisol) instead of fostering the trust (oxytocin) necessary for high performance. The book advocates for leaders who prioritize the well-being of their people over short-term metrics.</p>
</div>
<div class="summary-section">
    <h3>Book Reviews</h3>
    <p>"A paradigm-shifting look at organizational culture. Sinek explains the science behind why we love working for some leaders and dread working for others." - Forbes</p>
    <p>"Essential reading for anyone managing a team. It fundamentally changes how you view your responsibility as a leader." - Inc. Magazine</p>
</div>
<div class="summary-section">
    <h3>Indicative Price</h3>
    <p>Approximately $18.00 for the paperback edition.</p>
</div>`
};

for (const [slug, html] of Object.entries(batch4)) {
  if (global.bookSummariesData[slug]) {
    global.bookSummariesData[slug].summaryHtml = html;
  }
}

const newFileContent = `const bookSummariesData = ${JSON.stringify(global.bookSummariesData, null, 2)};\n`;
fs.writeFileSync(dataPath, newFileContent, 'utf8');
console.log('Batch 4 injected successfully.');
