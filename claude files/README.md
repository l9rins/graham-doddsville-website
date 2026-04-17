# Graham and Doddsville Website

A modern, responsive website for Graham and Doddsville - Australia's premier value investing education platform.

## 🚀 Features

- **Modern Responsive Design** - Mobile-first approach with premium styling
- **Legal News Aggregation** - Real-time Australian financial news via RSS feeds and NewsAPI
- **Newspaper-Style Layout** - Content-heavy design perfect for educational materials
- **Interactive Elements** - Smooth scrolling, animations, and dynamic content
- **PWA Ready** - Progressive Web App capabilities with offline support

## 📰 News Sources

The website aggregates news from legal, legitimate sources:

### RSS Feeds
- ABC News
- Sydney Morning Herald  
- The Age
- Brisbane Times
- 9News

### NewsAPI.org
- Australian financial headlines
- Proper licensing and attribution

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/graham-doddsville-website.git
cd graham-doddsville-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up NewsAPI (Optional)**
```bash
# Get free API key from https://newsapi.org/
export NEWS_API_KEY=your-api-key-here
```

4. **Start the development server**
```bash
npm start
```

5. **Open the website**
- Open `index.html` in your browser
- Or visit `http://localhost:3000` if using the news server

## 📁 Project Structure

```
graham-doddsville-website/
├── index.html              # Main website file
├── styles.css              # All styling and responsive design
├── script.js               # Main JavaScript functionality
├── news-scraper.js         # News aggregation system
├── server.js               # Backend server for news API
├── package.json            # Dependencies and scripts
├── manifest.json           # PWA manifest
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎨 Design Features

- **Premium Color Palette** - Dark navy theme with blue accents
- **Modern Typography** - Inter and Playfair Display fonts
- **Smooth Animations** - CSS transitions and keyframe animations
- **Responsive Grid** - Multi-column newspaper-style layout
- **Interactive Navigation** - Smooth scrolling and mobile menu

## ⚖️ Legal Compliance

This project uses only legal methods for news aggregation:

- ✅ **RSS Feeds** - Published by news organizations for syndication
- ✅ **NewsAPI.org** - Official API with proper licensing
- ✅ **No Web Scraping** - Eliminates copyright and ToS violations
- ✅ **Proper Attribution** - All sources properly credited

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub
2. Go to repository Settings > Pages
3. Select source branch
4. Your site will be available at `https://yourusername.github.io/graham-doddsville-website`

### Netlify
1. Connect your GitHub repository
2. Build command: `npm install`
3. Publish directory: `/` (root)
4. Deploy!

### Vercel
1. Import from GitHub
2. Framework preset: Other
3. Deploy!

## 📱 Mobile Responsive

The website is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔧 Development

### Available Scripts
- `npm start` - Start the news server
- `npm run dev` - Development mode with auto-reload
- `npm test` - Run tests (if implemented)

### Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please contact:
- Email: info@grahamanddoddsville.com.au
- Website: https://www.grahamanddoddsville.com.au/

## 🙏 Acknowledgments

- News sources for providing RSS feeds
- NewsAPI.org for legal news aggregation
- Modern web standards and best practices