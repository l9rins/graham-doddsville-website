const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// News sources with their RSS feeds
const newsSources = {
    'afr': {
        name: 'Australian Financial Review',
        rssUrl: 'https://www.afr.com/rss.xml',
        category: 'business'
    },
    'smh': {
        name: 'Sydney Morning Herald',
        rssUrl: 'https://www.smh.com.au/rss.xml',
        category: 'business'
    },
    'abc': {
        name: 'ABC News',
        rssUrl: 'https://www.abc.net.au/news/feed/1534/rss.xml',
        category: 'business'
    },
    'the-australian': {
        name: 'The Australian',
        rssUrl: 'https://www.theaustralian.com.au/rss',
        category: 'business'
    },
    'news-com-au': {
        name: 'News.com.au',
        rssUrl: 'https://www.news.com.au/feeds/feed.xml',
        category: 'business'
    }
};

// Parse RSS feed and extract articles
function parseRSSFeed(xmlContent, source) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');
        
        const articles = [];
        for (let i = 0; i < Math.min(items.length, 5); i++) {
            const item = items[i];
            const title = getTextContent(item, 'title');
            const description = getTextContent(item, 'description');
            const link = getTextContent(item, 'link');
            const pubDate = getTextContent(item, 'pubDate');
            
            if (title && link) {
                articles.push({
                    title: title,
                    excerpt: cleanDescription(description),
                    url: link,
                    image: generatePlaceholderImage(source.name),
                    category: categorizeNews(title + ' ' + description),
                    source: source.name,
                    publishedAt: new Date(pubDate || Date.now()).toISOString()
                });
            }
        }
        
        return articles;
    } catch (error) {
        console.error(`Error parsing RSS feed for ${source.name}:`, error);
        return [];
    }
}

// Helper function to get text content from XML element
function getTextContent(parent, tagName) {
    const elements = parent.getElementsByTagName(tagName);
    return elements.length > 0 ? elements[0].textContent : '';
}

// Clean HTML from description
function cleanDescription(description) {
    if (!description) return '';
    return description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
}

// Categorize news based on content
function categorizeNews(content) {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('asx') || lowerContent.includes('market') || lowerContent.includes('stock')) {
        return 'Markets';
    } else if (lowerContent.includes('company') || lowerContent.includes('business') || lowerContent.includes('corporate')) {
        return 'Companies';
    } else if (lowerContent.includes('economy') || lowerContent.includes('gdp') || lowerContent.includes('inflation')) {
        return 'Economy';
    } else if (lowerContent.includes('industry') || lowerContent.includes('sector') || lowerContent.includes('mining')) {
        return 'Industry';
    } else if (lowerContent.includes('rba') || lowerContent.includes('interest') || lowerContent.includes('rate')) {
        return 'Monetary Policy';
    } else if (lowerContent.includes('property') || lowerContent.includes('housing') || lowerContent.includes('real estate')) {
        return 'Property';
    } else if (lowerContent.includes('bank') || lowerContent.includes('financial') || lowerContent.includes('fund')) {
        return 'Banking';
    } else if (lowerContent.includes('tech') || lowerContent.includes('ai') || lowerContent.includes('digital')) {
        return 'Technology';
    } else if (lowerContent.includes('energy') || lowerContent.includes('renewable') || lowerContent.includes('coal')) {
        return 'Energy';
    } else if (lowerContent.includes('super') || lowerContent.includes('retirement') || lowerContent.includes('pension')) {
        return 'Superannuation';
    } else if (lowerContent.includes('retail') || lowerContent.includes('consumer') || lowerContent.includes('shopping')) {
        return 'Consumer';
    } else if (lowerContent.includes('mining') || lowerContent.includes('resources') || lowerContent.includes('commodity')) {
        return 'Resources';
    } else if (lowerContent.includes('investment') || lowerContent.includes('value') || lowerContent.includes('portfolio')) {
        return 'Investment';
    }
    return 'General';
}

// Generate placeholder image based on source
function generatePlaceholderImage(sourceName) {
    const colors = {
        'Australian Financial Review': '1e3a8a',
        'Sydney Morning Herald': '059669',
        'ABC News': 'dc2626',
        'The Australian': '7c3aed',
        'News.com.au': '1e3a8a'
    };
    const color = colors[sourceName] || '666666';
    return `https://via.placeholder.com/300x200/${color}/ffffff?text=${encodeURIComponent(sourceName)}`;
}

// API endpoint to fetch news from a specific source
app.get('/api/news/:source', async (req, res) => {
    try {
        const sourceKey = req.params.source;
        const source = newsSources[sourceKey];
        
        if (!source) {
            return res.status(404).json({ error: 'Source not found' });
        }
        
        console.log(`Fetching news from ${source.name}...`);
        
        // Fetch RSS feed
        const response = await fetch(source.rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlContent = await response.text();
        const articles = parseRSSFeed(xmlContent, source);
        
        console.log(`Successfully fetched ${articles.length} articles from ${source.name}`);
        
        res.json({
            source: source.name,
            articles: articles,
            count: articles.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error(`Error fetching news for ${req.params.source}:`, error);
        res.status(500).json({ 
            error: 'Failed to fetch news',
            message: error.message 
        });
    }
});

// API endpoint to fetch news from all sources
app.get('/api/news', async (req, res) => {
    try {
        console.log('Fetching news from all sources...');
        
        const allArticles = [];
        const sourceKeys = Object.keys(newsSources);
        
        // Fetch from all sources in parallel
        const promises = sourceKeys.map(async (sourceKey) => {
            try {
                const response = await fetch(`http://localhost:${PORT}/api/news/${sourceKey}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles;
                }
                return [];
            } catch (error) {
                console.error(`Error fetching from ${sourceKey}:`, error);
                return [];
            }
        });
        
        const results = await Promise.all(promises);
        results.forEach(articles => allArticles.push(...articles));
        
        // Sort by publication date (newest first)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        console.log(`Successfully fetched ${allArticles.length} total articles`);
        
        res.json({
            articles: allArticles,
            count: allArticles.length,
            sources: sourceKeys,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching news from all sources:', error);
        res.status(500).json({ 
            error: 'Failed to fetch news from all sources',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        sources: Object.keys(newsSources)
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`News API server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /api/health - Health check`);
    console.log(`  GET /api/news - Fetch news from all sources`);
    console.log(`  GET /api/news/:source - Fetch news from specific source`);
    console.log(`Available sources: ${Object.keys(newsSources).join(', ')}`);
});

module.exports = app;
