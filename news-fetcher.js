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
        const res = await fetch('https://www.rba.gov.au/news/', { signal: AbortSignal.timeout(8000) });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.list-articles li').each((i, el) => {
            const a = $(el).find('a').first();
            const title = a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.rba.gov.au' + link;
            const dateStr = $(el).find('.date').text().trim();
            if (title && link) {
                articles.push({
                    title,
                    url: link,
                    source: { name: 'Reserve Bank of Australia' },
                    publishedAt: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
                    category: 'regulatory'
                });
            }
        });
        return articles.slice(0, 10);
    } catch(e) { console.error('RBA Scraper error:', e.message); return []; }
}

async function scrapeACCC() {
    try {
        const res = await fetch('https://www.accc.gov.au/about-us/media/media-releases', { timeout: 8000 });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.view-content .views-row').each((i, el) => {
            const a = $(el).find('a').first();
            const title = a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.accc.gov.au' + link;
            const dateStr = $(el).find('.date-display-single').text().trim();
            if (title && link) {
                articles.push({
                    title,
                    url: link,
                    source: { name: 'ACCC' },
                    publishedAt: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
                    category: 'regulatory'
                });
            }
        });
        return articles.slice(0, 10);
    } catch(e) { console.error('ACCC Scraper error:', e.message); return []; }
}

async function scrapeATO() {
    try {
        const res = await fetch('https://www.accc.gov.au/media-centre', { signal: AbortSignal.timeout(8000) });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.item-list ul li').each((i, el) => {
            const a = $(el).find('a').first();
            const title = a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.ato.gov.au' + link;
            if (title && link) {
                articles.push({
                    title,
                    url: link,
                    source: { name: 'ATO' },
                    publishedAt: new Date().toISOString(),
                    category: 'regulatory'
                });
            }
        });
        return articles.slice(0, 10);
    } catch(e) { console.error('ATO Scraper error:', e.message); return []; }
}

async function scrapeAUSTRAC() {
    try {
        const res = await fetch('https://www.austrac.gov.au/news-and-media/media-release', { signal: AbortSignal.timeout(8000) });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.view-news-and-media .views-row').each((i, el) => {
            const a = $(el).find('h3 a').first();
            const title = a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.austrac.gov.au' + link;
            const dateStr = $(el).find('.date-display-single').text().trim();
            if (title && link) {
                articles.push({
                    title,
                    url: link,
                    source: { name: 'AUSTRAC' },
                    publishedAt: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
                    category: 'regulatory'
                });
            }
        });
        return articles.slice(0, 10);
    } catch(e) { console.error('AUSTRAC Scraper error:', e.message); return []; }
}


async function scrapeAFCA() {
    try {
        const res = await fetch('https://www.afca.org.au/news/media-releases', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(8000) 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        // Generic extraction (AFCA structure might need refinement, trying a safe generic approach if specific classes aren't known yet)
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/news/media-releases/')) {
                const title = $(el).text().trim();
                if (title && title.length > 15) {
                    let fullLink = link.startsWith('http') ? link : 'https://www.afca.org.au' + (link.startsWith('/') ? '' : '/') + link;
                    articles.push({
                        title,
                        url: fullLink,
                        source: { name: 'AFCA' },
                        publishedAt: new Date().toISOString(),
                        category: 'regulatory'
                    });
                }
            }
        });
        // Simple dedup by url
        const unique = [];
        const seen = new Set();
        for (const a of articles) {
            if (!seen.has(a.url)) { seen.add(a.url); unique.push(a); }
        }
        return unique.slice(0, 10);
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
        return articles.slice(0, 10);
    } catch(e) { console.error('FSC Scraper error:', e.message); return []; }
}

