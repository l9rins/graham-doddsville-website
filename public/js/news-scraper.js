// News Scraper for Graham and Doddsville Website
// Updated: Fixes Date Crash and Image Timeouts

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
            
            // Check client-side cache
            if (this.cachedNews.length > 0 && this.isRecentCache()) {
                console.log('Returning client-side cached data');
                return this.cachedNews;
            }

            const allNews = [];
            
            // Fetch directly from the Server API
            try {
                console.log(`Fetching from backend: ${this.apiUrl}/news`);
                const response = await fetch(`${this.apiUrl}/news`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.articles) {
                        allNews.push(...data.articles);
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

    // === THE CRITICAL FIX IS HERE ===
    formatDate(dateInput) {
        try {
            // 1. Force convert ANY input (string or object) to a Date Object
            const date = new Date(dateInput);

            // 2. Check if the conversion worked
            if (isNaN(date.getTime())) {
                return 'Recently'; // Fallback for bad dates
            }

            const now = new Date();
            const diff = now - date;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);

            if (hours < 1) return 'Just now';
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            
            // 3. Now it is safe to call the function
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
            
            // Save to localStorage
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

    // Use Placehold.co to prevent timeouts
    generatePlaceholderImage(sourceName) {
        const safeName = sourceName ? sourceName.replace(/[^a-zA-Z0-9 ]/g, '') : 'News';
        return `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(safeName)}`;
    }

    showLoadingState() {
        const categoryContainers = [
            'companies-news', 'markets-news', 'economy-news', 
            'industry-news', 'regulatory-news', 'guru-watch-news'
        ];
        categoryContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<div class="loading-state"><p>Loading news...</p></div>`;
            }
        });
    }

    showErrorState() {
        const categoryContainers = [
            'companies-news', 'markets-news', 'economy-news', 
            'industry-news', 'regulatory-news', 'guru-watch-news'
        ];
        categoryContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<div class="error-state"><p>⚠️ Unable to load news.</p></div>`;
            }
        });
    }

    displayNews(news) {
        console.log('NewsDisplayManager: Displaying', news.length, 'news items');

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

        const categoryContainers = {
            'Companies': 'companies-news',
            'Markets': 'markets-news',
            'Economy': 'economy-news',
            'Industry': 'industry-news',
            'Regulatory': 'regulatory-news',
            'Guru Watch': 'guru-watch-news'
        };

        Object.keys(categoryContainers).forEach(category => {
            const containerId = categoryContainers[category];
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = ''; // Clear container
                const categoryNews = newsByCategory[category] || [];
                
                if (categoryNews.length > 0) {
                    const displayNews = categoryNews.slice(0, 3);
                    container.innerHTML = displayNews.map(item => this.createNewsItemHTML(item)).join('');
                } else {
                    container.innerHTML = `<div class="no-news-in-category"><p>No updates currently available.</p></div>`;
                }
            }
        });

        this.updateLastUpdatedTime();
    }

    createNewsItemHTML(item) {
        // Safe date formatting
        const formattedDate = this.scraper.formatDate(item.publishedAt);
        
        // Use reliable image source
        let imageUrl = item.image;
        if (!imageUrl || imageUrl.includes('unsplash')) {
            imageUrl = this.generatePlaceholderImage(item.source);
        }
        
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
    const apiUrl = '/api'; 
    newsDisplayManager = new NewsDisplayManager();
    newsDisplayManager.scraper = new AustralianNewsScraper(apiUrl);
    window.newsDisplayManager = newsDisplayManager;
    newsDisplayManager.initialize();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AustralianNewsScraper, NewsDisplayManager };
}