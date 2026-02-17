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

// === EMERGENCY BACKUP DATA (For when API Quota is dead) ===
const BACKUP_NEWS = [
    {
        title: "Localhost Development Mode: API Quota Exceeded",
        description: "This is a placeholder article because the NewsAPI limit (100 req/day) has been reached. Real news will return tomorrow.",
        url: "#",
        source: "System Message",
        publishedAt: new Date().toISOString(),
        category: "General"
    },
    {
        title: "Buffett's Berkshire Hathaway Reports Strong Q4 Earnings",
        description: "Operating earnings surged as insurance underwriting profits rebounded significantly in the latest quarter.",
        url: "#",
        source: "Bloomberg",
        publishedAt: new Date().toISOString(),
        category: "Companies"
    },
    {
        title: "ASX 200 rallies on mining strength",
        description: "The local bourse hit a new record high driven by surging commodity prices and renewed optimism in the resources sector.",
        url: "#",
        source: "ABC News",
        publishedAt: new Date().toISOString(),
        category: "Markets"
    },
    {
        title: "Reserve Bank maintains interest rates",
        description: "The RBA kept the cash rate steady at 4.35% as expected, citing persistent inflation pressures despite recent economic data.",
        url: "#",
        source: "Australian Financial Review",
        publishedAt: new Date().toISOString(),
        category: "Economy"
    },
    {
        title: "Tech stocks lead market recovery",
        description: "Technology shares bounced back strongly following recent volatility, with AI and cloud computing stocks showing particular strength.",
        url: "#",
        source: "Sydney Morning Herald",
        publishedAt: new Date().toISOString(),
        category: "Industry"
    },
    {
        title: "Value investing opportunities emerge",
        description: "Analysts identify undervalued stocks in traditional sectors as market sentiment shifts toward fundamental analysis approaches.",
        url: "#",
        source: "The Australian",
        publishedAt: new Date().toISOString(),
        category: "Investment"
    }
];

const app = express();
const PORT = process.env.PORT || 3051;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Performance optimization constants
const MAX_CONCURRENT_REQUESTS = 5; // Reduced for NewsAPI rate limits
const REQUEST_TIMEOUT = 5000; // Increased for NewsAPI
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours for NewsAPI free tier
const MAX_ARTICLES_PER_SOURCE = 5; // Increased for better content

// CACHE SETTINGS
const CACHE_DIR = path.join(__dirname, 'news-cache');
const NEWSAPI_CACHE_TIME = 6 * 60 * 60 * 1000; // 6 Hours (Strict for free tier)
const RSS_CACHE_TIME = 30 * 60 * 1000;         // 30 Minutes (fresher for RSS)

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}

// NewsAPI optimization constants
const FINANCIAL_KEYWORDS = ['investment', 'stock market', 'earnings', 'dividend', 'portfolio', 'value investing', 'financial analysis'];
const CREDIBLE_DOMAINS = ['reuters.com', 'bloomberg.com', 'ft.com', 'cnbc.com', 'investing.com', 'wsj.com', 'economist.com'];
const REQUEST_DELAY = 5000; // 5 seconds between requests
const FREE_TIER_DELAY_HOURS = 24; // NewsAPI free tier articles are minimum 24 hours old

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
    max: process.env.NODE_ENV === 'development' ? 1000 : 100, // 1000 requests per minute in dev, 100 per 15 min in prod
    message: 'Too many requests from this IP, please try again later.'
});

// Request tracking for NewsAPI quota management
const REQUEST_COUNTER = {
    dailyCount: 0,
    lastResetDate: new Date().toDateString(),
    requests: []  // Store request timestamps for sliding window analysis
};

// Reset counter at midnight
function resetDailyCounter() {
    const now = new Date().toDateString();
    if (now !== REQUEST_COUNTER.lastResetDate) {
        console.log(`✅ Daily reset: ${REQUEST_COUNTER.dailyCount} requests used yesterday`);
        REQUEST_COUNTER.dailyCount = 0;
        REQUEST_COUNTER.lastResetDate = now;
        REQUEST_COUNTER.requests = [];
    }
}

// Check and track NewsAPI requests
async function checkAndTrackNewsAPIRequest() {
    resetDailyCounter();

    if (REQUEST_COUNTER.dailyCount >= 100) {
        throw new Error(`❌ Daily NewsAPI limit (100) exceeded. Reset at midnight UTC.`);
    }

    if (REQUEST_COUNTER.dailyCount >= 95) {
        console.warn(`⚠️ WARNING: ${REQUEST_COUNTER.dailyCount}/100 daily requests used`);
    }

    REQUEST_COUNTER.dailyCount++;
    return true;
}

