## PROJECT OVERVIEW
Mobile-responsive news aggregation website for Graham and Doddsville, a value investing education platform. The website features sections for:
- Latest News (with subcategories: Companies, Markets, Commodities)
- Around The World (regional news)
- Market Quotes (interactive quotes with full details)
- Articles (organized by category tabs: Classical Readings, Economics, Events, Financial Markets, Financial Products, Greatest Investors, Legal Taxation, Professional Advisers, Resources, Share Investing, Wealth Creation)

## ARCHITECTURE (CLIENT / SERVER)
This project uses a full-stack architecture with a Node.js API backend and a Vanilla JS frontend.
- **Backend Entry Point**: `server.js` (Express server running on port 4012). It provides the API at `/api/news` and serves static files from the `public/` directory.
- **Frontend Directory**: All UI code (HTML, CSS, JS) must reside exclusively inside the `public/` directory. The root directory is strictly for backend and configuration files.

## TECH STACK
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (located in `public/`)
- **Backend**: Node.js with Express.js (located in root)
- **Security**: Helmet (CSP Headers), Express Rate Limit, CORS
- **Data Pipeline**: Custom hybrid pipeline (`news-fetcher.js`) that aggregates standard RSS feeds, Google News fallback searches (enforcing strict financial keywords), and custom web scraping (e.g., RBA, APRA).

## FILE STRUCTURE
### Backend / Root Files
- `server.js` - Node.js Express API server and static file host
- `news-fetcher.js` - The master hybrid data pipeline (scrapes and standardizes all news)
- `news-sources-data.js` - Configuration array of target URLs and domains
- `news-rss-map.json` - Dictionary mapping target domains to their specific RSS feeds
- `package.json` - Node dependencies

### Frontend Files (Inside `public/`)
- `public/index.html` - Main homepage containing the news aggregator UI
- `public/css/styles.css` - Main stylesheet
- `public/js/news-scraper.js` - Client-side logic for fetching `/api/news` and rendering the UI
- `public/js/...` - Client-side utilities (dropdowns, category loaders, etc.)
- `public/*.html` - Sub-pages for educational articles

### Scratch / Backups
- `scratch/` - Contains old data dumps, one-off scripts, and redundant root assets. Do not use for production code.