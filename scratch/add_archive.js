const fs = require('fs');

let html = fs.readFileSync('public/category.html', 'utf8');

// 1. Insert the archive section HTML right after the sources list
const sourcesListEndIndex = html.indexOf('</div>\n    </div>\n</div>\n\n<script src="/news-sources-data.js"></script>');
if (sourcesListEndIndex !== -1) {
    const archiveHtml = `
    </div>

    <!-- Archive Section -->
    <div class="wealth-creation-content" id="archive-section" style="display: none; margin-top: 40px; padding-top: 40px; border-top: 1px solid #e5e7eb;">
        <div class="wealth-creation-header">
            <h1>Recent Articles Archive</h1>
            <p class="page-subtitle">Older news articles from this category</p>
        </div>
        
        <div class="readings-grid" id="archived-articles-list">
            <!-- Archived articles will be rendered here -->
        </div>
    </div>
</div>

<script src="js/news-scraper.js"></script>
<script src="/news-sources-data.js"></script>`;

    html = html.replace('</div>\n    </div>\n</div>\n\n<script src="/news-sources-data.js"></script>', archiveHtml);
} else {
    console.error('Could not find injection point for HTML.');
}

// 2. Modify the inline script to use async function and add archive fetching logic
html = html.replace('(function () {', '(async function () {');

const archiveScriptLogic = `
        // --- Archive News Logic ---
        const archiveSection = document.getElementById('archive-section');
        const archiveList = document.getElementById('archived-articles-list');
        
        if (window.AustralianNewsScraper && meta && meta.title) {
            try {
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const apiUrl = isLocalhost ? 'http://localhost:4012/api' : 'https://graham-doddsville.onrender.com/api';
                
                const scraper = new window.AustralianNewsScraper(apiUrl);
                const allNews = await scraper.fetchNews();
                
                const categoryMatch = meta.title; 
                
                let categoryNews = allNews.filter(article => {
                    const articleCat = article.category || 'General';
                    return articleCat === categoryMatch;
                });
                
                // Sort by date (newest first)
                categoryNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                
                // Skip the first 5 (shown on index) and take the next 10
                const archiveNews = categoryNews.slice(5, 15);
                
                if (archiveNews.length > 0) {
                    archiveSection.style.display = 'block';
                    
                    const archiveFragment = document.createDocumentFragment();
                    
                    archiveNews.forEach((article, index) => {
                        const card = document.createElement('a');
                        card.href = article.url;
                        card.target = '_blank';
                        card.rel = 'noopener noreferrer';
                        card.className = 'reading-card';
                        card.style.textDecoration = 'none';
                        card.style.display = 'flex';
                        card.style.flexDirection = 'column';
                        card.style.justifyContent = 'space-between';
                        card.style.height = '100%';
                        
                        let dateStr = scraper.formatDate(article.publishedAt);
                        let sourceName = article.source?.name || article.source || 'News';
                        
                        let authorClass = 'author-graham';
                        if (meta.section === 'Around the World') {
                            authorClass = 'author-tweedy';
                        } else if (categoryType === 'guru-watch') {
                            authorClass = 'author-buffett';
                        }
                        
                        card.innerHTML =
                            '<div class="reading-card-header">' +
                            '  <span class="reading-number" style="background: ' + meta.accent + '">' + (index + 6) + '</span>' +
                            '  <div class="reading-content">' +
                            '    <span class="reading-title" style="font-size: 1rem; line-height: 1.3;">' + escapeHtml(article.title) + '</span>' +
                            '    <div class="reading-meta" style="margin-top: 8px;">' +
                            '      <span class="reading-author ' + authorClass + '">' + escapeHtml(sourceName) + '</span>' +
                            '      <span class="reading-year">' + escapeHtml(dateStr) + '</span>' +
                            '    </div>' +
                            '  </div>' +
                            '</div>' +
                            '<div class="reading-actions">' +
                            '  <span class="btn-primary" style="background: ' + meta.accent + '; padding: 6px 12px; font-size: 13px;">Read Article</span>' +
                            '</div>';
                            
                        archiveFragment.appendChild(card);
                    });
                    
                    archiveList.appendChild(archiveFragment);
                }
            } catch (e) {
                console.error("Failed to load archive news", e);
            }
        }
`;

// Insert the archive logic right before `// --- HTML escape helper ---`
if (html.includes('// --- HTML escape helper ---')) {
    html = html.replace('// --- HTML escape helper ---', archiveScriptLogic + '\n        // --- HTML escape helper ---');
} else {
    console.error('Could not find injection point for JS.');
}

fs.writeFileSync('public/category.html', html, 'utf8');
console.log('Successfully added archive section to category.html');