// Centralized rate limiter for NewsAPI requests
class RequestQueue {
    constructor(delayMs = 5000, maxConcurrent = 1) {
        this.queue = [];
        this.active = 0;
        this.delayMs = delayMs;
        this.maxConcurrent = maxConcurrent;
        this.lastRequestTime = 0;
    }

    async add(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.active >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }

        this.active++;
        const { fn, resolve, reject } = this.queue.shift();

        try {
            // Enforce minimum delay between requests
            const timeSinceLastRequest = Date.now() - this.lastRequestTime;
            if (timeSinceLastRequest < this.delayMs) {
                await new Promise(r => setTimeout(r, this.delayMs - timeSinceLastRequest));
            }

            this.lastRequestTime = Date.now();
            const result = await fn();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.active--;
            this.process();
        }
    }
}

const newsApiQueue = new RequestQueue(REQUEST_DELAY, 1);  // 5sec delay, 1 concurrent

// Deduplication and validation functions
const articleHashes = new Set();

// In-memory cache for news data
const newsCache = new Map();
const sourceHealth = new Map(); // Track source health

// Enable CORS for all routes
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com'  // Change to your actual domain
        : 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
    maxAge: 3600
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

// Deduplication and validation functions
function generateArticleHash(title, source, publishedAt) {
    const content = `${title.trim().toLowerCase()}_${source.trim().toLowerCase()}_${new Date(publishedAt).toDateString()}`;
    return crypto.createHash('sha256').update(content).digest('hex');
}

function isArticleValid(article) {
    // Validation rules
    if (!article.title || article.title.length < 20 || article.title.length > 150) return false;
    if (!article.description || article.description.length < 50) return false;
    if (!article.source || !article.source.name) return false;
    if (!article.url) return false;
    if (!article.publishedAt) return false;

    // ✅ NEW: Account for free tier 24-hour delay
    const publishedDate = new Date(article.publishedAt);
    const now = new Date();
    const hoursDiff = (now - publishedDate) / (1000 * 60 * 60);

    // Free tier: articles are minimum 24 hours old, accept up to 72 hours
    const MIN_HOURS = FREE_TIER_DELAY_HOURS;   // Don't show fresh articles (not from free tier)
    const MAX_HOURS = 72;   // Don't show very stale articles

    if (hoursDiff < MIN_HOURS || hoursDiff > MAX_HOURS) return false;

    // Check domain whitelist for NewsAPI articles
    if (article.url) {
        const url = new URL(article.url);
        if (!CREDIBLE_DOMAINS.some(domain => url.hostname.includes(domain))) return false;
    }

    return true;
}

function isArticleRelevant(article) {
    const relevantKeywords = [
        'investment', 'investing', 'market', 'stocks', 'shares', 'equity',
        'bonds', 'property', 'real estate', 'superannuation', 'super',
        'banking', 'finance', 'economic', 'economy', 'inflation', 'interest',
        'rate', 'rba', 'asx', 'mining', 'resources', 'energy', 'retail',
        'consumer', 'business', 'company', 'earnings', 'profit', 'revenue'
    ];

    const text = (article.title + ' ' + (article.excerpt || '')).toLowerCase();
    return relevantKeywords.some(keyword => text.includes(keyword));
}

function deduplicateArticles(articles) {
    const uniqueArticles = [];
    const seenHashes = new Set();

    for (const article of articles) {
        const hash = generateArticleHash(article.title, article.source, article.publishedAt);
        if (!seenHashes.has(hash) && !articleHashes.has(hash)) {
            seenHashes.add(hash);
            articleHashes.add(hash);
            uniqueArticles.push(article);
        }
    }

    return uniqueArticles;
}

// Performance optimization middleware
app.use((req, res, next) => {
    // Set caching headers for static assets
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    } else if (req.url.match(/\.(html)$/)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    // Enable compression
    res.setHeader('Vary', 'Accept-Encoding');

    next();
});

