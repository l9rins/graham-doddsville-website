// Backend News API for Graham and Doddsville Website
// This would typically run on a Node.js server with proper CORS handling

const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 1800 }); // 30 minutes cache

app.use(cors());
app.use(express.json());

// News sources configuration
const newsSources = [
    {
        name: 'Australian Financial Review',
        url: 'https://www.afr.com/',
        selectors: {
            headlines: 'h3 a, .story-block h3 a, .headline a',
            links: 'a[href*="/story/"], a[href*="/companies/"], a[href*="/markets/"]',
            images: 'img[src*="afr.com"]'
        },
        category: 'Financial'
    },
    {
        name: 'The Australian',
        url: 'https://www.theaustralian.com.au/',
        selectors: {
            headlines: 'h3 a, .story-block h3 a, .headline a',
            links: 'a[href*="/story/"], a[href*="/business/"]',
            images: 'img[src*="theaustralian.com.au"]'
        },
        category: 'General'
    },
    {
        name: 'Sydney Morning Herald',
        url: 'https://www.smh.com.au/',
        selectors: {
            headlines: 'h3 a, .story-block h3 a, .headline a',
            links: 'a[href*="/story/"], a[href*="/business/"]',
            images: 'img[src*="smh.com.au"]'
        },
        category: 'General'
    },
    {
        name: 'ABC News',
        url: 'https://www.abc.net.au/news/',
        selectors: {
            headlines: 'h3 a, .story-block h3 a, .headline a',
            links: 'a[href*="/news/"]',
            images: 'img[src*="abc.net.au"]'
        },
        category: 'General'
    }
];

// Scrape news from a single source
async function scrapeSource(source) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(source.url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        const content = await page.content();
        const $ = cheerio.load(content);
        
        const newsItems = [];
        
        // Extract headlines and links
        $(source.selectors.headlines).each((index, element) => {
            if (index >= 10) return; // Limit to 10 items per source
            
            const $element = $(element);
            const title = $element.text().trim();
            const url = $element.attr('href');
            
            if (title && url && isRelevantNews(title)) {
                // Make URL absolute
                const absoluteUrl = url.startsWith('http') ? url : new URL(url, source.url).href;
                
                // Find associated image
                const $parent = $element.closest('article, .story-block, .news-item');
                const imageUrl = $parent.find('img').first().attr('src');
                
                newsItems.push({
                    title,
                    url: absoluteUrl,
                    image: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, source.url).href) : null,
                    source: source.name,
                    category: categorizeNews(title),
                    publishedAt: new Date(),
                    excerpt: generateExcerpt(title)
                });
            }
        });
        
        await browser.close();
        return newsItems;
        
    } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        return [];
    }
}

// Check if news is relevant to investment/finance
function isRelevantNews(title) {
    const relevantKeywords = [
        'investment', 'investing', 'market', 'stocks', 'shares', 'equity',
        'bonds', 'property', 'real estate', 'superannuation', 'super',
        'banking', 'finance', 'economic', 'economy', 'inflation', 'interest',
        'rate', 'rba', 'asx', 'mining', 'resources', 'energy', 'retail',
        'consumer', 'business', 'company', 'earnings', 'profit', 'revenue',
        'budget', 'tax', 'gdp', 'unemployment', 'cryptocurrency', 'bitcoin'
    ];
    
    const titleLower = title.toLowerCase();
    return relevantKeywords.some(keyword => titleLower.includes(keyword));
}

// Categorize news based on title content
function categorizeNews(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('asx') || titleLower.includes('market') || titleLower.includes('stock')) {
        return 'Markets';
    } else if (titleLower.includes('investment') || titleLower.includes('portfolio') || titleLower.includes('fund')) {
        return 'Investment';
    } else if (titleLower.includes('bank') || titleLower.includes('lending') || titleLower.includes('credit')) {
        return 'Banking';
    } else if (titleLower.includes('property') || titleLower.includes('real estate') || titleLower.includes('housing')) {
        return 'Property';
    } else if (titleLower.includes('mining') || titleLower.includes('resources') || titleLower.includes('commodity')) {
        return 'Resources';
    } else if (titleLower.includes('tech') || titleLower.includes('digital') || titleLower.includes('ai')) {
        return 'Technology';
    } else if (titleLower.includes('rba') || titleLower.includes('interest rate') || titleLower.includes('monetary')) {
        return 'Monetary Policy';
    } else if (titleLower.includes('super') || titleLower.includes('retirement') || titleLower.includes('pension')) {
        return 'Superannuation';
    } else {
        return 'General';
    }
}

