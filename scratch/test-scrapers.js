const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testRBA() {
    try {
        const res = await fetch('https://www.rba.gov.au/news/', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.list-articles li').each((i, el) => {
            const a = $(el).find('a').first();
            articles.push(a.text().trim());
        });
        console.log('RBA:', articles.length);
    } catch(e) { console.error('RBA Error:', e.message); }
}

async function testACCC() {
    try {
        const res = await fetch('https://www.accc.gov.au/about-us/media/media-releases', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.view-content .views-row').each((i, el) => {
            const a = $(el).find('a').first();
            articles.push(a.text().trim());
        });
        console.log('ACCC:', articles.length);
    } catch(e) { console.error('ACCC Error:', e.message); }
}

async function testATO() {
    try {
        const res = await fetch('https://www.ato.gov.au/media-centre', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.item-list ul li, .card-title, h3 a').each((i, el) => {
            articles.push($(el).text().trim());
        });
        console.log('ATO:', articles.length);
    } catch(e) { console.error('ATO Error:', e.message); }
}

async function testAUSTRAC() {
    try {
        const res = await fetch('https://www.austrac.gov.au/news-and-media/media-release', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 15000 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('.view-news-and-media .views-row, h3 a, .view-content h3').each((i, el) => {
            articles.push($(el).text().trim());
        });
        console.log('AUSTRAC:', articles.length);
    } catch(e) { console.error('AUSTRAC Error:', e.message); }
}

async function testAFCA() {
    try {
        const res = await fetch('https://www.afca.org.au/news/media-releases', { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 15000 
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const articles = [];
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/news/media-releases/')) {
                articles.push($(el).text().trim());
            }
        });
        console.log('AFCA:', articles.length);
    } catch(e) { console.error('AFCA Error:', e.message); }
}

(async () => {
    await testRBA();
    await testACCC();
    await testATO();
    await testAUSTRAC();
    await testAFCA();
})();
