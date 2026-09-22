const Parser = require('rss-parser');
const cheerio = require('cheerio');
const crypto = require('crypto');
const fs = require('fs');
const fetch = require('node-fetch');

const { newsSourcesData } = require('./news-sources-data.js');
let rssMap = {};
try {
    rssMap = JSON.parse(fs.readFileSync('./news-rss-map.json', 'utf8'));
} catch (e) {
    console.error("No RSS map found!");
}

const parser = new Parser({
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 8000
});

// Guru Watch sources in the client spreadsheet are all "Warren Buffett" search/topic
// pages. Their RSS equivalents are broader, so keep only items about the investors.
const GURU_TERMS = ['buffett', 'berkshire', 'munger', 'greg abel', 'dalio', 'ackman', 'burry',
    'klarman', 'howard marks', 'icahn', 'druckenmiller', 'soros', 'hedge fund',
    'investor letter', 'shareholder letter', '13f'];

function isGuruArticle(article) {
    const text = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    return GURU_TERMS.some(term => text.includes(term));
}

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

// Scrapers for regulatory sites

async function scrapeRBA() {
    try {
        const res = await fetch('https://www.rba.gov.au/news/', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(15000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        const seen = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('/media-releases/202')) {
                const title = $(el).text().trim();
                let link = href.startsWith('http') ? href : 'https://www.rba.gov.au' + href;
                if (title && title.length > 10 && !seen.has(link)) {
                    seen.add(link);
                    articles.push({
                        title,
                        url: link,
                        source: { name: 'Reserve Bank of Australia' },
                        publishedAt: new Date().toISOString(),
                        category: 'regulatory'
                    });
                }
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('RBA Scraper error:', e.message); return []; }
}

async function scrapeACCC() {
    try {
        const res = await fetch('https://www.accc.gov.au/about-us/media/media-releases', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 15000 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        const seen = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('media-release')) {
                const title = $(el).text().trim();
                let link = href.startsWith('http') ? href : 'https://www.accc.gov.au' + href;
                if (title && title.length > 15 && !title.toLowerCase().includes('subscribe') && !seen.has(link)) {
                    seen.add(link);
                    articles.push({
                        title,
                        url: link,
                        source: { name: 'ACCC' },
                        publishedAt: new Date().toISOString(),
                        category: 'regulatory'
                    });
                }
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('ACCC Scraper error:', e.message); return []; }
}

async function scrapeATO() {
    try {
        const res = await fetch('https://www.ato.gov.au/media-centre', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(15000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        const seen = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('media-releases')) {
                const title = $(el).text().trim();
                let link = href.startsWith('http') ? href : 'https://www.ato.gov.au' + href;
                if (title && title.length > 15 && !seen.has(link)) {
                    seen.add(link);
                    articles.push({
                        title,
                        url: link,
                        source: { name: 'ATO' },
                        publishedAt: new Date().toISOString(),
                        category: 'regulatory'
                    });
                }
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('ATO Scraper error:', e.message); return []; }
}

async function scrapeAUSTRAC() {
    try {
        const res = await fetch('https://www.austrac.gov.au/news-and-media/media-release', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(15000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        const seen = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('media-release')) {
                const title = $(el).text().trim();
                let link = href.startsWith('http') ? href : 'https://www.austrac.gov.au' + (href.startsWith('/') ? '' : '/') + href;
                if (title && title.length > 15 && !seen.has(link)) {
                    seen.add(link);
                    articles.push({
                        title,
                        url: link,
                        source: { name: 'AUSTRAC' },
                        publishedAt: new Date().toISOString(),
                        category: 'regulatory'
                    });
                }
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('AUSTRAC Scraper error:', e.message); return []; }
}


async function scrapeAFCA() {
    try {
        const res = await fetch('https://www.afca.org.au/news/media-releases', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(15000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        const seen = new Set();
        $('.view-news-events .views-row').each((i, el) => {
            const a = $(el).find('h3 a').first();
            const title = a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.afca.org.au' + link;
            const dateStr = $(el).find('.date-display-single').text().trim();
            if (title && link && !seen.has(link)) {
                seen.add(link);
                articles.push({
                    title,
                    url: link,
                    source: { name: 'AFCA' },
                    publishedAt: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
                    category: 'regulatory'
                });
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('AFCA Scraper error:', e.message); return []; }
}

async function scrapeFSC() {
    try {
        const res = await fetch('https://fsc.org.au/news', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(8000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('h3 a, h2 a, h4 a, .news-title a').each((i, el) => {
            const title = $(el).text().trim();
            const link = $(el).attr('href');
            if (title && link) {
                let fullLink = link.startsWith('http') ? link : 'https://fsc.org.au' + (link.startsWith('/') ? '' : '/') + link;
                articles.push({
                    title,
                    url: fullLink,
                    source: { name: 'FSC' },
                    publishedAt: new Date().toISOString(),
                    category: 'regulatory'
                });
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('FSC Scraper error:', e.message); return []; }
}



// Maximum article age per section (Guru Watch matches the homepage's 30-day backfill).
// Regulatory releases and Guru Watch items are published less often.
const MAX_AGE_DAYS = { regulatory: 7, 'guru-watch': 30 };
const DEFAULT_MAX_AGE_DAYS = 3;

function isQualityArticle(article, category) {
    if (!article || !article.title) return false;
    const t = article.title.toLowerCase();

    // 1. Length check
    if (t.length < 15) return false;

    // Scraped navigation links, not articles
    if (/^(latest )?(news|media)( and | & )?(media )?releases?$/.test(t.trim())) return false;

    // 2. Keyword Blocklist
    const badWords = [
        'subscribe to read', 'paywall', 'podcast:', 'watch live', 'crossword',
        'sudoku', 'wordle', 'quiz', 'kardashian', 'taylor swift', 'prince harry',
        'meghan markle', 'daily briefing'
    ];
    for (const w of badWords) {
        if (t.includes(w)) return false;
    }

    // 3. Date check
    if (article.publishedAt) {
        const maxAgeDays = MAX_AGE_DAYS[category] || DEFAULT_MAX_AGE_DAYS;
        const cutoff = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000);
        if (new Date(article.publishedAt) < cutoff) return false;
    }

    return true;
}

// Format payload strictly
function formatArticle(article, category) {
    if (!article.title || !article.url) return null;
    if (!isQualityArticle(article, category)) return null;
    return {
        title: article.title.trim(),
        url: article.url.trim(),
        source: { name: article.source?.name || article.source || 'News' },
        publishedAt: article.publishedAt,
        category: category
    };
}

// Deduplication
function deduplicateAll(allArticles) {
    const finalArticles = [];
    const seenTitles = [];

    // Process in order, later categories won't get duplicates of earlier ones
    for (const article of allArticles) {
        const norm = normalizeTitle(article.title);
        let isDup = false;
        for (const seen of seenTitles) {
            if (wordOverlapRatio(norm, seen) > 0.75) {
                isDup = true;
                break;
            }
        }
        if (!isDup) {
            seenTitles.push(norm);
            finalArticles.push(article);
        }
    }
    return finalArticles;
}

async function buildHybridPipeline() {
    let allArticles = [];

    console.log('Starting hybrid news pipeline fetch...');

    const { matchesRegion, GLOBAL_SOURCES_NEEDING_FILTER } = require('./region-keywords');

    const fetchPromises = [];

    // Structure to track counts per source for canary health checks
    const sourceTracker = {};

    // A feed listed under several columns (e.g. Money Management under Companies and
    // Markets) is fetched once and its items dealt out between those columns, so one
    // section can't claim every item before deduplication.
    const feedCache = {};
    const feedColumns = {};
    for (const [category, sources] of Object.entries(newsSourcesData)) {
        for (const s of sources) {
            const feedUrl = rssMap[s.url];
            if (!feedUrl) continue;
            (feedColumns[feedUrl] ??= []);
            // Guru Watch takes every guru item from a shared feed; the rest is split.
            if (category === 'guru-watch') feedColumns[feedUrl].guru = true;
            else feedColumns[feedUrl].push(category);
        }
    }
    function fetchFeed(feedUrl, sourceName) {
        return feedCache[feedUrl] ??= parser.parseURL(feedUrl)
            .then(feed => feed.items)
            .catch(e => { console.error('RSS error for', sourceName, ':', e.message); return []; });
    }

    // Every article belongs to the section (spreadsheet column) its source is listed under.
    for (const [category, sources] of Object.entries(newsSourcesData)) {
        for (const s of sources) {
            fetchPromises.push((async () => {
                let fetched = [];
                const feedUrl = rssMap[s.url];
                if (feedUrl) {
                    const columns = feedColumns[feedUrl];
                    let items = (await fetchFeed(feedUrl, s.name))
                        .filter(item => !isNaN(new Date(item.isoDate || item.pubDate))); // undated items would show as "just now"
                    if (category !== 'guru-watch') {
                        if (columns.guru) items = items.filter(item => !isGuruArticle({ title: item.title, description: item.contentSnippet }));
                        const share = columns.indexOf(category);
                        items = items.filter((item, i) => i % columns.length === share);
                    }
                    fetched = items
                        .slice(0, 20)
                        .map(item => ({
                            title: item.title,
                            url: item.link,
                            description: item.contentSnippet || '',
                            source: { name: s.name },
                            publishedAt: new Date(item.isoDate || item.pubDate).toISOString()
                        }));
                } else if (category === 'regulatory') {
                    if (s.name === 'Reserve Bank of Australia') fetched = await scrapeRBA();
                    else if (s.name === 'ACCC') fetched = await scrapeACCC();
                    else if (s.name === 'ATO') fetched = await scrapeATO();
                    else if (s.name === 'AUSTRAC') fetched = await scrapeAUSTRAC();
                    else if (s.name === 'Financial Services Council') fetched = await scrapeFSC();
                    else if (s.name === 'AFCA') fetched = await scrapeAFCA();
                }

                // Label items with the source name as it appears in the spreadsheet
                fetched = fetched.map(a => ({ ...a, source: { name: s.name } }));

                // Relevance filters drop items; they never move them to another section.
                if (category === 'guru-watch') {
                    fetched = fetched.filter(isGuruArticle);
                } else if (GLOBAL_SOURCES_NEEDING_FILTER.includes(s.name) &&
                    ['north-america', 'europe', 'asia', 'elsewhere'].includes(category)) {
                    fetched = fetched.filter(a => matchesRegion(((a.title || '') + ' ' + (a.description || '')).trim(), category));
                }

                // Track counts for canary check
                sourceTracker[s.name] = (sourceTracker[s.name] || 0) + fetched.length;

                allArticles.push(...fetched.map(a => formatArticle(a, category)).filter(Boolean));
            })());
        }
    }
    await Promise.allSettled(fetchPromises);

    // Canary Health Check
    for (const [sourceName, count] of Object.entries(sourceTracker)) {
        if (count === 0) {
            console.warn(`[CANARY WARNING] Source "${sourceName}" returned 0 articles. This may indicate a broken scraper, dead RSS feed, or severe 403 block.`);
        }
    }

    // Sort by date before dedup to keep freshest
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const deduped = deduplicateAll(allArticles);
    console.log(`Pipeline complete. Filtered ${allArticles.length} -> ${deduped.length} unique articles.`);
    return deduped;
}

module.exports = { buildHybridPipeline };
