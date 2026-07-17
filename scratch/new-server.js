require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { newsSourcesData } = require('./news-sources-data');
const { buildHybridPipeline } = require('./news-fetcher');

const app = express();
const PORT = process.env.PORT || 4012;

// Security and utility middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.currentsapi.services"]
        }
    },
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Cache state
const newsCache = {
    articles: [],
    lastUpdated: null,
    isRefreshing: false
};

// Static file serving
app.use('/html', express.static(path.join(__dirname, 'public', 'html')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API ROUTES
app.use('/api', limiter);

app.get('/api/news/status', (req, res) => {
    const nextRefresh = newsCache.lastUpdated
        ? new Date(new Date(newsCache.lastUpdated).getTime() + 45 * 60 * 1000).toISOString()
        : null;
    const cacheAge = newsCache.lastUpdated ? (Date.now() - new Date(newsCache.lastUpdated).getTime()) / 1000 : 0;

    res.json({
        cacheAge: `${Math.floor(cacheAge / 60)} minutes`,
        articleCount: newsCache.articles.length,
        lastUpdated: newsCache.lastUpdated,
        nextRefresh
    });
});

app.get('/api/news', (req, res) => {
    if (newsCache.articles.length === 0) {
        if (!newsCache.isRefreshing) refreshNewsCache();
        return res.json({
            articles: [],
            count: 0,
            lastUpdated: null,
            isCached: false,
            warning: 'Cache warming up, please refresh shortly'
        });
    }

    res.json({
        articles: newsCache.articles.slice(0, 20),
        count: Math.min(newsCache.articles.length, 20),
        lastUpdated: newsCache.lastUpdated,
        isCached: true
    });
});

app.get('/api/news/category/:category', (req, res) => {
    try {
        const category = req.params.category.toLowerCase();
        if (newsCache.articles.length === 0) {
            return res.status(503).json({ error: 'Service temporarily unavailable', message: 'Cache warming up' });
        }
        
        const filtered = newsCache.articles
            .filter(a => a.category === category)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 20);

        res.json({
            category,
            articles: filtered,
            count: filtered.length,
            lastUpdated: newsCache.lastUpdated,
            isCached: true
        });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/news/region/:region', (req, res) => {
    try {
        const region = req.params.region.toLowerCase();
        if (newsCache.articles.length === 0) {
            return res.status(503).json({ error: 'Service temporarily unavailable', message: 'Cache warming up' });
        }
        
        const filtered = newsCache.articles
            .filter(a => a.category === region)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 10);

        res.json({
            region,
            articles: filtered,
            count: filtered.length,
            sources: [],
            timestamp: new Date().toISOString()
        });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        sources: {
            total: Object.keys(newsSourcesData).reduce((sum, cat) => sum + newsSourcesData[cat].length, 0),
            healthy: Object.keys(newsSourcesData).reduce((sum, cat) => sum + newsSourcesData[cat].length, 0),
            unhealthy: 0
        },
        cache: {
            cachedArticles: newsCache.articles.length,
            lastUpdated: newsCache.lastUpdated
        }
    });
});

// Cache Refresh Logic
async function refreshNewsCache() {
    if (newsCache.isRefreshing) return;
    newsCache.isRefreshing = true;
    console.log('📰 Starting background news refresh...');

    try {
        const newArticles = await buildHybridPipeline();
        
        if (newArticles.length > 0) {
            newsCache.articles = newArticles;
            newsCache.lastUpdated = new Date().toISOString();
        }
    } catch (error) {
        console.error('❌ Background refresh failed:', error.message);
    } finally {
        newsCache.isRefreshing = false;
        console.log(`✅ Background refresh completed: ${newsCache.articles.length} articles cached`);
    }
}

// Error handling
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => res.status(500).json({ error: 'Server Error' }));
process.on('uncaughtException', err => { console.error('💥 UNCAUGHT EXCEPTION:', err); process.exit(1); });
process.on('unhandledRejection', reason => console.error('💥 UNHANDLED REJECTION:', reason));

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

setTimeout(() => {
    console.log('📋 Scheduling background refresh...');
    refreshNewsCache().catch(e => console.error(e));
    const refreshInterval = setInterval(() => {
        refreshNewsCache().catch(e => console.error(e));
    }, 45 * 60 * 1000); // 45 mins
    refreshInterval.unref();
}, 1000);

module.exports = app;
