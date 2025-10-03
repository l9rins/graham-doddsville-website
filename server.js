const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const { newsSources } = require('./news-sources-config');

const app = express();
const PORT = process.env.PORT || 3001;
const NEWS_API_KEY = '6d122bb10581490591ee20ade119ec27';

// Performance optimization constants
const MAX_CONCURRENT_REQUESTS = 10; // Limit concurrent requests
const REQUEST_TIMEOUT = 8000; // 8 second timeout
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const MAX_ARTICLES_PER_SOURCE = 5; // Limit articles per source

// In-memory cache for news data
const newsCache = new Map();
const sourceHealth = new Map(); // Track source health

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Performance optimization middleware
app.use((req, res, next) => {
    // Set caching headers for static assets
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    } else if (req.url.match(/\.(html)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
    } else {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    
    // Enable compression
    res.setHeader('Vary', 'Accept-Encoding');
    
    next();
});

// Enhanced RSS Feed Parser with timeout and error handling
async function parseRSSFeed(url, sourceName) {
    try {
        console.log(`Fetching RSS feed from ${sourceName}...`);
        
        // Check if source is marked as unhealthy
        if (sourceHealth.get(sourceName)?.isUnhealthy) {
            console.log(`Skipping unhealthy source: ${sourceName}`);
            return [];
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'application/xml');
        
        const items = doc.getElementsByTagName('item');
        const articles = [];
        
        for (let i = 0; i < Math.min(items.length, MAX_ARTICLES_PER_SOURCE); i++) {
            const item = items[i];
            const title = item.getElementsByTagName('title')[0]?.textContent || '';
            const description = item.getElementsByTagName('description')[0]?.textContent || '';
            const link = item.getElementsByTagName('link')[0]?.textContent || '';
            const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
            
            if (title && link) {
                articles.push({
                    title: title.trim(),
                    excerpt: description ? description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '',
                    url: link.trim(),
                    image: generatePlaceholderImage(sourceName),
                    category: categorizeNews(title + ' ' + description),
                    source: sourceName,
                    publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                });
            }
        }
        
        // Mark source as healthy
        sourceHealth.set(sourceName, { isUnhealthy: false, lastSuccess: Date.now() });
        
        console.log(`Successfully parsed ${articles.length} articles from ${sourceName}`);
        return articles;
    } catch (error) {
        console.error(`Error parsing RSS feed for ${sourceName}:`, error.message);
        
        // Mark source as unhealthy if it fails multiple times
        const health = sourceHealth.get(sourceName) || { failures: 0 };
        health.failures = (health.failures || 0) + 1;
        if (health.failures >= 3) {
            health.isUnhealthy = true;
            console.log(`Marking ${sourceName} as unhealthy after ${health.failures} failures`);
        }
        sourceHealth.set(sourceName, health);
        
        return [];
    }
}

// Enhanced NewsAPI fetcher with timeout and caching
async function fetchNewsFromAPI(source) {
    try {
        // Check cache first
        const cacheKey = `newsapi_${source.source}`;
        const cached = newsCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            console.log(`Using cached data for ${source.name}`);
            return cached.articles;
        }
        
        // Get articles from the last 7 days to ensure we have content
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fromDate = sevenDaysAgo.toISOString().split('T')[0];
        
        const url = `https://newsapi.org/v2/everything?sources=${source.source}&from=${fromDate}&sortBy=publishedAt&pageSize=${MAX_ARTICLES_PER_SOURCE}&apiKey=${NEWS_API_KEY}`;
        
        console.log(`Fetching news from NewsAPI for ${source.name}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`NewsAPI error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`NewsAPI returned error: ${data.message}`);
        }
        
        const articles = data.articles.map(article => ({
            title: article.title,
            excerpt: article.description ? article.description.substring(0, 150) + '...' : '',
            url: article.url,
            image: article.urlToImage || generatePlaceholderImage(source.name),
            category: categorizeNews(article.title + ' ' + (article.description || '')),
            source: source.name,
            publishedAt: article.publishedAt
        }));
        
        // Cache the results
        newsCache.set(cacheKey, {
            articles: articles,
            timestamp: Date.now()
        });
        
        console.log(`Successfully fetched ${articles.length} articles from ${source.name}`);
        return articles;
        
    } catch (error) {
        console.error(`Error fetching news from NewsAPI for ${source.name}:`, error);
        return [];
    }
}

// Helper function to get text content from XML element
function getTextContent(parent, tagName) {
    const elements = parent.getElementsByTagName(tagName);
    return elements.length > 0 ? elements[0].textContent : '';
}

// Clean HTML from description
function cleanDescription(description) {
    if (!description) return '';
    return description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
}

