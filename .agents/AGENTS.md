# AI Agent Architecture Guide & Rules

**CRITICAL RULE FOR ALL FUTURE AGENTS:** Read this document carefully before making ANY file changes.

## 1. Project Architecture (Client / Server Separation)
This project is NOT a simple static HTML site. It is a full-stack application served by a Node.js Express server.
- **Backend Entry Point:** `server.js` (runs on port 4012). It serves the API endpoints AND statically serves the `public/` directory.
- **Frontend Directory:** `public/`. **ALL** HTML, CSS, and client-side JS files live inside the `public/` folder.
- **Routing:** When a user navigates to `http://localhost:4012/`, the server secretly serves `public/index.html`. 

## 2. Where to Edit Files
- **Frontend Changes:** If you need to edit the UI, layout, HTML, CSS, or client-side logic, you MUST edit the files inside the `public/` folder (e.g., `public/index.html`, `public/css/styles.css`, `public/js/...`). 
- **Backend Changes:** If you need to edit the API, the scrapers, or the server configuration, you MUST edit the JS files in the ROOT directory (e.g., `server.js`, `news-fetcher.js`, `news-sources-data.js`).

## 3. DO NOT MOVE OR RENAME THE FRONTEND FILES
Do NOT attempt to restructure or rename the files inside the `public/` directory (e.g., do not try to move them into `public/pages/`). Doing so will break all relative paths (`<script src="js/...">`, `<img src="images/...">`) across 20+ HTML files. Leave the flat structure inside `public/` exactly as it is.

## 4. The News Pipeline
- The backend fetches news from RSS feeds and custom scrapers using `news-fetcher.js`.
- It maps generic RSS domains to Google News strict financial searches using `news-rss-map.json`.
- The frontend fetches the aggregated array of news via `http://localhost:4012/api/news` and displays it using client-side JavaScript (`public/js/news-scraper.js` and `index.html`).

## 5. Scratch & Backups
- Do NOT clutter the root directory with old JSON dumps, loose HTML files, or test scripts.
- Any temporary scripts, backups, or raw data dumps should be placed in the `scratch/` directory.


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
## Verification and Evidence Rule
**CRITICAL RULE FOR ALL FUTURE SESSIONS:** When verifying fixes, data pipelines, or scrapers, NEVER accept or present high-level summaries or '100% accurate' claims without hard evidence. You MUST spot-check and provide actual raw log excerpts, exact JSON payload samples, and real data points (e.g., actual pubDate lists) to the user. Every real bug in the news pipeline (e.g., the 3-day purge bug, the canary timeout bug) was only surfaced because the user insisted on seeing the raw evidence instead of accepting a confident summary. Always show the data.

