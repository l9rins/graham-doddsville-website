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
const { newsSourcesData } = require('./news-sources-data');

// Build allowed domains mapping from newsSourcesData
function getDomain(urlString) {
    try {
        return new URL(urlString).hostname.replace(/^www\./, '');
    } catch (e) {
        return null;
    }
}
const globalAllowedDomains = new Set();
for (const [cat, sources] of Object.entries(newsSourcesData)) {
    sources.forEach(s => {
        const d = getDomain(s.url);
        if (d) globalAllowedDomains.add(d);
    });
}


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
const PORT = process.env.PORT || 4012;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '6d122bb10581490591ee20ade119ec27';
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Performance optimization constants
const MAX_CONCURRENT_REQUESTS = 5;
const REQUEST_TIMEOUT = 8000;
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours
const MAX_ARTICLES_PER_SOURCE = 50;

// CACHE SETTINGS
const CACHE_DIR = path.join(__dirname, 'news-cache');
const RSS_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}


function isDomainAllowed(url) {
    try {
        if (!url) return false;
        const urlObj = new URL(url);
        let host = urlObj.hostname.toLowerCase();
        if (host.startsWith('www.')) host = host.substring(4);
        if (host.startsWith('www1.')) host = host.substring(5);
        return CREDIBLE_DOMAINS.some(domain => host === domain || host.endsWith('.' + domain));
    } catch(e) { return false; }
}

const CREDIBLE_DOMAINS = [
    "abc.net.au",
    "ausbanking.org.au",
    "accc.gov.au",
    "asiatimes.com",
    "africanews.com",
    "canberratimes.com.au",
    "superannuation.asn.au",
    "berkshirehathaway.com",
    "afca.org.au",
    "bloomberg.com",
    "bbc.com",
    "business-standard.com",
    "arabianbusiness.com",
    "heraldsun.com.au",
    "marketwatch.com",
    "apra.gov.au",
    "cbsnews.com",
    "channelnewsasia.com",
    "egypttoday.com",
    "moneymanagement.com.au",
    "crikey.com.au",
    "cnbc.com",
    "asic.gov.au",
    "chicagotribune.com",
    "chinadaily.com.cn",
    "morningstar.com.au",
    "dfat.gov.au",
    "financialstandard.com.au",
    "nydailynews.com",
    "ato.gov.au",
    "eubusiness.com",
    "eastasiaforum.org",
    "folha.uol.com.br",
    "news.com.au",
    "faaa.au",
    "entrepreneur.com",
    "austrac.gov.au",
    "edition.cnn.com",
    "euronews.com",
    "financeasia.com",
    "gulfnews.com",
    "9news.com.au",
    "macrobusiness.com.au",
    "daily.fattail.com.au",
    "forbes.com",
    "frc.gov.au",
    "financialpost.com",
    "euroweeklynews.com",
    "focustaiwan.tw",
    "iol.co.za",
    "perthnow.com.au",
    "fsadvice.com.au",
    "foxbusiness.com",
    "fsc.org.au",
    "fortune.com",
    "japantoday.com",
    "khaleejtimes.com",
    "sharecafe.com.au",
    "fsmanagedaccounts.com.au",
    "gurufocus.com",
    "foreigninvestment.gov.au",
    "imf.org",
    "asia.nikkei.com",
    "mg.co.za",
    "smh.com.au",
    "7news.com.au",
    "fsprivatewealth.com.au",
    "huffpost.com",
    "oaic.gov.au",
    "theglobeandmail.com",
    "independent.co.uk",
    "shine.cn",
    "skynews.com.au",
    "fssuper.com.au",
    "hbr.org",
    "rba.gov.au",
    "nltimes.nl",
    "scmp.com",
    "nzherald.co.nz",
    "markets.businessinsider.com",
    "treasury.gov.au",
    "investors.com",
    "baltictimes.com",
    "asianage.com",
    "thenationalnews.com",
    "adelaidenow.com.au",
    "inc.com",
    "nbcnews.com",
    "budapesttimes.hu",
    "chosun.com",
    "thepeninsulaqatar.com",
    "theage.com.au",
    "investordaily.com.au",
    "nypost.com",
    "thediplomat.com",
    "riotimesonline.com",
    "theaustralian.com.au",
    "mckinsey.com",
    "newsweek.com",
    "nytimes.com",
    "theguardian.com",
    "japannews.yomiuri.co.jp",
    "thisdaylive.com",
    "thebull.com.au",
    "time.com",
    "themoscowtimes.com",
    "japantimes.co.jp",
    "couriermail.com.au",
    "usnews.com",
    "usanews.com",
    "thesun.co.uk",
    "koreatimes.co.kr",
    "usatoday.com",
    "thestandard.com.hk",
    "theguardian.com.au",
    "thewest.com.au",
    "thestar.com.my",
    "watoday.com.au",
    "washingtonpost.com",
    "straitstimes.com"
];

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 1000 : 500,
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
        : ['http://localhost:4012', 'http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST'],
    credentials: true,
    maxAge: 3600
};