// Enhanced RSS Feed Parser with timeout, error handling, and entity cleaning
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let xmlText = await response.text();

        // === THE FIX IS HERE ===
        // Clean common HTML entities that break strict XML parsers
        xmlText = xmlText
            .replace(/&nbsp;/g, ' ')
            .replace(/&copy;/g, '©')
            .replace(/&ndash;/g, '-')
            .replace(/&mdash;/g, '-')
            .replace(/&rsquo;/g, "'")
            .replace(/&lsquo;/g, "'")
            .replace(/&rdquo;/g, '"')
            .replace(/&ldquo;/g, '"');
        // =======================

        const parser = new DOMParser();
        // Use 'text/xml' instead of 'application/xml' for better leniency
        const doc = parser.parseFromString(xmlText, 'text/xml');

        const items = doc.getElementsByTagName('item');
        const articles = [];

        for (let i = 0; i < Math.min(items.length, MAX_ARTICLES_PER_SOURCE); i++) {
            const item = items[i];
            const title = item.getElementsByTagName('title')[0]?.textContent || '';
            const description = item.getElementsByTagName('description')[0]?.textContent || '';
            const link = item.getElementsByTagName('link')[0]?.textContent || '';
            const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';

            if (title && link) {
                // Enhanced Image Extraction
                let imageUrl = null;

                // 1. Try media:content
                const mediaContent = item.getElementsByTagName('media:content')[0];
                if (mediaContent) {
                    imageUrl = mediaContent.getAttribute('url');
                }

                // 2. Try enclosure
                if (!imageUrl) {
                    const enclosure = item.getElementsByTagName('enclosure')[0];
                    if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
                        imageUrl = enclosure.getAttribute('url');
                    }
                }

                // 3. Try parsing description for <img> tag
                if (!imageUrl && description) {
                    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) {
                        imageUrl = imgMatch[1];
                    }
                }

                // 4. Google News specific (cover image often in description)
                if (!imageUrl && sourceName.includes('Google News')) {
                    // Google News RSS doesn't give images easily, but sometimes they are in the description HTML
                    // If not found, it will fall back to placeholder in the frontend
                }

                articles.push({
                    title: title.trim(),
                    excerpt: description ? description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '',
                    url: link.trim(),
                    image: imageUrl || generatePlaceholderImage(sourceName),
                    category: (defaultCategory && ['Industry', 'Regulatory', 'Technology', 'Guru Watch', 'Economy', 'Markets', 'Companies'].includes(defaultCategory))
                        ? defaultCategory
                        : categorizeNews(title + ' ' + description + ' ' + sourceName),
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

// Fetch news for a source, using appropriate method
async function fetchNews(sourceKey, keywords = FINANCIAL_KEYWORDS) {
    const source = newsSources[sourceKey];
    if (!source) return [];

    if (source.type === 'rss') {
        return await parseRSSFeed(source.url, source.name, source.category);
    } else if (source.type === 'newsapi') {
        const articles = [];
        for (const keyword of keywords) {
            try {
                const result = await fetchNewsFromAPI(keyword, 0);
                articles.push(...result);
            } catch (error) {
                console.log(`Failed to fetch ${keyword} for ${source.name}:`, error.message);
            }
        }
        return articles;
    }
    return [];
}

// Enhanced NewsAPI fetcher with optimization and validation
async function fetchNewsFromAPI(keyword, delay = 0) {
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
        // ✅ NEW: Check quota before making request
        await checkAndTrackNewsAPIRequest();

        // Check cache first
        const cacheKey = `newsapi_${keyword}`;
        const cached = newsCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            console.log(`Using cached data for keyword: ${keyword}`);
            return cached.articles;
        }

        // Date range: last 7 days to account for free tier delay
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fromDate = sevenDaysAgo.toISOString().split('T')[0];
        const toDate = new Date().toISOString().split('T')[0];

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&domains=${CREDIBLE_DOMAINS.join(',')}&from=${fromDate}&to=${toDate}&language=en&sortBy=publishedAt&pageSize=${MAX_ARTICLES_PER_SOURCE}&apiKey=${NEWS_API_KEY}`;

        console.log(`Fetching optimized news from NewsAPI for keyword: ${keyword}...`);

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

        // Validate and process articles
        const validArticles = data.articles
            .filter(article => isArticleValid({
                title: article.title,
                description: article.description,
                source: { name: article.source.name },
                url: article.url,
                publishedAt: article.publishedAt
            }))
            .map(article => ({
                title: article.title.trim(),
                excerpt: article.description ? article.description.substring(0, 120) + '...' : '',
                url: article.url,
                image: article.urlToImage || generatePlaceholderImage(article.source.name),
                category: categorizeNews(article.title + ' ' + (article.description || '')),
                source: article.source.name,
                publishedAt: article.publishedAt,
                hash: generateArticleHash(article.title, article.source.name, article.publishedAt)
            }));

        // Cache the results
        newsCache.set(cacheKey, {
            articles: validArticles,
            timestamp: Date.now()
        });

        console.log(`Successfully fetched ${validArticles.length} valid articles for keyword: ${keyword}`);
        return validArticles;

    } catch (error) {
        console.error(`Error fetching news from NewsAPI for keyword ${keyword}:`, error.message);
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
    if (lowerContent.includes('asx') || lowerContent.includes('market') || lowerContent.includes('stock') || lowerContent.includes('trading')) {
        return 'Markets';
    } else if (lowerContent.includes('company') || lowerContent.includes('business') || lowerContent.includes('corporate') || lowerContent.includes('startup')) {
        return 'Companies';
    } else if (lowerContent.includes('economy') || lowerContent.includes('gdp') || lowerContent.includes('inflation') || lowerContent.includes('unemployment')) {
        return 'Economy';
    } else if (lowerContent.includes('industry') || lowerContent.includes('sector') || lowerContent.includes('mining') || lowerContent.includes('manufacturing')) {
        return 'Industry';
    } else if (lowerContent.includes('rba') || lowerContent.includes('interest') || lowerContent.includes('rate') || lowerContent.includes('regulation') || lowerContent.includes('regulator') || lowerContent.includes('policy')) {
        return 'Regulatory';
    } else if (lowerContent.includes('commodity') || lowerContent.includes('commodities') || lowerContent.includes('gold') || lowerContent.includes('silver') || lowerContent.includes('copper') || lowerContent.includes('iron ore') || lowerContent.includes('wheat') || lowerContent.includes('oil') || lowerContent.includes('gas')) {
        return 'Commodities';
    } else if (lowerContent.includes('property') || lowerContent.includes('housing') || lowerContent.includes('real estate')) {
        return 'Property';
    } else if (lowerContent.includes('bank') || lowerContent.includes('financial') || lowerContent.includes('fund') || lowerContent.includes('finance')) {
        return 'Banking';
    } else if (lowerContent.includes('tech') || lowerContent.includes('ai') || lowerContent.includes('digital') || lowerContent.includes('software')) {
        return 'Technology';
    } else if (lowerContent.includes('energy') || lowerContent.includes('renewable') || lowerContent.includes('coal')) {
        return 'Energy';
    } else if (lowerContent.includes('super') || lowerContent.includes('retirement') || lowerContent.includes('pension')) {
        return 'Superannuation';
    } else if (lowerContent.includes('retail') || lowerContent.includes('consumer') || lowerContent.includes('shopping')) {
        return 'Consumer';
    } else if (lowerContent.includes('mining') || lowerContent.includes('resources')) {
        return 'Resources';
    } else if (lowerContent.includes('buffett') || lowerContent.includes('munger') || lowerContent.includes('graham') || lowerContent.includes('dodd') || lowerContent.includes('guru') || lowerContent.includes('investor') || lowerContent.includes('legend')) {
        return 'Guru Watch';
    } else if (lowerContent.includes('investment') || lowerContent.includes('value') || lowerContent.includes('portfolio') || lowerContent.includes('investor')) {
        return 'Investment';
    }
    return 'General';
}

// Generate placeholder image (Fixed: Uses Placehold.co which is faster/reliable)
function generatePlaceholderImage(sourceName) {
    // Clean up source name
    const safeName = sourceName ? sourceName.replace(/[^a-zA-Z0-9 ]/g, '') : 'News';
    // Returns a fast, lightweight generated image
    return `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(safeName)}`;
}

// === HELPER: FETCH AND NORMALIZE ===
async function fetchSourceData(sourceKey) {
    const sourceConfig = newsSources[sourceKey];
    if (!sourceConfig) throw new Error('Source not found in config');

    console.log(`[Server] Fetching fresh data for ${sourceKey} (${sourceConfig.type})...`);

    let articles = [];

    try {
        if (sourceConfig.type === 'newsapi') {
            // --- STRATEGY A: NewsAPI ---
            const apiKey = process.env.NEWS_API_KEY;
            // Note: Using 'everything' endpoint often yields more than top-headlines for specific domains
            const url = `https://newsapi.org/v2/everything?domains=${sourceConfig.source}&apiKey=${apiKey}&pageSize=10`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'ok') {
                articles = data.articles;
            } else {
                throw new Error(`NewsAPI Error: ${JSON.stringify(data)}`);
            }

        } else if (sourceConfig.type === 'rss') {
            // --- STRATEGY B: RSS Feeds ---
            const feed = await parser.parseURL(sourceConfig.url);

            // Normalize RSS to match NewsAPI structure so frontend code is simple
            articles = feed.items.map(item => ({
                title: item.title,
                description: item.contentSnippet || item.content,
                url: item.link,
                publishedAt: item.pubDate,
                source: { name: sourceConfig.name }, // Match NewsAPI format
                urlToImage: null // RSS rarely provides clean images, frontend handles placeholder
            }));
        }
    } catch (error) {
        console.error(`[Server] Error fetching ${sourceKey}:`, error.message);
        throw error;
    }

    return {
        articles: articles,
        timestamp: new Date().toISOString()
    };
}

