require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const Parser = require('rss-parser');
const { DOMParser } = require('xmldom');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { newsSources, regionalNewsSources } = require('./news-sources-config');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

// === EMERGENCY BACKUP DATA (For when all sources fail) ===
const BACKUP_NEWS = [
    {
        title: "Service temporarily unavailable",
        description: "News is currently being fetched. Please refresh in a moment.",
        url: "#",
        source: { name: "System Message" },
        publishedAt: new Date().toISOString(),
        category: "General"
    }
];

const app = express();
const PORT = process.env.PORT || 3051;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Performance optimization constants
const MAX_CONCURRENT_REQUESTS = 5;
const REQUEST_TIMEOUT = 8000;
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours
const MAX_ARTICLES_PER_SOURCE = 5;

// CACHE SETTINGS
const CACHE_DIR = path.join(__dirname, 'news-cache');
const RSS_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}

const CREDIBLE_DOMAINS = [
    'reuters.com', 'bloomberg.com', 'ft.com', 'cnbc.com',
    'investing.com', 'wsj.com', 'economist.com',
    'afr.com', 'smh.com.au', 'theaustralian.com.au',
    'abc.net.au', 'asx.com.au', 'rba.gov.au', 'asic.gov.au',
    'news.com.au', 'businessinsider.com.au', 'marketwatch.com',
    'finance.yahoo.com', 'seekingalpha.com', 'fool.com',
    'livewiremarkets.com', 'stockhead.com.au', 'theguardian.com',
    'bbc.com', 'ap.org', 'apnews.com'
];

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
    message: 'Too many requests from this IP, please try again later.'
});

// In-memory cache
let newsCache = {
    articles: [],
    lastUpdated: null,
    isRefreshing: false
};

const keywordCache = new Map();
const sourceHealth = new Map();
const articleHashes = new Set();

// Enable CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://graham-doddsville.onrender.com',
            'https://grahamanddoddsville.com.au',
            'https://l9rins.github.io']
        : ['http://localhost:4012', 'http://localhost:4012'],
    methods: ['GET', 'POST'],
    credentials: true,
    maxAge: 3600
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

// Deduplication helpers
function generateArticleHash(title, source, publishedAt) {
    const content = `${title.trim().toLowerCase()}_${source.trim().toLowerCase()}_${new Date(publishedAt).toDateString()}`;
    return crypto.createHash('sha256').update(content).digest('hex');
}

function isArticleValid(article) {
    const BLOCKED_DOMAINS = [
        'vanityfair.com', 'pagesix.com', 'twistedsifter.com', 'bleedingcool.com',
        'tmz.com', 'eonline.com', 'people.com', 'usmagazine.com',
        'hollywoodreporter.com', 'variety.com', 'entertainmentweekly.com'
    ];
    const articleUrl = (article.url || article.link || '').toLowerCase();
    if (BLOCKED_DOMAINS.some(domain => articleUrl.includes(domain))) return false;

    if (!article.title || article.title.length < 20 || article.title.length > 150) return false;
    if (!article.description || article.description.length < 50) return false;
    if (!article.source || !article.source.name) return false;
    if (!article.url) return false;
    if (!article.publishedAt) return false;

    const publishedDate = new Date(article.publishedAt);
    const now = new Date();
    const hoursDiff = (now - publishedDate) / (1000 * 60 * 60);
    if (hoursDiff > 168) return false; // 7 days max

    return true;
}

function deduplicateArticles(articles) {
    const uniqueArticles = [];
    const seenHashes = new Set();

    for (const article of articles) {
        const sourceName = article.source?.name || article.source || '';
        const hash = generateArticleHash(article.title, sourceName, article.publishedAt);
        if (!seenHashes.has(hash) && !articleHashes.has(hash)) {
            seenHashes.add(hash);
            articleHashes.add(hash);
            uniqueArticles.push(article);
        }
    }

    return uniqueArticles;
}

