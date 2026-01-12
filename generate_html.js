const fs = require('fs');

const categories = {
  "Buffett/Munger/Berkshire": [
    {
      "title": "The Deals of Warren Buffett",
      "author": "Glen Arnold",
      "price": "$47.10"
    },
    {
      "title": "Warren Buffett: Investor and Entrepreneur",
      "author": "Todd Finkle",
      "price": "$35.38"
    },
    {
      "title": "The Essays of Warren Buffett",
      "author": "Lawrence Cunningham",
      "price": "$51.63"
    },
    {
      "title": "Berkshire Hathaway Letters to Shareholders",
      "author": "Warren Buffett & Max Olson",
      "price": "$6.10"
    },
    {
      "title": "The Warren Buffett Shareholder",
      "author": "Lawrence Cunningham & Stephanie Cuba",
      "price": "$7.75"
    },
    {
      "title": "Warren Buffett and the Value Investing Mindset",
      "author": "Carlos Abad",
      "price": "$13.06"
    },
    {
      "title": "The Warren Buffett Way",
      "author": "Robert Hagstrom",
      "price": "$46.02"
    },
    {
      "title": "Of Permanent Value",
      "author": "Andrew Kilpatrick",
      "price": "$434.99"
    },
    {
      "title": "Buffett: The Making of An American Capitalist",
      "author": "Roger Lowenstein",
      "price": "$39.46"
    },
    {
      "title": "The Snowball",
      "author": "Alice Schroeder",
      "price": "$21.56"
    },
    {
      "title": "Poor Charlie\u0027s Almanack",
      "author": "Charles T. Munger",
      "price": "$47.86"
    },
    {
      "title": "The Warren Buffett CEO",
      "author": "Robert Miles",
      "price": "$50.23"
    },
    {
      "title": "Buffettology",
      "author": "Mary Buffett & David Clark",
      "price": "$32.13"
    },
    {
      "title": "The Complete Financial History of Berkshire Hathaway",
      "author": "Adam Mead",
      "price": "$99.27"
    },
    {
      "title": "Warren Buffett Wealth",
      "author": "Robert Miles",
      "price": "$40.95"
    },
    {
      "title": "Warren Buffett: Inside the Ultimate Money Mind",
      "author": "Robert Hagstrom",
      "price": "$34.72"
    },
    {
      "title": "The Winning Investment Habits of Warren Buffett and George Soros",
      "author": "Mark Tier",
      "price": "$51.88"
    },
    {
      "title": "The Warren Buffett Philosophy of Investment",
      "author": "Elena Chirkova",
      "price": "$45.01"
    },
    {
      "title": "Damn Right!",
      "author": "Janet Lowe",
      "price": "$39.32"
    },
    {
      "title": "The Essential Buffett",
      "author": "Robert Hagstrom",
      "price": "$22.60"
    },
    {
      "title": "The Warren Buffett Portfolio",
      "author": "Robert Hagstrom",
      "price": "$26.95"
    },
    {
      "title": "Seeking Wisdom: From Darwin to Munger",
      "author": "Peter Bevelin",
      "price": "$75.78"
    },
    {
      "title": "The Tao of Warren Buffett",
      "author": "Mary Buffett & David Clark",
      "price": "$29.99"
    },
    {
      "title": "The New Buffettology",
      "author": "Mary Buffett & David Clark",
      "price": "$48.76"
    },
    {
      "title": "University of Berkshire Hathaway",
      "author": "Daniel Pecaut & Corey Wrenn",
      "price": "$18.88"
    },
    {
      "title": "Buffett Beyond Value",
      "author": "Prem Jain",
      "price": "$187.00"
    },
    {
      "title": "Buffett\u0027s 2-Step Stock Market Strategy",
      "author": "Danial Jiwani",
      "price": "$31.74"
    },
    {
      "title": "Warren Buffett\u0027s 3 Favorite Books",
      "author": "Preston George Pysh",
      "price": "$29.32"
    },
    {
      "title": "A Few Lessons for Investors and Managers",
      "author": "Warren Buffett & Peter Bevelin",
      "price": "$31.54"
    },
    {
      "title": "Warren Buffett\u0027s Ground Rules",
      "author": "Jeremy Miller",
      "price": "$19.25"
    },
    {
      "title": "Warren Buffett Speaks",
      "author": "Janet Lowe",
      "price": "$23.23"
    },
    {
      "title": "Invest Like Warren Buffett",
      "author": "Matthew Kratter",
      "price": "$10.15"
    },
    {
      "title": "Buying Like Buffett",
      "author": "Jonathan Belliveau",
      "price": "$5.56"
    },
    {
      "title": "Warren Buffett on Business",
      "author": "Warren Buffett & Richard Connors",
      "price": "$31.54"
    },
    {
      "title": "Tap Dancing To Work",
      "author": "Carol Loomis",
      "price": "$27.99"
    },
    {
      "title": "The Warren Buffett Stock Portfolio",
      "author": "Mary Buffett & David Clark",
      "price": "$17.35"
    },
    {
      "title": "Charlie Munger: The Complete Investor",
      "author": "Tren Griffin",
      "price": "$24.61"
    },
    {
      "title": "Capital Allocation",
      "author": "Jacob McDonough",
      "price": "$32.52"
    },
    {
      "title": "How to Think Like Benjamin Graham and Invest Like Warren Buffett",
      "author": "Lawrence Cunningham",
      "price": "$76.97"
    },
    {
      "title": "Warren Buffett: 43 Lessons for Business & Life",
      "author": "Keith Lard",
      "price": "$21.20"
    },
    {
      "title": "Warren Buffett Invests Like a Girl",
      "author": "Motley Fool & Louann Lofton",
      "price": "$21.23"
    },
    {
      "title": "Warren Buffett\u0027s Management Secrets",
      "author": "Mary Buffett & David Clark",
      "price": "$20.85"
    },
    {
      "title": "101 Reasons to Own the World\u0027s Greatest Investment",
      "author": "Robert Miles",
      "price": "$38.74"
    },
    {
      "title": "How to Pick Stocks Like Warren Buffett",
      "author": "Timothy Vick",
      "price": "$54.39"
    },
    {
      "title": "Think, Act and Invest Like Warren Buffett",
      "author": "Larry Swedroe",
      "price": "$27.73"
    },
    {
      "title": "The Real Warren Buffett",
      "author": "James O\u0027Loughlin",
      "price": "$58.31"
    },
    {
      "title": "Even Buffett Isn\u0027t Perfect",
      "author": "Janjigian Vahan",
      "price": "$63.59"
    },
    {
      "title": "Trade Like Warren Buffett",
      "author": "James Altucher",
      "price": "$68.55"
    },
    {
      "title": "The Warren Buffett: The Good Guy of Wall Street",
      "author": "Andrew Kilpatrick",
      "price": "$269.00"
    }
  ],
  "Value Investing": [
    {
      "title": "The Interpretation of Financial Statements",
      "author": "Benjamin Graham",
      "price": "$24.99"
    },
    {
      "title": "Security Analysis (2nd ed)",
      "author": "Benjamin Graham and David Dodd",
      "price": "$89.99"
    },
    {
      "title": "Security Analysis (7th ed)",
      "author": "Benjamin Graham and David Dodd",
      "price": "$95.99"
    },
    {
      "title": "Security Analysis (1st ed)",
      "author": "Benjamin Graham and David Dodd",
      "price": "$79.99"
    },
    {
      "title": "Security Analysis (3rd ed)",
      "author": "Benjamin Graham and David Dodd",
      "price": "$85.99"
    },
    {
      "title": "Security Analysis (6th ed)",
      "author": "Benjamin Graham and David Dodd",
      "price": "$92.99"
    },
    {
      "title": "Margin of Safety",
      "author": "Seth Klarman",
      "price": "$45.99"
    },
    {
      "title": "The Intelligent Investor (3rd ed)",
      "author": "Benjamin Graham",
      "price": "$25.99"
    },
    {
      "title": "The Intelligent Investor (Revised Edition)",
      "author": "Benjamin Graham",
      "price": "$25.99"
    },
    {
      "title": "The Intelligent Investor: The Classic Text On Value Investing",
      "author": "Benjamin Graham",
      "price": "$25.99"
    },
    {
      "title": "Value Investing: From Graham to Buffett and Beyond (2nd edn)",
      "author": "Greenwald, Kahn, Bellissimo, Cooper, Santos",
      "price": "$39.99"
    },
    {
      "title": "Investing the Templeton Way",
      "author": "Lauren Templeton and Scott Phillips",
      "price": "$32.99"
    },
    {
      "title": "Benjamin Graham\u0027s Net-Net Stock Strategy",
      "author": "Evan Bleker",
      "price": "$24.99"
    },
    {
      "title": "Good Stocks Cheap",
      "author": "Kenneth Marshall",
      "price": "$28.99"
    },
    {
      "title": "The Joys Of Compounding",
      "author": "Gautam Baid",
      "price": "$19.99"
    },
    {
      "title": "Benjamin Graham on Investing",
      "author": "Benjamin Graham and Rodney G Klein",
      "price": "$22.99"
    },
    {
      "title": "The Little Book of Value Investing",
      "author": "Christopher Browne",
      "price": "$22.99"
    },
    {
      "title": "The Little Book That Still Beats the Market",
      "author": "Joel Greenblatt",
      "price": "$24.99"
    },
    {
      "title": "You Can Be A Stockmarket Genius",
      "author": "Joel Greenblatt",
      "price": "$26.99"
    },
    {
      "title": "Value Investing For Dummies",
      "author": "Peter Sander and Janet Haley",
      "price": "$29.99"
    },
    {
      "title": "The Education of a Value Investor",
      "author": "Guy Spier",
      "price": "$35.99"
    },
    {
      "title": "The 8-Step Beginner\u0027s Guide to Value Investing",
      "author": "Freeman Publications",
      "price": "$15.99"
    },
    {
      "title": "The Dhandho Investor",
      "author": "Mohnish Pabrai",
      "price": "$27.99"
    },
    {
      "title": "Invest Like a Guru",
      "author": "Charlie Tian",
      "price": "$31.99"
    },
    {
      "title": "Deep Value",
      "author": "Tobias Carlisle",
      "price": "$33.99"
    },
    {
      "title": "Active Value Investing",
      "author": "Vitaliy Katsenelson",
      "price": "$39.99"
    },
    {
      "title": "Value Investing in Growth Companies",
      "author": "Rusmin Ang and Victor Chng",
      "price": "$45.99"
    },
    {
      "title": "Mosaic: Perspectives on Investing",
      "author": "Mohnish Pabrai",
      "price": "$29.99"
    },
    {
      "title": "The Manual of Ideas",
      "author": "John Mihaljevic",
      "price": "$49.99"
    },
    {
      "title": "Modern Value Investing",
      "author": "Sven Carlin",
      "price": "$34.99"
    },
    {
      "title": "Benjamin Graham: The Father of Financial Analysis",
      "author": "Irving Kahn and Robert Milne",
      "price": "$42.99"
    },
    {
      "title": "The Little Book That Beats the Market",
      "author": "Joel Greenblatt",
      "price": "$24.99"
    },
    {
      "title": "Getting Started in Value Investing",
      "author": "Charles S Mizrahi",
      "price": "$26.99"
    },
    {
      "title": "Value Investing: From Graham to Buffett and Beyond",
      "author": "Greenwald, Kahn, Bellissimo, Cooper, Santos",
      "price": "$39.99"
    },
    {
      "title": "Quantitative Value",
      "author": "Wesley Gray and Tobias Carlisle",
      "price": "$41.99"
    },
    {
      "title": "The Acquirer\u0027s Multiple",
      "author": "Tobias Carlisle",
      "price": "$37.99"
    },
    {
      "title": "Applied Value Investing",
      "author": "Joseph Calandro",
      "price": "$43.99"
    },
    {
      "title": "Value Trap",
      "author": "Brian Nelson",
      "price": "$38.99"
    },
    {
      "title": "All About Value Investing",
      "author": "Esme Faerber",
      "price": "$31.99"
    },
    {
      "title": "Benjamin Graham and the Power of Growth Stocks",
      "author": "Martin, Hansen, Link, Nicoski",
      "price": "$36.99"
    },
    {
      "title": "The Business of Value Investing",
      "author": "Sham Gad",
      "price": "$44.99"
    },
    {
      "title": "The Net Current Asset Value Approach to Stock Investing",
      "author": "Victor Wendl",
      "price": "$27.99"
    },
    {
      "title": "The Conscious Investor",
      "author": "John Price",
      "price": "$33.99"
    },
    {
      "title": "F Wall Street",
      "author": "Joe Ponzio",
      "price": "$28.99"
    },
    {
      "title": "Value Investing with Masters",
      "author": "Kirk Kazanjian",
      "price": "$35.99"
    },
    {
      "title": "Value.able",
      "author": "Roger Montgomery",
      "price": "$29.99"
    },
    {
      "title": "Concise Guide to Value Investing",
      "author": "Brian McNiven",
      "price": "$24.99"
    },
    {
      "title": "The Power of Modern Value Investing",
      "author": "Gary Smith and Margaret Smith",
      "price": "$41.99"
    },
    {
      "title": "Value Investing Made Easy",
      "author": "Janet Lowe",
      "price": "$26.99"
    },
    {
      "title": "Benjamin Graham On Value Investing",
      "author": "Janet Lowe",
      "price": "$22.99"
    },
    {
      "title": "The Value Investors",
      "author": "Ronald Chan",
      "price": "$38.99"
    },
    {
      "title": "The Making of a Value Investor",
      "author": "Gautam Baid",
      "price": "$32.99"
    },
    {
      "title": "Deep Value Investing",
      "author": "Jeroen Bos",
      "price": "$33.99"
    },
    {
      "title": "The Art of Value Investing",
      "author": "Heins and Tilson",
      "price": "$39.99"
    },
    {
      "title": "Value Investing For Beginners",
      "author": "Kevin Bailey",
      "price": "$16.99"
    },
    {
      "title": "Modern Security Analysis",
      "author": "Whitman and Diz",
      "price": "$47.99"
    },
    {
      "title": "Value Investing: Tools and Techniques",
      "author": "James Montier",
      "price": "$42.99"
    },
    {
      "title": "The Secrets of Value Investing You Need to Know",
      "author": "JD Rams",
      "price": "$21.99"
    },
    {
      "title": "Strategic Value Investing",
      "author": "Horan, Johnson, Robinson",
      "price": "$43.99"
    },
    {
      "title": "Taking Charge with Value Investing",
      "author": "Brian Nichols",
      "price": "$36.99"
    },
    {
      "title": "Ben Graham Was a Quant",
      "author": "Steven Greiner",
      "price": "$34.99"
    },
    {
      "title": "Value Investing Today",
      "author": "Charles Brandes",
      "price": "$37.99"
    },
    {
      "title": "What Would Ben Graham Do Now?",
      "author": "Jeffrey Towson",
      "price": "$31.99"
    },
    {
      "title": "Concentrated Investing",
      "author": "Benello, van Biema, Carlisle",
      "price": "$39.99"
    },
    {
      "title": "Value Investing in Real Estate",
      "author": "Gary Eldred",
      "price": "$35.99"
    },
    {
      "title": "Value Investing Checklist",
      "author": "Vivek Coudhary",
      "price": "$19.99"
    },
    {
      "title": "The Triumph of Value Investing",
      "author": "Janet Lowe",
      "price": "$29.99"
    },
    {
      "title": "Value Returns",
      "author": "Randy Beeman and James Schneider",
      "price": "$32.99"
    },
    {
      "title": "Value Investing Simplified",
      "author": "Cayden Chang",
      "price": "$22.99"
    },
    {
      "title": "What Is Value Investing?",
      "author": "Lawrence Cunningham",
      "price": "$25.99"
    },
    {
      "title": "The 5 Keys to Value Investing",
      "author": "J Dennis Jean-Jacques",
      "price": "$17.99"
    },
    {
      "title": "Value Investing: A Balanced Approach",
      "author": "Martin Whitman",
      "price": "$38.99"
    },
    {
      "title": "New Era Value Investing",
      "author": "Nancy Tengler",
      "price": "$36.99"
    }
  ],
  "Share Investing": [
    {
      "title": "Stock Investing for Beginners",
      "author": "Everyman Investing",
      "price": "$18.99"
    },
    {
      "title": "The Little Book of Common Sense Investing",
      "author": "John Bogle",
      "price": "$21.99"
    },
    {
      "title": "The Neatest Little Guide to Stock Market Investing",
      "author": "Jason Kelly",
      "price": "$16.99"
    },
    {
      "title": "Stock Market Wizards",
      "author": "Jack Schwager",
      "price": "$29.99"
    },
    {
      "title": "The Art of Quality Investing",
      "author": "Luc Kroeze",
      "price": "$34.99"
    },
    {
      "title": "A Random Walk Down Wall Street",
      "author": "Burton Malkiel",
      "price": "$26.99"
    },
    {
      "title": "Stocks for the Long Run",
      "author": "Jeremy Siegel",
      "price": "$29.99"
    },
    {
      "title": "Get Started Investing",
      "author": "Alec Renehan & Bryce Leske",
      "price": "$24.99"
    },
    {
      "title": "Girls That Invest",
      "author": "Simran Kaur",
      "price": "$22.99"
    },
    {
      "title": "Trade Like a Stock Market Wizard",
      "author": "Mark Minervini",
      "price": "$31.99"
    },
    {
      "title": "The Bogleheads' Guide to Investing",
      "author": "Mel Lindauer et al.",
      "price": "$27.99"
    },
    {
      "title": "Think & Trade Like a Champion",
      "author": "Mark Minervini",
      "price": "$32.99"
    },
    {
      "title": "Hedge Fund Market Wizards",
      "author": "Jack Schwager",
      "price": "$33.99"
    },
    {
      "title": "The Four Pillars of Investing",
      "author": "William Bernstein",
      "price": "$24.99"
    },
    {
      "title": "The Elements of Investing",
      "author": "Burton Malkiel & Charles Ellis",
      "price": "$23.99"
    },
    {
      "title": "The New Market Wizards",
      "author": "Jack Schwager",
      "price": "$31.99"
    },
    {
      "title": "Unknown Market Wizards",
      "author": "Jack Schwager",
      "price": "$35.99"
    },
    {
      "title": "The Most Important Thing",
      "author": "Howard Marks",
      "price": "$28.99"
    },
    {
      "title": "What Works on Wall Street (4th ed)",
      "author": "James O'Shaughnessy",
      "price": "$39.99"
    },
    {
      "title": "The Little Book of Big Profits from Small Stocks",
      "author": "Hilary Kramer",
      "price": "$22.99"
    },
    {
      "title": "The Five Rules for Successful Stock Investing",
      "author": "Pat Dorsey",
      "price": "$23.99"
    },
    {
      "title": "Stock Market 101",
      "author": "Michele Cagan",
      "price": "$19.99"
    },
    {
      "title": "Trading in the Zone",
      "author": "Mark Douglas",
      "price": "$26.99"
    },
    {
      "title": "Trading Psychology",
      "author": "Bennett Zamani & Matthew Pryzby",
      "price": "$29.99"
    },
    {
      "title": "Charting and Technical Analysis",
      "author": "Fred Mcallen",
      "price": "$41.99"
    },
    {
      "title": "Technical Analysis of the Financial Markets",
      "author": "John Murphy",
      "price": "$49.99"
    },
    {
      "title": "Common Sense on Mutual Funds",
      "author": "John Bogle & David Swensen",
      "price": "$25.99"
    },
    {
      "title": "Beating the Street",
      "author": "Peter Lynch",
      "price": "$21.99"
    },
    {
      "title": "Learn to Earn",
      "author": "Peter Lynch",
      "price": "$18.99"
    },
    {
      "title": "Common Stocks and Uncommon Profits",
      "author": "Philip Fisher",
      "price": "$23.99"
    },
    {
      "title": "How to Make Money in Stocks",
      "author": "William O'Neil",
      "price": "$29.99"
    },
    {
      "title": "Investing for Growth",
      "author": "Terry Smith",
      "price": "$32.99"
    },
    {
      "title": "The Clash of the Cultures",
      "author": "John Bogle",
      "price": "$26.99"
    },
    {
      "title": "100 Baggers",
      "author": "Christopher Mayer",
      "price": "$27.99"
    },
    {
      "title": "The Little Investment That Beats the Market",
      "author": "Joel Greenblatt",
      "price": "$24.99"
    },
    {
      "title": "Reminiscences of a Stock Operator",
      "author": "Edwin Lefèvre",
      "price": "$19.99"
    },
    {
      "title": "The Little Book of Big Dividends",
      "author": "Charles Carlson",
      "price": "$21.99"
    },
    {
      "title": "Extraordinary Popular Delusions",
      "author": "Charles Mackay",
      "price": "$16.99"
    },
    {
      "title": "How to Pick Quality Shares",
      "author": "Phil Oakley",
      "price": "$28.99"
    },
    {
      "title": "How to Day Trade for a Living",
      "author": "Andrew Azia",
      "price": "$24.99"
    },
    {
      "title": "You Can Be a Stock Market Genius",
      "author": "Joel Greenblatt",
      "price": "$26.99"
    },
    {
      "title": "The Man Who Solved the Market",
      "author": "Gregory Zuckerman",
      "price": "$29.99"
    },
    {
      "title": "A Piece of the Action",
      "author": "Joe Nocera",
      "price": "$31.99"
    },
    {
      "title": "Where Are the Customers' Yachts?",
      "author": "Fred Schwed Jr",
      "price": "$17.99"
    },
    {
      "title": "Confidence Game",
      "author": "Christine Richard",
      "price": "$33.99"
    },
    {
      "title": "John Bogle on Investing",
      "author": "John Bogle",
      "price": "$24.99"
    },
    {
      "title": "Paths to Wealth through Common Stocks",
      "author": "Philip Fisher",
      "price": "$24.99"
    },
    {
      "title": "How to Make Money in Stocks (Beginner's Guide)",
      "author": "Fred Green",
      "price": "$22.99"
    },
    {
      "title": "Bogle on Mutual Funds",
      "author": "John Bogle",
      "price": "$26.99"
    },
    {
      "title": "A Beginner's Guide to the Stock Market",
      "author": "Matthew Kratter",
      "price": "$19.99"
    },
    {
      "title": "Irrational Exuberance",
      "author": "Robert Shiller",
      "price": "$27.99"
    },
    {
      "title": "Fooled by Randomness",
      "author": "Nassim Taleb",
      "price": "$24.99"
    },
    {
      "title": "Fooling Some of the People All of the Time",
      "author": "David Einhorn",
      "price": "$29.99"
    },
    {
      "title": "The Little Book of Behavioral Investing",
      "author": "James Montier",
      "price": "$22.99"
    },
    {
      "title": "Liar's Poker",
      "author": "Michael Lewis",
      "price": "$21.99"
    },
    {
      "title": "The Little Book of Main Street Money",
      "author": "Jonathan Clements",
      "price": "$20.99"
    },
    {
      "title": "The Little Book of Bulletproof Investing",
      "author": "Ben Stein & Phil DeMuth",
      "price": "$19.99"
    },
    {
      "title": "Trading: Technical Analysis Masterclass",
      "author": "Rolf Schlotmann & Moritz Czubatinski",
      "price": "$49.99"
    },
    {
      "title": "The Great Crash 1929",
      "author": "John Kenneth Galbraith",
      "price": "$18.99"
    },
    {
      "title": "How to Value Real Estate Investment Trusts (REITs) in Australia",
      "author": "Carlos Abad",
      "price": "$29.99"
    },
    {
      "title": "Stock Investing for Beginners: Fantastic Moats",
      "author": "Freeman Publications",
      "price": "$17.99"
    },
    {
      "title": "The Alchemy of Finance",
      "author": "George Soros",
      "price": "$26.99"
    },
    {
      "title": "The Little Book of Investing Like the Pros",
      "author": "Joshua Pearl & Joshua Rosenbaum",
      "price": "$23.99"
    },
    {
      "title": "The Ultimate Industry Guide for Australian Publicly-Listed Companies",
      "author": "Carlos Abad",
      "price": "$39.99"
    },
    {
      "title": "When the Wolves Bite",
      "author": "Scott Wapner",
      "price": "$28.99"
    },
    {
      "title": "Why Are We So Clueless About the Stock Market?",
      "author": "Mariusz Skonieczny",
      "price": "$25.99"
    },
    {
      "title": "Stock Investing For Dummies",
      "author": "Paul Mladjenovic",
      "price": "$26.99"
    },
    {
      "title": "The Little Book of Safe Money",
      "author": "Jason Zweig",
      "price": "$21.99"
    },
    {
      "title": "The Little Book of Bull Moves (Updated)",
      "author": "Peter Schiff",
      "price": "$23.99"
    },
    {
      "title": "The Holy Grail of Investing",
      "author": "Tony Robbins & Christopher Zook",
      "price": "$31.99"
    },
    {
      "title": "Big Mistakes",
      "author": "Michael Batnick",
      "price": "$24.99"
    },
    {
      "title": "How to Value a Major Australian Bank",
      "author": "Carlos Abad",
      "price": "$27.99"
    },
    {
      "title": "Fundamental Analysis Essentials",
      "author": "Brian Hale",
      "price": "$34.99"
    },
    {
      "title": "Success in the Stock Market",
      "author": "James Emanuel",
      "price": "$29.99"
    },
    {
      "title": "The Complete Idiot's Guide to Stock Investing",
      "author": "Fisher Sarah Young & Shelly Susan",
      "price": "$24.99"
    },
    {
      "title": "The Quick-Start Guide to Investing",
      "author": "Glen James & Nick Bradley",
      "price": "$21.99"
    },
    {
      "title": "The Alpha Masters",
      "author": "Maneet Ahuja",
      "price": "$33.99"
    },
    {
      "title": "The Little Book of Trading",
      "author": "Michael Covel",
      "price": "$23.99"
    },
    {
      "title": "The Biography of Bill Ackman",
      "author": "Daniel Gray",
      "price": "$26.99"
    },
    {
      "title": "The Large-Cap Portfolio",
      "author": "Thomas Villalta",
      "price": "$34.99"
    },
    {
      "title": "The Money Game",
      "author": "Adam Smith",
      "price": "$24.99"
    },
    {
      "title": "The Strategic Millionaire",
      "author": "Armando Pantoja",
      "price": "$29.99"
    },
    {
      "title": "Simple Money, Rich Life",
      "author": "Bob Lotich",
      "price": "$26.99"
    },
    {
      "title": "Broken Money",
      "author": "Lyn Alden",
      "price": "$34.99"
    },
    {
      "title": "Millionaire Mission",
      "author": "Brian Preston",
      "price": "$27.99"
    },
    {
      "title": "You're Already a Wealth Heiress!",
      "author": "Linda Jones",
      "price": "$24.99"
    },
    {
      "title": "The Barefoot Investor",
      "author": "Scott Pape",
      "price": "$22.99"
    },
    {
      "title": "Get Good with Money",
      "author": "Tiffany Aliche",
      "price": "$28.99"
    },
    {
      "title": "7 Strategies For Wealth And Happiness",
      "author": "Jim John",
      "price": "$25.99"
    },
    {
      "title": "A Happy Pocket Full of Money",
      "author": "David Cameron Gikandi",
      "price": "$23.99"
    },
    {
      "title": "It's Not Your Money",
      "author": "Tosha Silver",
      "price": "$26.99"
    },
    {
      "title": "Poverty, Riches and Wealth",
      "author": "Kris Vallotton",
      "price": "$24.99"
    },
    {
      "title": "How Money Works",
      "author": "Dorling Kindersley",
      "price": "$19.99"
    },
    {
      "title": "The Price of Money",
      "author": "Rob Dix",
      "price": "$31.99"
    },
    {
      "title": "The White Coat Investor",
      "author": "James Dahle",
      "price": "$34.99"
    },
    {
      "title": "Buy Back Your Time",
      "author": "Dan Martell",
      "price": "$27.99"
    },
    {
      "title": "Wealth Choice",
      "author": "Dennis Kimbro",
      "price": "$25.99"
    },
    {
      "title": "Think And Grow Rich",
      "author": "Napoleon Hill",
      "price": "$16.99"
    },
    {
      "title": "The Simple Path to Wealth",
      "author": "J.L. Collins",
      "price": "$24.99"
    },
    {
      "title": "The Millionaire Fastlane",
      "author": "MJ DeMarco",
      "price": "$29.99"
    },
    {
      "title": "You Are a Badass at Making Money",
      "author": "Jen Sincero",
      "price": "$26.99"
    },
    {
      "title": "Richer, Wiser, Happier",
      "author": "William Green",
      "price": "$32.99"
    },
    {
      "title": "Tax-Free Wealth",
      "author": "Tom Wheelwright",
      "price": "$28.99"
    },
    {
      "title": "Rich As Fck*",
      "author": "Amanda Frances",
      "price": "$27.99"
    },
    {
      "title": "Abundance Now",
      "author": "Lisa Nichols & Janet Switzer",
      "price": "$29.99"
    },
    {
      "title": "The Magic of Manifesting Money",
      "author": "Ryuu Shinohara",
      "price": "$24.99"
    },
    {
      "title": "Secrets of Six-Figure Women",
      "author": "Barbara Stanny",
      "price": "$26.99"
    },
    {
      "title": "Why the Rich Are Getting Richer",
      "author": "Robert Kiyosaki",
      "price": "$19.99"
    },
    {
      "title": "Rich Dad's Increase Your Financial IQ",
      "author": "Robert Kiyosaki",
      "price": "$21.99"
    },
    {
      "title": "Money Magnet",
      "author": "Steve McKnight",
      "price": "$28.99"
    },
    {
      "title": "Smart Women Finish Rich",
      "author": "David Bach",
      "price": "$24.99"
    },
    {
      "title": "Your Next Five Moves",
      "author": "Patrick Bet-David",
      "price": "$31.99"
    },
    {
      "title": "Profit First",
      "author": "Mike Michalowicz",
      "price": "$27.99"
    },
    {
      "title": "Investing for Kids",
      "author": "Dylin Redling & Allison Tom",
      "price": "$22.99"
    },
    {
      "title": "The Compound Effect",
      "author": "Darren Hardy",
      "price": "$25.99"
    },
    {
      "title": "The Total Money Makeover",
      "author": "Dave Ramsey",
      "price": "$23.99"
    },
    {
      "title": "Dave Ramsey's Complete Guide to Money",
      "author": "Dave Ramsey",
      "price": "$29.99"
    },
    {
      "title": "Smart Money Smart Kids",
      "author": "Dave Ramsey & Rachel Cruze",
      "price": "$24.99"
    },
    {
      "title": "The Millionaire Mind",
      "author": "Thomas Stanley",
      "price": "$26.99"
    },
    {
      "title": "Rich Dad Poor Dad",
      "author": "Robert Kiyosaki",
      "price": "$16.99"
    },
    {
      "title": "I Will Teach You to Be Rich",
      "author": "Ramit Sethi",
      "price": "$24.99"
    },
    {
      "title": "Principles: Life and Work",
      "author": "Ray Dalio",
      "price": "$39.99"
    },
    {
      "title": "The Psychology of Money",
      "author": "Morgan Housel",
      "price": "$22.99"
    },
    {
      "title": "Rich Dad's Guide to Investing",
      "author": "Robert Kiyosaki",
      "price": "$24.99"
    },
    {
      "title": "Rich Dad's CASHFLOW Quadrant",
      "author": "Robert Kiyosaki",
      "price": "$19.99"
    },
    {
      "title": "7 Steps to Wealth",
      "author": "John Fitzgerald",
      "price": "$26.99"
    },
    {
      "title": "Rich AF",
      "author": "Vivian Tu",
      "price": "$28.99"
    },
    {
      "title": "Rich Dad's Who Took My Money?",
      "author": "Robert Kiyosaki",
      "price": "$21.99"
    },
    {
      "title": "Secrets Of The Millionaire Mind",
      "author": "T. Harv Eker",
      "price": "$23.99"
    },
    {
      "title": "Retire Young Retire Rich",
      "author": "Robert Kiyosaki",
      "price": "$22.99"
    },
    {
      "title": "The Wealth Mindset",
      "author": "Neville Goddard & Tim Grimes",
      "price": "$27.99"
    },
    {
      "title": "The One Week Budget",
      "author": "Tiffany Aliche",
      "price": "$25.99"
    },
    {
      "title": "You Need a Budget",
      "author": "Jesse Mecham",
      "price": "$24.99"
    },
    {
      "title": "Baby Steps Millionaires",
      "author": "Dave Ramsey",
      "price": "$26.99"
    },
    {
      "title": "The Financial Peace Planner",
      "author": "Dave Ramsey",
      "price": "$31.99"
    },
    {
      "title": "How to Get Rich",
      "author": "Felix Dennis",
      "price": "$29.99"
    },
    {
      "title": "The Science of Getting Rich",
      "author": "Wallace Wattles",
      "price": "$14.99"
    },
    {
      "title": "Millionaire Next Door",
      "author": "Thomas Stanley & William Danko",
      "price": "$19.99"
    },
    {
      "title": "The Richest Man in Babylon",
      "author": "George S. Clason",
      "price": "$12.99"
    },
    {
      "title": "Think and Grow Rich (Original)",
      "author": "Napoleon Hill",
      "price": "$16.99"
    },
    {
      "title": "How to Become Sustainably Rich",
      "author": "Clay Clark",
      "price": "$32.99"
    },
    {
      "title": "Your Money or Your Life",
      "author": "Vicki Robin",
      "price": "$21.99"
    },
    {
      "title": "Same as Ever",
      "author": "Morgan Housel",
      "price": "$28.99"
    },
    {
      "title": "One Thousand Ways to Make $1000",
      "author": "F.C. Minaker",
      "price": "$18.99"
    },
    {
      "title": "The 4-Hour Work Week",
      "author": "Timothy Ferriss",
      "price": "$26.99"
    },
    {
      "title": "Supermoney",
      "author": "Adam Smith",
      "price": "$27.99"
    },
    {
      "title": "How To Get Rich Before 30",
      "author": "A.B. Stanley",
      "price": "$24.99"
    },
    {
      "title": "How to Become Rich and Successful",
      "author": "Ernesto Martinez",
      "price": "$29.99"
    },
    {
      "title": "Jim Cramer's Get Rich Carefully",
      "author": "James Cramer",
      "price": "$31.99"
    },
    {
      "title": "The Miracle Morning",
      "author": "Hal Elrod",
      "price": "$22.99"
    },
    {
      "title": "Die With Zero",
      "author": "Bill Perkins",
      "price": "$26.99"
    },
    {
      "title": "How To Be Rich",
      "author": "J. Paul Getty",
      "price": "$24.99"
    },
    {
      "title": "Take on the Street",
      "author": "Arthur Levitt",
      "price": "$28.99"
    },
    {
      "title": "Rich Dad Poor Dad for Teens",
      "author": "Robert Kiyosaki",
      "price": "$18.99"
    },
    {
      "title": "Blueprint to Wealth",
      "author": "Gary Stone",
      "price": "$31.99"
    },
    {
      "title": "The Missing Billionaires",
      "author": "Victor Haghani & James White",
      "price": "$34.99"
    },
    {
      "title": "Enough",
      "author": "John Bogle",
      "price": "$25.99"
    },
    {
      "title": "A 9-Step Path To Financial Independence",
      "author": "Joe Dominguez, Vicki Robin & Monica Wood",
      "price": "$27.99"
    }
  ],
  "Wealth Creation": [
    {
      "title": "How To: $10M",
      "author": "William Brown",
      "price": "$21.44"
    },
    {
      "title": "Undisruptable",
      "author": "Aidan McCullen",
      "price": "$33.84"
    },
    {
      "title": "Valuepreneurs",
      "author": "Steve Waddell",
      "price": "$33.03"
    },
    {
      "title": "$100M Offers",
      "author": "Alex Hormozi",
      "price": "$39.59"
    },
    {
      "title": "$100M Leads",
      "author": "Alex Hormozi",
      "price": "$43.94"
    },
    {
      "title": "The EXITPreneur's Playbook",
      "author": "Joe Valley",
      "price": "$28.10"
    },
    {
      "title": "How to Build a Billion-Dollar Business",
      "author": "Radek Sali & Bernadette Schwerdt",
      "price": "$21.56"
    },
    {
      "title": "Million Dollar Weekend",
      "author": "Noah Kagan",
      "price": "$28.49"
    },
    {
      "title": "Hustle Harder, Hustle Smarter",
      "author": "Curtis \"50 Cent\" Jackson",
      "price": "$22.32"
    },
    {
      "title": "Extreme Revenue Growth",
      "author": "Victor Cheng",
      "price": "$41.37"
    },
    {
      "title": "Your Next Five Moves",
      "author": "Patrick Bet-David",
      "price": "$25.40"
    },
    {
      "title": "Microsoft Secrets",
      "author": "Cusumano & Selby",
      "price": "$41.41"
    },
    {
      "title": "The Diary of a CEO",
      "author": "Steven Bartlett",
      "price": "$22.00"
    },
    {
      "title": "Dotcom Secrets",
      "author": "Russell Brunson",
      "price": "$23.09"
    },
    {
      "title": "UNSCRIPTED",
      "author": "MJ DeMarco",
      "price": "$29.61"
    },
    {
      "title": "Start Your Own Corporation",
      "author": "Garrett Sutton",
      "price": "$47.81"
    },
    {
      "title": "Rich Dad's Before You Quit Your Job",
      "author": "Robert Kiyosaki",
      "price": "$23.09"
    },
    {
      "title": "From the Trash Man to the Cash Man",
      "author": "Myron Golden",
      "price": "$321.82"
    },
    {
      "title": "Profit First",
      "author": "Mike Michalowicz",
      "price": "$26.00"
    },
    {
      "title": "12 Months to $1 Million",
      "author": "Ryan Moran",
      "price": "$38.50"
    },
    {
      "title": "Steve Jobs",
      "author": "Walter Isaacson",
      "price": "$19.25"
    },
    {
      "title": "Built to Sell",
      "author": "John Warrillow",
      "price": "$20.79"
    },
    {
      "title": "The Prosperous Coach",
      "author": "Chandler & Litvin",
      "price": "$98.41"
    },
    {
      "title": "Business Made Simple",
      "author": "Donald Miller",
      "price": "$21.56"
    },
    {
      "title": "Shoe Dog",
      "author": "Phil Knight",
      "price": "$15.00"
    },
    {
      "title": "Good to Great",
      "author": "Jim Collins",
      "price": "$25.44"
    },
    {
      "title": "Maverick!",
      "author": "Ricardo Semler",
      "price": "$24.99"
    },
    {
      "title": "Competitive Strategy",
      "author": "Michael Porter",
      "price": "$25.40"
    },
    {
      "title": "Built to Last",
      "author": "Collins & Porras",
      "price": "$25.16"
    },
    {
      "title": "Who Moved My Cheese?",
      "author": "Spencer Johnson",
      "price": "$12.00"
    },
    {
      "title": "The E Myth Revisited",
      "author": "Michael Gerber",
      "price": "$19.00"
    },
    {
      "title": "Blue Ocean Strategy",
      "author": "Kim & Mauborgne",
      "price": "$34.99"
    },
    {
      "title": "Traction",
      "author": "Gino Wickman",
      "price": "$18.19"
    },
    {
      "title": "Business Model Generation",
      "author": "Osterwalder & Pigneur",
      "price": "$34.77"
    },
    {
      "title": "The Power of Broke",
      "author": "Daymond John",
      "price": "$31.59"
    },
    {
      "title": "Titan",
      "author": "Ron Chernow",
      "price": "$40.39"
    },
    {
      "title": "Dare to Lead",
      "author": "Brené Brown",
      "price": "$16.00"
    },
    {
      "title": "The Outsiders",
      "author": "William Thorndike",
      "price": "$22.77"
    },
    {
      "title": "The Hard Thing About Hard Things",
      "author": "Ben Horowitz",
      "price": "$28.81"
    },
    {
      "title": "Leadership and Self-Deception",
      "author": "Arbinger Institute",
      "price": "$23.09"
    },
    {
      "title": "Twelve and a Half",
      "author": "Gary Vaynerchuk",
      "price": "$34.99"
    },
    {
      "title": "Jab, Jab, Jab, Right Hook",
      "author": "Gary Vaynerchuk",
      "price": "$30.79"
    },
    {
      "title": "High Output Management",
      "author": "Andrew Grove",
      "price": "$11.58"
    },
    {
      "title": "Sam Walton: Made In America",
      "author": "Sam Walton",
      "price": "$13.09"
    },
    {
      "title": "No Rules Rules",
      "author": "Hastings & Meyer",
      "price": "$26.96"
    },
    {
      "title": "First A Dream",
      "author": "Jim Clayton",
      "price": "$75.20"
    },
    {
      "title": "The Man Behind the Microchip",
      "author": "Leslie Berlin",
      "price": "$51.95"
    },
    {
      "title": "Business @ the Speed of Thought",
      "author": "Bill Gates",
      "price": "$64.71"
    },
    {
      "title": "The Personal MBA",
      "author": "Josh Kaufman",
      "price": "$21.56"
    },
    {
      "title": "The Lean Startup",
      "author": "Eric Ries",
      "price": "$21.95"
    },
    {
      "title": "Crush It!",
      "author": "Gary Vaynerchuk",
      "price": "$20.40"
    },
    {
      "title": "Winning",
      "author": "Jack Welch",
      "price": "$26.41"
    },
    {
      "title": "Getting to Yes",
      "author": "Ury & Fisher",
      "price": "$19.25"
    },
    {
      "title": "Drive",
      "author": "Daniel Pink",
      "price": "$20.72"
    },
    {
      "title": "The Everything Store",
      "author": "Brad Stone",
      "price": "$17.70"
    },
    {
      "title": "Outliers",
      "author": "Malcolm Gladwell",
      "price": "$19.25"
    },
    {
      "title": "Start With Why",
      "author": "Simon Sinek",
      "price": "$19.25"
    },
    {
      "title": "The Innovator's Dilemma",
      "author": "Clayton Christensen",
      "price": "$35.40"
    },
    {
      "title": "The Coaching Habit",
      "author": "Michael Bungay Stanier",
      "price": "$19.23"
    },
    {
      "title": "2600 Phrases for Effective Performance Reviews",
      "author": "Paul Falcone",
      "price": "$17.99"
    },
    {
      "title": "Give and Take",
      "author": "Adam Grant",
      "price": "$19.25"
    },
    {
      "title": "The Effective Executive",
      "author": "Peter Drucker",
      "price": "$24.57"
    },
    {
      "title": "The Ten Commandments for Business Failure",
      "author": "Donald Keough",
      "price": "$26.30"
    },
    {
      "title": "Dear Chairman",
      "author": "Jeff Gramm",
      "price": "$41.58"
    },
    {
      "title": "Purple Cow",
      "author": "Seth Godin",
      "price": "$19.21"
    },
    {
      "title": "The $100 Startup",
      "author": "Chris Guillebeau",
      "price": "$23.00"
    },
    {
      "title": "Personal History",
      "author": "Katharine Graham",
      "price": "$47.18"
    },
    {
      "title": "Only the Paranoid Survive",
      "author": "Andrew Grove",
      "price": "$14.09"
    },
    {
      "title": "Exactly What to Say",
      "author": "Phil Jones",
      "price": "$25.47"
    },
    {
      "title": "Jack: Straight from the Gut",
      "author": "Jack Welch",
      "price": "$20.45"
    },
    {
      "title": "Dream Big",
      "author": "Cristiane Correa",
      "price": "$60.55"
    },
    {
      "title": "The Art of War",
      "author": "Sun Tzu",
      "price": "$9.46"
    },
    {
      "title": "Zero to One",
      "author": "Masters & Thiel",
      "price": "$41.90"
    },
    {
      "title": "Tribes",
      "author": "Seth Godin",
      "price": "$26.15"
    },
    {
      "title": "Drive to Thrive",
      "author": "Sharad Bajaj",
      "price": "$19.51"
    },
    {
      "title": "The Farmer from Merna",
      "author": "Karl Schriftgeisser",
      "price": "$150.07"
    },
    {
      "title": "Business Adventures",
      "author": "John Brooks",
      "price": "$19.25"
    },
    {
      "title": "Limping on Water",
      "author": "Phil Beuth",
      "price": "$670.00"
    },
    {
      "title": "Bemused Investor's Guide to Company Accounts",
      "author": "W.M. Jamieson",
      "price": "$29.99"
    },
    {
      "title": "How To Value Stocks Quickly!",
      "author": "Carlos Abad",
      "price": "$34.99"
    },
    {
      "title": "Financial Intelligence",
      "author": "Karen Berman & Joe Knight",
      "price": "$39.99"
    },
    {
      "title": "Valuation: Measuring and Managing the Value of Companies",
      "author": "Tim Koller, Marc Goedhart & David Wessels",
      "price": "$99.99"
    },
    {
      "title": "The Essentials of Financial Analysis",
      "author": "Samuel Weaver",
      "price": "$44.99"
    },
    {
      "title": "Financial Shenanigans",
      "author": "Howard Schilit, Jeremy Perler & Yoni Engelhart",
      "price": "$49.99"
    },
    {
      "title": "Warren Buffett Accounting",
      "author": "Stig Brodersen & Preston Pysh",
      "price": "$29.99"
    },
    {
      "title": "Investment Valuation",
      "author": "Aswath Damodaran",
      "price": "$89.99"
    },
    {
      "title": "The Investment Checklist",
      "author": "Michael Shearn",
      "price": "$34.99"
    },
    {
      "title": "Damodaran on Valuation",
      "author": "Aswath Damodaran",
      "price": "$49.99"
    },
    {
      "title": "The Dark Side of Valuation",
      "author": "Aswath Damodaran",
      "price": "$39.99"
    },
    {
      "title": "Financial Statement Analysis",
      "author": "Martin Fridson & Fernando Alvarez",
      "price": "$79.99"
    },
    {
      "title": "Financial Statements",
      "author": "Thomas Ittelson",
      "price": "$24.99"
    },
    {
      "title": "Reading Financial Reports For Dummies",
      "author": "Lita Epstein",
      "price": "$29.99"
    },
    {
      "title": "How to Read a Financial Report",
      "author": "John Tracy & Tage Tracy",
      "price": "$34.99"
    },
    {
      "title": "Warren Buffett and the Interpretation of Financial Statements",
      "author": "Mary Buffett & David Clark",
      "price": "$39.99"
    },
    {
      "title": "The Buffettology Workbook",
      "author": "Mary Buffett & David Clark",
      "price": "$44.99"
    },
    {
      "title": "Financial Statement Analysis and Security Valuation",
      "author": "Stephen Penman",
      "price": "$89.99"
    },
    {
      "title": "The Little Book of Valuation",
      "author": "Aswath Damodaran",
      "price": "$24.99"
    },
    {
      "title": "Fundamental Analysis for Beginners",
      "author": "A.Z. Penn",
      "price": "$19.99"
    },
    {
      "title": "The Company Valuation Playbook",
      "author": "Charles Sunnucks",
      "price": "$54.99"
    },
    {
      "title": "The Ultimate Guide to Business Valuation",
      "author": "Adam Diesel",
      "price": "$59.99"
    },
    {
      "title": "Quality of Earnings",
      "author": "Thornton O'Glove",
      "price": "$64.99"
    },
    {
      "title": "Financial Ratio Analysis",
      "author": "Andrew P.C.",
      "price": "$29.99"
    },
    {
      "title": "The Theory of Investment Value",
      "author": "John Burr Williams",
      "price": "$34.99"
    },
    {
      "title": "The Valuation of Financial Companies",
      "author": "Mario Massari, Gianfranco Gianfrate & Laura Zanetti",
      "price": "$74.99"
    },
    {
      "title": "Founder's Pocket Guide: Startup Valuation",
      "author": "Stephen Poland",
      "price": "$24.99"
    },
    {
      "title": "Security Analysis and Business Valuation on Wall Street",
      "author": "Jeffrey Hooke",
      "price": "$69.99"
    },
    {
      "title": "How To Value Stocks",
      "author": "Edmund Simms",
      "price": "$39.99"
    },
    {
      "title": "Balance Sheet Basics",
      "author": "Ronald Spurga",
      "price": "$19.99"
    },
    {
      "title": "Financial Statement Analysis for Value Investing",
      "author": "Stephen Penman & Peter Pope",
      "price": "$79.99"
    },
    {
      "title": "The Interpretation of Financial Statements",
      "author": "Steven Bragg",
      "price": "$29.99"
    },
    {
      "title": "Fundamental Analysis Essentials",
      "author": "Brian Hale",
      "price": "$34.99"
    },
    {
      "title": "Ratio Analysis Fundamentals",
      "author": "Axel Tracy",
      "price": "$24.99"
    },
    {
      "title": "The Art of Company Valuation and Financial Statement Analysis",
      "author": "Nicolas Schmidlin",
      "price": "$49.99"
    },
    {
      "title": "How to Value a Stock",
      "author": "Mariusz Skonieczny",
      "price": "$39.99"
    },
    {
      "title": "Basic Economics",
      "author": "Thomas Sowell",
      "price": "$43.47"
    },
    {
      "title": "Deep Simplicity",
      "author": "John Gribbin",
      "price": "$48.72"
    },
    {
      "title": "A Really Short History of Nearly Everything",
      "author": "Bill Bryson",
      "price": "$25.40"
    },
    {
      "title": "Made to Stick",
      "author": "Chip & Dan Heath",
      "price": "$24.29"
    },
    {
      "title": "Never Split the Difference",
      "author": "Chris Voss",
      "price": "$19.25"
    },
    {
      "title": "The Big Short",
      "author": "Michael Lewis",
      "price": "$19.25"
    },
    {
      "title": "Moneyball",
      "author": "Michael Lewis",
      "price": "$23.07"
    },
    {
      "title": "General Theory of Employment, Interest and Money",
      "author": "John Maynard Keynes",
      "price": "$16.40"
    },
    {
      "title": "The Ultimate Quotable Einstein",
      "author": "Alice Calaprice",
      "price": "$23.09"
    },
    {
      "title": "The Moment of Lift",
      "author": "Melinda Gates",
      "price": "$25.40"
    },
    {
      "title": "The Selfish Gene",
      "author": "Richard Dawkins",
      "price": "$23.84"
    },
    {
      "title": "The Third Chimpanzee",
      "author": "Jared Diamond",
      "price": "$20.65"
    },
    {
      "title": "How the Scots Invented the Modern World",
      "author": "Arthur Herman",
      "price": "$22.79"
    },
    {
      "title": "Meditations",
      "author": "Marcus Aurelius",
      "price": "$13.85"
    },
    {
      "title": "A Short History of Nearly Everything",
      "author": "Bill Bryson",
      "price": "$19.25"
    },
    {
      "title": "Extraordinary Popular Delusions and the Madness of Crowds",
      "author": "Charles Mackay",
      "price": "$29.33"
    },
    {
      "title": "Misbehaving",
      "author": "Richard Thaler",
      "price": "$17.70"
    },
    {
      "title": "Interesting Facts for Curious Minds",
      "author": "Jordan Moore",
      "price": "$19.75"
    },
    {
      "title": "Flash Boys",
      "author": "Michael Lewis",
      "price": "$24.28"
    },
    {
      "title": "The Smartest Guys in the Room",
      "author": "Bethany McLean",
      "price": "$27.99"
    },
    {
      "title": "40 Chances",
      "author": "Howard Buffett",
      "price": "$35.00"
    },
    {
      "title": "Stress Test",
      "author": "Timothy Geithner",
      "price": "$24.70"
    },
    {
      "title": "Keeping At It",
      "author": "Paul Volcker & Christine Harper",
      "price": "$26.80"
    },
    {
      "title": "Guns, Germs and Steel",
      "author": "Jared Diamond",
      "price": "$19.25"
    },
    {
      "title": "The Black Swan",
      "author": "Nassim Taleb",
      "price": "$19.25"
    },
    {
      "title": "Fooled by Randomness",
      "author": "Nassim Taleb",
      "price": "$24.77"
    },
    {
      "title": "The Autobiography of Benjamin Franklin",
      "author": "Benjamin Franklin",
      "price": "$9.62"
    },
    {
      "title": "Surrounded by Idiots",
      "author": "Thomas Erikson",
      "price": "$14.00"
    },
    {
      "title": "Interesting Stories for Curious People",
      "author": "Bill O'Neill",
      "price": "$24.10"
    },
    {
      "title": "Liar's Poker",
      "author": "Michael Lewis",
      "price": "$17.70"
    },
    {
      "title": "The Undoing Project",
      "author": "Michael Lewis",
      "price": "$19.25"
    },
    {
      "title": "Bull!",
      "author": "Maggie Mahar",
      "price": "$25.19"
    },
    {
      "title": "Life Is What You Make It",
      "author": "Peter Buffett",
      "price": "$34.32"
    },
    {
      "title": "Tools and Weapons",
      "author": "Brad Smith & Carol Ann Browne",
      "price": "$24.99"
    },
    {
      "title": "Firefighting",
      "author": "Bernanke, Geithner & Paulson",
      "price": "$31.16"
    },
    {
      "title": "Ice Age",
      "author": "John & Mary Gribbin",
      "price": "$15.96"
    },
    {
      "title": "Man's Search for Meaning",
      "author": "Viktor Frankl",
      "price": "$13.09"
    },
    {
      "title": "Eat the Rich",
      "author": "P.J. O'Rourke",
      "price": "$38.82"
    },
    {
      "title": "Read People Like a Book",
      "author": "Patrick King",
      "price": "$24.39"
    },
    {
      "title": "The Fifth Risk",
      "author": "Michael Lewis",
      "price": "$17.70"
    },
    {
      "title": "Essays in Persuasion",
      "author": "John Maynard Keynes",
      "price": "$17.26"
    },
    {
      "title": "Theory of Investment Value",
      "author": "John Burr Williams",
      "price": "$54.28"
    },
    {
      "title": "In an Uncertain World",
      "author": "Robert Rubin",
      "price": "$33.99"
    },
    {
      "title": "Nuclear Terrorism",
      "author": "Graham Allison",
      "price": "$38.96"
    },
    {
      "title": "Showing Up for Life",
      "author": "Bill Gates Sr & Mary Mackin",
      "price": "$16.34"
    },
    {
      "title": "Three Scientists and Their Gods",
      "author": "Robert Wright",
      "price": "$46.63"
    },
    {
      "title": "Going Infinite",
      "author": "Michael Lewis",
      "price": "$24.99"
    },
    {
      "title": "Investing Between the Lines",
      "author": "LJ Rittenhouse",
      "price": "$60.64"
    },
    {
      "title": "Models of My Life",
      "author": "Herbert Simon",
      "price": "$102.00"
    },
    {
      "title": "How to Become Sustainably Rich",
      "author": "Clay Clark",
      "price": "$32.99"
    },
    {
      "title": "Your Money or Your Life",
      "author": "Vicki Robin",
      "price": "$21.99"
    },
    {
      "title": "One Thousand Ways to Make $1000",
      "author": "F.C. Minaker",
      "price": "$18.99"
    },
    {
      "title": "How To Get Rich Before 30",
      "author": "A.B. Stanley",
      "price": "$24.99"
    },
    {
      "title": "How to Become Rich and Successful",
      "author": "Ernesto Martinez",
      "price": "$29.99"
    },
    {
      "title": "Jim Cramer's Get Rich Carefully",
      "author": "James Cramer",
      "price": "$31.99"
    },
    {
      "title": "The Miracle Morning",
      "author": "Hal Elrod",
      "price": "$22.99"
    },
    {
      "title": "Die With Zero",
      "author": "Bill Perkins",
      "price": "$26.99"
    },
    {
      "title": "How To Be Rich",
      "author": "J. Paul Getty",
      "price": "$24.99"
    },
    {
      "title": "Take on the Street",
      "author": "Arthur Levitt",
      "price": "$28.99"
    },
    {
      "title": "Rich Dad Poor Dad for Teens",
      "author": "Robert Kiyosaki",
      "price": "$18.99"
    },
    {
      "title": "Blueprint to Wealth",
      "author": "Gary Stone",
      "price": "$31.99"
    },
    {
      "title": "The Missing Billionaires",
      "author": "Victor Haghani & James White",
      "price": "$34.99"
    },
    {
      "title": "Enough",
      "author": "John Bogle",
      "price": "$25.99"
    },
    {
      "title": "A 9-Step Path To Financial Independence",
      "author": "Joe Dominguez, Vicki Robin & Monica Wood",
      "price": "$27.99"
    }
  ],
  "Financial Analysis": [
    {
      "title": "The Interpretation of Financial Statements",
      "author": "Benjamin Graham",
      "price": "$24.99"
    },
    {
      "title": "Financial Intelligence",
      "author": "Karen Berman & Joe Knight",
      "price": "$39.99"
    },
    {
      "title": "Valuation: Measuring and Managing the Value of Companies",
      "author": "Tim Koller, Marc Goedhart & David Wessels",
      "price": "$99.99"
    },
    {
      "title": "The Essentials of Financial Analysis",
      "author": "Samuel Weaver",
      "price": "$44.99"
    },
    {
      "title": "Financial Shenanigans",
      "author": "Howard Schilit, Jeremy Perler & Yoni Engelhart",
      "price": "$49.99"
    },
    {
      "title": "Warren Buffett Accounting",
      "author": "Stig Brodersen & Preston Pysh",
      "price": "$29.99"
    },
    {
      "title": "Investment Valuation",
      "author": "Aswath Damodaran",
      "price": "$89.99"
    },
    {
      "title": "The Investment Checklist",
      "author": "Michael Shearn",
      "price": "$34.99"
    },
    {
      "title": "Damodaran on Valuation",
      "author": "Aswath Damodaran",
      "price": "$49.99"
    },
    {
      "title": "The Dark Side of Valuation",
      "author": "Aswath Damodaran",
      "price": "$39.99"
    },
    {
      "title": "Financial Statement Analysis",
      "author": "Martin Fridson & Fernando Alvarez",
      "price": "$79.99"
    },
    {
      "title": "Financial Statements",
      "author": "Thomas Ittelson",
      "price": "$24.99"
    },
    {
      "title": "Reading Financial Reports For Dummies",
      "author": "Lita Epstein",
      "price": "$29.99"
    },
    {
      "title": "How to Read a Financial Report",
      "author": "John Tracy & Tage Tracy",
      "price": "$34.99"
    },
    {
      "title": "Warren Buffett and the Interpretation of Financial Statements",
      "author": "Mary Buffett & David Clark",
      "price": "$39.99"
    },
    {
      "title": "The Buffettology Workbook",
      "author": "Mary Buffett & David Clark",
      "price": "$44.99"
    },
    {
      "title": "Financial Statement Analysis and Security Valuation",
      "author": "Stephen Penman",
      "price": "$89.99"
    },
    {
      "title": "The Little Book of Valuation",
      "author": "Aswath Damodaran",
      "price": "$24.99"
    },
    {
      "title": "Fundamental Analysis for Beginners",
      "author": "A.Z. Penn",
      "price": "$19.99"
    },
    {
      "title": "The Company Valuation Playbook",
      "author": "Charles Sunnucks",
      "price": "$54.99"
    },
    {
      "title": "The Ultimate Guide to Business Valuation",
      "author": "Adam Diesel",
      "price": "$59.99"
    },
    {
      "title": "Quality of Earnings",
      "author": "Thornton O'Glove",
      "price": "$64.99"
    },
    {
      "title": "Financial Ratio Analysis",
      "author": "Andrew P.C.",
      "price": "$29.99"
    },
    {
      "title": "The Theory of Investment Value",
      "author": "John Burr Williams",
      "price": "$34.99"
    },
    {
      "title": "The Valuation of Financial Companies",
      "author": "Mario Massari, Gianfranco Gianfrate & Laura Zanetti",
      "price": "$74.99"
    },
    {
      "title": "Founder's Pocket Guide: Startup Valuation",
      "author": "Stephen Poland",
      "price": "$24.99"
    },
    {
      "title": "Security Analysis and Business Valuation on Wall Street",
      "author": "Jeffrey Hooke",
      "price": "$69.99"
    },
    {
      "title": "How To Value Stocks",
      "author": "Edmund Simms",
      "price": "$39.99"
    },
    {
      "title": "Balance Sheet Basics",
      "author": "Ronald Spurga",
      "price": "$19.99"
    },
    {
      "title": "Financial Statement Analysis for Value Investing",
      "author": "Stephen Penman & Peter Pope",
      "price": "$79.99"
    },
    {
      "title": "The Interpretation of Financial Statements",
      "author": "Steven Bragg",
      "price": "$29.99"
    },
    {
      "title": "Fundamental Analysis Essentials",
      "author": "Brian Hale",
      "price": "$34.99"
    },
    {
      "title": "Ratio Analysis Fundamentals",
      "author": "Axel Tracy",
      "price": "$24.99"
    },
    {
      "title": "The Art of Company Valuation and Financial Statement Analysis",
      "author": "Nicolas Schmidlin",
      "price": "$49.99"
    },
    {
      "title": "How to Value a Stock",
      "author": "Mariusz Skonieczny",
      "price": "$39.99"
    }
  ],
  "Sales & Marketing": [
    {
      "title": "Dotcom Secrets",
      "author": "Russell Brunson",
      "price": "$23.09"
    },
    {
      "title": "Traffic Secrets",
      "author": "Russell Brunson",
      "price": "$49.99"
    },
    {
      "title": "Marketing Made Simple",
      "author": "Donald Miller & JJ Peterson",
      "price": "$39.99"
    },
    {
      "title": "Copywriting Secrets",
      "author": "Jim Edwards",
      "price": "$29.99"
    },
    {
      "title": "Exactly What to Say: For Real Estate Agents",
      "author": "Phil Jones, Chris Smith & Jimmy Mackin",
      "price": "$34.99"
    },
    {
      "title": "Ca$hvertising",
      "author": "Drew Whitman",
      "price": "$39.99"
    },
    {
      "title": "Greatest Salesman In The World 2",
      "author": "Og Mandino",
      "price": "$24.99"
    },
    {
      "title": "Go-Givers Sell More",
      "author": "John David",
      "price": "$29.99"
    },
    {
      "title": "The Qualified Sales Leader",
      "author": "John McMahon",
      "price": "$44.99"
    },
    {
      "title": "Objections",
      "author": "Jeb Blount",
      "price": "$39.99"
    },
    {
      "title": "The Art of Closing the Sale",
      "author": "Brian Tracy",
      "price": "$34.99"
    },
    {
      "title": "The 16-Word Sales Letter™",
      "author": "Evaldo Albuquerque",
      "price": "$19.99"
    },
    {
      "title": "Customers for Life",
      "author": "Carl Sewell & Paul Brown",
      "price": "$49.99"
    },
    {
      "title": "The Miracle Morning for Salespeople",
      "author": "Ryan Snow & Honoree Corder",
      "price": "$29.99"
    },
    {
      "title": "Marketing Rebellion",
      "author": "Mark Schaefer",
      "price": "$39.99"
    },
    {
      "title": "My Life in Advertising and Scientific Advertising",
      "author": "Claude Hopkins",
      "price": "$34.99"
    },
    {
      "title": "Day Trading Attention",
      "author": "Gary Vaynerchuk",
      "price": "$44.99"
    },
    {
      "title": "Be A Sales Superstar",
      "author": "Brian Tracy",
      "price": "$39.99"
    },
    {
      "title": "Secrets of Successful Selling Habits",
      "author": "Zig Ziglar",
      "price": "$29.99"
    },
    {
      "title": "Confessions of an Advertising Man",
      "author": "David Ogilvy",
      "price": "$24.99"
    },
    {
      "title": "Ogilvy on Advertising",
      "author": "David Ogilvy",
      "price": "$34.99"
    },
    {
      "title": "The Greatest Salesman in the World",
      "author": "Og Mandino",
      "price": "$19.99"
    },
    {
      "title": "Gap Selling",
      "author": "Keenan",
      "price": "$49.99"
    },
    {
      "title": "How To Be A GREAT Salesperson...By Monday Morning!",
      "author": "David Cook",
      "price": "$39.99"
    },
    {
      "title": "Inside the Mind of Sales",
      "author": "Derek Borthwick",
      "price": "$44.99"
    },
    {
      "title": "Sell: The Secrets of Selling Anything to Anyone",
      "author": "Bruce Littlefield & Fredrik Eklund",
      "price": "$29.99"
    },
    {
      "title": "Pitch Anything",
      "author": "Oren Klaff",
      "price": "$34.99"
    },
    {
      "title": "This Is Marketing",
      "author": "Seth Godin",
      "price": "$39.99"
    },
    {
      "title": "All Marketers are Liars",
      "author": "Seth Godin",
      "price": "$24.99"
    },
    {
      "title": "Secrets of Successful Sales",
      "author": "Alison Edgar",
      "price": "$29.99"
    },
    {
      "title": "Virtual Selling",
      "author": "Mike Schultz, Dave Shaby & Andy Springer",
      "price": "$49.99"
    },
    {
      "title": "Scientific Advertising",
      "author": "Claude Hopkins",
      "price": "$19.99"
    },
    {
      "title": "One Million Followers",
      "author": "Brendan Kane",
      "price": "$39.99"
    },
    {
      "title": "Instant Cashflow",
      "author": "Bradley Sugars",
      "price": "$34.99"
    },
    {
      "title": "The Secrets of Successful Selling",
      "author": "Tony Adams",
      "price": "$29.99"
    },
    {
      "title": "The Certifiable Salesperson",
      "author": "Tom Hopkins & Laura Laaman",
      "price": "$44.99"
    },
    {
      "title": "Reverse Selling",
      "author": "Brandon Mulrenin",
      "price": "$29.99"
    },
    {
      "title": "Go Big or Go Home",
      "author": "Diana Kander & Tucker Trotter",
      "price": "$34.99"
    },
    {
      "title": "P3 Selling",
      "author": "Greg Nutter",
      "price": "$39.99"
    },
    {
      "title": "Quit Stalling and Build Your Brand",
      "author": "Ben Leonard",
      "price": "$24.99"
    },
    {
      "title": "The Sales Skills Book",
      "author": "Gerald Zankl",
      "price": "$44.99"
    },
    {
      "title": "Ninja Selling",
      "author": "Larry Kendall",
      "price": "$29.99"
    },
    {
      "title": "Super Duper Profitable Ads",
      "author": "Laurel Portié",
      "price": "$49.99"
    },
    {
      "title": "The Six-Figure Author's Guide To Facebook Ads",
      "author": "Matthew Holmes",
      "price": "$39.99"
    },
    {
      "title": "Tested Advertising Methods",
      "author": "John Caples",
      "price": "$24.99"
    },
    {
      "title": "Sales Coaching Essentials",
      "author": "Mark Hayes",
      "price": "$34.99"
    },
    {
      "title": "Napoleon Hill's Science of Successful Selling",
      "author": "Napoleon Hill Associates",
      "price": "$29.99"
    },
    {
      "title": "The Network Is Your Customer",
      "author": "David Rogers",
      "price": "$39.99"
    },
    {
      "title": "Using Behavioral Science in Marketing",
      "author": "Nancy Harhut",
      "price": "$44.99"
    },
    {
      "title": "Brands and Bullst.",
      "author": "Bernhard Schroeder",
      "price": "$29.99"
    },
    {
      "title": "Masterful Marketing",
      "author": "Aan Weiss & Lisa Larter",
      "price": "$49.99"
    },
    {
      "title": "How to Win Customers and Keep Them for Life",
      "author": "Michael LeBoeuf",
      "price": "$34.99"
    },
    {
      "title": "The Copy Book",
      "author": "D&AD",
      "price": "$59.99"
    },
    {
      "title": "Fanatical Prospecting",
      "author": "Jeb Blount",
      "price": "$39.99"
    },
    {
      "title": "Building A Story Brand",
      "author": "Donald Miller",
      "price": "$29.99"
    },
    {
      "title": "The 1-Page Marketing Plan",
      "author": "Allan Dib",
      "price": "$24.99"
    },
    {
      "title": "Sell or Be Sold",
      "author": "Grant Cardone",
      "price": "$34.99"
    },
    {
      "title": "How I Raised Myself From Failure to Success in Selling",
      "author": "Frank Bettger",
      "price": "$19.99"
    }
  ],
  "Self-Improvement": [
    {
      "title": "The Diary of a CEO",
      "author": "Steven Bartlett",
      "price": "$22.00"
    },
    {
      "title": "The Law of Success",
      "author": "Napoleon Hill",
      "price": "$47.54"
    },
    {
      "title": "The 15 Invaluable Laws of Growth",
      "author": "John Maxwell",
      "price": "$26.95"
    },
    {
      "title": "The Gift",
      "author": "Dr Edith Eger",
      "price": "$25.63"
    },
    {
      "title": "The Power of One More",
      "author": "Ed Mylett",
      "price": "$36.15"
    },
    {
      "title": "The Greatest You",
      "author": "Trent Shelton",
      "price": "$25.03"
    },
    {
      "title": "The Success Principles Workbook",
      "author": "Jack Canfield",
      "price": "$23.09"
    },
    {
      "title": "The Strangest Secret",
      "author": "Earl Nightingale",
      "price": "$17.21"
    },
    {
      "title": "Beyond Order",
      "author": "Jordan Peterson",
      "price": "$14.00"
    },
    {
      "title": "Psycho-Cybernetics",
      "author": "Maxwell Maltz",
      "price": "$23.15"
    },
    {
      "title": "The 7 Habits of Highly Effective People",
      "author": "Stephen Covey",
      "price": "$21.30"
    },
    {
      "title": "Never Finished",
      "author": "David Goggins",
      "price": "$41.60"
    },
    {
      "title": "As A Man Thinketh",
      "author": "James Allen",
      "price": "$9.96"
    },
    {
      "title": "The Game of Life & How to Play It",
      "author": "Florence Shinn",
      "price": "$21.94"
    },
    {
      "title": "Act Like A Success, Think Like A Success",
      "author": "Steve Harvey",
      "price": "$24.85"
    },
    {
      "title": "21 Indispensable Qualities of a Leader",
      "author": "John Maxwell",
      "price": "$16.95"
    },
    {
      "title": "Goals",
      "author": "Zig Ziglar",
      "price": "$27.44"
    },
    {
      "title": "Napoleon Hill's Power of Positive Action",
      "author": "Napoleon Hill",
      "price": "$22.39"
    },
    {
      "title": "Outwitting the Devil",
      "author": "Napoleon Hill",
      "price": "$23.42"
    },
    {
      "title": "The Magic of Thinking Big",
      "author": "David Schwartz",
      "price": "$21.56"
    },
    {
      "title": "Becoming Supernatural",
      "author": "Joe Dispenza",
      "price": "$19.00"
    },
    {
      "title": "Breaking the Habit of Being Yourself",
      "author": "Joe Dispenza",
      "price": "$15.37"
    },
    {
      "title": "You Are the Placebo",
      "author": "Joe Dispenza",
      "price": "$20.79"
    },
    {
      "title": "The Buddha and the Badass",
      "author": "Vishen Lakhiani",
      "price": "$34.89"
    },
    {
      "title": "The Pivot Year",
      "author": "Brianna Wiest",
      "price": "$30.79"
    },
    {
      "title": "Forgiving What You Can't Forget",
      "author": "Lysa TerKeurst",
      "price": "$23.09"
    },
    {
      "title": "Influence",
      "author": "Robert Cialdini",
      "price": "$26.95"
    },
    {
      "title": "Awaken The Giant Within",
      "author": "Tony Robbins",
      "price": "$19.25"
    },
    {
      "title": "How to Win Friends and Influence People",
      "author": "Dale Carnegie",
      "price": "$19.25"
    },
    {
      "title": "Atomic Habits",
      "author": "James Clear",
      "price": "$18.94"
    },
    {
      "title": "Grit",
      "author": "Angela Duckworth",
      "price": "$19.25"
    },
    {
      "title": "Road Less Traveled",
      "author": "M. Scott Peck",
      "price": "$19.25"
    },
    {
      "title": "The Power of Moments",
      "author": "Chip & Dan Heath",
      "price": "$25.39"
    },
    {
      "title": "The 10X Rule",
      "author": "Grant Cardone",
      "price": "$24.99"
    },
    {
      "title": "The 48 Laws Of Power",
      "author": "Robert Greene",
      "price": "$27.99"
    },
    {
      "title": "Success Through a Positive Mental Attitude",
      "author": "Hill & Stone",
      "price": "$22.79"
    },
    {
      "title": "The Biology of Belief",
      "author": "Bruce Lipton",
      "price": "$16.99"
    },
    {
      "title": "The Code of the Extraordinary Mind",
      "author": "Vishen Lakhiani",
      "price": "$25.40"
    },
    {
      "title": "How to Own Your Own Mind",
      "author": "Napoleon Hill",
      "price": "$31.09"
    },
    {
      "title": "The Law of Success In Sixteen Lessons",
      "author": "Napoleon Hill",
      "price": "$32.99"
    },
    {
      "title": "The Success System That Never Fails",
      "author": "W. Clement Stone",
      "price": "$28.19"
    },
    {
      "title": "The Mountain Is You",
      "author": "Brianna Wiest",
      "price": "$31.56"
    },
    {
      "title": "The Culture Code",
      "author": "Daniel Coyle",
      "price": "$19.25"
    },
    {
      "title": "Think Again",
      "author": "Adam Grant",
      "price": "$19.25"
    },
    {
      "title": "The Things You Can See Only When You Slow Down",
      "author": "Haemin Sunim",
      "price": "$19.25"
    },
    {
      "title": "The Untethered Soul",
      "author": "Michael Singer",
      "price": "$19.37"
    },
    {
      "title": "Daring Greatly",
      "author": "Brené Brown",
      "price": "$19.00"
    },
    {
      "title": "Good Vibes, Good Life",
      "author": "Vex King",
      "price": "$15.39"
    },
    {
      "title": "The Power of Positive Thinking",
      "author": "Norman Vincent Peale",
      "price": "$19.25"
    },
    {
      "title": "Four Thousand Weeks",
      "author": "Oliver Burkeman",
      "price": "$17.70"
    },
    {
      "title": "Pre-Suasion",
      "author": "Robert Cialdini",
      "price": "$19.25"
    },
    {
      "title": "Thinking, Fast and Slow",
      "author": "Daniel Kahneman",
      "price": "$16.00"
    },
    {
      "title": "Getting Things Done",
      "author": "David Allen",
      "price": "$32.64"
    },
    {
      "title": "12 Rules for Life",
      "author": "Jordan Peterson",
      "price": "$14.00"
    },
    {
      "title": "The Silva Mind Control Method",
      "author": "Jose Silva",
      "price": "$18.99"
    },
    {
      "title": "101 Essays That Will Change The Way You Think",
      "author": "Brianna Wiest",
      "price": "$24.17"
    },
    {
      "title": "The Talent Code",
      "author": "Daniel Coyle",
      "price": "$19.54"
    },
    {
      "title": "Unlimited Memory",
      "author": "Kevin Horsley",
      "price": "$27.49"
    },
    {
      "title": "The Four Agreements",
      "author": "Don Miguel Ruiz",
      "price": "$15.37"
    },
    {
      "title": "Ikigai",
      "author": "Héctor García & Francesc Miralles",
      "price": "$21.56"
    },
    {
      "title": "Why Has Nobody Told Me This Before?",
      "author": "Julie Smith",
      "price": "$19.00"
    },
    {
      "title": "Don't Believe Everything You Think",
      "author": "Joseph Nguyen",
      "price": "$13.36"
    },
    {
      "title": "Stop Overthinking",
      "author": "Nick Trenton",
      "price": "$18.41"
    },
    {
      "title": "Unfck Your Brain*",
      "author": "Faith Harper",
      "price": "$22.99"
    },
    {
      "title": "Feel-Good Productivity",
      "author": "Ali Abdaal",
      "price": "$24.00"
    },
    {
      "title": "The Charisma Myth",
      "author": "Olivia Cabane",
      "price": "$17.70"
    },
    {
      "title": "The Power of Discipline",
      "author": "Daniel Walter",
      "price": "$24.99"
    },
    {
      "title": "Master Your Emotions",
      "author": "Thibaut Meurisse",
      "price": "$23.00"
    },
    {
      "title": "The Tipping Point",
      "author": "Malcolm Gladwell",
      "price": "$19.25"
    },
    {
      "title": "Blink",
      "author": "Malcolm Gladwell",
      "price": "$19.25"
    },
    {
      "title": "Linchpin",
      "author": "Seth Godin",
      "price": "$22.57"
    },
    {
      "title": "The Courage to Be Disliked",
      "author": "Kishimi & Koga",
      "price": "$32.12"
    },
    {
      "title": "The Subtle Art of Not Giving a Fck*",
      "author": "Mark Manson",
      "price": "$19.00"
    },
    {
      "title": "Make Your Bed",
      "author": "William McRaven",
      "price": "$19.25"
    },
    {
      "title": "Quiet",
      "author": "Susan Cain",
      "price": "$19.25"
    },
    {
      "title": "Noise",
      "author": "Kahneman, Sibony & Sunstein",
      "price": "$20.79"
    },
    {
      "title": "How to Become a People Magnet",
      "author": "Mark Reklau",
      "price": "$18.00"
    },
    {
      "title": "Dark Psychology and Manipulation",
      "author": "William Cooper",
      "price": "$27.84"
    },
    {
      "title": "Everything Is Fcked*",
      "author": "Mark Manson",
      "price": "$18.00"
    },
    {
      "title": "The Alchemist",
      "author": "Paulo Coelho",
      "price": "$14.00"
    },
    {
      "title": "Better Small Talk",
      "author": "Patrick King",
      "price": "$25.98"
    },
    {
      "title": "Dopamine Detox",
      "author": "Thibaut Meurisse",
      "price": "$16.49"
    },
    {
      "title": "The 5am Club",
      "author": "Robin Sharma",
      "price": "$17.10"
    },
    {
      "title": "How to Talk to Anyone",
      "author": "Leil Lowndes",
      "price": "$19.25"
    }
  ],
  "Business & Management": [
    {
      "title": "Leadership Strategy and Tactics",
      "author": "Jocko Willink",
      "price": "$26.95"
    },
    {
      "title": "The Dichotomy of Leadership",
      "author": "Jocko Willink & Leif Babin",
      "price": "$26.95"
    },
    {
      "title": "Robert's Rules of Order Newly Revised",
      "author": "Henry Robert et al.",
      "price": "$25.40"
    },
    {
      "title": "The 5 Levels of Leadership",
      "author": "John Maxwell",
      "price": "$12.63"
    },
    {
      "title": "The 21 Irrefutable Laws of Leadership",
      "author": "John Maxwell",
      "price": "$28.04"
    },
    {
      "title": "Developing the Leader Within You 2.0",
      "author": "John Maxwell",
      "price": "$23.09"
    },
    {
      "title": "The Culture Map",
      "author": "Erin Meyer",
      "price": "$18.00"
    },
    {
      "title": "Business Made Simple",
      "author": "Donald Miller",
      "price": "$21.56"
    },
    {
      "title": "Good to Great",
      "author": "Jim Collins",
      "price": "$25.44"
    },
    {
      "title": "Maverick!",
      "author": "Ricardo Semler",
      "price": "$24.99"
    },
    {
      "title": "Competitive Strategy",
      "author": "Michael Porter",
      "price": "$25.40"
    },
    {
      "title": "Built to Last",
      "author": "Collins & Porras",
      "price": "$25.16"
    },
    {
      "title": "Who Moved My Cheese?",
      "author": "Spencer Johnson",
      "price": "$12.00"
    },
    {
      "title": "The E Myth Revisited",
      "author": "Michael Gerber",
      "price": "$19.00"
    },
    {
      "title": "Blue Ocean Strategy",
      "author": "Kim & Mauborgne",
      "price": "$34.99"
    },
    {
      "title": "Traction",
      "author": "Gino Wickman",
      "price": "$18.19"
    },
    {
      "title": "Business Model Generation",
      "author": "Osterwalder & Pigneur",
      "price": "$34.77"
    },
    {
      "title": "The Power of Broke",
      "author": "Daymond John",
      "price": "$31.59"
    },
    {
      "title": "Titan",
      "author": "Ron Chernow",
      "price": "$40.39"
    },
    {
      "title": "Dare to Lead",
      "author": "Brené Brown",
      "price": "$16.00"
    },
    {
      "title": "The Outsiders",
      "author": "William Thorndike",
      "price": "$22.77"
    },
    {
      "title": "The Hard Thing About Hard Things",
      "author": "Ben Horowitz",
      "price": "$28.81"
    },
    {
      "title": "Leadership and Self-Deception",
      "author": "Arbinger Institute",
      "price": "$23.09"
    },
    {
      "title": "Twelve and a Half",
      "author": "Gary Vaynerchuk",
      "price": "$34.99"
    },
    {
      "title": "Jab, Jab, Jab, Right Hook",
      "author": "Gary Vaynerchuk",
      "price": "$30.79"
    },
    {
      "title": "High Output Management",
      "author": "Andrew Grove",
      "price": "$11.58"
    },
    {
      "title": "Sam Walton: Made In America",
      "author": "Sam Walton",
      "price": "$13.09"
    },
    {
      "title": "No Rules Rules",
      "author": "Hastings & Meyer",
      "price": "$26.96"
    },
    {
      "title": "First A Dream",
      "author": "Jim Clayton",
      "price": "$75.20"
    },
    {
      "title": "The Man Behind the Microchip",
      "author": "Leslie Berlin",
      "price": "$51.95"
    },
    {
      "title": "Business @ the Speed of Thought",
      "author": "Bill Gates",
      "price": "$64.71"
    },
    {
      "title": "The Personal MBA",
      "author": "Josh Kaufman",
      "price": "$21.56"
    },
    {
      "title": "The Lean Startup",
      "author": "Eric Ries",
      "price": "$21.95"
    },
    {
      "title": "Crush It!",
      "author": "Gary Vaynerchuk",
      "price": "$20.40"
    },
    {
      "title": "Winning",
      "author": "Jack Welch",
      "price": "$26.41"
    },
    {
      "title": "Getting to Yes",
      "author": "Ury & Fisher",
      "price": "$19.25"
    },
    {
      "title": "Drive",
      "author": "Daniel Pink",
      "price": "$20.72"
    },
    {
      "title": "The Everything Store",
      "author": "Brad Stone",
      "price": "$17.70"
    },
    {
      "title": "Outliers",
      "author": "Malcolm Gladwell",
      "price": "$19.25"
    },
    {
      "title": "Start With Why",
      "author": "Simon Sinek",
      "price": "$19.25"
    },
    {
      "title": "The Innovator's Dilemma",
      "author": "Clayton Christensen",
      "price": "$35.40"
    },
    {
      "title": "The Coaching Habit",
      "author": "Michael Bungay Stanier",
      "price": "$19.23"
    },
    {
      "title": "2600 Phrases for Effective Performance Reviews",
      "author": "Paul Falcone",
      "price": "$17.99"
    },
    {
      "title": "Give and Take",
      "author": "Adam Grant",
      "price": "$19.25"
    },
    {
      "title": "The Effective Executive",
      "author": "Peter Drucker",
      "price": "$24.57"
    },
    {
      "title": "The Ten Commandments for Business Failure",
      "author": "Donald Keough",
      "price": "$26.30"
    },
    {
      "title": "Dear Chairman",
      "author": "Jeff Gramm",
      "price": "$41.58"
    },
    {
      "title": "Purple Cow",
      "author": "Seth Godin",
      "price": "$19.21"
    },
    {
      "title": "The $100 Startup",
      "author": "Chris Guillebeau",
      "price": "$23.00"
    },
    {
      "title": "Personal History",
      "author": "Katharine Graham",
      "price": "$47.18"
    },
    {
      "title": "Only the Paranoid Survive",
      "author": "Andrew Grove",
      "price": "$14.09"
    },
    {
      "title": "Exactly What to Say",
      "author": "Phil Jones",
      "price": "$25.47"
    },
    {
      "title": "Jack: Straight from the Gut",
      "author": "Jack Welch",
      "price": "$20.45"
    },
    {
      "title": "Dream Big",
      "author": "Cristiane Correa",
      "price": "$60.55"
    },
    {
      "title": "The Art of War",
      "author": "Sun Tzu",
      "price": "$9.46"
    },
    {
      "title": "Zero to One",
      "author": "Masters & Thiel",
      "price": "$41.90"
    },
    {
      "title": "Tribes",
      "author": "Seth Godin",
      "price": "$26.15"
    },
    {
      "title": "Drive to Thrive",
      "author": "Sharad Bajaj",
      "price": "$19.51"
    },
    {
      "title": "The Farmer from Merna",
      "author": "Karl Schriftgeisser",
      "price": "$150.07"
    },
    {
      "title": "Business Adventures",
      "author": "John Brooks",
      "price": "$19.25"
    },
    {
      "title": "Limping on Water",
      "author": "Phil Beuth",
      "price": "$670.00"
    },
    {
      "title": "Principles: Life and Work",
      "author": "Ray Dalio",
      "price": "$39.99"
    },
    {
      "title": "The Psychology of Money",
      "author": "Morgan Housel",
      "price": "$22.99"
    },
    {
      "title": "Same as Ever",
      "author": "Morgan Housel",
      "price": "$28.99"
    },
    {
      "title": "The 4-Hour Work Week",
      "author": "Timothy Ferriss",
      "price": "$26.99"
    },
    {
      "title": "Supermoney",
      "author": "Adam Smith",
      "price": "$27.99"
    },
    {
      "title": "The Miracle Morning",
      "author": "Hal Elrod",
      "price": "$22.99"
    },
    {
      "title": "Die With Zero",
      "author": "Bill Perkins",
      "price": "$26.99"
    },
    {
      "title": "How To Be Rich",
      "author": "J. Paul Getty",
      "price": "$24.99"
    },
    {
      "title": "Take on the Street",
      "author": "Arthur Levitt",
      "price": "$28.99"
    },
    {
      "title": "Rich Dad Poor Dad for Teens",
      "author": "Robert Kiyosaki",
      "price": "$18.99"
    },
    {
      "title": "Blueprint to Wealth",
      "author": "Gary Stone",
      "price": "$31.99"
    },
    {
      "title": "The Missing Billionaires",
      "author": "Victor Haghani & James White",
      "price": "$34.99"
    },
    {
      "title": "Enough",
      "author": "John Bogle",
      "price": "$25.99"
    },
    {
      "title": "A 9-Step Path To Financial Independence",
      "author": "Joe Dominguez, Vicki Robin & Monica Wood",
      "price": "$27.99"
    }
  ],
  "Miscellaneous": [
    {
      "title": "How To: $10M",
      "author": "William Brown",
      "price": "$21.44"
    },
    {
      "title": "Undisruptable",
      "author": "Aidan McCullen",
      "price": "$33.84"
    },
    {
      "title": "Valuepreneurs",
      "author": "Steve Waddell",
      "price": "$33.03"
    },
    {
      "title": "$100M Offers",
      "author": "Alex Hormozi",
      "price": "$39.59"
    },
    {
      "title": "$100M Leads",
      "author": "Alex Hormozi",
      "price": "$43.94"
    },
    {
      "title": "The EXITPreneur's Playbook",
      "author": "Joe Valley",
      "price": "$28.10"
    },
    {
      "title": "How to Build a Billion-Dollar Business",
      "author": "Radek Sali & Bernadette Schwerdt",
      "price": "$21.56"
    },
    {
      "title": "Million Dollar Weekend",
      "author": "Noah Kagan",
      "price": "$28.49"
    },
    {
      "title": "Hustle Harder, Hustle Smarter",
      "author": "Curtis \"50 Cent\" Jackson",
      "price": "$22.32"
    },
    {
      "title": "Extreme Revenue Growth",
      "author": "Victor Cheng",
      "price": "$41.37"
    },
    {
      "title": "Your Next Five Moves",
      "author": "Patrick Bet-David",
      "price": "$25.40"
    },
    {
      "title": "Microsoft Secrets",
      "author": "Cusumano & Selby",
      "price": "$41.41"
    },
    {
      "title": "UNSCRIPTED",
      "author": "MJ DeMarco",
      "price": "$29.61"
    },
    {
      "title": "Start Your Own Corporation",
      "author": "Garrett Sutton",
      "price": "$47.81"
    },
    {
      "title": "Rich Dad's Before You Quit Your Job",
      "author": "Robert Kiyosaki",
      "price": "$23.09"
    },
    {
      "title": "From the Trash Man to the Cash Man",
      "author": "Myron Golden",
      "price": "$321.82"
    },
    {
      "title": "Profit First",
      "author": "Mike Michalowicz",
      "price": "$26.00"
    },
    {
      "title": "12 Months to $1 Million",
      "author": "Ryan Moran",
      "price": "$38.50"
    },
    {
      "title": "Steve Jobs",
      "author": "Walter Isaacson",
      "price": "$19.25"
    },
    {
      "title": "Built to Sell",
      "author": "John Warrillow",
      "price": "$20.79"
    },
    {
      "title": "The Prosperous Coach",
      "author": "Chandler & Litvin",
      "price": "$98.41"
    },
    {
      "title": "Business Made Simple",
      "author": "Donald Miller",
      "price": "$21.56"
    },
    {
      "title": "Shoe Dog",
      "author": "Phil Knight",
      "price": "$15.00"
    },
    {
      "title": "Good to Great",
      "author": "Jim Collins",
      "price": "$25.44"
    },
    {
      "title": "Maverick!",
      "author": "Ricardo Semler",
      "price": "$24.99"
    },
    {
      "title": "Competitive Strategy",
      "author": "Michael Porter",
      "price": "$25.40"
    },
    {
      "title": "Built to Last",
      "author": "Collins & Porras",
      "price": "$25.16"
    },
    {
      "title": "Who Moved My Cheese?",
      "author": "Spencer Johnson",
      "price": "$12.00"
    },
    {
      "title": "The E Myth Revisited",
      "author": "Michael Gerber",
      "price": "$19.00"
    },
    {
      "title": "Blue Ocean Strategy",
      "author": "Kim & Mauborgne",
      "price": "$34.99"
    },
    {
      "title": "Traction",
      "author": "Gino Wickman",
      "price": "$18.19"
    },
    {
      "title": "Business Model Generation",
      "author": "Osterwalder & Pigneur",
      "price": "$34.77"
    },
    {
      "title": "The Power of Broke",
      "author": "Daymond John",
      "price": "$31.59"
    },
    {
      "title": "Titan",
      "author": "Ron Chernow",
      "price": "$40.39"
    },
    {
      "title": "Dare to Lead",
      "author": "Brené Brown",
      "price": "$16.00"
    },
    {
      "title": "The Outsiders",
      "author": "William Thorndike",
      "price": "$22.77"
    },
    {
      "title": "The Hard Thing About Hard Things",
      "author": "Ben Horowitz",
      "price": "$28.81"
    },
    {
      "title": "Leadership and Self-Deception",
      "author": "Arbinger Institute",
      "price": "$23.09"
    },
    {
      "title": "Twelve and a Half",
      "author": "Gary Vaynerchuk",
      "price": "$34.99"
    },
    {
      "title": "Jab, Jab, Jab, Right Hook",
      "author": "Gary Vaynerchuk",
      "price": "$30.79"
    },
    {
      "title": "High Output Management",
      "author": "Andrew Grove",
      "price": "$11.58"
    },
    {
      "title": "Sam Walton: Made In America",
      "author": "Sam Walton",
      "price": "$13.09"
    },
    {
      "title": "No Rules Rules",
      "author": "Hastings & Meyer",
      "price": "$26.96"
    },
    {
      "title": "First A Dream",
      "author": "Jim Clayton",
      "price": "$75.20"
    },
    {
      "title": "The Man Behind the Microchip",
      "author": "Leslie Berlin",
      "price": "$51.95"
    },
    {
      "title": "Business @ the Speed of Thought",
      "author": "Bill Gates",
      "price": "$64.71"
    },
    {
      "title": "The Personal MBA",
      "author": "Josh Kaufman",
      "price": "$21.56"
    },
    {
      "title": "The Lean Startup",
      "author": "Eric Ries",
      "price": "$21.95"
    },
    {
      "title": "Crush It!",
      "author": "Gary Vaynerchuk",
      "price": "$20.40"
    },
    {
      "title": "Winning",
      "author": "Jack Welch",
      "price": "$26.41"
    },
    {
      "title": "Getting to Yes",
      "author": "Ury & Fisher",
      "price": "$19.25"
    },
    {
      "title": "Drive",
      "author": "Daniel Pink",
      "price": "$20.72"
    },
    {
      "title": "The Everything Store",
      "author": "Brad Stone",
      "price": "$17.70"
    },
    {
      "title": "Outliers",
      "author": "Malcolm Gladwell",
      "price": "$19.25"
    },
    {
      "title": "Start With Why",
      "author": "Simon Sinek",
      "price": "$19.25"
    },
    {
      "title": "The Innovator's Dilemma",
      "author": "Clayton Christensen",
      "price": "$35.40"
    },
    {
      "title": "The Coaching Habit",
      "author": "Michael Bungay Stanier",
      "price": "$19.23"
    },
    {
      "title": "2600 Phrases for Effective Performance Reviews",
      "author": "Paul Falcone",
      "price": "$17.99"
    },
    {
      "title": "Give and Take",
      "author": "Adam Grant",
      "price": "$19.25"
    },
    {
      "title": "The Effective Executive",
      "author": "Peter Drucker",
      "price": "$24.57"
    },
    {
      "title": "The Ten Commandments for Business Failure",
      "author": "Donald Keough",
      "price": "$26.30"
    },
    {
      "title": "Dear Chairman",
      "author": "Jeff Gramm",
      "price": "$41.58"
    },
    {
      "title": "Purple Cow",
      "author": "Seth Godin",
      "price": "$19.21"
    },
    {
      "title": "The $100 Startup",
      "author": "Chris Guillebeau",
      "price": "$23.00"
    },
    {
      "title": "Personal History",
      "author": "Katharine Graham",
      "price": "$47.18"
    },
    {
      "title": "Only the Paranoid Survive",
      "author": "Andrew Grove",
      "price": "$14.09"
    },
    {
      "title": "Exactly What to Say",
      "author": "Phil Jones",
      "price": "$25.47"
    },
    {
      "title": "Jack: Straight from the Gut",
      "author": "Jack Welch",
      "price": "$20.45"
    },
    {
      "title": "Dream Big",
      "author": "Cristiane Correa",
      "price": "$60.55"
    },
    {
      "title": "The Art of War",
      "author": "Sun Tzu",
      "price": "$9.46"
    },
    {
      "title": "Zero to One",
      "author": "Masters & Thiel",
      "price": "$41.90"
    },
    {
      "title": "Tribes",
      "author": "Seth Godin",
      "price": "$26.15"
    },
    {
      "title": "Drive to Thrive",
      "author": "Sharad Bajaj",
      "price": "$19.51"
    },
    {
      "title": "The Farmer from Merna",
      "author": "Karl Schriftgeisser",
      "price": "$150.07"
    },
    {
      "title": "Business Adventures",
      "author": "John Brooks",
      "price": "$19.25"
    },
    {
      "title": "Limping on Water",
      "author": "Phil Beuth",
      "price": "$670.00"
    },
    {
      "title": "Principles: Life and Work",
      "author": "Ray Dalio",
      "price": "$39.99"
    },
    {
      "title": "The Psychology of Money",
      "author": "Morgan Housel",
      "price": "$22.99"
    },
    {
      "title": "Same as Ever",
      "author": "Morgan Housel",
      "price": "$28.99"
    },
    {
      "title": "The 4-Hour Work Week",
      "author": "Timothy Ferriss",
      "price": "$26.99"
    },
    {
      "title": "Supermoney",
      "author": "Adam Smith",
      "price": "$27.99"
    },
    {
      "title": "The Miracle Morning",
      "author": "Hal Elrod",
      "price": "$22.99"
    },
    {
      "title": "Die With Zero",
      "author": "Bill Perkins",
      "price": "$26.99"
    },
    {
      "title": "How To Be Rich",
      "author": "J. Paul Getty",
      "price": "$24.99"
    },
    {
      "title": "Take on the Street",
      "author": "Arthur Levitt",
      "price": "$28.99"
    },
    {
      "title": "Rich Dad Poor Dad for Teens",
      "author": "Robert Kiyosaki",
      "price": "$18.99"
    },
    {
      "title": "Blueprint to Wealth",
      "author": "Gary Stone",
      "price": "$31.99"
    },
    {
      "title": "The Missing Billionaires",
      "author": "Victor Haghani & James White",
      "price": "$34.99"
    },
    {
      "title": "Enough",
      "author": "John Bogle",
      "price": "$25.99"
    },
    {
      "title": "A 9-Step Path To Financial Independence",
      "author": "Joe Dominguez, Vicki Robin & Monica Wood",
      "price": "$27.99"
    }
  ]
};

