/**
 * Region keyword gazetteer — used ONLY to re-check articles from globally-
 * publishing sources (BBC, Guardian, CNBC, Bloomberg, etc.) before trusting
 * their source-declared region.
 */

const REGION_KEYWORDS = {
  "north-america": [
    "United States", "U.S.", "US", "USA", "American economy", "Canada", "Canadian",
    "Mexico", "Mexican",
    "New York", "NY", "Washington D.C.", "Wall Street", "Silicon Valley",
    "Toronto", "Ottawa", "Vancouver", "Quebec", "Mexico City", "Los Angeles",
    "Chicago", "Texas", "California",
    "Federal Reserve", "the Fed", "White House", "US Congress",
    "S&P 500", "Nasdaq", "Dow Jones", "Bank of Canada", "Morgan Stanley", "Warren Buffett"
  ],

  "europe": [
    "United Kingdom", "UK", "U.K.", "Britain", "British", "England", "Scotland", "Wales",
    "France", "French", "Germany", "German", "Italy", "Italian", "Spain",
    "Spanish", "Portugal", "Netherlands", "Dutch", "Belgium", "Switzerland",
    "Swiss", "Austria", "Sweden", "Norway", "Denmark", "Finland", "Poland",
    "Ireland", "Irish", "Greece", "Greek", "Ukraine", "Ukrainian", "Russia",
    "Russian",
    "London", "Paris", "Berlin", "Rome", "Madrid", "Brussels", "Amsterdam",
    "Frankfurt", "Zurich", "Geneva", "Dublin", "Moscow", "Kyiv", "Vienna",
    "Warsaw", "Lisbon",
    "European Union", "Eurozone", "European Central Bank", "ECB", "BOE", "Bank of England"
  ],

  "asia": [
    "China", "Chinese", "Japan", "Japanese", "South Korea", "Korean", "Kospi",
    "North Korea", "India", "Indian", "Taiwan", "Taiwanese", "Singapore",
    "Malaysia", "Indonesia", "Thailand", "Vietnam", "Philippines",
    "Hong Kong", "Pakistan", "Bangladesh", "Sri Lanka", "Asian",
    "Beijing", "Shanghai", "Shenzhen", "Tokyo", "Seoul", "Mumbai", "Delhi",
    "New Delhi", "Bangkok", "Jakarta", "Manila", "Taipei",
    "Nikkei", "Hang Seng", "PBOC", "People's Bank of China", "Bank of Japan",
    "ASEAN", "RBI", "Reserve Bank of India"
  ],

  "elsewhere": [
    "South Africa", "Nigeria", "Nigerian", "Kenya", "Egypt", "Egyptian",
    "Johannesburg", "Cairo", "Lagos", "Nairobi",
    "UAE", "United Arab Emirates", "Saudi Arabia", "Saudi", "Qatar",
    "Dubai", "Abu Dhabi", "Doha", "Riyadh", "Gulf states",
    "Brazil", "Brazilian", "Argentina", "Argentine", "Chile", "Chilean",
    "Colombia", "Colombian", "Peru", "Peruvian", "Rio de Janeiro", "Sao Paulo", "Buenos Aires",
    "New Zealand", "Auckland", "Wellington"
  ]
};

function matchesRegion(text, region) {
  const keywords = REGION_KEYWORDS[region];
  if (!keywords || !text) return false;

  return keywords.some((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escaped}\\b`, "i");
    return pattern.test(text);
  });
}

const GLOBAL_SOURCES_NEEDING_FILTER = [
  "BBC News",
  "BBC",
  "Bloomberg",
  "Bloomberg Europe",
  "CNBC",
  "CNBC Europe",
  "The Guardian",
  "Guardian",
  "Guardian Australia"
];

module.exports = {
  REGION_KEYWORDS,
  matchesRegion,
  GLOBAL_SOURCES_NEEDING_FILTER
};
