const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../public/book-summary.html');
let html = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Replace title
html = html.replace(/<title>.*?<\/title>/, '<title>Book Summary - Graham and Doddsville</title>');

// 2. Change imported scripts
// Remove news-sources-data.js, add book-summaries-data.js
html = html.replace('<script src="/news-sources-data.js"></script>', '<script src="js/book-summaries-data.js"></script>');
html = html.replace('<script src="js/news-scraper.js"></script>', ''); // we don't need news scraper here

// 3. Replace the wealth-creation-page-content block entirely
const contentStart = html.indexOf('<div class="wealth-creation-page-content">');
const contentEnd = html.indexOf('</div>\n\n<script src="js/book-summaries-data.js"></script>');
// Wait, the end of the div is tricky to find. 
// Let's use regex to replace the whole block up to the script tags at the bottom.
const regex = /<div class="wealth-creation-page-content">[\s\S]*?(?=<\/div>\s*<script)/;

const newContent = `<div class="wealth-creation-page-content" style="max-width: 1000px; margin: 0 auto;">
    <div class="wealth-creation-header" style="text-align: left; border-bottom: 2px solid var(--border-light); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
            <a href="index.html" style="color: var(--primary-blue); text-decoration: none; font-weight: 500; font-size: 14px;">← Back to Books</a>
            <span style="color: var(--text-muted); font-size: 14px;">|</span>
            <span id="book-category" style="background: rgba(30, 64, 175, 0.1); color: var(--primary-blue); padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Category</span>
        </div>
        <h1 id="book-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 3rem; line-height: 1.2; margin-bottom: 16px; color: var(--text-primary);">Loading Summary...</h1>
    </div>

    <div style="display: flex; gap: 40px; flex-wrap: wrap;">
        <!-- Left: Summary Content -->
        <div id="summary-content" class="book-summary-text" style="flex: 1; min-width: 300px; font-size: 1.125rem; line-height: 1.8; color: var(--text-primary);">
            <div class="loading">Loading summary text...</div>
        </div>

        <!-- Right: Sidebar -->
        <div style="width: 320px; flex-shrink: 0;">
            <div style="position: sticky; top: 120px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,0.05); border-radius: var(--radius-lg); padding: 24px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.08);">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 0; margin-bottom: 16px;">Get the Book</h3>
                <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">Support the site by purchasing the full book through our Amazon affiliate link.</p>
                <a id="amazon-link" href="#" target="_blank" rel="noopener" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #FF9900; color: #111; padding: 14px 24px; border-radius: 99px; text-decoration: none; font-weight: 700; font-size: 16px; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);">
                    Buy on Amazon <span style="font-size: 18px;">→</span>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
    /* Styling for the injected Word HTML */
    .book-summary-text h1, .book-summary-text h2, .book-summary-text h3 {
        font-family: 'Playfair Display', Georgia, serif;
        color: var(--text-primary);
        margin-top: 2em;
        margin-bottom: 1em;
    }
    .book-summary-text p {
        margin-bottom: 1.5em;
    }
    .book-summary-text ul {
        margin-bottom: 1.5em;
        padding-left: 1.5em;
    }
    .book-summary-text li {
        margin-bottom: 0.5em;
    }
</style>
`;

html = html.replace(regex, newContent);

// 4. Update the inline script
const scriptRegex = /<script>\s*\(\s*async\s*function\s*\(\)\s*\{[\s\S]*?\}\s*\)\(\);\s*<\/script>/;
const newScript = `<script>
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const bookSlug = urlParams.get('book');

        const titleEl = document.getElementById('book-title');
        const categoryEl = document.getElementById('book-category');
        const contentEl = document.getElementById('summary-content');
        const amazonLink = document.getElementById('amazon-link');

        if (!bookSlug || typeof bookSummariesData === 'undefined' || !bookSummariesData[bookSlug]) {
            titleEl.textContent = "Summary Not Found";
            categoryEl.style.display = 'none';
            contentEl.innerHTML = '<p>Sorry, we could not find the summary you are looking for.</p>';
            amazonLink.style.display = 'none';
            return;
        }

        const book = bookSummariesData[bookSlug];
        
        document.title = book.title + " Summary - Graham and Doddsville";
        titleEl.textContent = book.title;
        categoryEl.textContent = book.category;
        
        if (book.amazonUrl) {
            amazonLink.href = book.amazonUrl;
        } else {
            amazonLink.style.display = 'none';
        }

        if (book.summaryHtml) {
            contentEl.innerHTML = book.summaryHtml;
        } else {
            contentEl.innerHTML = '<p>Summary text is being prepared.</p>';
        }
    });
</script>`;

html = html.replace(scriptRegex, newScript);

fs.writeFileSync(FILE_PATH, html, 'utf8');
console.log('Template generated.');
