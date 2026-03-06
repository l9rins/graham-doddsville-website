const fs = require('fs');
const https = require('https');
const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser();

const CATEGORIES = [
    { name: 'Companies', query: 'Companies OR Business', maxAgeH: 48 },
    { name: 'Markets', query: 'Stock Market OR ASX OR Dow', maxAgeH: 48 },
    { name: 'Economy', query: 'Economy OR inflation OR GDP', maxAgeH: 48 },
    { name: 'Industry', query: 'Industry OR mining OR retail OR construction', maxAgeH: 48 },
    { name: 'Regulatory', query: 'ASIC OR ACCC OR RBA OR Regulatory', maxAgeH: 168 },
    { name: 'Guru Watch', query: 'Warren Buffett OR Charlie Munger OR Ray Dalio', maxAgeH: 48 },
];

const now = new Date('2026-03-05T18:05:45Z');

async function fetchRss(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function getRelativeTime(pubDate) {
    const diffMs = now - pubDate;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH >= 24) {
        const days = Math.floor(diffH / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    return `${diffH} hour${diffH !== 1 ? 's' : ''} ago`;
}

async function run() {
    let result = {};
    for (const cat of CATEGORIES) {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(cat.query + ' when:7d')}&hl=en-US&gl=US&ceid=US:en`;

        try {
            const xml = await fetchRss(url);
            const obj = parser.parse(xml);
            let items = obj.rss?.channel?.item || [];
            if (!Array.isArray(items)) items = [items];

            let qualifying = [];
            for (const item of items) {
                if (!item.pubDate) continue;
                const pubDate = new Date(item.pubDate);
                const diffH = (now - pubDate) / (1000 * 60 * 60);
                if (diffH >= 0 && diffH <= cat.maxAgeH) {
                    qualifying.push({
                        title: item.title,
                        ageText: getRelativeTime(pubDate),
                        diffH
                    });
                }
            }

            qualifying.sort((a, b) => a.diffH - b.diffH);
            result[cat.name] = qualifying;
        } catch (e) {
            result[cat.name] = [];
        }
    }
    fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
}
run();