// Google News RSS Workaround for Guru Watch and Mainstream Failures
async function fetchGoogleNewsRSS(domains, keywords = '') {
    try {
        if (domains.length === 0) return [];
        let allArticles = [];
        // Chunk domains into groups of 10 to prevent massive URL lengths
        for (let i = 0; i < domains.length; i += 10) {
            const chunk = domains.slice(i, i + 10);
            const siteQuery = '(' + chunk.map(d => 'site:' + d).join(' OR ') + ')';
            
            let q = '';
            if (keywords) {
                q = '"' + keywords + '" ' + siteQuery;
            } else {
                q = siteQuery + ' when:1d'; // limit to 24h for general news
            }
            
            const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(q);
            try {
                const feed = await parser.parseURL(url);
                const chunkArticles = feed.items.map(item => ({
                    title: item.title ? item.title.replace(/ - Google News$/, '').replace(/ - .*?$/, '').trim() : '',
                    url: item.link,
                    source: { name: 'Google News (Aggregated)' },
                    publishedAt: item.pubDate || item.isoDate || new Date().toISOString()
                }));
                allArticles.push(...chunkArticles);
            } catch(e) {
                console.error('Google News RSS fetch error for chunk:', e.message);
            }
            
            // Sleep briefly between chunks
            await new Promise(r => setTimeout(r, 1000));
        }
        return allArticles;
    } catch(e) {
        console.error('Google News RSS wrapper error:', e.message);
        return [];
    }
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
        if (publishedDate < threeDaysAgo) return false;
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
    
    // 1. Guru Watch via Google News RSS
    const guruDomains = newsSourcesData['guru-watch'].map(s => {
        try { return new URL(s.url).hostname.replace(/^www\./, ''); } catch(e) { return null; }
    }).filter(Boolean);
    const guruArticles = await fetchGoogleNewsRSS(guruDomains, 'warren buffett');
    allArticles.push(...guruArticles.map(a => formatArticle(a, 'guru-watch')).filter(Boolean));

    // 2. Mainstream Failures via Google News RSS
    
      // We automatically use Google News RSS as the universal fallback for ANY domain that failed RSS discovery.
      const fallbackCatDomains = {};
      for (const [category, sources] of Object.entries(newsSourcesData)) {
          if (category === 'guru-watch' || category === 'regulatory') continue;
          fallbackCatDomains[category] = [];
          for (const s of sources) {
              if (!rssMap[s.url]) {
                  try {
                      const host = new URL(s.url).hostname.replace(/^www\./, '');
                      fallbackCatDomains[category].push({ host, name: s.name });
                  } catch(e) {}
              }
          }
      }


    const { matchesRegion, GLOBAL_SOURCES_NEEDING_FILTER } = require('./region-keywords');

    for (const [category, items] of Object.entries(fallbackCatDomains)) {
        if (items.length > 0) {
            const catDomains = items.map(i => i.host);
            const financialKeywords = '(intitle:business OR intitle:economy OR intitle:market OR intitle:finance OR intitle:shares OR intitle:invest OR intitle:rate OR intitle:inflation OR intitle:bank OR intitle:tax OR intitle:revenue OR intitle:profit OR intitle:ceo OR intitle:asx OR intitle:dividend OR intitle:debt)';
            const articles = await fetchGoogleNewsRSS(catDomains, financialKeywords);
            // For each article, map its source name based on the host
            articles.forEach(a => {
                const matchedSource = items.find(i => a.url.includes(i.host));
                if (matchedSource) a.source.name = matchedSource.name;
                
                let assignedCategory = category;
                
                // If the source is a global source and we are assigning it to a regional tab, we must verify the region
                if (['north-america', 'europe', 'asia', 'elsewhere'].includes(category)) {
                    if (GLOBAL_SOURCES_NEEDING_FILTER.includes(a.source.name)) {
                        const contentToMatch = (a.title + ' ' + (a.description || '')).trim();
                        if (!matchesRegion(contentToMatch, category)) {
                            assignedCategory = 'international';
                        }
                    }
                }
                
                allArticles.push(formatArticle(a, assignedCategory));
            });
        }
    }
    
    // 3. RSS and Scrapers for other categories (CONCURRENT FETCHING)
    const fetchPromises = [];
    for (const [category, sources] of Object.entries(newsSourcesData)) {
        if (category === 'guru-watch') continue;
        
        for (const s of sources) {
            fetchPromises.push((async () => {
                let fetched = [];
                if (rssMap[s.url]) {
                    try {
                        const feed = await parser.parseURL(rssMap[s.url]);
                        fetched = feed.items.slice(0, 5).map(item => ({
                            title: item.title,
                            url: item.link,
                            source: { name: s.name },
                            publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
                            category: category
                        }));
                    } catch(e) {}
                } else if (category === 'regulatory') {
                    if (s.name === 'Reserve Bank of Australia') fetched = await scrapeRBA();
                    else if (s.name === 'ACCC') fetched = await scrapeACCC();
                    else if (s.name === 'ATO') fetched = await scrapeATO();
                    else if (s.name === 'AUSTRAC') fetched = await scrapeAUSTRAC();
                    else if (s.name === 'Financial Services Council') fetched = await scrapeFSC();
                    else if (s.name === 'AFCA') fetched = await scrapeAFCA();
                }
                
                allArticles.push(...fetched.map(a => {
                    let assignedCategory = category;
                    // Apply regional filtering for global sources
                    if (['north-america', 'europe', 'asia', 'elsewhere'].includes(category)) {
                        if (GLOBAL_SOURCES_NEEDING_FILTER.includes(s.name)) {
                            const contentToMatch = ((a.title || '') + ' ' + (a.description || '')).trim();
                            if (!matchesRegion(contentToMatch, category)) {
                                assignedCategory = 'international';
                            }
                        }
                    }
                    return formatArticle(a, assignedCategory);
                }).filter(Boolean));
            })());
        }
    }
    await Promise.allSettled(fetchPromises);
    
    // Sort by date before dedup to keep freshest
    allArticles = allArticles.filter(Boolean);
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    const deduped = deduplicateAll(allArticles);
    console.log(`Pipeline complete. Filtered ${allArticles.length} -> ${deduped.length} unique articles.`);
    return deduped;
}

module.exports = { buildHybridPipeline };
