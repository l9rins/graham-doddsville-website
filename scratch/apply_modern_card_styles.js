const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'market-quotes.html');
let content = fs.readFileSync(filePath, 'utf8');

const startKey = '        .quote-card {';
const endKey = '        @media (min-width: 500px) and (max-width: 768px) {';

const startIdx = content.indexOf(startKey);
if (startIdx !== -1) {
  const endIdx = content.indexOf('}', content.indexOf('}', content.indexOf(endKey) + endKey.length));
  if (endIdx !== -1) {
    console.log(`Found styles section from index ${startIdx} to ${endIdx + 1}`);
    
    const replacement = `        /* === DYNAMIC CATEGORY CAROUSEL === */
        .category-carousel-container {
            margin: 0 0 24px 0;
            padding: 0 4px;
            overflow: visible;
        }

        .category-carousel {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 8px 4px;
            scrollbar-width: none; /* Hide scrollbar Firefox */
            -webkit-overflow-scrolling: touch;
        }

        .category-carousel::-webkit-scrollbar {
            display: none; /* Hide scrollbar Chrome/Safari */
        }

        .category-btn {
            flex-shrink: 0;
            background: #ffffff;
            border: 1.5px solid #e2e8f0;
            border-radius: 20px;
            padding: 6px 16px;
            font-size: 0.82rem;
            font-weight: 500;
            color: #475569;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: 'Inter', sans-serif;
        }

        .category-btn:hover {
            border-color: #cbd5e1;
            color: #1e293b;
        }

        .category-btn.active {
            background: #1e3a8a;
            border-color: #1e3a8a;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);
        }

        /* === PREMIUM MODERN QUOTE CARD === */
        .quote-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1.5px solid #f1f5f9;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04);
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: relative;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quote-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
            border-color: #e2e8f0;
        }

        /* Top row with badge and date */
        .card-top-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .category-badge {
            background: rgba(30, 58, 138, 0.06);
            color: #1e3a8a;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 4px 10px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
        }

        .card-date {
            color: #94a3b8;
            font-size: 0.82rem;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
        }

        /* Card title in bold serif */
        .card-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.45rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            line-height: 1.3;
        }

        /* Quote text block with warm background & gold left border */
        .quote-text-block {
            background: #f8fafc;
            border-left: 4px solid #eab308; /* Strong gold accent line */
            padding: 18px 20px;
            border-radius: 0 12px 12px 0;
            position: relative;
        }

        .quote-para {
            font-family: Georgia, serif;
            font-size: 1.05rem;
            line-height: 1.7;
            color: #334155;
            margin: 0;
            position: relative;
        }

        .quote-mark {
            font-family: 'Playfair Display', Georgia, serif;
            color: #f59e0b;
            font-size: 1.8rem;
            font-weight: 700;
            margin-right: 4px;
            line-height: 1;
        }

        /* Author Row with circular avatar initials */
        .author-avatar-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 4px;
        }

        .author-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #dbeafe; /* Soft blue avatar base */
            color: #1e40af;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.88rem;
            font-family: 'Inter', sans-serif;
            flex-shrink: 0;
            letter-spacing: 0.5px;
        }

        .author-details {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .author-name {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            font-family: 'Inter', sans-serif;
        }

        .company-link {
            color: #0f172a;
            text-decoration: none;
            transition: color 0.2s;
        }

        .company-link:hover {
            color: #1e3a8a;
            text-decoration: underline;
        }

        .author-subtitle {
            color: #64748b;
            font-size: 0.82rem;
            margin: 0;
            font-family: 'Inter', sans-serif;
        }

        /* Action bar with save and View Source */
        .card-action-row {
            display: flex;
            gap: 10px;
            margin-top: 8px;
        }

        .bookmark-btn {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            border: 1.5px solid #e2e8f0;
            background: #ffffff;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .bookmark-btn:hover {
            border-color: #cbd5e1;
            color: #1e293b;
            background: #f8fafc;
        }

        .bookmark-icon {
            width: 20px;
            height: 20px;
        }

        /* View Source Full Width CTA */
        .source-btn {
            flex-grow: 1;
            height: 44px;
            border-radius: 8px;
            background: #1e293b; /* Sleek slate-black background */
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 600;
            font-size: 0.88rem;
            text-decoration: none;
            transition: all 0.2s;
            font-family: 'Inter', sans-serif;
        }

        .source-btn:hover {
            background: #0f172a;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .source-btn:active {
            transform: scale(0.98);
        }

        .back-link {
            display: inline-block;
            margin-bottom: 24px;
            color: var(--primary-blue);
            text-decoration: none;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: var(--radius-md);
            transition: all 0.2s ease;
            border: 2px solid var(--primary-blue);
        }

        .back-link:hover {
            background: var(--primary-blue);
            color: white;
        }

        @media (max-width: 768px) {
            .desktop-only {
                display: none !important;
            }

            .mobile-only {
                display: block !important;
            }

            .market-quotes-page-content {
                padding: 12px;
            }

            .quotes-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .quote-card {
                padding: 20px;
                gap: 14px;
            }

            .card-title {
                font-size: 1.3rem;
            }

            .quote-text-block {
                padding: 14px 16px;
            }

            .quote-para {
                font-size: 1rem;
            }
        }

        @media (min-width: 500px) and (max-width: 768px) {
            .quotes-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 14px;
            }
        }`;

    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + 1);
    fs.writeFileSync(filePath, before + replacement + after, 'utf8');
    console.log('Successfully applied modern, mobile-first quote-card styles!');
  } else {
    console.log('Could not find the end key for style section');
  }
} else {
  console.log('Could not find the start key for style section');
}