const generateTableRows = (books) => {
  return books.map(book => `<tr>
                                <td><div class="book-title">${book.title}</div></td>
                                <td><div class="book-author">${book.author}</div></td>
                                <td><div class="book-price">${book.price}</div></td>
                            </tr>`).join('\n');
};

const generateMobileCards = (books) => {
  return books.map(book => {
    const href = `https://www.amazon.com/s?k=${encodeURIComponent(book.title + ', ' + book.author + ', ' + book.price)}`;
    return `<div class="book-mobile-card">
    <div class="book-mobile-title"><a href="${href}" target="_blank" rel="noopener noreferrer">${book.title}</a></div>
    <div class="book-mobile-author">${book.author}</div>
    <div class="book-mobile-price">${book.price}</div>
</div>`;
  }).join('');
};

let html = `            <section class="books-content">`;

for (const [category, books] of Object.entries(categories)) {
  html += `
                <h2 class="page-title">${category}</h2>
                <div class="books-table-container">
                    <table class="books-table">
                        <thead>
                            <tr>
                                <th>📚 Title</th>
                                <th>✍️ Author(s)</th>
                                <th>💰 Price</th>
                            </tr>
                        </thead>
                        <tbody>
${generateTableRows(books)}
                        </tbody>
                    </table>
                </div>

                <div class="books-mobile-cards" style="display: none;">${generateMobileCards(books)}
                </div>`;
}

html += `
            </section>`;

console.log(html);