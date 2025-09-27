const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const { newsSources } = require('./news-sources-config');

const app = express();
const PORT = process.env.PORT || 3001;
const NEWS_API_KEY = '6d122bb10581490591ee20ade119ec27';

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

// RSS Feed Parser Function
async function parseRSSFeed(url, sourceName) {
    try {
        console.log(`Fetching RSS feed from ${sourceName}...`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'application/xml');
        
        const items = doc.getElementsByTagName('item');
        const articles = [];
        
        for (let i = 0; i < Math.min(items.length, 10); i++) {
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
        
        console.log(`Successfully parsed ${articles.length} articles from ${sourceName}`);
        return articles;
    } catch (error) {
        console.error(`Error parsing RSS feed for ${sourceName}:`, error.message);
        return [];
    }
}

// Fetch news from NewsAPI
async function fetchNewsFromAPI(source) {
    try {
        // Get articles from the last 7 days to ensure we have content
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fromDate = sevenDaysAgo.toISOString().split('T')[0];
        
        const url = `https://newsapi.org/v2/everything?sources=${source.source}&from=${fromDate}&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
        
        console.log(`Fetching news from NewsAPI for ${source.name}...`);
        
        const response = await fetch(url);
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

// API endpoint to fetch news from all sources
app.get('/api/news', async (req, res) => {
    try {
        console.log('Fetching news from all sources...');
        
        const allArticles = [];
        const sourceKeys = Object.keys(newsSources);
        
        // Fetch from all sources in parallel
        const promises = sourceKeys.map(async (sourceKey) => {
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
        
        const results = await Promise.all(promises);
        results.forEach(articles => allArticles.push(...articles));
        
        // Sort by publication date (newest first)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        console.log(`Successfully fetched ${allArticles.length} total articles`);
        
        res.json({
            articles: allArticles,
            count: allArticles.length,
            sources: sourceKeys,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching news from all sources:', error);
        res.status(500).json({ 
            error: 'Failed to fetch news from all sources',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        sources: Object.keys(newsSources)
    });
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
    console.log(`Available sources: ${Object.keys(newsSources).join(', ')}`);
});

module.exports = app;
