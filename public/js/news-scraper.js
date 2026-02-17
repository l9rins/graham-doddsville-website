// News Scraper for Graham and Doddsville Website
// Updated: Targets ALL ID variations to prevent conflicts and ensure 5 items everywhere

class AustralianNewsScraper {
    constructor(apiUrl) {
        this.apiUrl = apiUrl || '/api';
        this.cachedNews = [];
        this.lastUpdate = null;
        this.updateInterval = 15 * 60 * 1000;
    }

    async fetchNews() {
        try {
            console.log('AustralianNewsScraper: Starting news fetching...');

            if (this.cachedNews.length > 0 && this.isRecentCache()) {
                console.log('Returning client-side cached data');
                return this.cachedNews;
            }

            const allNews = [];

            try {
                console.log(`Fetching from backend: ${this.apiUrl}/news`);
                const response = await fetch(`${this.apiUrl}/news`);

                if (response.ok) {
                    const data = await response.json();
                    if (data.articles) {
                        const reProcessedArticles = data.articles.map(article => ({
                            ...article,
                            category: (article.category && ['Industry', 'Regulatory', 'Technology', 'Commodities'].includes(article.category))
                                ? article.category
                                : this.categorizeNews(article.title, article.description || article.content, article.source.name || article.source)
                        }));

                        allNews.push(...reProcessedArticles);
                        console.log(`Received ${data.articles.length} articles from backend`);
                    }
                } else {
                    throw new Error('Backend responded with error');
                }
            } catch (error) {
                console.error('Backend fetch failed:', error);
                return [];
            }

            this.cachedNews = allNews;
            this.lastUpdate = new Date();
            return allNews;

        } catch (error) {
            console.error('Critical error in fetchNews:', error);
            return [];
        }
    }

    isRecentCache() {
        if (!this.lastUpdate) return false;
        return (Date.now() - this.lastUpdate.getTime()) < this.updateInterval;
    }

    categorizeNews(title, description, sourceName) {
        const text = (title + ' ' + (description || '')).toLowerCase();
        const source = (sourceName || '').toLowerCase();

        if (text.includes('buffett') || text.includes('berkshire') || text.includes('munger') ||
            text.includes('dalio') || text.includes('ackman') || text.includes('burry') ||
            text.includes('portfolio') || text.includes('hedge fund') || text.includes('investor letter') ||
            text.includes('holding') || text.includes('stake') || text.includes('shareholder letter')) {
            return 'Guru Watch';
        }

        if (text.includes('rba') || text.includes('reserve bank') || text.includes('asic') ||
            text.includes('accc') || text.includes('tax') || text.includes('law') ||
            text.includes('legislation') || text.includes('government') || text.includes('policy') ||
            text.includes('compliance') || text.includes('court') || text.includes('fine') ||
            text.includes('ban') || text.includes('penalty') || text.includes('regulator')) {
            return 'Regulatory';
        }

        if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') ||
            text.includes('interest rate') || text.includes('cpi') || text.includes('unemployment') ||
            text.includes('jobs') || text.includes('recession') || text.includes('growth') ||
            text.includes('fiscal') || text.includes('trade deficit') || text.includes('dollar')) {
            return 'Economy';
        }

        if (text.includes('mining') || text.includes('banking') || text.includes('retail') ||
            text.includes('tech') || text.includes('healthcare') || text.includes('energy') ||
            text.includes('resources') || text.includes('construction') || text.includes('property') ||
            text.includes('real estate') || text.includes('sector')) {
            return 'Industry';
        }

        if (text.includes('asx') || text.includes('market') || text.includes('dow') ||
            text.includes('nasdaq') || text.includes('s&p') || text.includes('index') ||
            text.includes('rally') || text.includes('plunge') || text.includes('bull') ||
            text.includes('bear') || text.includes('close') || text.includes('open')) {
            return 'Markets';
        }

        if (text.includes('company') || text.includes('shares') || text.includes('stock') ||
            text.includes('dividend') || text.includes('profit') || text.includes('revenue') ||
            text.includes('earnings') || text.includes('deal') || text.includes('acquisition') ||
            text.includes('merger') || text.includes('ceo') || text.includes('appoint') ||
            text.includes('launch') || text.includes('results') || text.includes('sales') ||
            text.includes('forecast') || text.includes('guidance') || text.includes('quarterly') ||
            text.includes('report') || text.includes('announced') || text.includes('business')) {
            return 'Companies';
        }