// Categorize news based on content
function categorizeNews(content) {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('asx') || lowerContent.includes('market') || lowerContent.includes('stock')) {
        return 'Markets';
    } else if (lowerContent.includes('company') || lowerContent.includes('business') || lowerContent.includes('corporate')) {
        return 'Companies';
    } else if (lowerContent.includes('economy') || lowerContent.includes('gdp') || lowerContent.includes('inflation')) {
        return 'Economy';
    } else if (lowerContent.includes('industry') || lowerContent.includes('sector') || lowerContent.includes('mining')) {
        return 'Industry';
    } else if (lowerContent.includes('rba') || lowerContent.includes('interest') || lowerContent.includes('rate')) {
        return 'Monetary Policy';
    } else if (lowerContent.includes('property') || lowerContent.includes('housing') || lowerContent.includes('real estate')) {
        return 'Property';
    } else if (lowerContent.includes('bank') || lowerContent.includes('financial') || lowerContent.includes('fund')) {
        return 'Banking';
    } else if (lowerContent.includes('tech') || lowerContent.includes('ai') || lowerContent.includes('digital')) {
        return 'Technology';
    } else if (lowerContent.includes('energy') || lowerContent.includes('renewable') || lowerContent.includes('coal')) {
        return 'Energy';
    } else if (lowerContent.includes('super') || lowerContent.includes('retirement') || lowerContent.includes('pension')) {
        return 'Superannuation';
    } else if (lowerContent.includes('retail') || lowerContent.includes('consumer') || lowerContent.includes('shopping')) {
        return 'Consumer';
    } else if (lowerContent.includes('mining') || lowerContent.includes('resources') || lowerContent.includes('commodity')) {
        return 'Resources';
    } else if (lowerContent.includes('investment') || lowerContent.includes('value') || lowerContent.includes('portfolio')) {
        return 'Investment';
    }
    return 'General';
}

// Generate placeholder image based on source
function generatePlaceholderImage(sourceName) {
    const colors = {
        'Australian Financial Review': '1e3a8a',
        'Sydney Morning Herald': '059669',
        'ABC News': 'dc2626',
        'The Australian': '7c3aed',
        'News.com.au': '1e3a8a',
        'Bloomberg': '000000',
        'Reuters': 'ff6600',
        'BBC News': 'bb0000',
        'CNN': 'cc0000',
        'Wall Street Journal': '000000',
        'Financial Times': 'fff1e5',
        'Fortune': '000000',
        'Business Insider': '000000',
        'Time': '000000',
        'USA Today': '003399',
        'The Guardian': '052962',
        'Independent': '000000',
        'The Telegraph': '000000',
        'The Economist': 'e3120b',
        'SBS News': 'ff6600',
        'The Age': '000000',
        'Herald Sun': '000000',
        'Daily Telegraph': '000000',
        'Courier Mail': '000000',
        'Adelaide Advertiser': '000000',
        'Perth Now': '000000',
        'NT News': '000000',
        'The Mercury': '000000'
    };
    
    // Get color for source or generate one based on name hash
    let color = colors[sourceName];
    if (!color) {
        // Generate a consistent color based on source name
        const hash = sourceName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const colorIndex = Math.abs(hash) % 10;
        const colorPalette = ['1e3a8a', '059669', 'dc2626', '7c3aed', '1e3a8a', 'ff6600', 'bb0000', 'cc0000', '000000', '003399'];
        color = colorPalette[colorIndex];
    }
    
    // Clean up source name for URL
    const cleanName = sourceName.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20);
    
    // Use a more reliable placeholder service or fallback
    return `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`;
}

