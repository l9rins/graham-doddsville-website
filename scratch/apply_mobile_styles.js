const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'market-quotes.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `        @media (max-width: 768px) {
            .desktop-only {
                display: none !important;
            }

            .mobile-only {
                display: block !important;
            }

            .market-quotes-page-content {
                padding: 16px;
            }

            .page-title {
                font-size: 2.2rem;
            }

            .quotes-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .quote-card {
                margin: 0 12px; /* Allow slight overflow for better mobile fit */
            }

            .quote-content {
                padding: 16px;
            }

            .quote-title {
                font-size: 1.2rem;
            }

            .quote-text {
                font-size: 1rem;
                line-height: 1.6;
            }
        }`;

const replacement = `        @media (max-width: 768px) {
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
            }

            /* Snug mobile layout to maximize horizontal text space */
            .quote-card {
                margin: 0 4px; 
                border-radius: 10px;
                transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
            }

            /* Premium Tactile Tap/Touch Feedback */
            .quote-card:active {
                transform: scale(0.975);
                background-color: #fcfdfe;
                box-shadow: 0 2px 8px rgba(30, 58, 138, 0.05);
            }

            /* Scale down quote watermark to avoid title collision */
            .quote-card::before {
                font-size: 90px;
                right: 15px;
                top: -5px;
            }

            .quote-header {
                padding: 20px 20px 10px 20px;
            }

            .quote-title {
                font-size: 1.25rem;
                padding-right: 40px; /* Leave space for the watermark */
            }

            .quote-content {
                padding: 10px 20px 20px 20px;
            }

            .quote-text {
                font-size: 1.02rem;
                line-height: 1.7;
                margin-bottom: 16px;
            }

            /* Compact single-line signature on mobile */
            .quote-author-info {
                padding-top: 12px;
            }

            .quote-position,
            .quote-company {
                display: inline;
                font-size: 0.82rem;
            }

            .quote-position::after {
                content: " • ";
                font-weight: bold;
                color: #d4af37; /* Gold separator */
                margin: 0 4px;
            }

            .quote-footer {
                padding: 12px 20px;
            }
        }`;

const index = content.indexOf(targetStr);
if (index !== -1) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully applied premium mobile quote-card media queries!');
} else {
  // Let's do a more robust substring matching in case of slight whitespace variance
  const partialTarget = '@media (max-width: 768px)';
  const idx = content.indexOf(partialTarget);
  if (idx !== -1) {
    const endIdx = content.indexOf('}', content.indexOf('.quote-text {', idx));
    if (endIdx !== -1) {
      const fullEndIdx = content.indexOf('}', endIdx + 1); // Find closing brace of media query
      if (fullEndIdx !== -1) {
        const before = content.substring(0, idx);
        const after = content.substring(fullEndIdx + 1);
        fs.writeFileSync(filePath, before + replacement + after, 'utf8');
        console.log('Successfully applied premium mobile quote-card media queries via partial matching!');
      } else {
        console.log('Could not find the closing brace of the media query');
      }
    } else {
      console.log('Could not find the end of .quote-text styles within media query');
    }
  } else {
    console.log('Could not locate @media (max-width: 768px) inside market-quotes.html');
  }
}
