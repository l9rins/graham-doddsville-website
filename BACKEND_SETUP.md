# Backend News API Setup

This backend API fetches real news from Australian RSS feeds and serves it to the frontend.

## Quick Start

1. **Install Node.js** (version 14 or higher)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```

4. **The API will be available at:**
   - `http://localhost:3000/api/health` - Health check
   - `http://localhost:3000/api/news` - All news sources
   - `http://localhost:3000/api/news/afr` - Australian Financial Review
   - `http://localhost:3000/api/news/smh` - Sydney Morning Herald
   - `http://localhost:3000/api/news/abc` - ABC News
   - `http://localhost:3000/api/news/the-australian` - The Australian
   - `http://localhost:3000/api/news/news-com-au` - News.com.au

## How It Works

1. **Backend fetches RSS feeds** from Australian news sources
2. **Parses XML** to extract real article titles, URLs, and descriptions
3. **Categorizes news** based on content (Markets, Companies, Economy, etc.)
4. **Serves clean JSON** to the frontend via CORS-enabled API
5. **Frontend displays real news** with working links

## Deployment Options

### Option 1: Local Development
- Run `npm start` on your local machine
- Frontend connects to `http://localhost:3000/api`

### Option 2: Deploy to Heroku
1. Create a Heroku app
2. Set up Git repository
3. Deploy with `git push heroku main`
4. Update frontend API URL to your Heroku app URL

### Option 3: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Update frontend API URL to your Vercel deployment URL

## API Response Format

```json
{
  "source": "Australian Financial Review",
  "articles": [
    {
      "title": "Real Article Title",
      "excerpt": "Article description...",
      "url": "https://www.afr.com/real-article-url",
      "image": "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=AFR",
      "category": "Markets",
      "source": "Australian Financial Review",
      "publishedAt": "2024-12-19T10:30:00.000Z"
    }
  ],
  "count": 5,
  "timestamp": "2024-12-19T10:30:00.000Z"
}
```

## Troubleshooting

- **CORS errors**: Make sure the backend is running and accessible
- **No articles returned**: Check if RSS feeds are accessible
- **Frontend not connecting**: Verify the API URL in `news-scraper.js`

## Production Notes

- The backend handles CORS automatically
- RSS feeds are fetched with proper User-Agent headers
- Error handling ensures graceful fallbacks
- All URLs returned are real, working links to actual articles
