const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const indexPath = path.join(process.cwd(), 'public', 'index.html');

function polishIndex() {
    console.log('Polishing index.html...');
    let content = fs.readFileSync(indexPath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;

    // Fix G: Rename "WARREN BUFFETT BOOKS" to "OUR RECOMMENDED BOOKS"
    const bookHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('WARREN BUFFETT BOOKS'));
    if (bookHeader) {
        bookHeader.textContent = 'OUR RECOMMENDED BOOKS';
    }

    // Fix G: Tab label
    const tabLabel = Array.from(document.querySelectorAll('.tab-btn, .tab-label, label, h3')).find(el => el.textContent.trim() === 'Warren Buffett Books');
    if (tabLabel) {
        tabLabel.textContent = 'Warren Buffett';
    }

    // Fix D: Feature Articles font match
    const latestNewsHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('LATEST NEWS'));
    const featureArticlesHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('FEATURE ARTICLES'));
    if (latestNewsHeader && featureArticlesHeader) {
        featureArticlesHeader.className = latestNewsHeader.className;
        featureArticlesHeader.setAttribute('style', latestNewsHeader.getAttribute('style') || '');
    }

    // Fix C: Remove "See more" under Warren Buffett tabs
    const buffettSection = document.querySelector('.warren-buffett');
    if (buffettSection) {
        const seeMoreLinks = buffettSection.querySelectorAll('a');
        seeMoreLinks.forEach(link => {
            if (link.textContent.trim() === 'See more') {
                const wrapper = link.closest('div');
                if (wrapper) wrapper.remove();
                else link.remove();
            }
        });
    }

    // Fix H: Book Lists (10 lines per tab)
    const bookData = {
        'Warren Buffett': ["The Essays of Warren Buffett", "The Snowball", "The Warren Buffett Way", "Warren Buffett Speaks", "Tap Dancing to Work", "Buffett: The Making of an American Capitalist", "The Warren Buffett Portfolio", "Warren Buffett: An Illustrated Biography", "The Deals of Warren Buffett", "Of Permanent Value"],
        'Value Investing': ["The Intelligent Investor", "Security Analysis (1940)", "Security Analysis (2008)", "Benjamin Graham On Value Investing", "Value Investing: From Graham to Buffett and Beyond", "The Rediscovered Benjamin Graham", "The Little Book of Value Investing", "The Little Book That Beats the Market", "You Can Be A Stock Market Genius", "Modern Value Investing"],
        'Share Investing': ["How to Make Money in Stocks", "One Up on Wall Street", "A Beginner's Guide to the Stock Market", "Common Sense on Mutual Funds", "The Little Book of Common Sense Investing", "Stocks for the Long Run", "The Five Rules for Successful Stock Investing", "The Little Book That Builds Wealth", "Best Loser Wins", "Stock Market Investing"],
        'Wealth Creation': ["How to Get Rich", "Rich Dad Poor Dad", "The Simple Path to Wealth", "I Will Teach You to be Rich", "The Richest Man in Babylon", "The Millionaire Next Door", "The Millionaire Mind", "The Millionaire Fastlane", "The Strategic Millionaire", "Millionaire Mission"],
        'Financial Analysis': ["Financial Statements", "How to Read a Financial Report", "Financial Shenanigans", "Bemused Investor's Guide to Company Accounts", "Warren Buffett Accounting", "Accounting for Beginners", "Financial Intelligence", "Balance Sheet Basics", "Financial Statement Analysis for Value Investors", "The Interpretation of Financial Statements"],
        'Sales and Marketing': ["$100M Offers", "$100M Leads", "Sell or Be Sold", "This Is Marketing", "The 1-Page Marketing Plan", "80/20 Sales and Marketing", "Gap Selling", "The Challenger Sale", "The Psychology of Selling", "Selling 101"],
        'Self-Improvement': ["Atomic Habits", "The Mountain Is You", "Good Vibes Good Life", "The Power of Discipline", "The Let Them Theory", "Stop Overthinking", "Breaking the Habits of Being Yourself", "The 7 Habits of Highly Effective People", "The 15 Invaluable Laws of Growth", "Success"],
        'Business & Management': ["Never Split the Difference", "The Lean Startup", "Leaders Eat Last", "The Coaching Habit", "The E-Myth Revisited", "Traction", "Surrounded By Idiots", "Profit First", "Personal MBA", "The Infinite Game"],
        'Miscellaneous': ["The Big Short", "Deep Simplicity", "Moneyball", "Flash Boys", "Liar's Poker", "The Fifth Risk", "Bull!", "Going Infinite", "Tools and Weapons", "The Third Chimpanzee"]
    };

    const bookCategoriesContainer = document.querySelector('.books-categories');
    if (bookCategoriesContainer) {
        bookCategoriesContainer.innerHTML = '';
        for (const [title, books] of Object.entries(bookData)) {
            const catDiv = document.createElement('div');
            catDiv.className = 'book-category';
            const h3 = document.createElement('h3');
            h3.textContent = title;
            const linkDiv = document.createElement('div');
            linkDiv.className = 'book-links-horizontal';
            linkDiv.innerHTML = books.join(' | ');
            catDiv.appendChild(h3);
            catDiv.appendChild(linkDiv);
            bookCategoriesContainer.appendChild(catDiv);
        }
    }

    // Fix I: Term Lists (Buffett on Everything)
    const termData = {
        'philosophy': ["Investment Philosophy", "Investment Objectives", "Modern Portfolio Theory", "Value Investing", "Successful Investing", "Intrinsic Value", "Wall Street and Mr Market", "Circle of Competence", "Long Term Investing", "Conservatism", "Security Analyst"],
        'investing': ["Stock Market", "Portfolio Allocation", "Buying Criteria", "Selling Criteria", "Investment Strategy", "Investment Advice", "Investment Risk", "Volatility", "Rumours", "Technical Analysis", "Share Buybacks"],
        'businesses': ["Good Businesses", "Economic Moat", "Good Managers", "Poor Businesses", "Poor Managers", "Airlines", "Auto Insurance", "Banks", "Berkshire Hathaway", "Controlled Businesses", "Derivatives Business"],
        'governance': ["Annual Meetings", "Audit Committee", "Auditors", "Berkshire Compensation", "CEO Compensation", "CEO Mistakes", "Corporate Charity", "Corporate Culture", "Corporate Expense", "Corporate Governance", "Corporate Responsibility"],
        'accounting': ["Accounting Creativity", "Accounting Ratios", "Accounting Goodwill", "Amortization", "Book Value", "Capital Base", "Capital Gain", "Cash Flow", "Compounding", "Debt", "Depreciation"],
        'economics': ["Budget Deficit", "Currency", "Globalisation", "Global Economy", "Gross Domestic Product", "Inflation", "Interest Rates", "International Trade", "Macroeconomics", "Recession", "Trade Imbalance", "US Economy"],
        'miscellaneous': ["Benjamin Graham", "Character", "Charlie Munger", "David Dodd", "Happiness", "Love", "Partnership", "Philanthropy", "Public Pension", "Success", "Taxation", "Unconventional Commitments"]
    };

    for (const [id, terms] of Object.entries(termData)) {
        const panel = document.getElementById(id + '-tab');
        if (panel) {
            panel.innerHTML = `
                <ul class="buffett-topics" style="display: block; columns: 1; list-style: none; padding: 0;">
                    ${terms.map(term => `<li><a href="#" style="text-decoration: none; color: #1e3a8a;">${term}</a></li>`).join('')}
                </ul>
            `;
        }
    }

    // Fix E: Docs 8-10 line spacing
    // Search for specifically the 8-10 items in the classical readings if they are list items
    const readingsList = document.querySelector('.readings-list');
    if (readingsList) {
        const items = readingsList.querySelectorAll('li');
        if (items.length >= 10) {
            const firstSevenStyle = dom.window.getComputedStyle(items[0]);
            const lineHeight = firstSevenStyle.lineHeight || '1.6';
            const marginBottom = firstSevenStyle.marginBottom || '8px';
            for (let i = 7; i < items.length; i++) {
                items[i].style.lineHeight = lineHeight;
                items[i].style.marginBottom = marginBottom;
            }
        }
    }

    fs.writeFileSync(indexPath, dom.serialize(), 'utf8');
}

polishIndex();
console.log('Final polish complete.');
