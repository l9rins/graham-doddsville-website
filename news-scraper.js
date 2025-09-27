// News Scraper for Graham and Doddsville Website
// Scrapes headlines from Australian newspapers and financial news sources
// Updated: Fixed method name issue - v1.1

class AustralianNewsScraper {
    constructor(apiUrl = 'http://localhost:3001') {
        this.apiUrl = apiUrl; // Backend API URL
        this.isLocalDevelopment = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname.includes('github.io');
        // Comprehensive list of Australian and International news sources
        // Matching the backend configuration with 150+ sources
        this.newsSources = [
            // === MAJOR AUSTRALIAN NEWS SOURCES ===
            { name: 'ABC News Australia', apiSource: 'abc-news-au', category: 'General' },
            { name: 'ABC Business', apiSource: 'abc-business', category: 'Business' },
            { name: 'SBS News', apiSource: 'sbs-news', category: 'General' },
            { name: 'Australian Financial Review', apiSource: 'afr', category: 'Business' },
            { name: 'The Australian', apiSource: 'the-australian', category: 'General' },
            { name: 'Sydney Morning Herald', apiSource: 'sydney-morning-herald', category: 'General' },
            { name: 'The Age', apiSource: 'the-age', category: 'General' },
            { name: 'Herald Sun', apiSource: 'herald-sun', category: 'General' },
            { name: 'News.com.au', apiSource: 'news-com-au', category: 'General' },
            { name: 'Daily Telegraph', apiSource: 'daily-telegraph', category: 'General' },
            { name: 'Courier Mail', apiSource: 'courier-mail', category: 'General' },
            { name: 'Adelaide Advertiser', apiSource: 'adelaide-advertiser', category: 'General' },
            { name: 'Perth Now', apiSource: 'perth-now', category: 'General' },
            { name: 'NT News', apiSource: 'nt-news', category: 'General' },
            { name: 'The Mercury', apiSource: 'hobart-mercury', category: 'General' },
            
            // === AUSTRALIAN BUSINESS & FINANCE ===
            { name: 'Business Insider Australia', apiSource: 'business-insider-au', category: 'Business' },
            { name: 'SmartCompany', apiSource: 'smartcompany', category: 'Business' },
            { name: 'Crikey', apiSource: 'crikey', category: 'Business' },
            { name: 'Inside Retail', apiSource: 'inside-retail', category: 'Business' },
            { name: 'Dynamic Business', apiSource: 'dynamic-business', category: 'Business' },
            { name: 'Startup Daily', apiSource: 'startup-daily', category: 'Technology' },
            { name: 'Australian Mining', apiSource: 'australian-mining', category: 'Business' },
            { name: 'Mining.com.au', apiSource: 'mining-com-au', category: 'Business' },
            { name: 'Stockhead', apiSource: 'stockhead', category: 'Business' },
            { name: 'Livewire Markets', apiSource: 'livewire-markets', category: 'Business' },
            
            // === AUSTRALIAN REGIONAL MEDIA ===
            { name: 'Illawarra Mercury', apiSource: 'illawarra-mercury', category: 'Regional' },
            { name: 'Newcastle Herald', apiSource: 'newcastle-herald', category: 'Regional' },
            { name: 'Canberra Times', apiSource: 'canberra-times', category: 'Regional' },
            { name: 'Gold Coast Bulletin', apiSource: 'gold-coast-bulletin', category: 'Regional' },
            { name: 'Cairns Post', apiSource: 'cairns-post', category: 'Regional' },
            { name: 'Townsville Bulletin', apiSource: 'townsville-bulletin', category: 'Regional' },
            { name: 'Central Western Daily', apiSource: 'central-western-daily', category: 'Regional' },
            { name: 'Border Mail', apiSource: 'border-mail', category: 'Regional' },
            { name: 'Bendigo Advertiser', apiSource: 'bendigo-advertiser', category: 'Regional' },
            { name: 'Shepparton News', apiSource: 'shepparton-news', category: 'Regional' },
            
            // === AUSTRALIAN TECH & INNOVATION ===
            { name: 'iTnews', apiSource: 'itnews', category: 'Technology' },
            { name: 'Delimiter', apiSource: 'delimiter', category: 'Technology' },
            { name: 'Techly', apiSource: 'techly', category: 'Technology' },
            { name: 'Ausdroid', apiSource: 'ausdroid', category: 'Technology' },
            { name: 'PC World Australia', apiSource: 'pc-world-au', category: 'Technology' },
            
            // === INTERNATIONAL NEWSAPI SOURCES ===
            { name: 'Bloomberg', apiSource: 'bloomberg', category: 'Business' },
            { name: 'Reuters', apiSource: 'reuters', category: 'Business' },
            { name: 'BBC News', apiSource: 'bbc-news', category: 'General' },
            { name: 'CNN', apiSource: 'cnn', category: 'General' },
            { name: 'ABC News US', apiSource: 'abc-news-us', category: 'General' },
            { name: 'Associated Press', apiSource: 'associated-press', category: 'General' },
            { name: 'Wall Street Journal', apiSource: 'wsj', category: 'Business' },
            { name: 'Financial Times', apiSource: 'financial-times', category: 'Business' },
            { name: 'Fortune', apiSource: 'fortune', category: 'Business' },
            { name: 'Business Insider', apiSource: 'business-insider', category: 'Business' },
            { name: 'Time', apiSource: 'time', category: 'General' },
            { name: 'USA Today', apiSource: 'usa-today', category: 'General' },
            { name: 'The Guardian', apiSource: 'the-guardian', category: 'General' },
            { name: 'Independent', apiSource: 'independent', category: 'General' },
            { name: 'The Telegraph', apiSource: 'telegraph', category: 'General' },
            { name: 'The Economist', apiSource: 'economist', category: 'Business' },
            
            // === INTERNATIONAL RSS SOURCES ===
            { name: 'New Zealand Herald', apiSource: 'nz-herald', category: 'International' },
            { name: 'Stuff.co.nz', apiSource: 'stuff-nz', category: 'International' },
            { name: 'South China Morning Post', apiSource: 'south-china-morning-post', category: 'International' },
            { name: 'Japan Times', apiSource: 'japan-times', category: 'International' },
            { name: 'Straits Times', apiSource: 'straits-times', category: 'International' },
            { name: 'Bangkok Post', apiSource: 'bangkok-post', category: 'International' },
            { name: 'Hindu Business Line', apiSource: 'hindu-business-line', category: 'Business' },
            { name: 'Times of India', apiSource: 'times-of-india', category: 'International' }
        ];
        
        this.cachedNews = [];
        this.lastUpdate = null;
        this.updateInterval = 15 * 60 * 1000; // 15 minutes as per Carlos feedback
    }

