require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const Parser = require('rss-parser');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { newsSources, regionalNewsSources } = require('./news-sources-config');

// ─── Constants ────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3051;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const IS_PROD = process.env.NODE_ENV === 'production';
const REQUEST_TIMEOUT = 8000;   // ms per fetch
const MAX_AGE_HOURS = 48;     // strict article age cutoff
const REFRESH_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours
const CACHE_DIR = path.join(__dirname, 'news-cache');
const SOURCE_FILE_TTL = 30 * 60 * 1000; // 30 min for /api/news/:sourceId cache

const BLOCKED_DOMAINS = new Set([
    'vanityfair.com', 'pagesix.com', 'twistedsifter.com', 'bleedingcool.com',
    'tmz.com', 'eonline.com', 'people.com', 'usmagazine.com',
    'hollywoodreporter.com', 'variety.com', 'entertainmentweekly.com'
]);

const FALLBACK_URLS = {
    Companies: 'https://www.asx.com.au/prices/company-information.htm',
    Markets: 'https://www.asx.com.au/markets/trade-our-cash-market.htm',
    Economy: 'https://www.rba.gov.au/statistics/',
    Industry: 'https://www.asx.com.au/markets/trade-our-cash-market/sector.htm',
    Regulatory: 'https://asic.gov.au/about-asic/news-centre/',
    'Guru Watch': 'https://www.berkshirehathaway.com/letters/letters.html'
};

// Categories with their GNews query + ordered RSS fallback sources
const CATEGORIES = [
    {
        name: 'Companies',
        gnewsQuery: 'ASX OR "Australian shares" OR "company earnings" OR "stock results"',
        rssSources: [
            'stockhead', 'livewire-markets', 'afr', 'abc-business',
            'sydney-morning-herald', 'the-australian', 'business-insider-au',
            'news-com-au', 'the-age', 'smartcompany', 'reuters-rss', 'guardian-rss'
        ]
    },
    {
        name: 'Markets',
        gnewsQuery: 'ASX OR "stock market" OR "share market" Australia',
        rssSources: [
            'stockhead', 'livewire-markets', 'afr', 'abc-business',
            'sydney-morning-herald', 'smartcompany', 'the-australian',
            'business-insider-au', 'news-com-au', 'the-age',
            'reuters-rss', 'bbc-rss', 'guardian-rss'
        ]
    },
    {
        name: 'Economy',
        gnewsQuery: 'RBA OR "Australian economy" OR inflation OR "interest rate" Australia',
        rssSources: [
            'abc-news-au', 'abc-business', 'afr', 'sydney-morning-herald',
            'the-australian', 'sbs-news', 'the-age', 'news-com-au',
            'business-insider-au', 'smartcompany', 'crikey',
            'guardian-rss', 'bbc-rss', 'reuters-rss'
        ]
    },
    {
        name: 'Industry',
        gnewsQuery: 'Australia industry OR mining OR energy OR banking OR retail',
        rssSources: [
            'google-news-mining', 'google-news-retail', 'google-news-construction',
            'australian-mining', 'mining-com-au', 'inside-retail', 'smartcompany',
            'abc-business', 'afr', 'the-australian', 'reuters-rss', 'guardian-rss'
        ]
    },
    {
        name: 'Regulatory',
        gnewsQuery: 'ASIC OR APRA OR ACCC OR "financial regulation" OR compliance Australia',
        rssSources: [
            'google-news-regulatory', 'abc-news-au', 'abc-business',
            'afr', 'sydney-morning-herald', 'the-australian',
            'sbs-news', 'the-age', 'news-com-au', 'business-insider-au',
            'crikey', 'guardian-rss', 'reuters-rss', 'bbc-rss'
        ]
    },
    {
        name: 'Guru Watch',
        gnewsQuery: 'Buffett OR "Charlie Munger" OR "Ray Dalio" OR "value investing"',
        rssSources: [
            'google-news-guru', 'google-news-investment-gurus',
            'livewire-markets', 'stockhead', 'afr', 'abc-business',
            'sydney-morning-herald', 'the-australian', 'business-insider-au',
            'guardian-rss', 'reuters-rss', 'bbc-rss'
        ]
    }
];

