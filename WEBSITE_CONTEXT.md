## PROJECT OVERVIEW
Mobile-responsive news aggregation website for Graham and Doddsville, a value investing education platform. The website features sections for:
- Latest News (with subcategories: Companies, Markets, Commodities)
- Around The World (regional news)
- Market Quotes (interactive quotes with full details)
- Articles (organized by category tabs: Classical Readings, Economics, Events, Financial Markets, Financial Products, Greatest Investors, Legal Taxation, Professional Advisers, Resources, Share Investing, Wealth Creation)

## TECH STACK
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js for API server
- **Data Sources**: RSS feeds and web scraping (news-scraper.js)
- **Styling Approach**: Custom CSS with CSS variables for theming
- **Deployment**: Static site with Node.js API backend

## DESIGN SPECIFICATIONS
- **Primary Color**: Purple (extracted from G&D Logo.png - to be confirmed as exact hex value)
- **Main Heading Font**: Georgia, Color: Purple, Size: Current (responsive)
- **Subheading Font**: Arial, Color: Black (#000000), Size: Current
- **News Headline Font**: Georgia, Size: 11.5pt (convert to rem for responsive: ~0.72rem), Color: Current
- **Source Attribution**: Abbreviated in grey (e.g., AFR for Australian Financial Review, SMH for Sydney Morning Herald)
- **Color Palette**: Primary purple, accent gold (#d4af37), text colors (#333, #666, #888)

## MOBILE SPECIFICATIONS
- **Target Device**: Mobile phone viewport (320px minimum width)
- **Layout**: All content must fit within screen width, no horizontal scrolling except for tab navigation
- **Responsive Spacing**: Consistent vertical spacing system (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px)
- **Tabs**: Must display in single horizontal line with horizontal scrolling if needed
- **Touch Targets**: Minimum 44px for interactive elements

## FILE STRUCTURE
### Core Files
- `index.html` - Main homepage with news sections
- `styles.css` - Main stylesheet with typography and layout
- `server.js` - Node.js Express API server
- `news-scraper.js` - News scraping logic
- `news-sources-config.js` - RSS feed configurations

### Section Pages
- `classical-readings.html`
- `economics.html`
- `events.html`
- `financial-markets.html`
- `financial-products.html`
- `Greatest-Investors.html`
- `legal-taxation.html`
- `professional-advisers.html`
- `resources.html`
- `share-investing.html`
- `wealth-creation.html`

### Assets
- `G&D Logo.png` - Site logo
- `js/dropdown-position.js` - Dropdown menu positioning
- `sw.js` - Service worker for caching
- `robots.txt` - Search engine crawling rules

### Configuration
- `package.json` - Node.js dependencies
- `LICENSE` - MIT license
- `README.md` - Project documentation
- `REVISION_SUMMARY.md` - Revision notes