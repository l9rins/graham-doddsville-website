// Category Loader for Graham and Doddsville Homepage
// Updated: Increases news items from 3 to 5 per section

document.addEventListener('DOMContentLoaded', async () => {
    // 1. configuration
    const categories = [
        { id: 'top-companies-news', keywords: ['Companies', 'Investment', 'Business'] },
        { id: 'top-markets-news', keywords: ['Markets', 'Investment', 'General'] },
        { id: 'top-economy-news', keywords: ['Economy', 'Monetary Policy', 'General'] },
        { id: 'top-industry-news', keywords: ['Industry', 'Resources', 'Energy', 'Technology'] },
        { id: 'top-regulatory-news', keywords: ['Regulatory', 'Banking', 'Monetary Policy', 'General'] },
        { id: 'top-guru-watch-news', keywords: ['Investment', 'Companies', 'Markets'] },
        { id: 'top-around-world-news', keywords: ['General', 'International', 'Economy'] }
    ];

    // 2. Main Logic
    try {
        // Wait for the main news manager to be ready, or fetch directly if needed
        if (window.newsDisplayManager && window.newsDisplayManager.allNews && window.newsDisplayManager.allNews.length > 0) {
            console.log(`Populating category sections with existing data: ${window.newsDisplayManager.allNews.length} articles`);
            populateSections(window.newsDisplayManager.allNews);
        } else {
            // If main manager isn't ready, fetch independently
            console.log('Fetching news for category sections...');
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = isLocalhost ? 'http://localhost:3051/api/news' : '/api/news';
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                if (data.articles) {
                    populateSections(data.articles);
                }
            }
        }

    } catch (error) {
        console.error('Error in category-loader:', error);
    }

    // 3. Populate Function
    function populateSections(allNews) {
        categories.forEach(cat => {
            const container = document.getElementById(cat.id);
            if (!container) return;

            // Filter news for this category based on keywords
            // We use the same loose matching logic to ensure we get enough items
            const sectionNews = allNews.filter(article => {
                const category = (article.category || 'General');
                // Check if the article's category matches any of our keywords
                return cat.keywords.includes(category) || cat.keywords.includes('General');
            });

            // Deduplicate logic if needed, but for now just take the top 5
            // UPDATED: Changed slice(0, 3) to slice(0, 5)
            const uniqueNews = [...new Set(sectionNews)];
            const displayNews = uniqueNews.slice(0, 5);

            if (displayNews.length > 0) {
                console.log(`Populating ${cat.id} with ${displayNews.length} articles`);
                renderCategoryNews(container, displayNews);
            } else {
                console.log(`No news found for ${cat.id}`);
                // Optional: Leave empty or show placeholder
                container.innerHTML = '<p class="no-news">No recent updates.</p>';
            }
        });
    }

    // 4. Render Function (Simplified for Sidebar/Small sections)
    function renderCategoryNews(container, articles) {
        container.innerHTML = articles.map(article => `
            <div class="news-item-small">
                <div class="news-content">
                    <h4><a href="${article.url}" target="_blank" rel="noopener">${article.title}</a></h4>
                    <span class="news-date">${formatDate(article.publishedAt)}</span>
                </div>
            </div>
        `).join('');
    }

    // Helper Date Formatter
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Recently';

            const now = new Date();
            const diff = (now - date) / (1000 * 60 * 60); // hours

            if (diff < 1) return 'Just now';
            if (diff < 24) return `${Math.floor(diff)}h ago`;
            if (diff < 168) return `${Math.floor(diff / 24)}d ago`; // up to 7 days

            return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
        } catch (e) {
            return 'Recently';
        }
    }
});