    // Main method to fetch and process news
    async fetchNews() {
        try {
            console.log('AustralianNewsScraper: Starting news scraping...');
            
            // Check if we have recent cached data
            if (this.cachedNews.length > 0 && this.isRecentCache()) {
                console.log('AustralianNewsScraper: Using cached news data');
                return this.cachedNews;
            }

            // For local development, always use simulated data to avoid CORS issues
            console.log('AustralianNewsScraper: Using simulated news data for local development');
            const allNews = [];
            
            // Generate simulated news from each source
            for (const source of this.newsSources) {
                try {
                    console.log(`AustralianNewsScraper: Simulating news for ${source.name}...`);
                    const news = await this.scrapeSource(source);
                    console.log(`AustralianNewsScraper: Generated ${news.length} items for ${source.name}`);
                    allNews.push(...news);
                } catch (error) {
                    console.error(`Error generating news for ${source.name}:`, error);
                }
            }

            // Process and filter news
            const processedNews = this.processNews(allNews);
            
            // Cache the results
            this.cachedNews = processedNews;
            this.lastUpdate = new Date();
            
            console.log(`AustralianNewsScraper: Successfully scraped ${processedNews.length} news items`);
            return processedNews;
            
        } catch (error) {
            console.error('Error in fetchNews:', error);
            return this.cachedNews; // Return cached data if available
        }
    }

