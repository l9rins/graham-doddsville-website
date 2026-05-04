import os
import re
import json
import urllib.parse

# Paths
PUBLIC_HTML_DIR = r"c:\Users\Mark Lorenz\Desktop\LibraryWebsite\public\html"
JSON_PATH = r"c:\Users\Mark Lorenz\Desktop\LibraryWebsite\categorized_books.json"

FILE_MAPPING = {
    "business-management-books.html": "Business & Management",
    "financial-analysis-books.html": "Financial Analysis & Valuation",
    "miscellaneous-books.html": "Miscellaneous / Biographies",
    "sales-marketing-books.html": "Sales & Marketing",
    "self-improvement-books.html": "Self-Improvement & Mindset",
    "share-investing-books.html": "Share Investing & Stock Market",
    "value-investing-books.html": "Value Investing",
    "warren-buffett-books.html": "Buffett, Munger & Berkshire",
    "wealth-creation-books.html": "Wealth Creation & Personal Finance"
}

TEMPLATE_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Graham and Doddsville</title>
    <meta name="description" content="Explore our curated collection of {title}. Best books for value investors and financial professionals.">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="css/books-unified.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="books-page">
        <!-- Header -->
        <header class="header sticky-header" role="banner">
            <div class="container">
                <div class="header-content">
                    <div class="logo">
                        <a href="index.html">
                            <img src="G&D Logo.png" alt="Graham & Doddsville Logo" class="logo-image">
                        </a>
                    </div>

                    <nav class="main-nav desktop-only" role="navigation" aria-label="Main navigation">
                        <ul>
                            <li><a href="index.html" class="nav-link">HOME</a></li>
                            <li><a href="wealth-creation.html" class="nav-link">Wealth Creation</a></li>
                            <li><a href="resources.html" class="nav-link">Resources</a></li>
                        </ul>
                    </nav>

                    <button class="mobile-menu-toggle mobile-only" id="mobile-toggle" aria-label="Toggle navigation menu">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Mobile Navigation Drawer -->
        <div class="mobile-drawer" id="mobile-drawer">
            <div class="drawer-header">
                <img src="G&D Logo (for black background).png" alt="Graham and Doddsville" class="drawer-logo">
                <button class="drawer-close" id="drawer-close" aria-label="Close menu">×</button>
            </div>
            <nav class="drawer-nav">
                <ul class="drawer-menu">
                    <li><a href="index.html" class="drawer-link" style="white-space: nowrap;">Home</a></li>
                    <li><a href="wealth-creation.html" class="drawer-link">Wealth Creation</a></li>
                    <li><a href="legal-taxation.html" class="drawer-link">Legal & Taxation</a></li>
                    <li><a href="financial-markets.html" class="drawer-link">Financial Markets</a></li>
                    <li><a href="share-investing.html" class="drawer-link">Share Investing</a></li>
                    <li><a href="Greatest-Investors.html" class="drawer-link">Greatest Investors</a></li>
                    <li><a href="investment-analysis.html" class="drawer-link">Investment Analysis</a></li>
                    <li><a href="financial-statement-analysis.html" class="drawer-link">Financial Statement Analysis</a></li>
                    <li><a href="stock-valuation.html" class="drawer-link">Stock Valuation</a></li>
                    <li><a href="economics.html" class="drawer-link">Economics</a></li>
                    <li><a href="professional-advisers.html" class="drawer-link">Professional Advisers</a></li>
                    <li><a href="financial-products.html" class="drawer-link">Financial Products</a></li>
                    <li><a href="resources.html" class="drawer-link">Resources</a></li>
                    <li><a href="events.html" class="drawer-link">Events & Seminars</a></li>
                </ul>
            </nav>
        </div>

        <div class="books-page-content">
            <!-- Page Title Section -->
            <section class="page-title-section">
                <div class="breadcrumb">
                    <a href="index.html" class="breadcrumb-link">← Home</a>
                </div>
                <h1 class="page-title">{page_h1}</h1>
                <p class="page-subtitle">{page_subtitle}</p>
            </section>

            <!-- Books Content -->
            <section class="books-container">
                <div class="book-sort-controls">
                    <label>Sort by:</label>
                    <select class="book-sort" id="book-sort">
                        <option value="default">Default</option>
                        <option value="title">Title</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>

                <div class="books-grid" id="books-grid">
