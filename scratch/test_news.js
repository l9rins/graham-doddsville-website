const http = require('http');

http.get('http://localhost:4012/api/news', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const articles = json.articles || [];
            console.log(`Total articles fetched: ${articles.length}`);
            
            const categories = {};
            articles.forEach(a => {
                let cat = a.category || 'General';
                // simulate categorizeNews
                const text = ((a.title||'') + ' ' + (a.description||'')).toLowerCase();
                const source = (a.source?.name||a.source||'').toLowerCase();
                if (!a.category || a.category === 'General') {
                    if (text.includes('buffett')) cat = 'Guru Watch';
                    else if (text.includes('asx') || text.includes('nasdaq')) cat = 'Markets';
                    else if (text.includes('rba') || text.includes('reserve bank')) cat = 'Regulatory';
                    else if (text.includes('economy') || text.includes('gdp')) cat = 'Economy';
                    else if (text.includes('mining') || text.includes('banking')) cat = 'Industry';
                    else if (text.includes('company') || text.includes('shares')) cat = 'Companies';
                    else if (source.includes('financial')) cat = 'Companies';
                }
                
                categories[cat] = (categories[cat] || 0) + 1;
            });
            console.log('Category breakdown:', categories);
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', err => {
    console.error('Request error:', err);
});