        if (source.includes('financial') || source.includes('business') || source.includes('money')) {
            return 'Companies';
        }

        return 'General';
    }

    formatDate(dateInput) {
        try {
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return 'Recently';

            const now = new Date();
            const diff = now - date;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);

            if (hours < 1) return 'Just now';
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;

            return date.toLocaleDateString('en-AU');
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Recently';
        }
    }
}

class NewsDisplayManager {
    constructor() {
        this.scraper = null;
        this.allNews = [];
        this.maxDisplay = 7;
    }

    async initialize() {
        try {
            console.log('NewsDisplayManager: Starting initialization...');
            this.showLoadingState();

            const news = await this.scraper.fetchNews();
            this.allNews = news;

            try {
                const cacheData = { data: news, timestamp: Date.now() };
                localStorage.setItem('newsCache', JSON.stringify(cacheData));
            } catch (e) { console.log('LocalStorage Error:', e); }

            this.displayNews(news);
            this.setupEventListeners();
            this.setupAutoRefresh();

        } catch (error) {
            console.error('Error initializing news display:', error);
            this.showErrorState();
        }
    }

    generatePlaceholderImage(sourceName) {
        const safeName = sourceName ? sourceName.replace(/[^a-zA-Z0-9 ]/g, '') : 'News';
        return `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(safeName)}`;
    }

