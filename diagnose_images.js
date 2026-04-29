/**
 * Diagnostic script: Extracts all article IDs + titles from every page that uses
 * the image resolver, then runs the same matching logic the resolver uses to
 * identify which articles FAIL to find an image.
 *
 * Updated with the LATEST matching logic from article-image-resolver.js
 */

const fs = require('fs');
const path = require('path');

// ── 1. Load the ARTICLE_IMAGE_INDEX from article-image-resolver.js ──────────
const resolverSrc = fs.readFileSync(
  path.join(__dirname, 'js', 'article-image-resolver.js'),
  'utf-8'
);

const arrStart = resolverSrc.indexOf('[');
const arrEnd = resolverSrc.indexOf('];', arrStart);
const ARTICLE_IMAGE_INDEX = JSON.parse(
  resolverSrc.slice(arrStart, arrEnd + 1)
);

// ── 2. The LATEST matching logic ───────────────────────────────────────────

const MAPPING_OVERRIDES = {
    'smsfs': 'Self-managed super fund (SMSF)',
    'self-managed-superannuation-funds': 'Self-managed super fund (SMSF)',
    'managed-funds': 'Managed equity funds (unit trusts)',
    'interest-rate-derivatives': 'Interest rate swaps',
    'structured-products': 'Overview of the derivatives market',
    'direct-property': 'Residential property',
    'listed-property-trusts': 'Real estate investment trusts (REITs)',
    'energy-commodities': 'Overview of the energy industry',
    'metal-commodities': 'Precious metals',
    'livestock-futures': 'Livestock commodities',
    'economic-theories': 'Introduction to economics',
    'implication-for-businesses': 'Implications for businesses',
    'future-trends': 'Outlook for the global economy',
    'government-spending': 'Government budget and fiscal position',
    'cpi-and-inflation': 'Consumer price index (CPI)',
    'strategies-inflation': 'Strategies against inflation',
    'combating-inflation': 'Strategies against inflation',
    'business-cycles-definition': 'What are business cycles',
    'business-cycle-implications': 'Impact of business cycles',
    'business-cycle-forecasting': 'How to forecast business cycles',
    'effects-on-investments': 'Implications for investments',
    'house-price-index': 'Housing market indicators',
    'advanced-currency-topics': 'Foreign exchange (FX)',
    'derivatives-markets': 'Overview of the derivatives market',
    'crypto-wallets': 'How to store cryptocurrency',
    'rsas': 'Superannuation', // Fallback for RSAs
    'lpts': 'Real estate investment trusts (REITs)',
    'upts': 'Property funds (unlisted)',
    'qualitative-factors-technological-disruption': 'How to select stocks', // Fallback
    'qualitative-factors-customer-loyalty': 'Product and service quality', // Fallback
    'stock-valuation-intro-to-revenue-based-val': 'Use of discount rates', // Fallback
    'famous-investors': 'Warren Buffett', // Fallback to a famous investor
    'how-value-ipos': 'How to value IPOs',
    'stockopedia': 'General investing calculators', // Fallback to general tool image
    'seeking-alpha': 'General investing calculators', // Fallback to general tool image
    'stocktwits': 'General investing calculators', // Fallback to general tool image
    'super-contributions-optimizer': 'Superannuation calculators',
    'property-transfer-registration-fees': 'Other useful calculators',
    'cgt-introduction': 'Introduction to CGT',
    'cgt-calculation': 'The calculation of CGT',
    'shares-cgt': 'Shares and CGT',
    'faaa-fprj': 'FAAA Fin Plan Research Journal',
    'cfa-faj': 'CFA Financial Analysts Journal',
    'rba-somp': 'RBA Statement on Monetary Policy',
    'rba-fsr': 'RBA Financial Stability Review',
    'fsc-reports': 'Financial Services Council reports',
    'asx': 'Australian Securities Exchange (ASX)',
    'debentures': 'Negotiable certificates of deposit', 
    'grain-derivatives': 'Equity derivatives',
    'energy-derivatives': 'Equity derivatives',
    'oil-futures': 'Crude oil',
    'inflation-definition': 'Inflation rate',
    'measuring-inflation': 'How to measure inflation',
    'popular-cryptos': 'Bitcoin',
    'omaha-may-2024': 'Buffett, Munger & Berkshire',
    'upcoming-': 'Buffett, Munger & Berkshire' // Generic events fallback
  };

const ABBREVIATIONS = {
  'cgt': 'capital gains tax',
  'smsf': 'self managed super fund',
  'ipo': 'initial public offering',
  'fx': 'foreign exchange',
  'reit': 'real estate investment trust',
  'etf': 'exchange traded fund',
};

