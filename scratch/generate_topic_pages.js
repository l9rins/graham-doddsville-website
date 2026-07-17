const fs = require('fs');
const path = require('path');

const categories = [
    {
        id: "philosophy",
        title: "Investment Philosophy",
        subcategories: [
            {
                name: "Investment Concepts",
                topics: ["Efficient Market Theory", "Modern Portfolio Theory", "Intrinsic value", "Wall Street and Mr Market", "Circle of competence", "Margin of safety", "Frictional costs", "Capital allocation", "Security analyst", "Speculation", "Long Term Investing"]
            },
            {
                name: "Investment Philosophy",
                topics: ["Conservatism", "Investment philosophy", "Investment objectives", "Performance standards", "Performance measurement", "Berkshire disclosure", "Market forecasting", "Market timing", "Value investing", "Successful Investing", "Exit Strategy", "Mistakes"]
            },
            {
                name: "Bubbles and Crashes",
                topics: ["Market bubble", "Market crash"]
            },
            {
                name: "Great Investors",
                topics: ["Benjamin Graham", "David Dodd", "Charlie Munger"]
            }
        ]
    },
    {
        id: "investing",
        title: "Investment Strategies",
        subcategories: [
            {
                name: "Investment Basics",
                topics: ["Portfolio allocation", "Stock market", "Technical analysis", "Share buybacks", "Share issues", "Stock splits", "Book recommendations", "Stock Options"]
            },
            {
                name: "Investing Strategies",
                topics: ["Arbitrage", "Cigar butt investing", "Indexing", "Investment advice", "Buying criteria", "Selling criteria", "Mergers and acquisitions", "Workouts", "Investment Strategy"]
            },
            {
                name: "Investment Risks",
                topics: ["Derivatives", "Diversification", "Fees", "Investment risk", "Rumours", "Volatility"]
            },
            {
                name: "Investment Assets",
                topics: ["Bonds", "Gold", "Initial public offering", "Convertible Preferred Stock", "Junk bonds", "Private equity", "Real estate", "The Dow"]
            }
        ]
    },
    {
        id: "businesses",
        title: "Business Principles",
        subcategories: [
            {
                name: "Poor Businesses",
                topics: ["Banks", "Retail", "Derivatives business", "Investment companies", "Investment managers", "Poor businesses", "Poor managers", "Shoe business", "Textile business", "Berkshire Hathaway"]
            },
            {
                name: "Great Businesses",
                topics: ["Auto insurance", "Competitive advantage", "Economic moat", "Good businesses", "Best managers", "Property casualty insurance", "Reinsurance", "Retroactive insurance", "Super cat insurance", "Television Networks", "Insurance Companies"]
            },
            {
                name: "Industries",
                topics: ["Airlines", "Aviation services", "Float", "Insurance", "Investment banks", "Manufactured housing", "Newspapers", "Paper industry", "Technology stocks", "Utilities"]
            },
            {
                name: "Other Topics",
                topics: ["Buffett Associates Ltd", "Consolidation", "Control", "Controlled Businesses", "Franchises"]
            }
        ]
    },
    {
        id: "governance",
        title: "Corporate Governance",
        subcategories: [
            {
                name: "Board of Directors",
                topics: ["Directors' role", "Directors' weaknesses", "Director remuneration", "Independent directors", "Corporate Governance", "Succession"]
            },
            {
                name: "CEO and Managers",
                topics: ["CEO compensation", "CEO mistakes", "CEO weaknesses", "Berkshire compensation", "Berkshire succession", "Executive Compensation", "Our Job"]
            },
            {
                name: "Committees",
                topics: ["Audit Committee", "Remuneration Committee", "Auditors"]
            },
            {
                name: "Corporate Policies",
                topics: ["Annual meetings", "Corporate charity", "Corporate culture", "Corporate responsibility", "Corporate strategy", "Dividend policy", "Greenmail", "Hiring and firing staff", "Manager owner relationship", "Organisational structure", "Corporate Expense", "Shareholders"]
            }
        ]
    },
    {
        id: "accounting",
        title: "Accounting & Evaluation",
        subcategories: [
            {
                name: "Accounting Concepts",
                topics: ["Capital gain", "Amortization", "Accounting goodwill", "Cash flow", "Book value", "Debt", "GAAP", "Depreciation", "Earnings", "EBITDA", "Economic goodwill", "Intangibles"]
            },
            {
                name: "Accounting Creativity",
                topics: ["In Financial statements", "In Mergers and acquisitions", "Accounting fraud"]
            },
            {
                name: "Accounting Ratios",
                topics: ["Compounded growth rate", "PE ratio", "Return on capital", "Return on equity", "Earnings Per Share", "Valuation"]
            },
            {
                name: "Other Concepts",
                topics: ["Capital base", "Compounding", "Leverage", "Liquidation", "Look through earnings", "Owner earnings", "Pro forma reporting", "Realised gains and losses", "Retention of earnings", "Segment reporting", "Full and Fair Reporting"]
            }
        ]
    },
    {
        id: "economics",
        title: "Economic Principles",
        subcategories: [
            {
                name: "Economics",
                topics: ["Inflation", "Macroeconomics", "Economy"]
            },
            {
                name: "Balance of Trade",
                topics: ["Budget deficit", "Trade imbalance"]
            },
            {
                name: "US Economy",
                topics: ["US economy"]
            }
        ]
    },
    {
        id: "miscellaneous",
        title: "Miscellaneous Topics",
        subcategories: [
            {
                name: "General Topics",
                topics: ["Philanthropy", "Public pension", "Taxation", "Unconventional commitments"]
            }
        ]
    }
];