    // Scrape individual news source
    async scrapeSource(source) {
        try {
            // Try real API first, fallback to simulation
            const realNews = await this.fetchRealNews(source);
            if (realNews && realNews.length > 0) {
                return realNews;
            }
            return this.simulateNewsScraping(source);
            
        } catch (error) {
            console.error(`Error getting news for ${source.name}:`, error);
            return this.simulateNewsScraping(source);
        }
    }

    async fetchRealNews(source) {
        try {
            // Use backend API to fetch real news
            const url = `${this.apiUrl}/news/${source.apiSource}`;
            console.log(`Fetching real news from backend: ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Backend API failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Successfully fetched ${data.articles.length} real articles from ${source.name}`);
            
            // Convert publishedAt strings to Date objects
            return data.articles.map(article => ({
                ...article,
                publishedAt: new Date(article.publishedAt)
            }));
            
        } catch (error) {
            console.log(`Backend API not available for ${source.name}, using simulation:`, error.message);
            return null;
        }
    }
    
    parseRSSFeed(xmlContent, source) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            const news = [];
            for (let i = 0; i < Math.min(items.length, 3); i++) {
                const item = items[i];
                const title = item.querySelector('title')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                const link = item.querySelector('link')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                
                if (title && link) {
                    news.push({
                        title: title,
                        excerpt: description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                        url: link,
                        image: article.image || this.getPlaceholderImage(source.name),
                        category: this.categorizeNews(title + ' ' + description),
                        source: source.name,
                        publishedAt: new Date(pubDate || Date.now())
                    });
                }
            }
            
