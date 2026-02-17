
const fetch = require('node-fetch');

// Copied from public/js/news-scraper.js to ensure fidelity
function categorizeNews(title, description, sourceName) {
    const text = (title + ' ' + (description || '')).toLowerCase();
    const source = (sourceName || '').toLowerCase();

    if (text.includes('buffett') || text.includes('berkshire') || text.includes('munger') ||
        text.includes('dalio') || text.includes('ackman') || text.includes('burry') ||
        text.includes('portfolio') || text.includes('hedge fund') || text.includes('investor letter') ||
        text.includes('holding') || text.includes('stake') || text.includes('shareholder letter')) {
        return 'Guru Watch';
    }

    if (text.includes('rba') || text.includes('reserve bank') || text.includes('asic') ||
        text.includes('accc') || text.includes('tax') || text.includes('law') ||
        text.includes('legislation') || text.includes('government') || text.includes('policy') ||
        text.includes('compliance') || text.includes('court') || text.includes('fine') ||
        text.includes('ban') || text.includes('penalty') || text.includes('regulator')) {
        return 'Regulatory';
    }

    if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') ||
        text.includes('interest rate') || text.includes('cpi') || text.includes('unemployment') ||
        text.includes('jobs') || text.includes('recession') || text.includes('growth') ||
        text.includes('fiscal') || text.includes('trade deficit') || text.includes('dollar')) {
        return 'Economy';
    }

    if (text.includes('mining') || text.includes('banking') || text.includes('retail') ||
        text.includes('tech') || text.includes('healthcare') || text.includes('energy') ||
        text.includes('resources') || text.includes('construction') || text.includes('property') ||
        text.includes('real estate') || text.includes('sector')) {
        return 'Industry';
    }

    if (text.includes('asx') || text.includes('market') || text.includes('dow') ||
        text.includes('nasdaq') || text.includes('s&p') || text.includes('index') ||
        text.includes('rally') || text.includes('plunge') || text.includes('bull') ||
        text.includes('bear') || text.includes('close') || text.includes('open')) {
        return 'Markets';
    }

    if (text.includes('company') || text.includes('shares') || text.includes('stock') ||
        text.includes('dividend') || text.includes('profit') || text.includes('revenue') ||
        text.includes('earnings') || text.includes('deal') || text.includes('acquisition') ||
        text.includes('merger') || text.includes('ceo') || text.includes('appoint') ||
        text.includes('launch') || text.includes('results') || text.includes('sales') ||
        text.includes('forecast') || text.includes('guidance') || text.includes('quarterly') ||
        text.includes('report') || text.includes('announced') || text.includes('business')) {
        return 'Companies';
    }

    if (source.includes('financial') || source.includes('business') || source.includes('money')) {
        return 'Companies';
    }

    return 'General';
}

async function run() {
    try {
        console.log("Fetching from http://localhost:3051/api/news...");
        const response = await fetch('http://localhost:3051/api/news');
        const data = await response.json();

        console.log(`Fetched ${data.articles.length} articles.`);

        const categories = {};
        const categoryDetails = {};

        data.articles.forEach(article => {
            const cat = categorizeNews(article.title, article.description, article.source.name);
            categories[cat] = (categories[cat] || 0) + 1;

            if (!categoryDetails[cat]) categoryDetails[cat] = [];
            categoryDetails[cat].push(article.title);
        });

        console.log("\nCATEGORY DISTRIBUTION:");
        console.log(JSON.stringify(categories, null, 2));

        console.log("\n=== INSPECTING 'General' ARTICLES (Why did they not match?) ===");
        const generalArticles = data.articles.filter(a => categorizeNews(a.title, a.description, a.source.name) === 'General');
        generalArticles.slice(0, 5).forEach(a => {
            console.log(`\nTitle: ${a.title}`);
            console.log(`Source: ${a.source.name}`);
            console.log(`Published: ${a.publishedAt}`);
            console.log(`Text: ${(a.title + ' ' + (a.description || '')).toLowerCase()}`);
        });

        console.log("\n=== INSPECTING 'Regulatory' ARTICLES (Why did they not show?) ===");
        const regArticles = data.articles.filter(a => categorizeNews(a.title, a.description, a.source.name) === 'Regulatory');
        regArticles.forEach(a => {
            console.log(`\nTitle: ${a.title}`);
            console.log(`Published: ${a.publishedAt}`);
            const hoursOld = (new Date() - new Date(a.publishedAt)) / (1000 * 60 * 60);
            console.log(`Age: ${hoursOld.toFixed(1)} hours`);
        });

    } catch (e) {
        console.error(e);
    }
}

run();