const template = (cat, isHtmlSubdir) => {
    const parentPath = isHtmlSubdir ? "../" : "";
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Warren Buffett on ${cat.title} - Graham and Doddsville</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-blue: #1e3a8a;
            --primary-blue-light: #3b82f6;
            --primary-blue-dark: #1e40af;
            --secondary-gold: #d4af37;
            --text-primary: #111827;
            --text-secondary: #4b5563;
            --bg-light: #f9fafb;
            --border-color: #e5e7eb;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.05);
            --radius-md: 8px;
            --radius-lg: 12px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text-primary);
            background: #ffffff;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px 16px;
        }

        /* Top Header Navigation */
        .header {
            background: #ffffff;
            border-bottom: 2px solid var(--secondary-gold);
            padding: 12px 0;
            margin-bottom: 32px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo-image {
            height: 40px;
            width: auto;
        }

        .breadcrumb {
            font-size: 14px;
            font-weight: 500;
            color: var(--primary-blue-light);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s;
        }

        .breadcrumb:hover {
            color: var(--primary-blue);
        }

        /* Title Section */
        .page-title-section {
            margin-bottom: 36px;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 16px;
        }

        .page-title-section h1 {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }

        .page-subtitle {
            font-size: 16px;
            color: var(--text-secondary);
        }

        /* Subcategories & Lists */
        .subcategory-section {
            margin-bottom: 40px;
        }

        .subcategory-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--primary-blue);
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-left: 4px solid var(--secondary-gold);
            padding-left: 12px;
        }

        .topics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
        }

        .topic-card {
            background: var(--bg-light);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: 16px;
            text-decoration: none;
            color: var(--text-primary);
            font-size: 15px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: var(--shadow-sm);
        }

        .topic-card:hover {
            transform: translateY(-2px);
            background: #ffffff;
            border-color: var(--primary-blue-light);
            box-shadow: var(--shadow-md);
            color: var(--primary-blue);
        }

        .topic-card::after {
            content: "→";
            font-size: 16px;
            color: var(--primary-blue-light);
            opacity: 0;
            transition: transform 0.2s, opacity 0.2s;
            transform: translateX(-4px);
        }

        .topic-card:hover::after {
            opacity: 1;
            transform: translateX(0);
        }

        /* Footer */
        .footer {
            margin-top: 60px;
            border-top: 1px solid var(--border-color);
            padding-top: 24px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container header-content">
            <a href="${parentPath}index.html" class="breadcrumb">← Back to Home</a>
            <img src="${parentPath}images/G&D Logo.png" alt="Logo" class="logo-image">
        </div>
    </header>

    <main class="container">
        <div class="page-title-section">
            <h1>Warren Buffett on ${cat.title}</h1>
            <p class="page-subtitle">A collection of essays, letters, and topics on ${cat.title.toLowerCase()} from Warren Buffett.</p>
        </div>

        ${cat.subcategories.map(sub => `
        <section class="subcategory-section">
            <h2 class="subcategory-title">${sub.name}</h2>
            <div class="topics-grid">
                ${sub.topics.map(top => `
                <a href="https://www.amazon.com.au/s?k=Warren+Buffett+${encodeURIComponent(top)}&tag=grahamdoddsvi-22" class="topic-card" target="_blank" rel="noopener noreferrer">
                    <span>${top}</span>
                </a>
                `).join('')}
            </div>
        </section>
        `).join('')}
    </main>

    <footer class="footer container">
        <p>&copy; 2026 Graham and Doddsville. All Rights Reserved.</p>
    </footer>
</body>
</html>`;
};

const publicDir = path.join(__dirname, 'public');
const htmlDir = path.join(__dirname, 'public', 'html');

categories.forEach(cat => {
    // Generate in public/
    fs.writeFileSync(path.join(publicDir, `${cat.id}.html`), template(cat, false));
    console.log(`Created public/${cat.id}.html`);

    // Generate in public/html/
    fs.writeFileSync(path.join(htmlDir, `${cat.id}.html`), template(cat, true));
    console.log(`Created public/html/${cat.id}.html`);
});

console.log('Successfully created all 14 standalone Buffett category pages!');
