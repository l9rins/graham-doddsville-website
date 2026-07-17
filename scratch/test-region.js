const { matchesRegion, GLOBAL_SOURCES_NEEDING_FILTER, REGION_KEYWORDS } = require('../region-keywords');
const Parser = require('rss-parser');
const parser = new Parser();

async function fetchSample() {
    const domains = ['bbc.com', 'cnbc.com', 'bloomberg.com', 'theguardian.com'];
    const searchKeywords = '(intitle:business OR intitle:economy OR intitle:market OR intitle:finance)';
    const query = domains.map(d => `site:${d}`).join(' OR ') + ' AND ' + searchKeywords + ' when:1d';
    const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query);
    
    console.log('Fetching sample from:', url);
    const feed = await parser.parseURL(url);
    const articles = feed.items.map(item => ({
        title: item.title,
        description: item.contentSnippet || '',
        source: item.source || 'Unknown'
    }));
    
    console.log(`Fetched ${articles.length} articles. Testing against regions...\\n`);
    
    const results = { 'north-america': [], 'europe': [], 'asia': [], 'elsewhere': [], 'unmatched': [] };
    
    articles.forEach(a => {
        const text = a.title + ' ' + a.description;
        let matched = false;
        for (const region of ['north-america', 'europe', 'asia', 'elsewhere']) {
            if (matchesRegion(text, region)) {
                results[region].push(a.title);
                matched = true;
                break;
            }
        }
        if (!matched) results['unmatched'].push(a.title);
    });
    
    for (const [region, items] of Object.entries(results)) {
        console.log(`=== ${region.toUpperCase()} (${items.length}) ===`);
        items.forEach(t => console.log(' - ' + t));
        console.log('');
    }
}

fetchSample().catch(console.error);