// Generate excerpt from title
function generateExcerpt(title) {
    const words = title.split(' ');
    if (words.length <= 8) {
        return title + '...';
    }
    return words.slice(0, 8).join(' ') + '...';
}

// Main scraping function
async function scrapeAllNews() {
    try {
        console.log('Starting news scraping...');
        
        const allNews = [];
        
        // Scrape each source
        for (const source of newsSources) {
            try {
                const news = await scrapeSource(source);
                allNews.push(...news);
                console.log(`Scraped ${news.length} items from ${source.name}`);
            } catch (error) {
                console.error(`Error scraping ${source.name}:`, error);
            }
        }
        
        // Process and deduplicate news
        const processedNews = processNews(allNews);
        
        // Cache the results
        cache.set('news', processedNews);
        cache.set('lastUpdate', new Date());
        
        console.log(`Successfully scraped ${processedNews.length} news items`);
        return processedNews;
        
    } catch (error) {
        console.error('Error in scrapeAllNews:', error);
        throw error;
    }
}

// Process and deduplicate news items
function processNews(newsItems) {
    // Remove duplicates based on title similarity
    const uniqueNews = [];
    const seenTitles = new Set();
    
    newsItems.forEach(item => {
        const titleKey = item.title.toLowerCase().replace(/[^\w\s]/g, '');
        if (!seenTitles.has(titleKey)) {
            seenTitles.add(titleKey);
            uniqueNews.push(item);
        }
    });
    
    // Sort by date (newest first)
    return uniqueNews
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 50); // Limit to 50 items
}

// API Routes

// Get all news
app.get('/api/news', async (req, res) => {
    try {
        let news = cache.get('news');
        
        if (!news) {
            news = await scrapeAllNews();
        }
        
        res.json({
            success: true,
            data: news,
            lastUpdate: cache.get('lastUpdate'),
            count: news.length
        });
        
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news'
        });
    }
});

// Get news by category
app.get('/api/news/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        let news = cache.get('news');
        
        if (!news) {
            news = await scrapeAllNews();
        }
        
        const filteredNews = news.filter(item => 
            item.category.toLowerCase() === category.toLowerCase()
        );
        
        res.json({
            success: true,
            data: filteredNews,
            category,
            count: filteredNews.length
        });
        
    } catch (error) {
        console.error('Error fetching news by category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news by category'
        });
    }
});

// Search news
app.get('/api/news/search', async (req, res) => {
    try {
        const { q } = req.query;
        let news = cache.get('news');
        
        if (!news) {
            news = await scrapeAllNews();
        }
        
        if (!q) {
            return res.json({
                success: true,
                data: news,
                count: news.length
            });
        }
        
        const searchTerm = q.toLowerCase();
        const filteredNews = news.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.excerpt.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
        
        res.json({
            success: true,
            data: filteredNews,
            query: q,
            count: filteredNews.length
        });
        
    } catch (error) {
        console.error('Error searching news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search news'
        });
    }
});

// Force refresh news
app.post('/api/news/refresh', async (req, res) => {
    try {
        const news = await scrapeAllNews();
        
        res.json({
            success: true,
            data: news,
            lastUpdate: cache.get('lastUpdate'),
            count: news.length,
            message: 'News refreshed successfully'
        });
        
    } catch (error) {
        console.error('Error refreshing news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to refresh news'
        });
    }
});

// Get news sources
app.get('/api/news/sources', (req, res) => {
    res.json({
        success: true,
        data: newsSources.map(source => ({
            name: source.name,
            category: source.category,
            url: source.url
        }))
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date(),
        cache: {
            hasNews: cache.has('news'),
            lastUpdate: cache.get('lastUpdate')
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`News API server running on port ${PORT}`);
    
    // Initial news scrape
    scrapeAllNews().catch(error => {
        console.error('Initial news scrape failed:', error);
    });
});

// Schedule regular news updates
setInterval(() => {
    scrapeAllNews().catch(error => {
        console.error('Scheduled news scrape failed:', error);
    });
}, 30 * 60 * 1000); // Every 30 minutes

module.exports = app;