// === THE ROUTE ===
app.get('/api/news/:sourceId', async (req, res) => {
    try {
        const sourceId = req.params.sourceId;
        const cacheFile = path.join(CACHE_DIR, `${sourceId}.json`);
        const sourceConfig = newsSources[sourceId];

        if (!sourceConfig) {
            return res.status(404).json({ error: 'Source not configured' });
        }

        // 1. DETERMINE CACHE DURATION
        const cacheDuration = sourceConfig.type === 'newsapi' ? NEWSAPI_CACHE_TIME : RSS_CACHE_TIME;

        // 2. CHECK CACHE
        if (fs.existsSync(cacheFile)) {
            const fileData = fs.readFileSync(cacheFile, 'utf8');
            const cachedJson = JSON.parse(fileData);

            const fileTime = new Date(cachedJson.timestamp).getTime();
            const now = new Date().getTime();

            // If cache is fresh, return it immediately
            if ((now - fileTime) < cacheDuration) {
                console.log(`[Server] Serving ${sourceId} from CACHE`);
                return res.json(cachedJson);
            }
            console.log(`[Server] Cache expired for ${sourceId}`);
        }

        // 3. FETCH FRESH DATA (If cache missing or stale)
        const freshData = await fetchSourceData(sourceId);

        // 4. WRITE TO CACHE
        fs.writeFileSync(cacheFile, JSON.stringify(freshData, null, 2));

        console.log(`[Server] Served and cached ${sourceId}`);
        return res.json(freshData);

    } catch (error) {
        console.error(`[Server] Error processing ${req.params.sourceId}:`, error.message);

        // FAIL-SAFE: If fetch fails (API limit), try to serve STALE cache if it exists
        const cacheFile = path.join(CACHE_DIR, `${req.params.sourceId}.json`);
        if (fs.existsSync(cacheFile)) {
            console.log(`[Server] Serving STALE cache for ${req.params.sourceId} due to error`);
            const staleData = fs.readFileSync(cacheFile, 'utf8');
            return res.json(JSON.parse(staleData));
        }

        return res.status(500).json({ error: 'Failed to fetch news', details: error.message });
    }
});