function normalizeText(input) {
  return (input || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function expandAbbreviations(text) {
  let result = text;
  for (const [abbr, full] of Object.entries(ABBREVIATIONS)) {
    const reg = new RegExp('\\b' + abbr + '\\b', 'gi');
    result = result.replace(reg, full);
  }
  return result;
}

function cleanTitle(title) {
  if (!title) return '';
  const firstPart = title.split(':')[0].split(' - ')[0];
  return firstPart.replace(/^the\s+/i, '').trim();
}

function getTokenScore(queryTokens, targetTokens) {
  if (!queryTokens.length || !targetTokens.length) return 0;
  let matches = 0;
  for (const q of queryTokens) {
    if (q.length < 3) continue;
    if (targetTokens.includes(q)) matches++;
  }
  return matches / Math.max(queryTokens.length, targetTokens.length);
}

function parseEntry(fileName) {
  const noExt = fileName.replace(/\.[a-z0-9]+$/i, '');
  const idMatch = noExt.match(/^(\d+(?:\.\d+)+)\s+/);
  const idPrefix = idMatch ? idMatch[1] : '';
  const labelRaw = idMatch ? noExt.slice(idMatch[0].length) : noExt;
  return { fileName, idPrefix, labelRaw, labelNorm: normalizeText(labelRaw) };
}

const entries = ARTICLE_IMAGE_INDEX.map(parseEntry);

function findImage(articleId, articleData) {
  const id = (articleId || '').toString().trim();
  const idNorm = normalizeText(id.replace(/[-_]+/g, ' '));
  const rawTitle = articleData && articleData.title ? articleData.title : '';
  const title = cleanTitle(rawTitle);
  const titleNorm = normalizeText(title);
  const expandedTitleNorm = normalizeText(expandAbbreviations(title));

  // 1. Explicit Overrides
  const overrideKey = id.toLowerCase();
  if (MAPPING_OVERRIDES[overrideKey]) {
    const overrideVal = MAPPING_OVERRIDES[overrideKey];
    const match = entries.find(e => e.labelNorm === normalizeText(overrideVal) || e.labelNorm.includes(normalizeText(overrideVal)));
    if (match) return match;
  }

  // 2. Numeric Prefix Match
  if (/^\d+(?:\.\d+)+$/.test(id)) {
    const numericHit = entries.find((e) => e.idPrefix === id || e.idPrefix.startsWith(id + '.'));
    if (numericHit) return numericHit;
  }

  // 3. Exact/Substring Matches
  const targets = [titleNorm, expandedTitleNorm, idNorm];
  for (const target of targets) {
    if (!target || target.length < 3) continue;
    const exact = entries.find(e => e.labelNorm === target);
    if (exact) return exact;
    const includes = entries.find(e => e.labelNorm.includes(target) || target.includes(e.labelNorm));
    if (includes) return includes;
  }

  // 4. Token-based Fuzzy Matching
  const queryTokens = normalizeText(expandAbbreviations(rawTitle || id.replace(/[-_]+/g, ' ')))
    .split(' ')
    .filter(t => t.length >= 3);
  
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of entries) {
    const entryTokens = entry.labelNorm.split(' ').filter(t => t.length >= 3);
    if (!entryTokens.length) continue;
    const score = getTokenScore(queryTokens, entryTokens);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestScore >= 0.3) return bestMatch;

  // 5. Special Fallbacks
  if (id.includes('calc') || title.toLowerCase().includes('calculator')) {
    const genCalc = entries.find(e => e.fileName.includes('General investing calculators'));
    if (genCalc) return genCalc;
  }

  return null;
}

// ── 3. Scrape article IDs & titles from each HTML page ──────────────────────

const htmlDir = __dirname;
const pages = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const results = { matched: 0, failed: 0, details: {} };

for (const page of pages) {
  const html = fs.readFileSync(path.join(htmlDir, page), 'utf-8');
  if (!html.includes('buildArticleImageHtml') && !html.includes('article-image-resolver')) continue;

  const re = /'([a-zA-Z0-9_-]+)':\s*\{\s*title:\s*'([^']+)'/g;
  let m;
  const articles = [];
  while ((m = re.exec(html)) !== null) {
    articles.push({ id: m[1], title: m[2] });
  }

  const pageResults = { total: articles.length, matched: [], failed: [] };

  for (const art of articles) {
    const result = findImage(art.id, { title: art.title });
    if (!result) {
      pageResults.failed.push({ id: art.id, title: art.title });
      results.failed++;
    } else {
      pageResults.matched.push({ id: art.id, title: art.title, matchedTo: result.fileName });
      results.matched++;
    }
  }

  results.details[page] = pageResults;
}

console.log('\n====================================================');
console.log('  IMAGE RESOLVER DIAGNOSTIC REPORT (FINAL PASS)');
console.log('====================================================\n');
console.log(`Total matched:        ${results.matched}`);
console.log(`Total FAILED:         ${results.failed}`);
console.log('');

for (const [page, data] of Object.entries(results.details)) {
  if (data.failed.length === 0) continue;
  console.log(`\n── ${page} (${data.total} articles) ──`);
  console.log(`  ✗ FAILED (${data.failed.length}):`);
  for (const f of data.failed) {
    console.log(`    • [${f.id}] "${f.title}"`);
  }
}
console.log('\n====================================================\n');


