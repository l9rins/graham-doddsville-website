const fs = require('fs');

const cssPath = 'public/css/books-unified.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newCss = `

/* ==========================================================================
   Detailed Book Card (For Warren Buffett Books & specific layouts)
   ========================================================================== */
.book-card-detailed {
    background: #ffffff;
    border: 1px solid var(--border-light, #e2e8f0);
    border-radius: var(--radius-lg, 12px);
    box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.06));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.3s ease;
    height: 100%;
}

.book-card-detailed:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
    border-bottom: 3px solid var(--secondary-gold, #d4af37);
}

.book-card-top {
    display: flex;
    flex-direction: row;
    padding: 16px;
    gap: 16px;
    background: #f1f5f9;
    border-bottom: 1px solid var(--border-light, #e2e8f0);
}

.book-card-detailed .book-cover-link {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
}

.book-card-detailed .book-cover {
    width: 100%;
    max-width: 130px;
    height: auto;
    object-fit: contain;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.book-card-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 110px;
    flex-shrink: 0;
}

.book-card-detailed .book-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #10b981;
    background: #fff;
    padding: 4px 12px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.book-card-detailed .btn-buy,
.book-card-detailed .btn-summary {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding: 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    color: white;
    background: var(--primary-blue, #1e3a8a);
    transition: background 0.2s ease;
    border: none;
    cursor: pointer;
}

.book-card-detailed .btn-buy:hover,
.book-card-detailed .btn-summary:hover {
    background: #172554;
    color: white;
    text-decoration: none;
}

.book-card-summary {
    padding: 16px;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #4b5563;
    border-bottom: 1px solid var(--border-light, #e2e8f0);
    flex-grow: 1;
}

.book-card-bottom {
    padding: 16px;
    background: #ffffff;
}

.book-card-detailed .book-title {
    font-family: Georgia, serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px 0;
    line-height: 1.3;
}

.book-card-detailed .book-author {
    font-size: 0.9rem;
    color: #6b7280;
    font-style: italic;
}
`;

if (!css.includes('.book-card-detailed')) {
    fs.appendFileSync(cssPath, newCss, 'utf8');
    console.log('Appended detailed book card CSS');
} else {
    console.log('CSS already contains .book-card-detailed');
}
