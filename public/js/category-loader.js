document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('category-news-container');
    const pageTitle = document.getElementById('page-title');
    const categoryHeader = document.querySelector('.category-header h1');
    const categoryDesc = document.querySelector('.category-description');

    // 1. Get Category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('type');

    // 2. Initialize Page
    if (category) {
        const displayCategory = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
        document.title = `${displayCategory} News - Graham and Doddsville`;
        if (categoryHeader) categoryHeader.textContent = displayCategory;
        if (categoryDesc) categoryDesc.textContent = `Latest updates and analysis for ${displayCategory}`;

        loadCategoryNews(category);
    } else {
        showError('No category specified');
    }

    // 3. Main Load Function
    async function loadCategoryNews(cat) {
        showLoading();

        try {
            // Use relative path for Render compatibility
            const response = await fetch(`/api/news/category/${cat}`);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                renderArticles(data.articles);
            } else {
                showEmptyState(cat);
            }

        } catch (error) {
            console.error('Error loading category news:', error);
            showError();
        }
    }

    // 4. Render Functions
    function renderArticles(articles) {
        container.innerHTML = articles.map(article => `
            <div class="news-card">
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 class="news-title">
                        <a href="${article.url}" target="_blank" rel="noopener">${article.title}</a>
                    </h3>
                    <p class="news-excerpt">${article.excerpt || ''}</p>
                    <a href="${article.url}" target="_blank" rel="noopener" class="read-more">Read Article →</a>
                </div>
            </div>
        `).join('');
    }

    function showLoading() {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading market updates...</p>
            </div>
        `;
    }

    // 5. THE FIX: Proper Error State with Working Buttons
    function showError(message) {
        container.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h3>Unable to Load News</h3>
                <p>${message || "News service temporarily unavailable. Please try again later."}</p>
                <div class="error-actions">
                    <button id="retry-btn" class="btn btn-primary">Try Again</button>
                    <a href="index.html" class="btn btn-secondary">← Back to Home</a>
                </div>
            </div>
        `;

        // Attach event listener AFTER creating the button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                loadCategoryNews(category);
            });
        }
    }

    function showEmptyState(cat) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No articles found for "${cat}".</p>
                <a href="index.html" class="btn btn-primary">Browse All News</a>
            </div>
        `;
    }
});