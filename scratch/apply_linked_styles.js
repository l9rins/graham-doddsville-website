const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'market-quotes.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update .quotes-grid definition
const oldGrid = `        .quotes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 24px;
            margin-bottom: 48px;
        }`;

const newGrid = `        .quotes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
            margin-bottom: 48px;
        }`;

if (content.indexOf(oldGrid) !== -1) {
  content = content.replace(oldGrid, newGrid);
  console.log('Updated .quotes-grid desktop min-width to 320px.');
}

// 2. Inject .company-link and .source-btn styles after .quote-country style
const oldCountry = `        .quote-country {
            background: #1e3a8a;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(30, 58, 138, 0.1);
        }`;

const newCountryAndLinks = `        .quote-country {
            background: #1e3a8a;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(30, 58, 138, 0.1);
        }

        /* Sleek Company Website Link */
        .company-link {
            color: #1e3a8a;
            font-weight: 600;
            text-decoration: none;
            border-bottom: 1px dashed rgba(30, 58, 138, 0.4);
            transition: all 0.2s ease;
        }
        
        .company-link:hover {
            color: #d4af37;
            border-bottom-color: #d4af37;
        }
        
        /* Sleek View Source Document Button */
        .source-btn {
            display: inline-flex;
            align-items: center;
            background: #1e3a8a;
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 600;
            text-decoration: none;
            box-shadow: 0 2px 4px rgba(30, 58, 138, 0.1);
            transition: all 0.2s ease;
            z-index: 2;
        }
        
        .source-btn:hover {
            background: #d4af37;
            color: #1e3a8a;
            box-shadow: 0 4px 8px rgba(212, 175, 55, 0.2);
            transform: translateY(-1px);
        }
        
        .source-btn:active {
            transform: translateY(1px);
        }`;

if (content.indexOf(oldCountry) !== -1) {
  content = content.replace(oldCountry, newCountryAndLinks);
  console.log('Injected .company-link and .source-btn CSS rules.');
}

// 3. Update the media queries to support the fluid responsive grid (1 col under 500px, 2 col 500px to 768px)
const oldMediaQueryStart = `        @media (max-width: 768px) {
            .desktop-only {
                display: none !important;
            }

            .mobile-only {
                display: block !important;
            }

            .market-quotes-page-content {
                padding: 12px;
            }

            .page-title {
                font-size: 2.2rem;
            }

            .quotes-grid {
                grid-template-columns: 1fr;
                gap: 14px; /* Tighter gap for better mobile scrolling flow */
            }`;

const newMediaQueryStart = `        @media (max-width: 768px) {
            .desktop-only {
                display: none !important;
            }

            .mobile-only {
                display: block !important;
            }

            .market-quotes-page-content {
                padding: 12px;
            }

            .page-title {
                font-size: 2.2rem;
            }

            /* Responsive Fluid Grid: 1 col on small phones (<500px) */
            .quotes-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }`;

const extraTabletGrid = `
        /* Responsive Fluid Grid: 2 cols on larger mobile/tablets (500px to 768px) */
        @media (min-width: 500px) and (max-width: 768px) {
            .quotes-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 14px;
            }
        }`;

if (content.indexOf(oldMediaQueryStart) !== -1) {
  content = content.replace(oldMediaQueryStart, newMediaQueryStart);
  
  // Also append the extra tablet media query right after the closing brace of the main mobile media query
  const searchPattern = `            .quote-footer {
                padding: 12px 20px;
            }
        }`;
  
  const insertIndex = content.indexOf(searchPattern);
  if (insertIndex !== -1) {
    const endInsertIdx = insertIndex + searchPattern.length;
    const before = content.substring(0, endInsertIdx);
    const after = content.substring(endInsertIdx);
    content = before + '\n' + extraTabletGrid + '\n' + after;
    console.log('Successfully applied fluid grid tablet media queries!');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
} else {
  console.log('Warning: Could not find media query starting block.');
}