// API endpoint to fetch news from a specific source
app.get('/api/news/:source', async (req, res) => {
    try {
        const sourceKey = req.params.source;
        const source = newsSources[sourceKey];
        
        if (!source) {
            return res.status(404).json({ error: 'Source not found' });
        }
        
        let articles = [];
        
        if (source.type === 'newsapi') {
            articles = await fetchNewsFromAPI(source);
        } else if (source.type === 'rss') {
            articles = await parseRSSFeed(source.url, source.name);
        }
        
        res.json({
            source: source.name,
            articles: articles,
            count: articles.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error(`Error fetching news for ${req.params.source}:`, error);
        res.status(500).json({ 
            error: 'Failed to fetch news',
            message: error.message 
        });
    }
});

// Batch processing function with concurrency control
async function processBatch(sources, batchSize = MAX_CONCURRENT_REQUESTS) {
    const results = [];
    
    for (let i = 0; i < sources.length; i += batchSize) {
        const batch = sources.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sources.length / batchSize)} (${batch.length} sources)`);
        
        const batchPromises = batch.map(async (sourceKey) => {
            try {
                const source = newsSources[sourceKey];
                let articles = [];
                
                if (source.type === 'newsapi') {
                    articles = await fetchNewsFromAPI(source);
                } else if (source.type === 'rss') {
                    articles = await parseRSSFeed(source.url, source.name);
                }
                
                return articles;
            } catch (error) {
                console.error(`Error fetching from ${sourceKey}:`, error);
                return [];
            }
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches to prevent overwhelming servers
        if (i + batchSize < sources.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return results;
}

// Prioritized source system
function getPrioritizedSources() {
    const sourceKeys = Object.keys(newsSources);
    
    // High priority sources (major news outlets)
    const highPriority = sourceKeys.filter(key => {
        const source = newsSources[key];
        return ['abc-news-au', 'afr', 'the-australian', 'sydney-morning-herald', 
                'the-age', 'news-com-au', 'bloomberg', 'reuters', 'bbc-news', 'cnn'].includes(key);
    });
    
    // Medium priority sources (business/tech)
    const mediumPriority = sourceKeys.filter(key => {
        const source = newsSources[key];
        return source.category === 'business' || source.category === 'technology';
    });
    
    // Low priority sources (regional)
    const lowPriority = sourceKeys.filter(key => {
        const source = newsSources[key];
        return source.category === 'regional' && !highPriority.includes(key) && !mediumPriority.includes(key);
    });
    
    return [...highPriority, ...mediumPriority, ...lowPriority];
}

// API endpoint to fetch news from all sources with optimization
app.get('/api/news', async (req, res) => {
    try {
        console.log('Fetching news from all sources with optimization...');
        
        // Check if we have cached data
        const cacheKey = 'all_news';
        const cached = newsCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            console.log('Returning cached news data');
            return res.json(cached.data);
        }
        
        const allArticles = [];
        const prioritizedSources = getPrioritizedSources();
        
        // Process sources in batches with priority
        const results = await processBatch(prioritizedSources);
        results.forEach(articles => allArticles.push(...articles));
        
        // Sort by publication date (newest first)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        const responseData = {
            articles: allArticles,
            count: allArticles.length,
            sources: prioritizedSources,
            timestamp: new Date().toISOString()
        };
        
        // Cache the results
        newsCache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now()
        });
        
        console.log(`Successfully fetched ${allArticles.length} total articles from ${prioritizedSources.length} sources`);
        
        res.json(responseData);
        
    } catch (error) {
        console.error('Error fetching news from all sources:', error);
        res.status(500).json({ 
            error: 'Failed to fetch news from all sources',
            message: error.message 
        });
    }
});

// Background refresh system
async function backgroundRefresh() {
    console.log('Starting background news refresh...');
    try {
        const prioritizedSources = getPrioritizedSources();
        const results = await processBatch(prioritizedSources.slice(0, 20)); // Only refresh top 20 sources
        
        const allArticles = [];
        results.forEach(articles => allArticles.push(...articles));
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        const responseData = {
            articles: allArticles,
            count: allArticles.length,
            sources: prioritizedSources.slice(0, 20),
            timestamp: new Date().toISOString()
        };
        
        // Update cache
        newsCache.set('all_news', {
            data: responseData,
            timestamp: Date.now()
        });
        
        console.log(`Background refresh completed: ${allArticles.length} articles`);
    } catch (error) {
        console.error('Background refresh failed:', error);
    }
}

// Cache cleanup function
function cleanupCache() {
    const now = Date.now();
    for (const [key, value] of newsCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION * 2) {
            newsCache.delete(key);
        }
    }
}

// Health check endpoint with performance metrics
app.get('/api/health', (req, res) => {
    const healthySources = Array.from(sourceHealth.entries())
        .filter(([name, health]) => !health.isUnhealthy)
        .map(([name]) => name);
    
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        totalSources: Object.keys(newsSources).length,
        healthySources: healthySources.length,
        cacheSize: newsCache.size,
        sources: Object.keys(newsSources)
    });
});

// Cache management endpoint
app.get('/api/cache/clear', (req, res) => {
    newsCache.clear();
    sourceHealth.clear();
    res.json({ message: 'Cache cleared successfully' });
});

// Serve static files
app.use(express.static('.'));

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`News API server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /api/health - Health check`);
    console.log(`  GET /api/news - Fetch news from all sources`);
    console.log(`  GET /api/news/:source - Fetch news from specific source`);
    console.log(`  GET /api/cache/clear - Clear cache`);
    console.log(`Available sources: ${Object.keys(newsSources).join(', ')}`);
    
    // Start background refresh timer (every 5 minutes)
    setInterval(backgroundRefresh, 5 * 60 * 1000);
    
    // Start cache cleanup timer (every 10 minutes)
    setInterval(cleanupCache, 10 * 60 * 1000);
    
    // Initial background refresh
    setTimeout(backgroundRefresh, 10000); // Start after 10 seconds
});

module.exports = app;
