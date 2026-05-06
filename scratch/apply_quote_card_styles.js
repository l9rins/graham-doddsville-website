const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'market-quotes.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `        .quote-card {
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            overflow: hidden;
            transition: all 0.3s ease;
            border: 1px solid var(--border-light);
        }`;

// Let's search for a broader block that defines the quote-card styles
const startKey = '        .quote-card {';
const endKey = '        .quote-country {';

const startIdx = content.indexOf(startKey);
if (startIdx !== -1) {
  const endIdx = content.indexOf('}', content.indexOf(endKey));
  if (endIdx !== -1) {
    console.log(`Found styles section at index ${startIdx} to ${endIdx + 1}`);
    
    const replacement = `        .quote-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(30, 58, 138, 0.05);
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(229, 231, 235, 0.8);
            border-left: 5px solid #1e3a8a; /* Strong brand left-accent */
        }

        /* Hover Interaction */
        .quote-card:hover {
            transform: translateY(-6px) scale(1.01);
            box-shadow: 0 12px 30px rgba(30, 58, 138, 0.12);
            border-left-width: 8px; /* Smooth expanding border effect */
        }

        /* Decorative Quote Mark Watermark */
        .quote-card::before {
            content: "“";
            position: absolute;
            top: -10px;
            right: 20px;
            font-size: 140px;
            font-family: 'Playfair Display', Georgia, serif;
            color: rgba(30, 58, 138, 0.04); /* Translucent elegant watermark */
            line-height: 1;
            pointer-events: none;
            z-index: 0;
        }

        .quote-header {
            padding: 24px 24px 12px 24px;
            z-index: 1;
        }

        .quote-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.35rem;
            font-weight: 700;
            color: #1e3a8a; /* Deep blue title */
            margin: 0 0 10px 0;
            line-height: 1.4;
        }

        /* Elegant Category Pill Tag */
        .quote-meta {
            display: inline-block;
            font-size: 0.78rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1e3a8a;
            background: rgba(30, 58, 138, 0.06);
            padding: 4px 12px;
            border-radius: 20px;
            margin: 0;
        }

        .quote-content {
            padding: 12px 24px 24px 24px;
            z-index: 1;
            flex-grow: 1;
        }

        /* High-readability Georgia typography */
        .quote-text {
            font-family: Georgia, serif;
            font-size: 1.08rem;
            line-height: 1.8;
            color: #2c3e50; /* Richer tone for text */
            margin: 0 0 24px 0;
            font-style: italic;
        }

        .quote-author-info {
            border-top: 1px solid rgba(229, 231, 235, 0.6);
            padding-top: 16px;
        }

        .quote-author {
            font-size: 1rem;
            font-weight: 700;
            color: #1e3a8a;
            margin: 0 0 4px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Visual indicator for authors */
        .quote-author::before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #d4af37; /* Executive gold marker */
            border-radius: 50%;
        }

        .quote-position {
            color: #4b5563;
            font-size: 0.88rem;
            font-weight: 500;
            margin: 0 0 2px 0;
        }

        .quote-company {
            color: #6b7280;
            font-size: 0.88rem;
            margin: 0;
        }

        .quote-footer {
            background: #fafafa;
            border-top: 1px solid rgba(229, 231, 235, 0.5);
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1;
        }

        .quote-date {
            color: #9ca3af;
            font-size: 0.85rem;
            font-weight: 500;
        }

        /* Sleek Country Label */
        .quote-country {
            background: #1e3a8a;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(30, 58, 138, 0.1);
        }`;

    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + 1);
    fs.writeFileSync(filePath, before + replacement + after, 'utf8');
    console.log('Successfully applied premium quote-card styles!');
  } else {
    console.log('Could not find the end key (.quote-country)');
  }
} else {
  console.log('Could not find the start key (.quote-card)');
}