    // === UPDATED: Targets BOTH ID sets (companies-news AND top-companies-news) ===
    showLoadingState() {
        const categoryContainers = [
            'companies-news', 'top-companies-news',
            'markets-news', 'top-markets-news',
            'economy-news', 'top-economy-news',
            'industry-news', 'top-industry-news',
            'regulatory-news', 'top-regulatory-news',
            'guru-watch-news', 'top-guru-watch-news',
            'feature-articles-container'
        ];
        categoryContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<div class="loading-state"><div class="news-loading-spinner"></div><p>Loading news...</p></div>`;
            }
        });
    }

    showErrorState() {
        const categoryContainers = [
            'companies-news', 'top-companies-news',
            'markets-news', 'top-markets-news',
            'economy-news', 'top-economy-news',
            'industry-news', 'top-industry-news',
            'regulatory-news', 'top-regulatory-news',
            'guru-watch-news', 'top-guru-watch-news',
            'feature-articles-container'
        ];
        categoryContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<div class="error-state"><p>⚠️ Unable to load news.</p></div>`;
            }
        });
    }

    // === SMART HYBRID DISPLAY LOGIC ===
    displayNews(news) {
        console.log('NewsDisplayManager: Displaying', news.length, 'news items');

        // Skip if real API data already populated the sections
        if (window.categorySectionsPopulated) {
            console.log('NewsDisplayManager.displayNews: Real API data already loaded, skipping to avoid overwrite');
            return;
        }

        if (!news || news.length === 0) {
            this.showErrorState();
            return;
        }

        const newsByCategory = {};
        news.forEach(item => {
            const category = item.category || 'General';
            if (!newsByCategory[category]) newsByCategory[category] = [];
            newsByCategory[category].push(item);
        });

        if (!newsByCategory['Feature Articles'] && newsByCategory['General']) {
            newsByCategory['Feature Articles'] = newsByCategory['General'];
        }

        // Configuration:
        // Supports BOTH ID formats to override any other script
        const categoryContainers = {
            'Companies': { ids: ['companies-news', 'top-companies-news'], limit: 5, freshLimit: 48, hardLimit: 168 },
            'Markets': { ids: ['markets-news', 'top-markets-news'], limit: 5, freshLimit: 48, hardLimit: 168 },
            'Economy': { ids: ['economy-news', 'top-economy-news'], limit: 5, freshLimit: 48, hardLimit: 168 },
            'Industry': { ids: ['industry-news', 'top-industry-news'], limit: 5, freshLimit: 48, hardLimit: 168 },
            'Regulatory': { ids: ['regulatory-news', 'top-regulatory-news'], limit: 5, freshLimit: 72, hardLimit: 168 },
            'Guru Watch': { ids: ['guru-watch-news', 'top-guru-watch-news'], limit: 5, freshLimit: 72, hardLimit: 336 },
            'Feature Articles': { ids: ['feature-articles-container'], limit: 10, freshLimit: 48, hardLimit: 168 }
        };

        Object.keys(categoryContainers).forEach(category => {
            const config = categoryContainers[category];

            // Iterate over ALL possible IDs for this category
            config.ids.forEach(containerId => {
                const container = document.getElementById(containerId);

                if (container) {
                    container.innerHTML = '';
                    let rawArticles = newsByCategory[category] || [];

                    // 1. Sort by Date (Newest First)
                    rawArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                    // BACKFILL STRATEGY: If fewer than 3 articles, supplement with General news
                    // This creates a "Hybrid" feed where specific news takes precedence, but the section is never empty
                    if (rawArticles.length < 3) {
                        let generalNews = newsByCategory['General'] || [];
                        generalNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                        // Filter out duplicates (by title)
                        const existingTitles = new Set(rawArticles.map(a => a.title));
                        const uniqueGeneral = generalNews.filter(a => !existingTitles.has(a.title));

                        // Take enough to reach limit (or at least some)
                        const needed = config.limit - rawArticles.length;
                        rawArticles = rawArticles.concat(uniqueGeneral.slice(0, needed));
                    }

                    // 2. SMART SELECTION
                    let selectedArticles = this.getSmartArticles(rawArticles, config.limit, config.freshLimit, config.hardLimit);

                    if (selectedArticles.length > 0) {
                        container.innerHTML = selectedArticles.map(item => this.createNewsItemHTML(item)).join('');
                    } else {
                        container.innerHTML = `<div class="no-news-in-category"><p>No updates within 7 days.</p></div>`;
                    }
                }
            });
        });

        this.updateLastUpdatedTime();
    }

    getSmartArticles(articles, limit, freshHours, hardHours) {
        const now = new Date();
        const validArticles = articles.filter(item => !isNaN(new Date(item.publishedAt).getTime()));

        const freshArticles = [];
        const backfillArticles = [];

        validArticles.forEach(item => {
            const diffHours = (now - new Date(item.publishedAt)) / (1000 * 60 * 60);
            if (diffHours <= freshHours) {
                freshArticles.push(item);
            } else if (diffHours <= hardHours) {
                backfillArticles.push(item);
            }
        });

        let result = [...freshArticles];
        if (result.length < limit && backfillArticles.length > 0) {
            const needed = limit - result.length;
            result = result.concat(backfillArticles.slice(0, needed));
        }

        return result.slice(0, limit);
    }

    createNewsItemHTML(item) {
        const formattedDate = this.scraper.formatDate(item.publishedAt);
        let imageUrl = item.image;
        if (!imageUrl || imageUrl.includes('unsplash')) {
            imageUrl = this.generatePlaceholderImage(item.source);
        }

        // Determine layout based on container type (sidebar vs main)
        // For simplicity, we use the standard card layout which works in both
        return `
            <div class="news-item" data-category="${item.category}">
                <div class="news-image-container">
                     <img src="${imageUrl}" alt="${item.title}" class="news-thumb" onerror="this.src='${this.generatePlaceholderImage(item.source)}'">
                </div>
                <div class="news-content">
                    <div class="news-header">
                        <h3><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                    </div>
                    <p>${item.excerpt || item.description || ''}</p>
                    <div class="news-meta">
                        <span class="news-source">${item.source}</span>
                        <span class="news-time">${formattedDate}</span>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const refreshButton = document.querySelector('.news-refresh-btn');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.refreshNews());
        }
    }

    setupAutoRefresh() {
        setInterval(() => this.refreshNews(), 30 * 60 * 1000);
    }

    async refreshNews() {
        this.showLoadingState();
        const news = await this.scraper.fetchNews();
        this.displayNews(news);
    }

    updateLastUpdatedTime() {
        const el = document.querySelector('.news-last-updated');
        if (el) el.textContent = `Last updated: ${new Date().toLocaleTimeString('en-AU')}`;
    }
}

// Initialize
let newsDisplayManager;
document.addEventListener('DOMContentLoaded', () => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isLocalhost ? 'http://localhost:3051/api' : '/api';

    newsDisplayManager = new NewsDisplayManager();
    newsDisplayManager.scraper = new AustralianNewsScraper(apiUrl);
    window.newsDisplayManager = newsDisplayManager;
    newsDisplayManager.initialize();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AustralianNewsScraper, NewsDisplayManager };
}