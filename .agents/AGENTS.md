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
