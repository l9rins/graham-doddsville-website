const fs = require('fs');

const wealthCreationHtml = fs.readFileSync('public/wealth-creation.html', 'utf8');

// Extract the head block and styles
const headMatch = wealthCreationHtml.match(/<head>[\s\S]*?<\/head>/i);
let newHead = headMatch[0];
// replace title
newHead = newHead.replace(/<title>.*?<\/title>/i, '<title>News Sources - Graham and Doddsville</title>');

// Extract the header and mobile drawer
const bodyStartMatch = wealthCreationHtml.match(/<body[^>]*>[\s\S]*?<div class="wealth-creation-page-content">/i);
let headerSection = bodyStartMatch[0];

// Extract mobile menu toggle JS from wealth-creation.html
let mobileMenuJs = `
        // Mobile menu functionality
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileDrawer = document.getElementById('mobile-drawer');
        const drawerClose = document.getElementById('drawer-close');
        
        if (mobileToggle && mobileDrawer && drawerClose) {
            mobileToggle.addEventListener('click', () => {
                mobileDrawer.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
            
            drawerClose.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
`;

// Build the new HTML
const newHtml = `<!DOCTYPE html>
<html lang="en">
${newHead}
${headerSection.replace('<body', '<body class="category-page"')}
    <!-- Page Title Section -->
    <div class="page-title-section">
        <div class="breadcrumb">
            <a href="index.html" class="breadcrumb-link">← Home</a>
        </div>
        <h1 class="page-title section-header" id="category-title">News Sources</h1>
        <p class="page-subtitle" id="category-subtitle">Curated financial news sources for value investors</p>
    </div>

    <div class="wealth-creation-content">
        <div class="wealth-creation-header">
            <h1 id="section-label">Loading...</h1>
            <p class="page-subtitle" id="category-count"></p>
        </div>
        
        <div class="readings-grid" id="sources-list">
            <!-- Sources will be rendered here by JavaScript -->
        </div>
    </div>
</div>

<script src="/news-sources-data.js"></script>
<script>
    ${mobileMenuJs}

    (function () {
        'use strict';

        // --- Parse URL parameters ---
        const urlParams = new URLSearchParams(window.location.search);
        const categoryType = urlParams.get('type') || '';

        // --- Get DOM references ---
        const sectionLabel = document.getElementById('section-label');
        const categoryTitle = document.getElementById('category-title');
        const categorySubtitle = document.getElementById('category-subtitle');
        const categoryCount = document.getElementById('category-count');
        const sourcesList = document.getElementById('sources-list');

        // --- Check if data exists ---
        if (typeof newsSourcesData === 'undefined' || typeof categoryMeta === 'undefined') {
            sourcesList.innerHTML = '<div class="no-results"><h3>Data Error</h3><p>Could not load news sources data.</p></div>';
            return;
        }

        // --- Get category data ---
        const sources = newsSourcesData[categoryType];
        const meta = categoryMeta[categoryType];

        if (!sources || !meta) {
            sourcesList.innerHTML = '<div class="no-results"><h3>Category Not Found</h3><p>The requested news category does not exist.</p></div>';
            return;
        }

        // --- Update page title ---
        document.title = \`\${meta.title} News Sources - Graham and Doddsville\`;
        categoryTitle.textContent = meta.section;
        sectionLabel.textContent = meta.icon + ' ' + meta.title;
        categoryCount.textContent = \`\${sources.length} curated source\${sources.length !== 1 ? 's' : ''}\`;

        // --- Render source cards ---
        const fragment = document.createDocumentFragment();

        sources.forEach(function (source, index) {
            const card = document.createElement('a');
            card.href = source.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'reading-card';
            card.setAttribute('aria-label', 'Open ' + source.name + ' in new tab');
            card.style.textDecoration = 'none';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'space-between';
            card.style.height = '100%';

            // Extract domain for display
            let domain = '';
            try {
                const urlObj = new URL(source.url);
                domain = urlObj.hostname.replace('www.', '');
            } catch (e) {
                domain = source.url;
            }

            // Determine author style
            let authorClass = 'author-graham'; // default blue
            if (meta.section === 'Around the World') {
                authorClass = 'author-tweedy'; // purple
            } else if (categoryType === 'guru-watch') {
                authorClass = 'author-buffett'; // orange
            }

            card.innerHTML =
                '<div class="reading-card-header">' +
                '  <span class="reading-number" style="background: ' + meta.accent + '">' + (index + 1) + '</span>' +
                '  <div class="reading-content">' +
                '    <span class="reading-title">' + escapeHtml(source.name) + '</span>' +
                '    <div class="reading-meta">' +
                '      <span class="reading-author ' + authorClass + '">' + escapeHtml(domain) + '</span>' +
                '    </div>' +
                '  </div>' +
                '</div>' +
                '<div class="reading-actions">' +
                '  <span class="btn-primary" style="background: ' + meta.accent + '">Visit Source</span>' +
                '</div>';

            fragment.appendChild(card);
        });

        sourcesList.appendChild(fragment);

        // --- HTML escape helper ---
        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

    })();
</script>
</body>
</html>`;

fs.writeFileSync('public/category.html', newHtml, 'utf8');
console.log('Successfully rewrote category.html');
