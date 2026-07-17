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

// Dedicated value-investing blogs are often hosted on small infrastructure
// and consistently time out at 8000ms. Give them a longer leash.
const slowFeedSources = ['Acquirers Multiple', 'Value and Opportunity', 'Safal Niveshak'];
const slowParser = new Parser({
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 15000
});

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

async function scrapeAFR() {
    try {
        const res = await fetch('https://www.afr.com/', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(15000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        const seen = new Set();
        $('h3 a').each((i, el) => {
            const href = $(el).attr('href');
            if (href) {
                const title = $(el).text().trim();
                let link = href.startsWith('http') ? href : 'https://www.afr.com' + href;
                if (title && title.length > 15 && !seen.has(link)) {
                    seen.add(link);
                    articles.push({
                        title,
                        url: link,
                        source: { name: 'AFR' },
                        publishedAt: new Date().toISOString(), // scoped to headline + url + date
                        category: 'companies' // Will be re-categorized in buildHybridPipeline if needed
                    });
                }
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('AFR Scraper error:', e.message); return []; }
}

async function scrapeBloomberg() {
    try {
        // Simple scraper for Bloomberg targeting business/finance headlines
        const res = await fetch('https://www.bloomberg.com/', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(15000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        const seen = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('/news/articles/') || href.includes('/news/features/'))) {
                const title = $(el).text().trim();
                let link = href.startsWith('http') ? href : 'https://www.bloomberg.com' + href;
                if (title && title.length > 20 && !seen.has(link)) {
                    seen.add(link);
                    articles.push({
                        title,
                        url: link,
                        source: { name: 'Bloomberg' },
                        publishedAt: new Date().toISOString(),
                        category: 'companies'
                    });
                }
            }
        });
        return articles.slice(0, 20);
    } catch(e) { console.error('Bloomberg Scraper error:', e.message); return []; }
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



function isQualityArticle(article) {
    if (!article || !article.title) return false;
    const t = article.title.toLowerCase();
    
    // 1. Length check
    if (t.length < 15) return false;
    
    // 2. Keyword Blocklist
    const badWords = [
        'subscribe to read', 'paywall', 'podcast:', 'watch live', 'crossword', 
        'sudoku', 'wordle', 'quiz', 'kardashian', 'taylor swift', 'prince harry', 
        'meghan markle', 'daily briefing'
    ];
    for (const w of badWords) {
        if (t.includes(w)) return false;
    }
    
    // 3. Date check (Reject if older than 3 days)
    if (article.publishedAt) {
        const publishedDate = new Date(article.publishedAt);
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        
        // Evergreen Exception: Dedicated value investing blogs have lower cadences
        // and their content remains relevant for weeks, so we exempt them from the 3-day rule.
        const sourceName = article.source?.name || article.source;
        const evergreenSources = ['Acquirers Multiple', 'Value and Opportunity', 'Safal Niveshak'];
        const isEvergreen = evergreenSources.includes(sourceName);
        
        if (!isEvergreen && publishedDate < threeDaysAgo) return false;
    }
    
    return true;
}

// Format payload strictly
function formatArticle(article, category) {
    if (!article.title || !article.url) return null;
    if (!isQualityArticle(article)) return null;
    return {
        title: article.title.trim(),
        url: article.url.trim(),
        source: { name: article.source?.name || article.source || 'News' },
        publishedAt: article.publishedAt,
        category: category
    };
}

// Deduplication
function categorizeNews(title, description, sourceName) {
    const text = ((title || '') + ' ' + (description || '')).toLowerCase();
    const source = (sourceName || '').toLowerCase();

    if (text.includes('buffett') || text.includes('berkshire') || text.includes('munger') ||
        text.includes('dalio') || text.includes('ackman') || text.includes('burry') ||
        text.includes('hedge fund') || text.includes('investor letter') ||
        text.includes('13f') || text.includes('shareholder letter')) {
        return 'guru-watch';
    }

    if (text.includes('asx') || text.includes('nasdaq') || text.includes('s&p 500') ||
        text.includes('dow jones') || text.includes('stock market') || text.includes('wall st') ||
        text.includes('share market') || text.includes('index closed') || text.includes('market rally') ||
        text.includes('market plunge')) {
        return 'markets';
    }

    if (text.includes('rba') || text.includes('reserve bank') || text.includes('asic') ||
        text.includes('accc') || text.includes('tax') || text.includes('law') ||
        text.includes('legislation') || text.includes('government') || text.includes('policy') ||
        text.includes('compliance') || text.includes('court') || text.includes('fine') ||
        text.includes('ban') || text.includes('penalty') || text.includes('regulator') ||
        source.includes('ato') || source.includes('austrac') || source.includes('afca') || source.includes('fsc') ||
        source.includes('rba') || source.includes('reserve bank') || source.includes('accc') || source.includes('asic')) {
        return 'regulatory';
    }

    if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') ||
        text.includes('interest rate') || text.includes('cpi') || text.includes('unemployment') ||
        text.includes('jobs') || text.includes('recession') || text.includes('growth') ||
        text.includes('fiscal') || text.includes('trade deficit') || text.includes('dollar')) {
        return 'economy';
    }

    if (text.includes('mining') || text.includes('banking') || text.includes('retail') ||
        text.includes('tech') || text.includes('healthcare') || text.includes('energy') ||
        text.includes('resources') || text.includes('construction') || text.includes('property') ||
        text.includes('real estate') || text.includes('sector')) {
        return 'industry';
    }
    
    // Add explicitly known companies keywords here
    const companyKeywords = ['company', 'shares', 'stock', 'dividend', 'profit', 'revenue', 
                             'earnings', 'deal', 'acquisition', 'merger', 'ceo', 'appoint', 
                             'strike', 'workers', 'port', 'wages', 'bid', 'offer', 'venture', 
                             'investment', 'fum', 'fua'];
    const companyRegex = new RegExp(`\\b(?:${companyKeywords.join('|')})\\b`, 'i');
    if (companyRegex.test(text)) {
        return 'companies';
    }

    return 'other'; // Default to other if no specific match, unless region overrides later
}

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
    
    // 1. Guru Watch via Google News RSS has been removed
    // 2. Mainstream Failures via Google News RSS has been removed

    const { matchesRegion, GLOBAL_SOURCES_NEEDING_FILTER } = require('./region-keywords');
    
    // 3. RSS and Scrapers for other categories (CONCURRENT FETCHING)
    const fetchPromises = [];
    
    // Structure to track counts per source for canary health checks
    const sourceTracker = {};

    for (const [category, sources] of Object.entries(newsSourcesData)) {
        for (const s of sources) {
            fetchPromises.push((async () => {
                let fetched = [];
                if (rssMap[s.url]) {
                    try {
                        const activeParser = slowFeedSources.includes(s.name) ? slowParser : parser;
                        const feed = await activeParser.parseURL(rssMap[s.url]);
                        fetched = feed.items.slice(0, 20).map(item => ({
                            title: item.title,
                            url: item.link,
                            source: { name: s.name },
                            publishedAt: item.pubDate || item.isoDate || new Date().toISOString()
                        }));
                    } catch(e) {
                        console.error('RSS error for', s.name, ':', e.message);
                    }
                } else if (category === 'regulatory') {
                    if (s.name === 'Reserve Bank of Australia') fetched = await scrapeRBA();
                    else if (s.name === 'ACCC') fetched = await scrapeACCC();
                    else if (s.name === 'ATO') fetched = await scrapeATO();
                    else if (s.name === 'AUSTRAC') fetched = await scrapeAUSTRAC();
                    else if (s.name === 'Financial Services Council') fetched = await scrapeFSC();
                    else if (s.name === 'AFCA') fetched = await scrapeAFCA();
                } else if (s.name === 'AFR') {
                    fetched = await scrapeAFR();
                } else if (s.name === 'Bloomberg') {
                    fetched = await scrapeBloomberg();
                }
                
                // Track counts for canary check
                const actualCount = fetched.length;
                sourceTracker[s.name] = (sourceTracker[s.name] || 0) + actualCount;
                
                allArticles.push(...fetched.map(a => {
                    // Categorize purely by content
                    let assignedCategory = categorizeNews(a.title, a.description, a.source?.name);
                    
                    // Apply regional grouping if it originally belonged to a region (Regions take precedence)
                    if (['north-america', 'europe', 'asia', 'elsewhere'].includes(category)) {
                        assignedCategory = category;
                        if (GLOBAL_SOURCES_NEEDING_FILTER.includes(s.name)) {
                            const contentToMatch = ((a.title || '') + ' ' + (a.description || '')).trim();
                            if (!matchesRegion(contentToMatch, category)) {
                                assignedCategory = 'international';
                            }
                        }
                    }
                    // Dedicated guru-watch sources get a bypass, but with a light sanity check
                    // to prevent completely off-topic posts (e.g. "Site Maintenance") from passing through.
                    const dedicatedGuruSources = ['Acquirers Multiple', 'Value and Opportunity', 'Safal Niveshak'];
                    if (dedicatedGuruSources.includes(s.name)) {
                        const contentToMatch = ((a.title || '') + ' ' + (a.description || '')).toLowerCase();
                        const sanityCheck = ['invest', 'stock', 'share', 'market', 'fund', 'portfolio', 'value', 'return', 'yield', 'dividend', 'capital', 'company', 'earnings', 'profit', 'loss', 'buy', 'sell', 'price', 'trade', 'economy', 'financial', 'asset', 'wealth', 'buffett', 'munger', 'graham', 'valuation'];
                        
                        // If it has at least one finance-adjacent word, classify as guru-watch.
                        // Otherwise, let the standard keyword categorization decide its fate.
                        if (sanityCheck.some(word => contentToMatch.includes(word))) {
                            assignedCategory = 'guru-watch';
                        }
                    }
                    
                    // Always ensure we have a category
                    a.category = assignedCategory;
                    return formatArticle(a, assignedCategory);
                }).filter(Boolean));
            })());
        }
    }
    await Promise.allSettled(fetchPromises);
    
    // Canary Health Check
    for (const [sourceName, count] of Object.entries(sourceTracker)) {
        if (count === 0 && sourceName !== 'Berkshire Hathaway') {
            console.warn(`[CANARY WARNING] Source "${sourceName}" returned 0 articles. This may indicate a broken scraper, dead RSS feed, or severe 403 block.`);
        }
    }
    
    // Sort by date before dedup to keep freshest
    allArticles = allArticles.filter(Boolean);
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    const deduped = deduplicateAll(allArticles);
    console.log(`Pipeline complete. Filtered ${allArticles.length} -> ${deduped.length} unique articles.`);
    return deduped;
}

module.exports = { buildHybridPipeline };