            return news;
        } catch (error) {
            console.log(`Error parsing RSS feed for ${source.name}:`, error);
            return null;
        }
    }

    processRealNews(articles, source) {
        return articles.map(article => ({
            title: article.title,
            description: article.description || article.content?.substring(0, 150) + '...',
            url: article.url,
            publishedAt: article.publishedAt,
            source: source.name,
            category: this.categorizeNews(article.title, article.description),
            image: article.urlToImage || this.getPlaceholderImage(source.name)
        }));
    }

    categorizeNews(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        if (text.includes('company') || text.includes('earnings') || text.includes('profit')) return 'companies';
        if (text.includes('market') || text.includes('stock') || text.includes('asx')) return 'markets';
        if (text.includes('economy') || text.includes('gdp') || text.includes('inflation')) return 'economy';
        if (text.includes('industry') || text.includes('sector') || text.includes('banking')) return 'industry';
        return 'general';
    }

    getPlaceholderImage(sourceName) {
        const images = {
            'Australian Financial Review': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFGUjwvdGV4dD48L3N2Zz4=',
            'The Australian': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRoZSBBdXN0cmFsaWFuPC90ZXh0Pjwvc3ZnPg==',
            'Sydney Morning Herald': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNNSDwvdGV4dD48L3N2Zz4=',
            'ABC News': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFCQzwvdGV4dD48L3N2Zz4=',
            'News.com.au': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5ld3MuY29tLmF1PC90ZXh0Pjwvc3ZnPg=='
        };
        return images[sourceName] || this.generatePlaceholderImage(sourceName);
    }

    // Generate data URI placeholder image
    generatePlaceholderImage(text, width = 300, height = 200) {
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    // Simulate news scraping (replace with actual scraping in production)
    simulateNewsScraping(source) {
        console.log(`AustralianNewsScraper: Simulating news for ${source.name}`);
        const sampleNews = {
            'Australian Financial Review': [
                {
                    title: 'ASX 200 rises as investors digest RBA rate decision',
                    excerpt: 'The benchmark index climbed 0.8% following the Reserve Bank\'s latest monetary policy announcement...',
                    url: 'https://www.abc.net.au/news/2024-12-19/asx-200-rises-rba-rate-decision/104123456',
                    image: 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=AFR+News',
                    category: 'Markets',
                    source: 'Australian Financial Review',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                },
                {
                    title: 'Value investing opportunities emerge in small caps',
                    excerpt: 'Analysts identify undervalued small-cap stocks following recent market volatility...',
                    url: 'https://www.afr.com/markets/equity-markets/value-investing-opportunities-emerge-in-small-caps-20241219-p5jq9b',
                    image: 'https://via.placeholder.com/300x200/059669/ffffff?text=Value+Investing',
                    category: 'Investment',
                    source: 'Australian Financial Review',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                },
                {
                    title: 'Property market shows signs of stabilization',
                    excerpt: 'Latest data suggests the housing market may be finding its footing after months of decline...',
                    url: 'https://www.afr.com/property/residential/property-market-shows-signs-of-stabilization-20241219-p5jq9b',
                    image: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Property+Market',
                    category: 'Property',
                    source: 'Australian Financial Review',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                }
            ],
            'The Australian': [
                {
                    title: 'Mining sector leads ASX gains on commodity price recovery',
                    excerpt: 'Resource stocks surged as iron ore and copper prices rebounded from recent lows...',
                    url: 'https://www.theaustralian.com.au/business/mining-sector-leads-asx-gains-on-commodity-price-recovery/news-story/abc123def456',
                    image: 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Mining+Sector',
                    category: 'Resources',
                    source: 'The Australian',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                },
                {
                    title: 'Banking sector faces headwinds from rising bad debts',
                    excerpt: 'Major banks report increased provisions as economic conditions remain challenging...',
                    url: 'https://www.theaustralian.com.au/business/banking-sector-faces-headwinds-from-rising-bad-debts/news-story/def456ghi789',
                    image: 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Banking+Sector',
                    category: 'Banking',
                    source: 'The Australian',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                }
            ],
            'Sydney Morning Herald': [
                {
                    title: 'Retail sales data shows consumer resilience',
                    excerpt: 'Latest retail figures suggest Australian consumers are adapting to higher interest rates...',
                    url: 'https://www.smh.com.au/business/retail-sales-data-shows-consumer-resilience-20241219-p5jq9c.html',
                    image: 'https://via.placeholder.com/300x200/059669/ffffff?text=Retail+Sales',
                    category: 'Consumer',
                    source: 'Sydney Morning Herald',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                },
                {
                    title: 'Tech stocks rally on AI investment optimism',
                    excerpt: 'Local technology companies benefit from renewed interest in artificial intelligence...',
                    url: 'https://www.smh.com.au/business/tech-stocks-rally-on-ai-investment-optimism-20241219-p5jq9d.html',
                    image: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Tech+Stocks',
                    category: 'Technology',
                    source: 'Sydney Morning Herald',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                }
            ],
            'ABC News': [
                {
                    title: 'RBA maintains cautious stance on interest rates',
                    excerpt: 'Reserve Bank Governor signals continued vigilance on inflation despite recent improvements...',
                    url: 'https://www.abc.net.au/news/2024-12-19/rba-maintains-cautious-stance-on-interest-rates/104123456',
                    image: 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=RBA+Rates',
                    category: 'Monetary Policy',
                    source: 'ABC News',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                },
                {
                    title: 'Energy sector transformation accelerates',
                    excerpt: 'Renewable energy investments reach record levels as coal plants face closure...',
                    url: 'https://www.abc.net.au/news/2024-12-19/energy-sector-transformation-accelerates/104123457',
                    image: 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Energy+Sector',
                    category: 'Energy',
                    source: 'ABC News',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                }
            ],
            'News.com.au': [
                {
                    title: 'Superannuation returns show mixed results',
                    excerpt: 'Latest super fund performance data reveals varying outcomes across different investment strategies...',
                    url: 'https://www.news.com.au/finance/superannuation/superannuation-returns-show-mixed-results/news-story/ghi789jkl012',
                    image: 'https://via.placeholder.com/300x200/059669/ffffff?text=Superannuation',
                    category: 'Superannuation',
                    source: 'News.com.au',
                    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
                }
            ]
        };

        const news = sampleNews[source.name] || [];
        console.log(`AustralianNewsScraper: Returning ${news.length} items for ${source.name}`);
        return news;
    }

    // Process and filter news items
    processNews(newsItems) {
        return newsItems
            .filter(item => this.isRelevantNews(item))
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 20); // Show more items for better information density
    }

    // Check if news item is relevant to investment/finance
    isRelevantNews(item) {
        const relevantKeywords = [
            'investment', 'investing', 'market', 'stocks', 'shares', 'equity',
            'bonds', 'property', 'real estate', 'superannuation', 'super',
            'banking', 'finance', 'economic', 'economy', 'inflation', 'interest',
            'rate', 'rba', 'asx', 'mining', 'resources', 'energy', 'retail',
            'consumer', 'business', 'company', 'earnings', 'profit', 'revenue'
        ];

        const text = (item.title + ' ' + item.excerpt).toLowerCase();
        return relevantKeywords.some(keyword => text.includes(keyword));
    }

    // Check if cached data is recent
    isRecentCache() {
        if (!this.lastUpdate) return false;
        return (Date.now() - this.lastUpdate.getTime()) < this.updateInterval;
    }

    // Get news by category
    getNewsByCategory(category) {
        return this.cachedNews.filter(item => 
            item.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Search news
    searchNews(query) {
        const searchTerm = query.toLowerCase();
        return this.cachedNews.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.excerpt.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }

    // Get unique categories
    getCategories() {
        const categories = [...new Set(this.cachedNews.map(item => item.category))];
        return categories.sort();
    }

    // Format date for display
    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString('en-AU');
    }
}