app.use(cors(corsOptions));
app.use(express.json());

// Deduplication helpers
function generateArticleHash(title, source, publishedAt) {
    const content = `${title.trim().toLowerCase()}_${source.trim().toLowerCase()}_${new Date(publishedAt).toDateString()}`;
    return crypto.createHash('sha256').update(content).digest('hex');
}

function isArticleValid(article, category = null) {
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

    const cat = (category || article.category || '').trim();
    let maxHours = 72;
    if (['Companies', 'Markets', 'Economy', 'Industry'].includes(cat)) {
        maxHours = 48;
    } else if (['Regulatory', 'Guru Watch'].includes(cat)) {
        maxHours = 168;
    }

    if (hoursDiff > maxHours) return false;

    return true;
}

function deduplicateArticles(articles) {
    const uniqueArticles = [];
    const seenHashes = new Set();
    const seenTitles = new Map();

    function normalizeTitle(title) {
        return title.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by|from|as|is|was|are|were|has|have|had|be|been|being|not|no|its|it|this|that|these|those|will|would|can|could|should|may|might|shall|do|does|did)\b/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function wordOverlapRatio(title1, title2) {
        const words1 = new Set(title1.split(' ').filter(w => w.length > 2));
        const words2 = new Set(title2.split(' ').filter(w => w.length > 2));
        if (words1.size === 0 || words2.size === 0) return 0;
        let overlap = 0;
        for (const word of words1) {
            if (words2.has(word)) overlap++;
        }
        return overlap / Math.max(words1.size, words2.size);
    }

    for (const article of articles) {
        const sourceName = article.source?.name || article.source || '';
        const hash = generateArticleHash(article.title, sourceName, article.publishedAt);
        if (seenHashes.has(hash) || articleHashes.has(hash)) continue;

        const normalized = normalizeTitle(article.title);
        let isDuplicate = false;
        for (const [seenTitle, _] of seenTitles) {
            if (wordOverlapRatio(normalized, seenTitle) > 0.8) {
                isDuplicate = true;
                break;
            }
        }
        if (isDuplicate) continue;

        seenHashes.add(hash);
        articleHashes.add(hash);
        seenTitles.set(normalized, uniqueArticles.length);
        uniqueArticles.push(article);
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

function extractImageFromDescription(description) {
    if (!description) return null;
    const patterns = [
        /<img[^>]+src="([^">]+)"/i,
        /<img[^>]+src='([^'>]+)'/i,
        /!\[.*?\]\((https?:\/\/[^)\s]+)\)/i,
        /(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s"'<>]*)?)/i
    ];
    for (const pattern of patterns) {
        const match = description.match(pattern);
        if (match && match[1] && !match[1].includes('placehold') && !match[1].includes('icon')) {
            return match[1];
        }
    }
    return null;
}

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
            const linkRaw = item.getElementsByTagName('link')[0]?.textContent || '';
            const sourceUrlElement = item.getElementsByTagName('source')[0];
            const sourceUrl = sourceUrlElement ? sourceUrlElement.getAttribute('url') : '';
            const link = (linkRaw.includes('news.google.com') && sourceUrl) ? sourceUrl : linkRaw;
            const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';

            if (title && link) {
                let imageUrl = null;

                const mediaContent = item.getElementsByTagName('media:content')[0];
                if (mediaContent) imageUrl = mediaContent.getAttribute('url');

                if (!imageUrl) {
                    const mediaThumbnail = item.getElementsByTagName('media:thumbnail')[0];
                    if (mediaThumbnail) imageUrl = mediaThumbnail.getAttribute('url');
                }

                if (!imageUrl) {
                    const enclosure = item.getElementsByTagName('enclosure')[0];
                    if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
                        imageUrl = enclosure.getAttribute('url');
                    }
                }

                if (!imageUrl && description) {
                    const ogImageMatch = description.match(/property="og:image"[^>]*content="([^">]+)"/i)
                        || description.match(/content="([^">]+)"[^>]*property="og:image"/i)
                        || description.match(/name="twitter:image"[^>]*content="([^">]+)"/i)
                        || description.match(/content="([^">]+)"[^>]*name="twitter:image"/i);
                    if (ogImageMatch) imageUrl = ogImageMatch[1];
                }

                if (!imageUrl && description) {
                    imageUrl = extractImageFromDescription(description);
                }

                let cleanedDescription = description || '';
                cleanedDescription = cleanedDescription.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
                cleanedDescription = cleanedDescription.replace(/<[^>]*>/g, '');
                cleanedDescription = cleanedDescription.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
                cleanedDescription = cleanedDescription.replace(/\s+/g, ' ').trim();

                const category = (defaultCategory && ['Industry', 'Regulatory', 'Technology', 'Guru Watch', 'Economy', 'Markets', 'Companies'].includes(defaultCategory))
                    ? defaultCategory
                    : categorizeNews(title + ' ' + description + ' ' + sourceName);

                articles.push({
                    title: title.trim(),
                    excerpt: cleanedDescription ? cleanedDescription.substring(0, 200) + (cleanedDescription.length > 200 ? '...' : '') : '',
                    content: cleanedDescription,
                    url: link.trim(),
                    image: imageUrl || generatePlaceholderImage(sourceName),
                    category: category,
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
    if (lowerContent.includes('rba') || lowerContent.includes('reserve bank') || lowerContent.includes('interest rate decision') || lowerContent.includes('monetary policy') || lowerContent.includes('regulation') || lowerContent.includes('regulator') || lowerContent.includes('asic') || lowerContent.includes('apra')) return 'Regulatory';
    if (lowerContent.includes('buffett') || lowerContent.includes('munger') || lowerContent.includes('graham') || lowerContent.includes('soros') || lowerContent.includes('druckenmiller') || lowerContent.includes('guru') || lowerContent.includes('legendary investor') || lowerContent.includes('warren')) return 'Guru Watch';
    if (lowerContent.includes('asx') || lowerContent.includes('all ordinaries') || lowerContent.includes('s&p/asx') || lowerContent.includes('stock exchange') || lowerContent.includes('trading halt') || lowerContent.includes('market close') || lowerContent.includes('market update') || lowerContent.includes('share price') || lowerContent.includes('equities')) return 'Markets';
    if (lowerContent.includes('gdp') || lowerContent.includes('inflation') || lowerContent.includes('cpi') || lowerContent.includes('unemployment') || lowerContent.includes('employment') || lowerContent.includes('economic growth') || lowerContent.includes('recession') || lowerContent.includes('economic outlook') || lowerContent.includes('trade balance') || lowerContent.includes('household spending')) return 'Economy';
    if (lowerContent.includes('company') || lowerContent.includes('corporate') || lowerContent.includes('startup') || lowerContent.includes('quarterly results') || lowerContent.includes('earnings') || lowerContent.includes('profit') || lowerContent.includes('revenue') || lowerContent.includes('dividend') || lowerContent.includes('shareholder') || lowerContent.includes('annual report') || lowerContent.includes('ceo') || lowerContent.includes('board')) return 'Companies';
    if (lowerContent.includes('mining') || lowerContent.includes('manufacturing') || lowerContent.includes('construction') || lowerContent.includes('resources') || lowerContent.includes('bhp') || lowerContent.includes('rio tinto') || lowerContent.includes('fortescue') || lowerContent.includes('sector') || lowerContent.includes('commodity')) return 'Industry';
    if (lowerContent.includes('property') || lowerContent.includes('housing') || lowerContent.includes('real estate') || lowerContent.includes('mortgage') || lowerContent.includes('house prices') || lowerContent.includes('residential') || lowerContent.includes('commercial property') || lowerContent.includes('rental')) return 'Property';
    if (lowerContent.includes('bank') || lowerContent.includes('cba') || lowerContent.includes('westpac') || lowerContent.includes('anz') || lowerContent.includes('nab') || lowerContent.includes('macquarie') || lowerContent.includes('financial') || lowerContent.includes('fund') || lowerContent.includes('finance') || lowerContent.includes('lending') || lowerContent.includes('credit')) return 'Banking';
    if (lowerContent.includes('tech') || lowerContent.includes('ai') || lowerContent.includes('artificial intelligence') || lowerContent.includes('digital') || lowerContent.includes('software') || lowerContent.includes('cyber') || lowerContent.includes('cloud') || lowerContent.includes('semiconductor') || lowerContent.includes('atlassian')) return 'Technology';
    if (lowerContent.includes('oil') || lowerContent.includes('gas') || lowerContent.includes('lpg') || lowerContent.includes('santos') || lowerContent.includes('woodside') || lowerContent.includes('lng')) return 'Energy';
    if (lowerContent.includes('energy') || lowerContent.includes('renewable') || lowerContent.includes('solar') || lowerContent.includes('wind farm') || lowerContent.includes('coal') || lowerContent.includes('clean energy')) return 'Energy';
    if (lowerContent.includes('super') || lowerContent.includes('retirement') || lowerContent.includes('pension') || lowerContent.includes('superannuation') || lowerContent.includes('self-managed super')) return 'Superannuation';
    if (lowerContent.includes('retail') || lowerContent.includes('consumer') || lowerContent.includes('shopping') || lowerContent.includes('woolworths') || lowerContent.includes('coles') || lowerContent.includes('bunnings')) return 'Consumer';
    if (lowerContent.includes('investment') || lowerContent.includes('portfolio') || lowerContent.includes('asset allocation') || lowerContent.includes('etf') || lowerContent.includes('managed fund')) return 'Investment';
    if (lowerContent.includes('market') || lowerContent.includes('stock') || lowerContent.includes('trading') || lowerContent.includes('share') || lowerContent.includes('index')) return 'Markets';
    if (lowerContent.includes('industry') || lowerContent.includes('sector')) return 'Industry';
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

app.use('/api', limiter);

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
    console.log('📰 Starting background news refresh...');

    try {
        const categoriesConfig = [
            { category: 'Companies', query: 'companies' },
            { category: 'Markets', query: 'markets' },
            { category: 'Economy', query: 'economy' },
            { category: 'Industry', query: 'industry' },
            { category: 'Regulatory', query: 'regulatory' },
            { category: 'Guru Watch', query: 'guru-watch' }
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
            await new Promise(resolve => setTimeout(resolve, index * 1000));
            let validArticles = [];

            console.log(`Fetching from NewsAPI for ${config.category}`);

            try {
                // Get up to 20 domains to avoid URL length limits
                const domainsParam = Array.from(globalAllowedDomains).slice(0, 20).join(',');
                const query = encodeURIComponent(config.query);
                const url = `https://newsapi.org/v2/everything?q=${query}&domains=${domainsParam}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWSAPI_KEY}`;
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`NewsAPI responded with status ${response.status}`);
                }
                const data = await response.json();
                
                if (data.status === 'ok' && data.articles) {
                    for (const item of data.articles) {
                        if (!item.title || !item.url || item.title === '[Removed]') continue;

                        validArticles.push({
                            title: item.title,
                            url: item.url,
                            publishedAt: item.publishedAt,
                            source: { name: item.source.name || 'NewsAPI' },
                            category: config.category,
                            excerpt: item.description,
                            image: item.urlToImage || generatePlaceholderImage(item.source.name || 'NewsAPI')
                        });
                    }
                }
            } catch (err) {
                console.error(`NewsAPI failed for ${config.category}:`, err.message);
            }

            if (validArticles.length === 0) {
                console.log(`Safety net triggered for ${config.category}: 0 articles found`);
                validArticles.push({
                    title: `Latest ${config.category} News`,
                    url: fallbackUrls[config.category] || 'https://grahamanddoddsville.com.au',
                    publishedAt: new Date().toISOString(),
                    source: { name: 'Graham & Doddsville' },
                    category: config.category,
                    excerpt: `Visit our curated ${config.category.toLowerCase()} news sources for the latest updates.`
                });
            }

            return validArticles.slice(0, 20);
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
        console.error('❌ Background refresh failed:', error.message);
    } finally {
        newsCache.isRefreshing = false;
        console.log(`✅ Background refresh completed: ${newsCache.articles.length} articles cached`);
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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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