"""

TEMPLATE_FOOTER = """
                </div>

                <div class="books-footer-content">
                    <p><strong>Note:</strong> Prices are in AUD and may vary depending on the retailer and availability. Some books may be available as digital editions at lower prices.</p>
                    <p><strong>Disclaimer:</strong> This list is for informational purposes only and does not constitute investment advice. Always do your own research and consult with a professional before making any investment decisions.</p>
                </div>
            </section>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const mobileToggle = document.getElementById('mobile-toggle');
            const mobileDrawer = document.getElementById('mobile-drawer');
            const drawerClose = document.getElementById('drawer-close');
            
            if (mobileToggle) {
                mobileToggle.addEventListener('click', function() {
                    mobileDrawer.classList.add('open');
                    mobileToggle.classList.add('active');
                });
            }
            
            if (drawerClose) {
                drawerClose.addEventListener('click', function() {
                    mobileDrawer.classList.remove('open');
                    mobileToggle.classList.remove('active');
                });
            }

            // Close drawer when clicking outside
            document.addEventListener('click', function(e) {
                if (mobileDrawer.classList.contains('open') && 
                    !mobileDrawer.contains(e.target) && 
                    !mobileToggle.contains(e.target)) {
                    mobileDrawer.classList.remove('open');
                    mobileToggle.classList.remove('active');
                }
            });

            // Sorting functionality
            const sortSelect = document.getElementById('book-sort');
            const booksGrid = document.getElementById('books-grid');
            
            function sortBooks() {
                const bookCards = Array.from(booksGrid.querySelectorAll('.book-card'));
                const val = sortSelect.value;
                let sorted;

                if (val === 'title') {
                    sorted = bookCards.sort((a, b) => {
                        const titleA = a.querySelector('.book-title').innerText.toLowerCase();
                        const titleB = b.querySelector('.book-title').innerText.toLowerCase();
                        return titleA.localeCompare(titleB);
                    });
                } else if (val === 'price-low' || val === 'price-high') {
                    sorted = bookCards.sort((a, b) => {
                        const priceA = parseFloat(a.querySelector('.book-price').innerText.replace(/[^0-9.]/g, '')) || 0;
                        const priceB = parseFloat(b.querySelector('.book-price').innerText.replace(/[^0-9.]/g, '')) || 0;
                        return val === 'price-low' ? priceA - priceB : priceB - priceA;
                    });
                } else {
                    return; // Default order
                }

                booksGrid.innerHTML = '';
                sorted.forEach(card => booksGrid.appendChild(card));
            }

            if (sortSelect) {
                sortSelect.addEventListener('change', sortBooks);
            }
        });
    </script>
</body>
</html>
"""

def get_amazon_link(title, author=""):
    query = f"{title} {author}".strip()
    encoded = urllib.parse.quote_plus(query)
    return f"https://www.amazon.com.au/s?k={encoded}&tag=grahamdoddsvi-22"

def extract_books_from_html(html_content):
    books = []
    card_pattern = re.compile(r'<div class="book-card">(.*?)</div>\s*</div>', re.DOTALL)
    if not card_pattern.search(html_content):
         card_pattern = re.compile(r'<div class="book-card">(.*?)</div>', re.DOTALL)
         
    for match in card_pattern.finditer(html_content):
        card_html = match.group(1)
        
        title_match = re.search(r'<h3 class="book-title">(.*?)</h3>', card_html)
        if not title_match:
            title_match = re.search(r'alt="(.*?)"', card_html)
        title = title_match.group(1) if title_match else "Unknown Title"
        
        # Skip templates
        if "${" in title:
            continue

        price_match = re.search(r'class="book-price">(.*?)</span>', card_html)
        price = price_match.group(1) if price_match else "$0.00"
        
        author_match = re.search(r'class="book-author">(.*?)</div>', card_html)
        author = author_match.group(1) if author_match else ""
        
        books.append({
            "title": title,
            "author": author,
            "price": price
        })
    return books

def main():
    # Load JSON
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    for filename, category in FILE_MAPPING.items():
        filepath = os.path.join(PUBLIC_HTML_DIR, filename)
        if not os.path.exists(filepath):
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Get metadata
        title_match = re.search(r'<title>(.*?)</title>', content)
        original_title = title_match.group(1).replace(" - Graham and Doddsville", "") if title_match else category
        
        h1_match = re.search(r'<h1 class="page-title">(.*?)</h1>', content)
        page_h1 = h1_match.group(1) if h1_match else original_title
        
        subtitle_match = re.search(r'<p class="page-subtitle">(.*?)</p>', content)
        page_subtitle = subtitle_match.group(1) if subtitle_match else ""

        # Extract books
        books = extract_books_from_html(content)
        
        # If no books (corruption case), use JSON
        if len(books) <= 1:
            print(f"Using JSON for {filename} (extracted {len(books)} books)")
            books = json_data.get(category, [])
        
        # Deduplicate and fix links
        seen_titles = set()
        unique_books = []
        for b in books:
            if b['title'].lower() not in seen_titles:
                seen_titles.add(b['title'].lower())
                unique_books.append(b)

        # Generate HTML
        new_html = TEMPLATE_HEAD.format(
            title=original_title,
            page_h1=page_h1,
            page_subtitle=page_subtitle
        )
        
        for book in unique_books:
            link = get_amazon_link(book['title'], book.get('author', ''))
            author_html = f'<div class="book-author">{book["author"]}</div>' if book.get('author') else ''
            
            book_card = f"""
                    <div class="book-card">
                        <a href="{link}" class="book-cover-link" target="_blank" rel="noopener noreferrer">
                            <img src="cover-placeholder.jpg" alt="{book['title']}" class="book-cover" onerror="this.src='https://via.placeholder.com/150x200?text={urllib.parse.quote(book['title'])}'">
                        </a>
                        <div class="book-info">
                            <h3 class="book-title">{book['title']}</h3>
                            {author_html}
                            <div class="book-footer">
                                <span class="book-price">{book['price']}</span>
                                <a href="{link}" class="btn-buy" target="_blank" rel="noopener noreferrer">BUY NOW</a>
                            </div>
                        </div>
                    </div>"""
            new_html += book_card
            
        new_html += TEMPLATE_FOOTER
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Final update for {filename}: {len(unique_books)} books.")

if __name__ == "__main__":
    main()