// API endpoint to fetch news by geographic region
app.get('/api/news/region/:region', async (req, res) => {
    try {
        const region = req.params.region.toLowerCase();
        const sourceKeys = regionalNewsSources[region];

        if (!sourceKeys) {
            return res.status(404).json({ error: 'Region not found' });
        }

        console.log(`Fetching news for region: ${region}`);

        // Get sources for this region, filtering out undefined sources
        const sources = sourceKeys.map(key => newsSources[key]).filter(source => source && source.name);

        if (sources.length === 0) {
            return res.status(404).json({ error: 'No sources found for region' });
        }

        console.log(`Found ${sources.length} sources for ${region}:`, sources.map(s => s.name));

        // All sources should be RSS now (Google News + direct RSS)
        const rssSources = sources.filter(s => s.type === 'rss');
        const newsApiSources = sources.filter(s => s.type === 'newsapi');

        let allArticles = [];

        // Try RSS sources first (our primary strategy now)
        if (rssSources.length > 0) {
            console.log(`Processing ${rssSources.length} RSS sources for ${region}...`);
            const rssSourceKeys = rssSources.map(s => {
                const key = Object.keys(newsSources).find(k => newsSources[k] === s);
                return key;
            }).filter(Boolean);
            // Process all RSS sources (up to 7) with batch size 4 for speed
            const rssResults = await processBatch(rssSourceKeys.slice(0, 7), 4);
            allArticles = rssResults.flat();
            console.log(`RSS sources returned ${allArticles.length} articles for ${region}`);
        }

        // fallback: try NewsAPI sources if RSS returned too few
        if (allArticles.length < 3 && newsApiSources.length > 0) {
            console.log(`Trying ${newsApiSources.length} NewsAPI sources for ${region}...`);
            try {
                const apiSourceKeys = newsApiSources.map(s => {
                    const key = Object.keys(newsSources).find(k => newsSources[k] === s);
                    return key;
                }).filter(Boolean);
                const keywords = (region === 'north-america' || region === 'europe') ? ['news'] : FINANCIAL_KEYWORDS;
                const apiResults = await processBatch(apiSourceKeys.slice(0, 3), 2, keywords);
                const apiArticles = apiResults.flat();
                allArticles = [...allArticles, ...apiArticles];
                console.log(`NewsAPI sources returned ${apiArticles.length} articles`);
            } catch (error) {
                console.log(`NewsAPI failed for ${region} (likely rate limited):`, error.message);
            }
        }

        // No additional relevance filter — Google News feeds are already targeted by region
        // Filter for freshness: only keep articles from the last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        allArticles = allArticles.filter(article => {
            if (!article.publishedAt) return true; // Keep articles without dates (Google News often has recent ones)
            const pubDate = new Date(article.publishedAt);
            return pubDate >= sevenDaysAgo;
        });

        console.log(`After freshness filter: ${allArticles.length} articles remain for ${region}`);

        // Deduplicate by title
        const seen = new Set();
        allArticles = allArticles.filter(article => {
            const key = article.title?.toLowerCase().trim();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        // Sort articles by date (newest first)
        allArticles = allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Take top 5 articles
        const topArticles = allArticles.slice(0, 5);

        res.json({
            region: region,
            articles: topArticles,
            count: topArticles.length,
            sources: sources.map(s => s.name),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`Error fetching news for region ${req.params.region}:`, error);
        res.status(500).json({
            error: 'Failed to fetch regional news',
            message: error.message
        });
    }
});

// Batch processing function with concurrency control
async function processBatch(sources, batchSize = MAX_CONCURRENT_REQUESTS, keywords = FINANCIAL_KEYWORDS) {
    const results = [];

    for (let i = 0; i < sources.length; i += batchSize) {
        const batch = sources.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sources.length / batchSize)} (${batch.length} sources)`);

        const batchPromises = batch.map(async (sourceKey) => {
            try {
                const source = newsSources[sourceKey];
                if (!source) {
                    console.log(`Source ${sourceKey} not found, skipping...`);
                    return [];
                }

                let articles = [];

                articles = await fetchNews(sourceKey, keywords);

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
        return ['business', 'technology', 'Industry', 'Regulatory', 'Markets', 'Guru Watch'].includes(source.category);
    });

    // Low priority sources (regional)
    const lowPriority = sourceKeys.filter(key => {
        const source = newsSources[key];
        return source.category === 'regional' && !highPriority.includes(key) && !mediumPriority.includes(key);
    });

    // Limit to top 20 sources for faster loading
    return [...highPriority, ...mediumPriority, ...lowPriority].slice(0, 50);
}

// API endpoint to fetch news from all sources with optimization
app.get('/api/news', async (req, res) => {
    try {
        console.log('Fetching optimized financial news...');

        // Check if we have cached data (but not empty data)
        const cacheKey = 'optimized_news';
        const cached = newsCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION && cached.data.articles && cached.data.articles.length > 0) {
            console.log('Returning cached optimized news data');
            return res.json({
                ...cached.data,
                lastUpdated: new Date(cached.timestamp).toISOString(),
                isCached: true
            });
        }

        const allArticles = [];

        // Fetch from RSS sources first (reliable) - ENABLED
        const rssSources = getPrioritizedSources().filter(key => newsSources[key]?.type === 'rss').slice(0, 30);
        if (rssSources.length > 0) {
            console.log(`Fetching from ${rssSources.length} RSS sources...`);
            const rssResults = await processBatch(rssSources, 3);
            rssResults.forEach(articles => allArticles.push(...articles));
        }

        // Fetch optimized NewsAPI content with keywords
        console.log('Fetching optimized NewsAPI content...');
        const newsApiPromises = FINANCIAL_KEYWORDS.map(keyword =>
            newsApiQueue.add(() => fetchNewsFromAPI(keyword, 0))
        );

        const newsApiResults = await Promise.allSettled(newsApiPromises);
        newsApiResults.forEach(result => {
            if (result.status === 'fulfilled') {
                allArticles.push(...result.value);
            } else {
                console.error('NewsAPI keyword fetch failed:', result.reason);
            }
        });

        // Deduplicate articles
        const uniqueArticles = deduplicateArticles(allArticles);

        // Sort by publication date (newest first), then by URL uniqueness
        uniqueArticles.sort((a, b) => {
            const dateDiff = new Date(b.publishedAt) - new Date(a.publishedAt);
            if (dateDiff !== 0) return dateDiff;
            // Prefer articles from different sources
            return a.source.localeCompare(b.source);
        });

        // Take top articles (limit to prevent overload)
        const topArticles = uniqueArticles.slice(0, 50);

        const responseData = {
            articles: topArticles,
            count: topArticles.length,
            keywords: FINANCIAL_KEYWORDS,
            domains: CREDIBLE_DOMAINS,
            lastUpdated: new Date().toISOString(),
            isCached: false,
            freshness: 'LIVE',  // ✅ NEW: Freshness indicator
            deduplicationApplied: allArticles.length - uniqueArticles.length
        };

        // Cache the results (only if we have articles)
        if (topArticles.length > 0) {
            newsCache.set(cacheKey, {
                data: responseData,
                timestamp: Date.now()
            });
        }

        console.log(`Successfully fetched ${topArticles.length} unique articles (${allArticles.length - uniqueArticles.length} duplicates removed)`);

        // If no articles were fetched (all APIs failed), serve emergency backup
        if (topArticles.length === 0) {
            console.log('🚨 No articles fetched from APIs. Serving Emergency Backup Data.');

            // Enhance backup data with random images
            const backupWithImages = BACKUP_NEWS.map(item => ({
                ...item,
                image: `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(item.source)}`
            }));

            return res.json({
                articles: backupWithImages,
                count: backupWithImages.length,
                keywords: FINANCIAL_KEYWORDS,
                domains: CREDIBLE_DOMAINS,
                lastUpdated: new Date().toISOString(),
                isCached: false,
                freshness: 'BACKUP',
                warning: 'Using emergency backup data (API Quota Exceeded)'
            });
        }

        res.json(responseData);

    } catch (error) {
        console.error('Error fetching optimized news:', error);

        // Return cached data with transparency
        const cached = newsCache.get('optimized_news');
        if (cached) {
            const ageHours = Math.round((Date.now() - cached.timestamp) / (1000 * 60 * 60));

            return res.json({
                ...cached.data,
                freshness: 'STALE',  // ✅ NEW: Stale indicator
                staleSinceHours: ageHours,
                error: 'Using cached data due to API failure',
                errorMessage: error.message,
                disclaimer: '⚠️ Free tier active: Limited real-time updates. Data may be 24-48 hours old.',
                httpStatus: 206  // 206 Partial Content
            });
        }

        // 6. Last Resort: Emergency Backup
        // If everything failed, send the static backup data so the UI isn't empty
        console.log('🚨 API Failed & No Cache. Serving Emergency Backup Data.');

        // Enhance backup data with random images
        const backupWithImages = BACKUP_NEWS.map(item => ({
            ...item,
            image: `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(item.source)}`
        }));

        res.json({
            articles: backupWithImages,
            count: backupWithImages.length,
            warning: 'Using emergency backup data (API Quota Exceeded)'
        });
    }
});

// Background refresh system
async function backgroundRefresh() {
    console.log('📰 Starting background news refresh...');
    try {
        const allArticles = [];

        // Fetch from RSS sources
        const rssSources = getPrioritizedSources()
            .filter(key => newsSources[key]?.type === 'rss')
            .slice(0, 30);

        if (rssSources.length > 0) {
            console.log(`📡 Fetching from ${rssSources.length} RSS sources...`);
            const rssResults = await processBatch(rssSources, 2);
            rssResults.forEach(articles => allArticles.push(...articles));
        }

        // Fetch optimized NewsAPI content (limit to 2 keywords for background refresh)
        const selectedKeywords = FINANCIAL_KEYWORDS.slice(0, 2);
        console.log(`🔍 Fetching from NewsAPI with keywords: ${selectedKeywords.join(', ')}`);

        // TEMP: Use simple delay instead of RequestQueue for background refresh
        const newsApiPromises = selectedKeywords.map((keyword, index) =>
            fetchNewsFromAPI(keyword, index * REQUEST_DELAY)
        );

        const newsApiResults = await Promise.allSettled(newsApiPromises);
        newsApiResults.forEach(result => {
            if (result.status === 'fulfilled') {
                allArticles.push(...result.value);
            } else {
                console.warn(`⚠️ NewsAPI failed for keyword:`, result.reason);
            }
        });

        // Deduplicate and sort
        const uniqueArticles = deduplicateArticles(allArticles);
        uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        const topArticles = uniqueArticles.slice(0, 200);

        const responseData = {
            articles: topArticles,
            count: topArticles.length,
            keywords: selectedKeywords,
            domains: CREDIBLE_DOMAINS,
            lastUpdated: new Date().toISOString(),
            isCached: false
        };

        // Update cache
        newsCache.set('optimized_news', {
            data: responseData,
            timestamp: Date.now()
        });

        console.log(`✅ Background refresh completed: ${topArticles.length} articles cached`);
        return responseData;  // ✅ Return the result

    } catch (error) {
        console.error('❌ Background refresh failed:', error.message);
        throw error;  // ✅ Re-throw so calling code knows it failed
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

    // Clean up old deduplication hashes (keep last 1000)
    if (articleHashes.size > 1000) {
        const hashesArray = Array.from(articleHashes);
        const keepHashes = hashesArray.slice(-500); // Keep most recent 500
        articleHashes.clear();
        keepHashes.forEach(hash => articleHashes.add(hash));
    }
}

// Health check endpoint with performance metrics
app.get('/api/news/category/:category', async (req, res) => {
    try {
        const requestedCategory = req.params.category.toLowerCase();
        console.log(`Fetching news for category: ${requestedCategory}`);

        // Check if we have cached data
        const cacheKey = 'optimized_news';
        const cached = newsCache.get(cacheKey);

        if (!cached || (Date.now() - cached.timestamp) > CACHE_DURATION) {
            console.log('No valid cache found, fetching fresh data...');
            return res.status(503).json({
                error: 'Service temporarily unavailable',
                message: 'Please try the main news endpoint first to populate cache.',
                retryAfter: 60
            });
        }

        // Filter articles by category (case-insensitive)
        const filteredArticles = cached.data.articles.filter(article =>
            article.category && article.category.toLowerCase() === requestedCategory
        );

        // Sort by publication date (newest first)
        filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Take up to 20 articles for the category page
        const categoryArticles = filteredArticles.slice(0, 20);

        const responseData = {
            category: requestedCategory,
            articles: categoryArticles,
            count: categoryArticles.length,
            totalAvailable: filteredArticles.length,
            lastUpdated: new Date(cached.timestamp).toISOString(),
            isCached: true,
            freshness: 'CACHED'
        };

        console.log(`Returning ${categoryArticles.length} articles for category '${requestedCategory}'`);

        res.json(responseData);

    } catch (error) {
        console.error('Error fetching category news:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch category news'
        });
    }
});

// Health check endpoint with performance metrics
app.get('/api/health', (req, res) => {
    resetDailyCounter();  // Ensure counter is current

    const healthySources = Array.from(sourceHealth.entries())
        .filter(([name, health]) => !health.isUnhealthy)
        .map(([name]) => name);

    const cachedNews = newsCache.get('optimized_news');
    const articleCount = cachedNews ? cachedNews.data.count : 0;
    const lastUpdated = cachedNews ? cachedNews.timestamp : null;

    // Calculate remaining quota
    const requestsUsedToday = REQUEST_COUNTER.dailyCount;
    const requestsRemaining = Math.max(0, 100 - requestsUsedToday);
    const quotaPercentage = ((requestsUsedToday / 100) * 100).toFixed(1);

    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        api: {
            requestsUsedToday: requestsUsedToday,
            requestsRemaining: requestsRemaining,
            quotaPercentage: quotaPercentage,
            quotaStatus: requestsRemaining < 10 ? '⚠️ WARNING' : 'OK',
            resetTime: 'Midnight UTC'
        },
        sources: {
            total: Object.keys(newsSources).length,
            healthy: healthySources.length,
            unhealthy: Object.keys(newsSources).length - healthySources.length
        },
        cache: {
            cachedArticles: articleCount,
            lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : null,
            cacheSize: newsCache.size,
            deduplicationHashes: articleHashes.size
        },
        keywords: FINANCIAL_KEYWORDS,
        domains: CREDIBLE_DOMAINS
    });
});

// Cache management endpoint
app.get('/api/cache/clear', (req, res) => {
    newsCache.clear();
    sourceHealth.clear();
    res.json({ message: 'Cache cleared successfully' });
});

// Static file serving with optimized caching headers
// ===================================================

// HTML files from /public/html - no cache (frequently updated)
app.use('/html', express.static(path.join(__dirname, 'public', 'html'), {
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// CSS files from /public/css - long cache (1 year)
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), {
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    }
}));

// JavaScript files from /public/js - long cache (1 year)
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), {
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    }
}));

// Images from /public/images - medium cache (1 week)
app.use('/images', express.static(path.join(__dirname, 'public', 'images'), {
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 1 week
        res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
    }
}));

// Root static files (favicon, manifest, service worker, etc.) - short cache
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.ico') || path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
        } else {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve main page (index.html from root)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ========================
// ERROR HANDLING MIDDLEWARE
// ========================

// 404 - Route not found
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist',
        path: req.path
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);

    res.status(err.status || 500).json({
        error: 'Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'An error occurred'
            : err.message,
        timestamp: new Date().toISOString()
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 UNHANDLED REJECTION:', reason);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.on('listening', () => {
    console.log('Server is listening on all interfaces!');
});

// Schedule background refresh AFTER server is fully started
// Schedule background refresh AFTER server is fully started
setTimeout(() => {
    console.log('📋 Scheduling background refresh...');

    // Run first refresh immediately after delay
    setTimeout(() => {
        backgroundRefresh().catch(error => {
            console.error('❌ Background refresh error:', error);
        });
    }, 1000);

    // Schedule recurring refreshes every 6 hours
    const refreshInterval = setInterval(() => {
        backgroundRefresh().catch(error => {
            console.error('❌ Background refresh error:', error);
        });
    }, 6 * 60 * 60 * 1000);

    refreshInterval.unref();
}, 1000); // Wait 1 second after server starts

// Cache cleanup interval
// TEMPORARILY DISABLED
// const cleanupInterval = setInterval(cleanupCache, 2 * 60 * 60 * 1000);
// cleanupInterval.unref();

module.exports = app;
