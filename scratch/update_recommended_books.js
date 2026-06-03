const fs = require('fs');
const cheerio = require('cheerio');

const categories = {
  "buffett-munger": [
    "The Essays of Warren Buffett", "The Snowball", "The Warren Buffett Way", "Warren Buffett Speaks", "Tap Dancing to Work", "Buffett: The Making of an American Capitalist", "The Warren Buffett Portfolio", "Warren Buffett: An Illustrated Biography", "The Deals of Warren Buffett", "Of Permanent Value", "The Essential Buffett", "The Real Warren Buffett", "Berkshire Hathaway Letters to Shareholders", "Damn Right!", "Poor Charlie's Almanack"
  ],
  "value-investing": [
    "The Intelligent Investor", "Security Analysis (1940)", "Security Analysis (2008)", "Benjamin Graham On Value Investing", "Value Investing: From Graham to Buffett and Beyond", "The Rediscovered Benjamin Graham", "The Little Book of Value Investing", "The Little Book That Beats the Market", "You Can Be A Stock Market Genius", "Modern Value Investing", "Dhandho Investor", "Margin of Safety", "Value Investing: Tools and Techniques", "Deep Value", "F Wall St"
  ],
  "share-investing": [
    "How to Make Money in Stocks", "One Up on Wall Street", "A Beginner's Guide to the Stock Market", "Common Sense on Mutual Funds", "The Little Book of Common Sense Investing", "Stocks for the Long Run", "The Five Rules for Successful Stock Investing", "The Little Book That Builds Wealth", "Best Loser Wins", "Stock Market Investing", "The Bogleheads Guide to Investing", "Learn to Earn", "The Art of Quality Investing", "A Random Walk Down Wall Street"
  ],
  "wealth-creation": [
    "How to Get Rich", "Rich Dad Poor Dad", "The Simple Path to Wealth", "I Will Teach You to be Rich", "The Richest Man in Babylon", "The Millionaire Next Door", "The Millionaire Mind", "The Millionaire Fastlane", "The Strategic Millionaire", "Millionaire Mission", "The Science of Getting Rich", "Secrets of the Millionaire Mind", "Simple Money Rich Life", "$1M Money Models", "Money Magnet", "Cashflow Quadrant", "Get Good With Money", "Psychology of Money"
  ],
  "financial-analysis": [
    "Financial Statements", "How to Read a Financial Report", "Financial Shenanigans", "Bemused Investor's Guide to Company Accounts", "Warren Buffett Accounting", "Accounting for Beginners", "Financial Intelligence", "Balance Sheet Basics", "Financial Statement Analysis for Value Investors", "The Interpretation of Financial Statements", "How to Value Company Stocks", "Valuation", "Damodaran on Valuation", "Buffettology"
  ],
  "sales-marketing": [
    "$100M Offers", "$100M Leads", "Sell or Be Sold", "This Is Marketing", "The 1-Page Marketing Plan", "80/20 Sales and Marketing", "Gap Selling", "The Challenger Sale", "The Psychology of Selling", "Selling 101", "Fanatical Prospecting", "Secrets of Closing the Sale", "Ninja Selling", "Go Pro", "Building a Story Brand", "The 22 Immutable Laws of Marketing", "Exactly What To Say", "Sell Like Crazy", "How to be a Great Salesperson", "Way Of the Wolf", "New Sales Simplified"
  ],
  "self-improvement": [
    "Atomic Habits", "The Mountain Is You", "Good Vibes Good Life", "The Power of Discipline", "The Let Them Theory", "Stop Overthinking", "Breaking the Habits of Being Yourself", "The 7 Habits of Highly Effective People", "The 15 Invaluable Laws of Growth", "Success, No Excuses!", "The Master Key System", "How to Talk to Anyone", "When Things Fall Apart", "Self Doubt Workbook for Women", "Love Yourself Like Your Life Depends On It", "Awaken The Giant Within"
  ],
  "business-management": [
    "Never Split the Difference", "The Lean Startup", "Leaders Eat Last", "The Coaching Habit", "The E-Myth Revisited", "Traction", "Surrounded By Idiots", "Profit First", "Personal MBA", "The Infinite Game", "Your Next Five Moves", "Legacy", "The Making of a Manager", "The New One Minute Manager", "The Diary of a CEO", "Million Dollar Weekend", "Build to Sell", "Buy Back Your Time", "Business Made Simple", "12 Months to $1 Million", "What's Your Dream", "Business Book"
  ],
  "miscellaneous": [
    "The Big Short", "Deep Simplicity", "Moneyball", "Flash Boys", "Liar's Poker", "The Fifth Risk", "Bull!", "Going Infinite", "Tools and Weapons", "The Third Chimpanzee", "Selfish Gene", "Three Scientists and their Gods", "Investing Between the Lines", "The Autobiography of Benjamin Franklin", "Extraordinary Popular Delusions and the Madness of Crowds", "A Short History of Nearly Everything", "The Black Swan", "Fooled by Randomness", "Smartest Guys in the Room"
  ]
};

const htmlPath = 'public/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(html, { decodeEntities: false });

const affiliateTag = "carl0c72-20";

function buildLinksHtml(books) {
    let result = '';
    books.forEach((book, index) => {
        const query = encodeURIComponent(book);
        const url = `https://www.amazon.com.au/s?k=${query}&tag=${affiliateTag}`;
        
        result += `<a href="${url}" target="_blank" class="recommended-book-link" style="font-style: normal !important; text-decoration: none; color: inherit;">${book}</a>`;
        if (index < books.length - 1) {
            result += `<span class="comma-text" style="color: #333; font-family: Georgia, serif; font-size: 14px; font-weight: 600;">,&nbsp;</span>`;
        }
        result += '\n';
    });
    return result;
}

// 1. Mobile section update
$('#mobile-book-content .book-category').each(function() {
    const categoryName = $(this).attr('data-category');
    if (categories[categoryName]) {
        const newHtml = buildLinksHtml(categories[categoryName]);
        // replace content inside .book-links-list with the new comma separated layout
        $(this).find('.book-links-list').html(newHtml)
            .removeClass('book-links-list')
            .addClass('comma-separated-list')
            .attr('style', 'display: block !important; padding: 0;');
    }
});

// 2. Desktop section update
const desktopCategoryMapping = {
    "Warren Buffett": "buffett-munger",
    "Value Investing": "value-investing",
    "Share Investing": "share-investing",
    "Wealth Creation": "wealth-creation",
    "Financial Analysis": "financial-analysis",
    "Sales & Marketing": "sales-marketing",
    "Self-Improvement": "self-improvement",
    "Business & Management": "business-management",
    "Miscellaneous": "miscellaneous"
};

$('.recommended-books .books-categories .book-category').each(function() {
    const titleText = $(this).find('h3').text().trim();
    const mappedKey = desktopCategoryMapping[titleText];
    if (mappedKey && categories[mappedKey]) {
        const newHtml = buildLinksHtml(categories[mappedKey]);
        $(this).find('.book-links-horizontal').html(newHtml)
            .removeClass('book-links-horizontal')
            .addClass('comma-separated-list')
            .attr('style', 'display: block !important; padding: 0;');
    }
});

fs.writeFileSync(htmlPath, $.html(), 'utf8');
console.log('Updated Recommended Books with explicit comma layouts and no italics');
