# 🏛️ Graham and Doddsville Website

![Graham and Doddsville Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=300&section=header&text=Graham%20&%20Doddsville&fontSize=70&animation=fadeIn&fontAlignY=38&desc=Australia's%20Premier%20Value%20Investing%20Education%20Platform&descAlignY=51&descSize=20)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green?logo=node.js)]()
[![Status](https://img.shields.io/badge/Status-Active-success)]()

**[Live Website](https://www.grahamanddoddsville.com.au/) • [Report Bug](#) • [Request Feature](#)**

</div>

---

## 🚀 Overview

**Graham and Doddsville Website** is a modern, responsive platform built for Australia's premier value investing education community. Designed with a mobile-first approach and premium styling, it delivers high-quality financial content and educational materials in an elegant newspaper-style layout.

The site is built as a Progressive Web App (PWA) with offline support and features real-time legal news aggregation from top Australian financial news sources.

> "Investing is most intelligent when it is most businesslike."

---

## ✨ Features

*   **Modern Responsive Design:** Mobile-first approach with premium styling and a responsive multi-column grid.
*   **Legal News Aggregation:** Real-time Australian financial news via RSS feeds and NewsAPI.org.
*   **Newspaper-Style Layout:** Content-heavy design perfectly tailored for educational materials.
*   **Interactive Elements:** Smooth scrolling, CSS keyframe animations, and dynamic content integration.
*   **PWA Ready:** Progressive Web App capabilities including offline support and manifest integration.

---

## 🎨 Design Features

*   **Premium Color Palette:** Dark navy theme with sophisticated blue accents.
*   **Modern Typography:** Clean integration of *Inter* and *Playfair Display* fonts.
*   **Smooth Animations:** CSS transitions and engaging keyframe animations.
*   **Responsive Grid:** Adapts beautifully across all devices:
    *   📱 Mobile phones (320px+)
    *   📱 Tablets (768px+)
    *   💻 Desktop (1024px+)
    *   🖥️ Large screens (1440px+)

---

## 📰 News Sources & Legal Compliance

This project aggregates news using strictly legal and legitimate methods, ensuring full compliance with copyright and Terms of Service:

*   ✅ **RSS Feeds:** ABC News, Sydney Morning Herald, The Age, Brisbane Times, 9News.
*   ✅ **NewsAPI.org:** Official API for Australian financial headlines with proper licensing.
*   ✅ **No Web Scraping:** Eliminates copyright violations.
*   ✅ **Proper Attribution:** All sources are correctly credited.

---

## 📂 Repository Structure

```text
/graham-doddsville-website
  ├── index.html                           # Main website file
  ├── styles.css                           # All styling and responsive design
  ├── script.js                            # Main JavaScript functionality
  ├── news-scraper.js                      # News aggregation system
  ├── server.js                            # Backend server for news API
  ├── package.json                         # Dependencies and scripts
  ├── manifest.json                        # PWA manifest
  ├── .gitignore                           # Git ignore rules
  └── README.md                            # Project documentation
```

---

## 📸 Screenshots

*(Add screenshots of the website and newspaper layout here)*

<div align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Graham+%26+Doddsville+Screenshot+Placeholder" alt="Graham and Doddsville Interface" width="800"/>
</div>

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/graham-doddsville-website.git
    cd graham-doddsville-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up NewsAPI (Optional):**
    Get a free API key from [newsapi.org](https://newsapi.org/) and export it:
    ```bash
    export NEWS_API_KEY=your-api-key-here
    ```

4.  **Start the development server:**
    ```bash
    npm start
    ```

5.  **Open the website:**
    Open `index.html` in your browser, or visit `http://localhost:3000` if you are using the news server.

### Available Scripts
- `npm start` - Start the news server
- `npm run dev` - Development mode with auto-reload
- `npm test` - Run tests (if implemented)

---

## 🚀 Deployment

**GitHub Pages:**
1. Push to GitHub > Repository Settings > Pages.
2. Select source branch. Your site will be live at `https://yourusername.github.io/graham-doddsville-website`.

**Netlify:**
1. Connect GitHub repository.
2. Build command: `npm install` | Publish directory: `/` (root).
3. Deploy!

**Vercel:**
1. Import from GitHub.
2. Framework preset: Other.
3. Deploy!

---

## 🤝 Contributing

1.  **Fork** the repository.
2.  Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## 📞 Support & Acknowledgments

**Support:**
For questions or support, please contact [info@grahamanddoddsville.com.au](mailto:info@grahamanddoddsville.com.au) or visit [grahamanddoddsville.com.au](https://www.grahamanddoddsville.com.au/).

**Acknowledgments:**
- News sources for providing RSS feeds
- NewsAPI.org for legal news aggregation
- Modern web standards and best practices

---

<div align="center">

Licensed under [MIT](./LICENSE)

</div>
