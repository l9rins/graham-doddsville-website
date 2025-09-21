const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Legal RSS feeds and API sources
const newsSources = [
    {
        name: 'ABC News',
        type: 'rss',
        url: 'https://www.abc.net.au/news/feed/2942460/rss.xml',
        category: 'General'
    },
    {
        name: 'Sydney Morning Herald',
        type: 'rss',
        url: 'https://www.smh.com.au/rss/feed.xml',
        category: 'General'
    },
    {
        name: 'The Age',
        type: 'rss',
        url: 'https://www.theage.com.au/rss/feed.xml',
        category: 'General'
    },
    {
        name: 'Brisbane Times',
        type: 'rss',
        url: 'https://www.brisbanetimes.com.au/rss/feed.xml',
        category: 'General'
    },
    {
        name: '9News',
        type: 'rss',
        url: 'https://www.9news.com.au/rss',
        category: 'General'
    }
];

// NewsAPI.org configuration (legal API)
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'your-newsapi-key-here';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// Function to fetch RSS feed
async function fetchRSSFeed(source) {
    try {
        console.log(`Fetching RSS feed from ${source.name}...`);
        
        const response = await axios.get(source.url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; News Aggregator/1.0)'
            }
        });
        
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        
        const newsItems = [];
        const items = result.rss?.channel?.[0]?.item || [];
        
        items.slice(0, 5).forEach(item => {
            const title = item.title?.[0] || '';
            const link = item.link?.[0] || '';
            const description = item.description?.[0] || '';
            const pubDate = item.pubDate?.[0] || new Date().toISOString();
            
            if (title && link) {
                newsItems.push({
                    title: title,
                    url: link,
                    excerpt: description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                    image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(source.name)}`,
                    category: source.category,
                    source: source.name,
                    publishedAt: new Date(pubDate).toISOString()
                });
            }
        });
        
        console.log(`Found ${newsItems.length} items from ${source.name} RSS feed`);
        return newsItems;
        
    } catch (error) {
        console.error(`Error fetching RSS from ${source.name}:`, error.message);
        return [];
    }
}

// Function to fetch from NewsAPI.org
async function fetchFromNewsAPI() {
    try {
        if (NEWS_API_KEY === 'your-newsapi-key-here') {
            console.log('NewsAPI key not configured, skipping...');
            return [];
        }
        
        console.log('Fetching from NewsAPI.org...');
        
        const response = await axios.get(NEWS_API_URL, {
            params: {
                country: 'au',
                apiKey: NEWS_API_KEY,
                pageSize: 20
            },
            timeout: 10000
        });
        
        const newsItems = response.data.articles.map(article => ({
            title: article.title,
            url: article.url,
            excerpt: article.description || '',
            image: article.urlToImage || `https://via.placeholder.com/300x200?text=News`,
            category: 'General',
            source: article.source.name,
            publishedAt: article.publishedAt
        }));
        
        console.log(`Found ${newsItems.length} items from NewsAPI.org`);
        return newsItems;
        
    } catch (error) {
        console.error('Error fetching from NewsAPI:', error.message);
        return [];
    }
}

// API endpoint to get news
app.get('/api/news', async (req, res) => {
    try {
        console.log('Fetching news from legal sources...');
        
        const allNews = [];
        
        // Fetch from RSS feeds
        for (const source of newsSources) {
            if (source.type === 'rss') {
                const news = await fetchRSSFeed(source);
                allNews.push(...news);
            }
        }
        
        // Fetch from NewsAPI.org
        const apiNews = await fetchFromNewsAPI();
        allNews.push(...apiNews);
        
        // Sort by date (newest first)
        allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        console.log(`Total news items fetched: ${allNews.length}`);
        
        res.json({
            success: true,
            data: allNews,
            count: allNews.length,
            timestamp: new Date().toISOString(),
            sources: 'RSS feeds and NewsAPI.org (legal sources)'
        });
        
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            data: []
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'News scraper API is running'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`News scraper server running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/news`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