// Performance middleware
app.use((req, res, next) => {
    if (req.url.includes('article-image-resolver.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else if (req.url.match(/\.(css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    } else if (req.url.match(/\.(js)$/)) {
        // Standard JS files get shorter cache during updates
        res.setHeader('Cache-Control', 'public, max-age=3600'); 
    } else if (req.url.match(/\.(html)$/)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    res.setHeader('Vary', 'Accept-Encoding');
    next();
});

// Enhanced RSS Feed Parser
async function parseRSSFeed(url, sourceName, defaultCategory = null) {
    try {
        console.log(`Fetching RSS feed from ${sourceName}...`);

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

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        let xmlText = await response.text();

        xmlText = xmlText
            .replace(/&nbsp;/g, ' ')
            .replace(/&copy;/g, 'Â©')
            .replace(/&ndash;/g, '-')
            .replace(/&mdash;/g, '-')
            .replace(/&rsquo;/g, "'")
            .replace(/&lsquo;/g, "'")
            .replace(/&rdquo;/g, '"')
            .replace(/&ldquo;/g, '"');

        const domParser = new DOMParser();
        const doc = domParser.parseFromString(xmlText, 'text/xml');
        const items = doc.getElementsByTagName('item');
        const articles = [];

        for (let i = 0; i < Math.min(items.length, MAX_ARTICLES_PER_SOURCE); i++) {
            const item = items[i];
            const title = item.getElementsByTagName('title')[0]?.textContent || '';
            const description = item.getElementsByTagName('description')[0]?.textContent || '';
            const link = item.getElementsByTagName('link')[0]?.textContent || '';
            const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';

            if (title && link) {
                let imageUrl = null;

                const mediaContent = item.getElementsByTagName('media:content')[0];
                if (mediaContent) imageUrl = mediaContent.getAttribute('url');

                if (!imageUrl) {
                    const enclosure = item.getElementsByTagName('enclosure')[0];
                    if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
                        imageUrl = enclosure.getAttribute('url');
                    }
                }

                if (!imageUrl && description) {
                    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }

                articles.push({
                    title: title.trim(),
                    excerpt: description ? description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '',
                    url: link.trim(),
                    image: imageUrl || generatePlaceholderImage(sourceName),
                    category: (defaultCategory && ['Industry', 'Regulatory', 'Technology', 'Guru Watch', 'Economy', 'Markets', 'Companies'].includes(defaultCategory))
                        ? defaultCategory
                        : categorizeNews(title + ' ' + description + ' ' + sourceName),
                    source: { name: sourceName },
                    publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                });
            }
        }

        sourceHealth.set(sourceName, { isUnhealthy: false, lastSuccess: Date.now() });
        console.log(`Successfully parsed ${articles.length} articles from ${sourceName}`);
        return articles;

    } catch (error) {
        console.error(`Error parsing RSS feed for ${sourceName}:`, error.message);

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

// Fetch news for a source
async function fetchNews(sourceKey) {
    const source = newsSources[sourceKey];
    if (!source) return [];

    if (source.type === 'rss') {
        return await parseRSSFeed(source.url, source.name, source.category);
    }
    return [];
}

// Helper: get text content from XML element
function getTextContent(parent, tagName) {
    const elements = parent.getElementsByTagName(tagName);
    return elements.length > 0 ? elements[0].textContent : '';
}

// Categorize news
function categorizeNews(content) {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('asx') || lowerContent.includes('market') || lowerContent.includes('stock') || lowerContent.includes('trading')) return 'Markets';
    if (lowerContent.includes('company') || lowerContent.includes('business') || lowerContent.includes('corporate') || lowerContent.includes('startup')) return 'Companies';
    if (lowerContent.includes('economy') || lowerContent.includes('gdp') || lowerContent.includes('inflation') || lowerContent.includes('unemployment')) return 'Economy';
    if (lowerContent.includes('industry') || lowerContent.includes('sector') || lowerContent.includes('mining') || lowerContent.includes('manufacturing')) return 'Industry';
    if (lowerContent.includes('rba') || lowerContent.includes('interest') || lowerContent.includes('rate') || lowerContent.includes('regulation') || lowerContent.includes('policy')) return 'Regulatory';
    if (lowerContent.includes('commodity') || lowerContent.includes('gold') || lowerContent.includes('oil') || lowerContent.includes('iron ore')) return 'Commodities';
    if (lowerContent.includes('property') || lowerContent.includes('housing') || lowerContent.includes('real estate')) return 'Property';
    if (lowerContent.includes('bank') || lowerContent.includes('financial') || lowerContent.includes('fund') || lowerContent.includes('finance')) return 'Banking';
    if (lowerContent.includes('tech') || lowerContent.includes('ai') || lowerContent.includes('digital') || lowerContent.includes('software')) return 'Technology';
    if (lowerContent.includes('energy') || lowerContent.includes('renewable') || lowerContent.includes('coal')) return 'Energy';
    if (lowerContent.includes('super') || lowerContent.includes('retirement') || lowerContent.includes('pension')) return 'Superannuation';
    if (lowerContent.includes('retail') || lowerContent.includes('consumer') || lowerContent.includes('shopping')) return 'Consumer';
    if (lowerContent.includes('buffett') || lowerContent.includes('munger') || lowerContent.includes('graham') || lowerContent.includes('guru') || lowerContent.includes('investor')) return 'Guru Watch';
    if (lowerContent.includes('investment') || lowerContent.includes('value') || lowerContent.includes('portfolio')) return 'Investment';
    return 'General';
}

// Generate placeholder image
function generatePlaceholderImage(sourceName) {
    const safeName = sourceName ? sourceName.replace(/[^a-zA-Z0-9 ]/g, '') : 'News';
    return `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(safeName)}`;
}

// Helper: fetch source data (for /api/news/:sourceId)
async function fetchSourceData(sourceId) {
    const sourceConfig = newsSources[sourceId];
    if (!sourceConfig) throw new Error('Source not found in config');

    console.log(`[Server] Fetching fresh data for ${sourceId}...`);

    if (sourceConfig.type === 'rss') {
        const feed = await parser.parseURL(sourceConfig.url);
        const articles = feed.items.map(item => ({
            title: item.title,
            description: item.contentSnippet || item.content,
            url: item.link,
            publishedAt: item.pubDate,
            source: { name: sourceConfig.name },
            urlToImage: null
        }));
        return { articles, timestamp: new Date().toISOString() };
    }

    throw new Error(`Unsupported source type: ${sourceConfig.type}`);
}

// ============================================================
// API ROUTES
// ============================================================

app.get('/api/news/status', (req, res) => {
    const nextRefresh = newsCache.lastUpdated
        ? new Date(new Date(newsCache.lastUpdated).getTime() + 4 * 60 * 60 * 1000).toISOString()
        : null;
    const cacheAge = newsCache.lastUpdated ? (Date.now() - new Date(newsCache.lastUpdated).getTime()) / 1000 : 0;

    res.json({
        cacheAge: `${Math.floor(cacheAge / 60)} minutes`,
        articleCount: newsCache.articles.length,
        lastUpdated: newsCache.lastUpdated,
        nextRefresh,
        gnewsEnabled: !!GNEWS_API_KEY
    });
});

app.get('/api/news/category/:category', async (req, res) => {
    try {
        const requestedCategory = req.params.category.toLowerCase();

        if (newsCache.articles.length === 0) {
            return res.status(503).json({
                error: 'Service temporarily unavailable',
                message: 'Cache is warming up. Please try again shortly.',
                retryAfter: 60
            });
        }

        const filteredArticles = newsCache.articles
            .filter(article => article.category && article.category.toLowerCase() === requestedCategory)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 20);

        res.json({
            category: requestedCategory,
            articles: filteredArticles,
            count: filteredArticles.length,
            lastUpdated: newsCache.lastUpdated,
            isCached: true
        });

    } catch (error) {
        console.error('Error fetching category news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/news', (req, res) => {
    if (newsCache.articles.length === 0) {
        if (!newsCache.isRefreshing) refreshNewsCache();
        return res.json({
            articles: BACKUP_NEWS,
            count: BACKUP_NEWS.length,
            lastUpdated: null,
            isCached: false,
            warning: 'Cache warming up, please refresh shortly'
        });
    }

    res.json({
        articles: newsCache.articles,
        count: newsCache.articles.length,
        lastUpdated: newsCache.lastUpdated,
        isCached: true
    });
});

app.get('/api/news/region/:region', async (req, res) => {
    try {
        const region = req.params.region.toLowerCase();
        const sourceKeys = regionalNewsSources[region];

        if (!sourceKeys) return res.status(404).json({ error: 'Region not found' });

        const sources = sourceKeys.map(key => newsSources[key]).filter(source => source && source.name);
        if (sources.length === 0) return res.status(404).json({ error: 'No sources found for region' });

        const rssSources = sources.filter(s => s.type === 'rss');
        let allArticles = [];

        if (rssSources.length > 0) {
            const rssSourceKeys = rssSources.map(s =>
                Object.keys(newsSources).find(k => newsSources[k] === s)
            ).filter(Boolean);

            const results = await processBatch(rssSourceKeys.slice(0, 7), 4);
            allArticles = results.flat();
        }

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        allArticles = allArticles.filter(a => !a.publishedAt || new Date(a.publishedAt) >= sevenDaysAgo);

        const seen = new Set();
        allArticles = allArticles.filter(article => {
            const key = article.title?.toLowerCase().trim();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        res.json({
            region,
            articles: allArticles.slice(0, 5),
            count: Math.min(allArticles.length, 5),
            sources: sources.map(s => s.name),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`Error fetching news for region ${req.params.region}:`, error);
        res.status(500).json({ error: 'Failed to fetch regional news', message: error.message });
    }
});

app.get('/api/news/:sourceId', async (req, res) => {
    try {
        const sourceId = req.params.sourceId;
        const cacheFile = path.join(CACHE_DIR, `${sourceId}.json`);
        const sourceConfig = newsSources[sourceId];

        if (!sourceConfig) return res.status(404).json({ error: 'Source not configured' });

        if (fs.existsSync(cacheFile)) {
            const cachedJson = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
            const fileTime = new Date(cachedJson.timestamp).getTime();

            if ((Date.now() - fileTime) < RSS_CACHE_TIME) {
                console.log(`[Server] Serving ${sourceId} from CACHE`);
                return res.json(cachedJson);
            }
        }

        const freshData = await fetchSourceData(sourceId);
        fs.writeFileSync(cacheFile, JSON.stringify(freshData, null, 2));
        return res.json(freshData);

    } catch (error) {
        console.error(`[Server] Error processing ${req.params.sourceId}:`, error.message);

        const cacheFile = path.join(CACHE_DIR, `${req.params.sourceId}.json`);
        if (fs.existsSync(cacheFile)) {
            console.log(`[Server] Serving STALE cache for ${req.params.sourceId}`);
            return res.json(JSON.parse(fs.readFileSync(cacheFile, 'utf8')));
        }

        return res.status(500).json({ error: 'Failed to fetch news', details: error.message });
    }
});

// Batch processing
async function processBatch(sources, batchSize = MAX_CONCURRENT_REQUESTS) {
    const results = [];

    for (let i = 0; i < sources.length; i += batchSize) {
        const batch = sources.slice(i, i + batchSize);
        const batchPromises = batch.map(async (sourceKey) => {
            try {
                return await fetchNews(sourceKey);
            } catch (error) {
                console.error(`Error fetching from ${sourceKey}:`, error);
                return [];
            }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        if (i + batchSize < sources.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return results;
}

// ============================================================
// MAIN CACHE REFRESH
// Priority order per category:
//   1. GNews API (server-friendly free tier)
//   2. Configured RSS sources from news-sources-config.js
//   3. Safety net placeholders (last resort only)
// ============================================================
async function refreshNewsCache() {
    if (newsCache.isRefreshing) return;
    newsCache.isRefreshing = true;
    console.log('ðŸ“° Starting background news refresh...');

    try {
        const categoriesConfig = [
            {
                category: 'Companies',
                query: 'ASX OR "Australian shares" OR "company earnings" OR "stock results"',
                // Configured RSS sources to pull from for this category
                rssSources: ['stockhead', 'livewire-markets', 'afr', 'abc-business',
                    'sydney-morning-herald', 'the-australian', 'business-insider-au'],
                baseAge: 72
            },
            {
                category: 'Markets',
                query: 'ASX OR "stock market" OR "share market" Australia',
                rssSources: ['stockhead', 'livewire-markets', 'afr', 'abc-business',
                    'sydney-morning-herald', 'smartcompany', 'the-australian',
                    'business-insider-au', 'news-com-au', 'the-age',
                    'reuters-rss', 'bbc-rss', 'guardian-rss'],
                baseAge: 72
            },
            {
                category: 'Economy',
                query: 'RBA OR "Australian economy" OR inflation OR "interest rate" Australia',
                rssSources: ['abc-news-au', 'abc-business', 'afr', 'sydney-morning-herald',
                    'the-australian', 'sbs-news', 'the-age', 'news-com-au',
                    'business-insider-au', 'smartcompany', 'crikey',
                    'guardian-rss', 'bbc-rss', 'reuters-rss'],
                baseAge: 72
            },
            {
                category: 'Industry',
                query: 'Australia industry OR mining OR energy OR banking OR retail',
                // Includes the client's specifically configured Google News industry feeds
                rssSources: ['google-news-mining', 'google-news-retail', 'google-news-construction',
                    'australian-mining', 'mining-com-au', 'inside-retail', 'smartcompany'],
                baseAge: 72
            },
            {
                category: 'Regulatory',
                query: 'ASIC OR APRA OR ACCC OR "financial regulation" OR compliance Australia',
                // Includes the client's specifically configured Google News regulatory feed
                rssSources: ['google-news-regulatory', 'abc-news-au', 'abc-business',
                    'afr', 'sydney-morning-herald', 'the-australian',
                    'sbs-news', 'the-age', 'news-com-au', 'business-insider-au',
                    'crikey', 'guardian-rss', 'reuters-rss', 'bbc-rss'],
                baseAge: 336
            },
            {
                category: 'Guru Watch',
                query: 'Buffett OR "Charlie Munger" OR "Ray Dalio" OR "value investing"',
                // Includes the client's specifically configured Google News guru feeds
                rssSources: ['google-news-guru', 'google-news-investment-gurus',
                    'livewire-markets', 'stockhead', 'afr', 'abc-business',
                    'sydney-morning-herald', 'the-australian', 'business-insider-au',
                    'guardian-rss', 'reuters-rss', 'bbc-rss'],
                baseAge: 168
            }
        ];

        const fallbackUrls = {
            'Companies': 'https://www.asx.com.au/prices/company-information.htm',
            'Markets': 'https://www.asx.com.au/markets/trade-our-cash-market.htm',
            'Economy': 'https://www.rba.gov.au/statistics/',
            'Industry': 'https://www.asx.com.au/markets/trade-our-cash-market/sector.htm',
            'Regulatory': 'https://asic.gov.au/about-asic/news-centre/',
            'Guru Watch': 'https://www.berkshirehathaway.com/letters/letters.html'
        };

        const allArticles = [];

        const promises = categoriesConfig.map(async (config, index) => {
            await new Promise(resolve => setTimeout(resolve, index * 500));

            let validArticles = [];
            let currentAgeLimit = config.baseAge;
            const MAX_AGE_LIMIT = currentAgeLimit + 336;

            // ============================================================
            // 1. PRIMARY: GNews API (works from servers on free tier)
            // ============================================================
            if (GNEWS_API_KEY) {
                try {
                    console.log(`Fetching GNews for ${config.category}...`);
                    const gNewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(config.query)}&lang=en&country=au&max=10&apikey=${GNEWS_API_KEY}`;

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
                    const response = await fetch(gNewsUrl, { signal: controller.signal });
                    clearTimeout(timeoutId);

                    const data = await response.json();

                    if (data.articles && Array.isArray(data.articles)) {
                        const seenUrls = new Set();
                        for (const article of data.articles) {
                            if (!article.title || !article.url || !article.publishedAt) continue;

                            const publishedDate = new Date(article.publishedAt);
                            const hoursDiff = (new Date() - publishedDate) / (1000 * 60 * 60);

                            if (hoursDiff <= MAX_AGE_LIMIT && !seenUrls.has(article.url)) {
                                seenUrls.add(article.url);
                                validArticles.push({
                                    title: article.title.trim(),
                                    url: article.url.trim(),
                                    publishedAt: publishedDate.toISOString(),
                                    source: { name: article.source?.name || 'GNews' },
                                    category: config.category,
                                    excerpt: article.description
                                        ? article.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                                        : '',
                                    image: article.image || generatePlaceholderImage(article.source?.name || 'News')
                                });
                            }
                        }
                        console.log(`GNews returned ${validArticles.length} articles for ${config.category}`);
                    } else if (data.errors) {
                        console.warn(`GNews error for ${config.category}:`, data.errors);
                    }
                } catch (err) {
                    console.error(`GNews failed for ${config.category}:`, err.message);
                }
            } else {
                console.warn('âš ï¸  GNEWS_API_KEY not set â€” skipping GNews. Add it to your Render environment variables.');
            }


            // Strict filter on GNews results based on category config (allow slightly older if needed)
            let filteredArticles = validArticles.filter(a => {
                const hoursDiff = (new Date() - new Date(a.publishedAt)) / (1000 * 60 * 60);
                return hoursDiff <= (currentAgeLimit + 24); 
            });

            // ============================================================
            // 2. FALLBACK: Configured RSS sources â€” strict 48h enforced
            // ============================================================
            if (filteredArticles.length < 5) {
                console.log(`Falling back to configured RSS sources for ${config.category}`);
                const seenUrls = new Set(filteredArticles.map(a => a.url));

                for (const sourceKey of config.rssSources) {
                    if (filteredArticles.length >= 5) break;

                    const sourceConfig = newsSources[sourceKey];
                    if (!sourceConfig || sourceConfig.type !== 'rss') continue;

                    try {
                        const feed = await parser.parseURL(sourceConfig.url);
                        const items = feed.items || [];

                        for (const item of items) {
                            if (filteredArticles.length >= 5) break;
                            if (!item.title || !item.link) continue;

                            const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();
                            const hoursDiff = (new Date() - publishedDate) / (1000 * 60 * 60);

                            // Be more lenient with RSS fallback timing (7 days max)
                            if (hoursDiff <= 168 && !seenUrls.has(item.link)) {
                                seenUrls.add(item.link);
                                filteredArticles.push({
                                    title: item.title.trim(),
                                    url: item.link.trim(),
                                    publishedAt: publishedDate.toISOString(),
                                    source: { name: sourceConfig.name },
                                    category: config.category,
                                    excerpt: (item.contentSnippet || item.content || '')
                                        .replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                                    image: generatePlaceholderImage(sourceConfig.name)
                                });
                            }
                        }
                        console.log(`${sourceConfig.name} â†’ now have ${filteredArticles.length} for ${config.category}`);
                    } catch (err) {
                        console.error(`RSS failed for ${sourceKey} (${config.category}):`, err.message);
                    }
                }
            }


            // ============================================================
            // 3. SAFETY NET: Placeholder articles (absolute last resort)
            // ============================================================
            if (filteredArticles.length < 5) {
                console.log(`Safety net triggered for ${config.category}: only ${filteredArticles.length} articles found`);
                const needed = 5 - filteredArticles.length;
                const safetyArticles = [
                    { title: `Latest ${config.category} News — ${new Date().toLocaleDateString('en-AU', { weekday: 'long' })}`, url: fallbackUrls[config.category] + '?item=1', publishedAt: new Date().toISOString(), source: { name: 'Graham & Doddsville' }, category: config.category, excerpt: `Stay informed with the latest ${config.category.toLowerCase()} updates.` },
                    { title: `${config.category} Market Roundup`, url: fallbackUrls[config.category] + '?item=2', publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: 'Graham & Doddsville' }, category: config.category, excerpt: `Latest ${config.category.toLowerCase()} analysis and commentary for Australian investors.` },
                    { title: `${config.category} Weekly Overview`, url: fallbackUrls[config.category] + '?item=3', publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: 'Graham & Doddsville' }, category: config.category, excerpt: `Weekly ${config.category.toLowerCase()} summary for value investors.` },
                    { title: `${config.category} Investment Insights`, url: fallbackUrls[config.category] + '?item=4', publishedAt: new Date(Date.now() - 10800000).toISOString(), source: { name: 'Graham & Doddsville' }, category: config.category, excerpt: `Expert ${config.category.toLowerCase()} insights from Graham & Doddsville.` },
                    { title: `${config.category} News Update`, url: fallbackUrls[config.category] + '?item=5', publishedAt: new Date(Date.now() - 14400000).toISOString(), source: { name: 'Graham & Doddsville' }, category: config.category, excerpt: `Current ${config.category.toLowerCase()} news and market commentary for Australian investors.` }
                ];
                filteredArticles.push(...safetyArticles.slice(0, needed));
            }

            return filteredArticles.slice(0, 5);
        });

        const results = await Promise.allSettled(promises);
        results.forEach(result => {
            if (result.status === 'fulfilled') allArticles.push(...result.value);
        });

        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        if (allArticles.length > 0) {
            newsCache.articles = allArticles;
            newsCache.lastUpdated = new Date().toISOString();
        }

    } catch (error) {
        console.error('âŒ Background refresh failed:', error.message);
    } finally {
        newsCache.isRefreshing = false;
        console.log(`âœ… Background refresh completed: ${newsCache.articles.length} articles cached`);
    }
}

function cleanupCache() {
    if (articleHashes.size > 1000) {
        const hashesArray = Array.from(articleHashes);
        const keepHashes = hashesArray.slice(-500);
        articleHashes.clear();
        keepHashes.forEach(hash => articleHashes.add(hash));
    }

    const now = Date.now();
    for (const [key, value] of keywordCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION * 2) keywordCache.delete(key);
    }

    console.log(`ðŸ§¹ Cache cleanup: ${articleHashes.size} hashes, ${keywordCache.size} keyword cache entries`);
}

// Health check
app.get('/api/health', (req, res) => {
    const healthySources = Array.from(sourceHealth.entries())
        .filter(([, health]) => !health.isUnhealthy)
        .map(([name]) => name);

    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        gnews: {
            enabled: !!GNEWS_API_KEY,
            note: GNEWS_API_KEY ? 'GNews API key configured' : 'âš ï¸ GNEWS_API_KEY not set â€” add to Render environment variables'
        },
        sources: {
            total: Object.keys(newsSources).length,
            healthy: healthySources.length,
            unhealthy: Object.keys(newsSources).length - healthySources.length
        },
        cache: {
            cachedArticles: newsCache.articles.length,
            lastUpdated: newsCache.lastUpdated,
            keywordCacheSize: keywordCache.size,
            deduplicationHashes: articleHashes.size
        }
    });
});

// Cache clear
app.get('/api/cache/clear', (req, res) => {
    newsCache.articles = [];
    newsCache.lastUpdated = null;
    newsCache.isRefreshing = false;
    keywordCache.clear();
    sourceHealth.clear();
    articleHashes.clear();
    res.json({ message: 'Cache cleared successfully' });
});

// Static file serving
app.use('/html', express.static(path.join(__dirname, 'public', 'html'), {
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

app.use('/css', express.static(path.join(__dirname, 'public', 'css'), {
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
}));

app.use('/js', express.static(path.join(__dirname, 'public', 'js'), {
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
}));

app.use('/images', express.static(path.join(__dirname, 'public', 'images'), {
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=604800');
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path });
});

app.use((err, req, res, next) => {
    console.error('âŒ Server Error:', err.message);
    res.status(err.status || 500).json({
        error: 'Server Error',
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
        timestamp: new Date().toISOString()
    });
});

process.on('uncaughtException', (err) => {
    console.error('ðŸ’¥ UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('ðŸ’¥ UNHANDLED REJECTION:', reason);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => console.error('Server error:', err));
server.on('listening', () => console.log('Server is listening on all interfaces!'));

// Schedule background refresh
setTimeout(() => {
    console.log('ðŸ“‹ Scheduling background refresh...');
    setTimeout(() => {
        refreshNewsCache().catch(error => console.error('âŒ Background refresh error:', error));
    }, 1000);

    const refreshInterval = setInterval(() => {
        refreshNewsCache().catch(error => console.error('âŒ Background refresh error:', error));
    }, 4 * 60 * 60 * 1000); // every 4 hours

    refreshInterval.unref();
}, 1000);

// Cache cleanup every 2 hours
const cleanupInterval = setInterval(cleanupCache, 2 * 60 * 60 * 1000);
cleanupInterval.unref();

module.exports = app;