// ─── Setup ────────────────────────────────────────────────────────────────────

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const rssParser = new Parser({
    timeout: REQUEST_TIMEOUT,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
});

// ─── In-memory state ──────────────────────────────────────────────────────────

const newsCache = {
    articles: [],
    lastUpdated: null,
    isRefreshing: false
};

// Tracks consecutive failures per RSS source key
const sourceFailures = new Map();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if a source has failed 3+ times in a row */
function isSourceUnhealthy(sourceKey) {
    return (sourceFailures.get(sourceKey) || 0) >= 3;
}

function recordSourceSuccess(sourceKey) {
    sourceFailures.set(sourceKey, 0);
}

function recordSourceFailure(sourceKey) {
    sourceFailures.set(sourceKey, (sourceFailures.get(sourceKey) || 0) + 1);
}

/** Article age in hours from now */
function ageHours(publishedAt) {
    return (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;
}

/** Is this article within the MAX_AGE_HOURS window? */
function isFresh(publishedAt) {
    return ageHours(publishedAt) <= MAX_AGE_HOURS;
}

/** Strip HTML tags and truncate */
function cleanText(text = '', maxLen = 150) {
    return text.replace(/<[^>]*>/g, '').substring(0, maxLen) + (text.length > maxLen ? '...' : '');
}

/** Generate a placeholder image URL for a given source name */
function placeholderImage(sourceName = 'News') {
    const safe = sourceName.replace(/[^a-zA-Z0-9 ]/g, '');
    return `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(safe)}`;
}

/** Stable dedupe key for an article */
function articleKey(title, sourceName) {
    return crypto
        .createHash('md5')
        .update(`${title.trim().toLowerCase()}__${sourceName.trim().toLowerCase()}`)
        .digest('hex');
}

/** Is a URL from a blocked entertainment domain? */
function isBlockedUrl(url = '') {
    const lower = url.toLowerCase();
    for (const domain of BLOCKED_DOMAINS) {
        if (lower.includes(domain)) return true;
    }
    return false;
}

// ─── GNews fetch ──────────────────────────────────────────────────────────────

/**
 * Fetch up to 10 fresh articles from GNews for a given query + category.
 * Returns [] on any error.
 */
async function fetchFromGNews(query, categoryName) {
    if (!GNEWS_API_KEY) {
        console.warn('⚠️  GNEWS_API_KEY not set — skipping GNews.');
        return [];
    }

    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=au&max=10&apikey=${GNEWS_API_KEY}`;

    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);

        if (!res.ok) throw new Error(`GNews HTTP ${res.status}`);

        const data = await res.json();

        if (!Array.isArray(data.articles)) {
            if (data.errors) console.warn(`GNews error for ${categoryName}:`, data.errors);
            return [];
        }

        const seen = new Set();
        const articles = [];

        for (const a of data.articles) {
            if (!a.title || !a.url || !a.publishedAt) continue;
            if (isBlockedUrl(a.url)) continue;
            if (!isFresh(a.publishedAt)) continue;

            const key = articleKey(a.title, a.source?.name || 'GNews');
            if (seen.has(key)) continue;
            seen.add(key);

            articles.push({
                title: a.title.trim(),
                url: a.url.trim(),
                publishedAt: new Date(a.publishedAt).toISOString(),
                source: { name: a.source?.name || 'GNews' },
                category: categoryName,
                excerpt: cleanText(a.description || ''),
                image: a.image || placeholderImage(a.source?.name)
            });
        }

        console.log(`GNews: ${articles.length} fresh articles for ${categoryName}`);
        return articles;

    } catch (err) {
        console.error(`GNews failed for ${categoryName}:`, err.message);
        return [];
    }
}

// ─── RSS fetch ────────────────────────────────────────────────────────────────

/**
 * Fetch fresh articles from a single RSS source.
 * Returns [] if the source is unhealthy or errors.
 */
async function fetchFromRSS(sourceKey, categoryName) {
    if (isSourceUnhealthy(sourceKey)) {
        console.log(`Skipping unhealthy RSS source: ${sourceKey}`);
        return [];
    }

    const sourceConfig = newsSources[sourceKey];
    if (!sourceConfig || sourceConfig.type !== 'rss') return [];

    try {
        const feed = await rssParser.parseURL(sourceConfig.url);
        const articles = [];

        for (const item of (feed.items || [])) {
            if (!item.title || !item.link) continue;
            if (isBlockedUrl(item.link)) continue;

            const publishedAt = item.pubDate
                ? new Date(item.pubDate).toISOString()
                : new Date().toISOString();

            if (!isFresh(publishedAt)) continue;

            articles.push({
                title: item.title.trim(),
                url: item.link.trim(),
                publishedAt,
                source: { name: sourceConfig.name },
                category: categoryName,
                excerpt: cleanText(item.contentSnippet || item.content || ''),
                image: placeholderImage(sourceConfig.name)
            });
        }

        recordSourceSuccess(sourceKey);
        console.log(`RSS ${sourceConfig.name}: ${articles.length} fresh articles for ${categoryName}`);
        return articles;

    } catch (err) {
        recordSourceFailure(sourceKey);
        console.error(`RSS failed [${sourceKey}] for ${categoryName}:`, err.message);
        return [];
    }
}

// ─── Per-category refresh ─────────────────────────────────────────────────────

/**
 * Build 5 fresh articles for one category.
 * Priority: GNews → RSS sources (parallel) → safety-net placeholders
 */
async function refreshCategory(config) {
    const seen = new Set();
    const result = [];

    const addArticle = (a) => {
        if (result.length >= 5) return;
        const key = articleKey(a.title, a.source?.name || '');
        if (seen.has(key)) return;
        seen.add(key);
        result.push(a);
    };

    // 1. GNews
    const gnewsArticles = await fetchFromGNews(config.gnewsQuery, config.name);
    gnewsArticles.forEach(addArticle);

    // 2. RSS — fetch ALL configured sources in parallel, then fill gaps
    if (result.length < 5) {
        const rssResults = await Promise.allSettled(
            config.rssSources.map(key => fetchFromRSS(key, config.name))
        );

        // Flatten all RSS results, preserving source order for priority
        const rssArticles = rssResults
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value);

        rssArticles.forEach(addArticle);
    }

    // 3. Safety net — only fires if both GNews and RSS couldn't find 5 fresh articles
    if (result.length < 5) {
        console.warn(`⚠️  Safety net for ${config.name}: only ${result.length}/5 found`);
        const fallbackUrl = FALLBACK_URLS[config.name] || '#';
        const now = Date.now();
        const safetyArticles = [
            { offset: 0, title: `Latest ${config.name} News — ${new Date().toLocaleDateString('en-AU', { weekday: 'long' })}`, excerpt: `Stay informed with the latest ${config.name.toLowerCase()} updates.` },
            { offset: 3600000, title: `${config.name} Market Roundup`, excerpt: `Latest ${config.name.toLowerCase()} analysis and commentary for Australian investors.` },
            { offset: 7200000, title: `${config.name} Weekly Overview`, excerpt: `Weekly ${config.name.toLowerCase()} summary for value investors.` },
            { offset: 10800000, title: `${config.name} Investment Insights`, excerpt: `Expert ${config.name.toLowerCase()} insights from Graham & Doddsville.` },
            { offset: 14400000, title: `${config.name} News Update`, excerpt: `Current ${config.name.toLowerCase()} news and market commentary.` }
        ];
        for (const s of safetyArticles) {
            if (result.length >= 5) break;
            addArticle({
                title: s.title,
                url: fallbackUrl,
                publishedAt: new Date(now - s.offset).toISOString(),
                source: { name: 'Graham & Doddsville' },
                category: config.name,
                excerpt: s.excerpt,
                image: placeholderImage('Graham Doddsville')
            });
        }
    }

    return result;
}

// ─── Main refresh ─────────────────────────────────────────────────────────────

async function refreshNewsCache() {
    if (newsCache.isRefreshing) return;
    newsCache.isRefreshing = true;
    console.log('📰 Starting background news refresh...');
    const start = Date.now();

    try {
        // All 6 categories refresh in parallel
        const categoryResults = await Promise.allSettled(
            CATEGORIES.map(config => refreshCategory(config))
        );

        const allArticles = categoryResults
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        if (allArticles.length > 0) {
            newsCache.articles = allArticles;
            newsCache.lastUpdated = new Date().toISOString();
        }

        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`✅ Refresh done in ${elapsed}s — ${newsCache.articles.length} articles cached`);

    } catch (err) {
        console.error('❌ Background refresh failed:', err.message);
    } finally {
        newsCache.isRefreshing = false;
    }
}

// ─── Express app ──────────────────────────────────────────────────────────────

const app = express();

// Gzip compression — free performance win
app.use(compression());

// CORS
const corsOptions = {
    origin: IS_PROD
        ? ['https://graham-doddsville.onrender.com',
            'https://grahamanddoddsville.com.au',
            'https://l9rins.github.io']
        : 'http://localhost:3051',
    methods: ['GET', 'POST'],
    credentials: true,
    maxAge: 3600
};
app.use(cors(corsOptions));

// Rate limiting
app.use(rateLimit({
    windowMs: IS_PROD ? 15 * 60 * 1000 : 60 * 1000,
    max: IS_PROD ? 100 : 1000,
    message: 'Too many requests — please try again later.'
}));

app.use(express.json());

// Cache-control headers middleware
app.use((req, res, next) => {
    if (/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/.test(req.url)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/\.html$/.test(req.url)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    res.setHeader('Vary', 'Accept-Encoding');
    next();
});

// ─── API Routes ───────────────────────────────────────────────────────────────

// Status
app.get('/api/news/status', (_req, res) => {
    const cacheAgeMs = newsCache.lastUpdated
        ? Date.now() - new Date(newsCache.lastUpdated).getTime()
        : null;

    res.json({
        cacheAge: cacheAgeMs ? `${Math.floor(cacheAgeMs / 60000)} minutes` : 'not cached yet',
        articleCount: newsCache.articles.length,
        lastUpdated: newsCache.lastUpdated,
        nextRefresh: newsCache.lastUpdated
            ? new Date(new Date(newsCache.lastUpdated).getTime() + REFRESH_INTERVAL).toISOString()
            : null,
        gnewsEnabled: !!GNEWS_API_KEY
    });
});

// All news (main endpoint used by frontend)
app.get('/api/news', (_req, res) => {
    if (newsCache.articles.length === 0) {
        if (!newsCache.isRefreshing) refreshNewsCache();
        return res.json({
            articles: [],
            count: 0,
            lastUpdated: null,
            isCached: false,
            warning: 'Cache warming up — please refresh in a moment'
        });
    }

    res.json({
        articles: newsCache.articles,
        count: newsCache.articles.length,
        lastUpdated: newsCache.lastUpdated,
        isCached: true
    });
});

// By category
app.get('/api/news/category/:category', (req, res) => {
    if (newsCache.articles.length === 0) {
        return res.status(503).json({
            error: 'Service temporarily unavailable',
            message: 'Cache is warming up. Please try again shortly.',
            retryAfter: 60
        });
    }

    const cat = req.params.category.toLowerCase();
    const articles = newsCache.articles
        .filter(a => a.category?.toLowerCase() === cat)
        .slice(0, 20);

    res.json({ category: cat, articles, count: articles.length, lastUpdated: newsCache.lastUpdated });
});

// Regional news (Around the World sections)
app.get('/api/news/region/:region', async (req, res) => {
    const region = req.params.region.toLowerCase();
    const sourceKeys = regionalNewsSources[region];

    if (!sourceKeys) return res.status(404).json({ error: 'Region not found' });

    try {
        // Fetch all regional RSS sources in parallel
        const results = await Promise.allSettled(
            sourceKeys.map(key => fetchFromRSS(key, region))
        );

        const seen = new Set();
        const articles = results
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value)
            .filter(a => {
                const key = articleKey(a.title, a.source?.name || '');
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 5);

        res.json({ region, articles, count: articles.length, timestamp: new Date().toISOString() });

    } catch (err) {
        console.error(`Region ${region} error:`, err.message);
        res.status(500).json({ error: 'Failed to fetch regional news' });
    }
});

// Single source by ID (with file cache)
app.get('/api/news/:sourceId', async (req, res) => {
    const { sourceId } = req.params;
    const sourceConfig = newsSources[sourceId];
    if (!sourceConfig) return res.status(404).json({ error: 'Source not configured' });

    const cacheFile = path.join(CACHE_DIR, `${sourceId}.json`);

    // Serve from file cache if still fresh
    try {
        if (fs.existsSync(cacheFile)) {
            const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
            if (Date.now() - new Date(cached.timestamp).getTime() < SOURCE_FILE_TTL) {
                return res.json(cached);
            }
        }
    } catch { /* stale or corrupt cache — fall through */ }

    // Fetch fresh
    try {
        const feed = await rssParser.parseURL(sourceConfig.url);
        const data = {
            articles: feed.items.map(item => ({
                title: item.title,
                description: item.contentSnippet || item.content,
                url: item.link,
                publishedAt: item.pubDate,
                source: { name: sourceConfig.name }
            })),
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
        return res.json(data);

    } catch (err) {
        console.error(`[/api/news/${sourceId}] fetch failed:`, err.message);

        // Serve stale cache as fallback
        try {
            if (fs.existsSync(cacheFile)) {
                return res.json(JSON.parse(fs.readFileSync(cacheFile, 'utf8')));
            }
        } catch { /* nothing to serve */ }

        return res.status(500).json({ error: 'Failed to fetch source', source: sourceId });
    }
});

// Health check
app.get('/api/health', (_req, res) => {
    const unhealthySources = [...sourceFailures.entries()]
        .filter(([, failures]) => failures >= 3)
        .map(([key]) => key);

    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        gnews: {
            enabled: !!GNEWS_API_KEY,
            note: GNEWS_API_KEY ? 'GNews configured ✅' : '⚠️ GNEWS_API_KEY not set'
        },
        cache: {
            articles: newsCache.articles.length,
            lastUpdated: newsCache.lastUpdated,
            isRefreshing: newsCache.isRefreshing
        },
        sources: {
            total: Object.keys(newsSources).length,
            unhealthy: unhealthySources.length,
            unhealthyList: unhealthySources
        }
    });
});

// Cache clear (useful when debugging)
app.get('/api/cache/clear', (_req, res) => {
    newsCache.articles = [];
    newsCache.lastUpdated = null;
    newsCache.isRefreshing = false;
    sourceFailures.clear();
    res.json({ message: 'Cache cleared ✅' });
});

// ─── Static files ─────────────────────────────────────────────────────────────

app.use('/html', express.static(path.join(__dirname, 'public', 'html'), { setHeaders: noCache }));
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), { setHeaders: longCache }));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), { setHeaders: longCache }));
app.use('/images', express.static(path.join(__dirname, 'public', 'images'), { setHeaders: weekCache }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

function noCache(res) { res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); }
function longCache(res) { res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); }
function weekCache(res) { res.setHeader('Cache-Control', 'public, max-age=604800'); }

// ─── Error handlers ───────────────────────────────────────────────────────────

app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.path }));

app.use((err, req, res, _next) => {
    console.error('❌ Server Error:', err.message);
    res.status(err.status || 500).json({
        error: 'Server Error',
        message: IS_PROD ? 'An error occurred' : err.message
    });
});

process.on('uncaughtException', (err) => { console.error('💥 UNCAUGHT EXCEPTION:', err); process.exit(1); });
process.on('unhandledRejection', (err) => { console.error('💥 UNHANDLED REJECTION:', err); });

// ─── Start ────────────────────────────────────────────────────────────────────

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 GNews: ${GNEWS_API_KEY ? 'configured ✅' : '⚠️  not configured'}`);
});

server.on('error', (err) => console.error('Server error:', err));

// Kick off first refresh 2s after boot, then every 4 hours
setTimeout(() => {
    refreshNewsCache().catch(err => console.error('Initial refresh error:', err));

    const interval = setInterval(
        () => refreshNewsCache().catch(err => console.error('Refresh error:', err)),
        REFRESH_INTERVAL
    );
    interval.unref();
}, 2000);

module.exports = app;