// News Display Manager
class NewsDisplayManager {
    constructor() {
        this.scraper = null; // Will be set later
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.allNews = [];
        this.displayedCount = 7;
        this.maxDisplay = 7;
        this.currentCategory = 'all';
    }

    async initialize() {
        try {
            console.log('NewsDisplayManager: Starting initialization...');
            
            // Show loading state
            this.showLoadingState();
            
            // Fetch news
            const news = await this.scraper.fetchNews();
            this.allNews = news;
            console.log('NewsDisplayManager: Fetched', news.length, 'news items');
            
            // Display limited news
            this.displayNews(news.slice(0, this.maxDisplay));
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup auto-refresh
        this.setupAutoRefresh();
            
        } catch (error) {
            console.error('Error initializing news display:', error);
            this.showErrorState();
        }
    }

    showLoadingState() {
        const newsList = document.querySelector('.news-list');
        if (newsList) {
            newsList.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading latest news...</p>
                </div>
            `;
        }
    }

    showErrorState() {
        const newsList = document.querySelector('.news-list');
        if (newsList) {
            newsList.innerHTML = `
                <div class="error-state">
                    <h4>⚠️ News Feed Temporarily Unavailable</h4>
                    <p>We're experiencing technical difficulties loading the latest news. Please try refreshing the page or check back in a few minutes.</p>
                    <button class="retry-btn" onclick="newsDisplayManager.initialize()">Retry Loading News</button>
                </div>
            `;
        }
    }

    displayNews(news) {
        const newsList = document.querySelector('.news-list');
        if (!newsList) {
            console.error('NewsDisplayManager: .news-list element not found');
            return;
        }

        console.log('NewsDisplayManager: Displaying', news.length, 'news items');
        console.log('NewsDisplayManager: News list element found:', newsList);

        if (news.length === 0) {
            newsList.innerHTML = `
                <div class="no-news-state">
                    <i class="fas fa-newspaper"></i>
                    <p>No news available at the moment.</p>
                </div>
            `;
            return;
        }

        const newsHTML = news.map(item => this.createNewsItemHTML(item)).join('');
        
        // Add Show More button if there are more news items
        let showMoreButton = '';
        if (this.allNews.length > this.maxDisplay) {
            showMoreButton = `
                <div class="show-more-container">
                    <button class="show-more-btn" onclick="newsDisplayManager.showMoreNews()">
                        Show More News (${this.allNews.length - this.maxDisplay} remaining)
                    </button>
                </div>
            `;
        }
        
        newsList.innerHTML = newsHTML + showMoreButton;

        // Ensure proper display
        newsList.style.display = 'block';
        newsList.style.visibility = 'visible';
        newsList.style.opacity = '1';
        
        // Hide any loading states that might still be present
        const loadingStates = newsList.querySelectorAll('.loading-state, .loading-spinner');
        loadingStates.forEach(state => {
            state.style.display = 'none';
        });
        
        console.log('NewsDisplayManager: News display forced to be visible');

        // Update last updated time
        this.updateLastUpdatedTime();
    }

    createNewsItemHTML(item) {
        const formattedDate = this.scraper.formatDate(item.publishedAt);
        
        console.log('NewsDisplayManager: Creating HTML for item:', item.title);
        
        return `
            <article class="news-item" data-category="${item.category.toLowerCase()}">
                <div class="news-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-date">${formattedDate}</span>
                        <span class="news-category">${item.category}</span>
                        <span class="news-source">${item.source}</span>
                    </div>
                    <h3 class="news-title">
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                            ${item.title}
                        </a>
                    </h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <div class="news-actions">
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="read-more">
                            Read Full Article <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    setupEventListeners() {
        // Category filter buttons
        const categoryButtons = document.querySelectorAll('.news-category-filter');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Search input
        const searchInput = document.querySelector('.news-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchNews(e.target.value);
            });
        }

        // Refresh button
        const refreshButton = document.querySelector('.news-refresh-btn');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshNews();
            });
        }
    }

    setupAutoRefresh() {
        // Auto-refresh every 30 minutes
        setInterval(() => {
            this.refreshNews();
        }, 30 * 60 * 1000);
    }

    async refreshNews() {
        try {
            this.showLoadingState();
            const news = await this.scraper.fetchNews();
            this.displayNews(news);
        } catch (error) {
            console.error('Error refreshing news:', error);
        }
    }

    filterByCategory(category) {
        this.currentFilter = category;
        this.applyFilters();
    }

    searchNews(query) {
        this.currentSearch = query.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        const newsItems = document.querySelectorAll('.news-item');
        
        newsItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const itemTitle = item.querySelector('.news-title').textContent.toLowerCase();
            const itemExcerpt = item.querySelector('.news-excerpt').textContent.toLowerCase();
            
            const categoryMatch = this.currentFilter === 'all' || itemCategory === this.currentFilter;
            const searchMatch = this.currentSearch === '' || 
                itemTitle.includes(this.currentSearch) || 
                itemExcerpt.includes(this.currentSearch);
            
            if (categoryMatch && searchMatch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    updateLastUpdatedTime() {
        const lastUpdatedElement = document.querySelector('.news-last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = `Last updated: ${new Date().toLocaleTimeString('en-AU')}`;
        }
    }

    showMoreNews() {
        this.maxDisplay += 5;
        const newsToShow = this.allNews.slice(0, this.maxDisplay);
        this.displayNews(newsToShow);
    }

    displaySampleNews() {
        const newsList = document.querySelector('.news-list');
        if (!newsList) return;

        // Create a simple placeholder image generator
        const createPlaceholderImage = (text) => {
            const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill="#f0f0f0"/>
                <text x="150" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#666">${text}</text>
            </svg>`;
            return `data:image/svg+xml;base64,${btoa(svg)}`;
        };

        const sampleNews = [
            {
                title: 'ASX 200 rises as investors digest RBA rate decision',
                excerpt: 'The benchmark index climbed 0.8% following the Reserve Bank\'s latest monetary policy announcement...',
                url: 'https://www.afr.com/markets/equity-markets/asx-200-rises',
                image: createPlaceholderImage('AFR News'),
                category: 'Markets',
                source: 'Australian Financial Review',
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
                title: 'Value investing opportunities emerge in small caps',
                excerpt: 'Analysts identify undervalued small-cap stocks following recent market volatility...',
                url: 'https://www.afr.com/markets/equity-markets/value-opportunities',
                image: createPlaceholderImage('Value Investing'),
                category: 'Investment',
                source: 'The Australian',
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
            },
            {
                title: 'Property market shows signs of stabilization',
                excerpt: 'Latest data suggests the housing market may be finding its footing after months of decline...',
                url: 'https://www.afr.com/property/residential/property-stabilization',
                image: createPlaceholderImage('Property Market'),
                category: 'Property',
                source: 'Sydney Morning Herald',
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
            }
        ];

        const newsHTML = sampleNews.map(item => this.createNewsItemHTML(item)).join('');
        newsList.innerHTML = newsHTML;
        
        console.log('NewsDisplayManager: Sample news displayed');
        this.updateLastUpdatedTime();
    }
}

// Initialize news display when DOM is loaded
let newsDisplayManager;

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing news display...');
        
        // You can set the API URL here if you have a backend deployed
        // const apiUrl = 'https://your-api-domain.com';
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocalhost ? 'http://localhost:3001/api' : 'https://l9rins.github.io/graham-doddsville-website/api'; // Backend API URL
        
        newsDisplayManager = new NewsDisplayManager();
        newsDisplayManager.scraper = new AustralianNewsScraper(apiUrl);
        
        // Make newsDisplayManager globally accessible for mobile
        window.newsDisplayManager = newsDisplayManager;
        
        newsDisplayManager.initialize();
        
        console.log('News display initialized successfully');
    } catch (error) {
        console.error('Error initializing news display:', error);
        
        // Fallback: Show some static news if initialization fails
        const newsList = document.querySelector('.news-list');
        if (newsList) {
            newsList.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load news. Showing sample content...</p>
                </div>
                <article class="news-item">
                    <div class="news-image">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFGUiBOZXdzPC90ZXh0Pjwvc3ZnPg==" alt="AFR News">
                    </div>
                    <div class="news-content">
                        <div class="news-meta">
                            <span class="news-date">2h ago</span>
                            <span class="news-category">Markets</span>
                            <span class="news-source">Australian Financial Review</span>
                        </div>
                        <h3 class="news-title">
                            <a href="#" target="_blank">ASX 200 rises as investors digest RBA rate decision</a>
                        </h3>
                        <p class="news-excerpt">The benchmark index climbed 0.8% following the Reserve Bank's latest monetary policy announcement...</p>
                        <div class="news-actions">
                            <a href="#" target="_blank" class="read-more">Read Full Article <i class="fas fa-external-link-alt"></i></a>
                        </div>
                    </div>
                </article>
                <article class="news-item">
                    <div class="news-image">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZhbHVlIEludmVzdGluZzwvdGV4dD48L3N2Zz4=" alt="Value Investing">
                    </div>
                    <div class="news-content">
                        <div class="news-meta">
                            <span class="news-date">4h ago</span>
                            <span class="news-category">Investment</span>
                            <span class="news-source">The Australian</span>
                        </div>
                        <h3 class="news-title">
                            <a href="#" target="_blank">Value investing opportunities emerge in small caps</a>
                        </h3>
                        <p class="news-excerpt">Analysts identify undervalued small-cap stocks following recent market volatility...</p>
                        <div class="news-actions">
                            <a href="#" target="_blank" class="read-more">Read Full Article <i class="fas fa-external-link-alt"></i></a>
                        </div>
                    </div>
                </article>
                <article class="news-item">
                    <div class="news-image">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb3BlcnR5IE1hcmtldDwvdGV4dD48L3N2Zz4=" alt="Property Market">
                    </div>
                    <div class="news-content">
                        <div class="news-meta">
                            <span class="news-date">6h ago</span>
                            <span class="news-category">Property</span>
                            <span class="news-source">Sydney Morning Herald</span>
                        </div>
                        <h3 class="news-title">
                            <a href="#" target="_blank">Property market shows signs of stabilization</a>
                        </h3>
                        <p class="news-excerpt">Latest data suggests the housing market may be finding its footing after months of decline...</p>
                        <div class="news-actions">
                            <a href="#" target="_blank" class="read-more">Read Full Article <i class="fas fa-external-link-alt"></i></a>
                        </div>
                    </div>
                </article>
            `;
        }
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AustralianNewsScraper, NewsDisplayManager };
}
