const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ─── CONFIGURATION & PATHS ──────────────────────────────────────────────────

const excelPath = path.join(__dirname, '..', 'xlsx', '0.2  Value Investor Quotes 2026-05-05.xlsx');
const rootIndexPath = path.join(__dirname, '..', 'index.html');
const publicIndexPath = path.join(__dirname, '..', 'public', 'index.html');
const quotesHtmlPath = path.join(__dirname, '..', 'market-quotes.html');

console.log('--- Graham & Doddsville Quotes Compiler ---');

if (!fs.existsSync(excelPath)) {
  console.error('Error: Carlos\'s spreadsheet not found at:', excelPath);
  process.exit(1);
}

// ─── 1. PARSE & SORT EXCEL DATA ─────────────────────────────────────────────

const workbook = XLSX.readFile(excelPath, { cellDates: true });
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(sheet);

console.log(`Successfully parsed ${rawData.length} quotes from spreadsheet.`);

// Formatting helpers
const formatDateString = (dateVal) => {
  if (dateVal instanceof Date) {
    return `${dateVal.getDate()}/${dateVal.getMonth() + 1}/${dateVal.getFullYear()}`;
  }
  return dateVal || '';
};

const formatDateFull = (dateVal) => {
  if (dateVal instanceof Date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateVal.toLocaleDateString('en-US', options);
  }
  return dateVal || '';
};

const cleanStr = (str) => {
  if (!str) return '';
  return str.toString()
    .replace(/Â¾/g, '¾')
    .replace(/Â/g, '')
    .trim();
};

const quotes = rawData.map((row, idx) => {
  return {
    id: idx + 1,
    date: row.Date instanceof Date ? row.Date : new Date(row.Date),
    dateStr: formatDateString(row.Date),
    dateFull: formatDateFull(row.Date),
    country: cleanStr(row.Country),
    specificHeading: cleanStr(row['Specific Heading']),
    generalHeading: cleanStr(row['General Heading']),
    quote: cleanStr(row.Quote),
    author: cleanStr(row.Author),
    jobTitle: cleanStr(row['Job Title']),
    company: cleanStr(row.Company),
    companyUrl: cleanStr(row['Company URL']),
    documentUrl: cleanStr(row['Document URL'])
  };
});

// Sort by date descending (most recent first)
quotes.sort((a, b) => b.date - a.date);

// ─── 2. GENERATE HOMEPAGE (INDEX) HTML PREVIEWS ─────────────────────────────

// Generate previews for the top 3 most recent quotes
const homePreviewsHtml = quotes.slice(0, 3).map((q, i) => {
  return `
                <!-- Quote ${i + 1} -->
                <div class="market-quote-item" onclick="window.location.href='market-quotes.html#quote-${q.id}'">
                    <div class="quote-content">
                        <p class="quote-text">"${q.quote.length > 200 ? q.quote.substring(0, 197) + '...' : q.quote}"</p>
                        <div class="quote-meta">
                            <span class="quote-author">${q.author}</span>
                            <span class="quote-position">${q.jobTitle}</span>
                            <span class="quote-company">${q.company}</span>
                            <span class="quote-country">(${q.country})</span>
                            <span class="quote-date">(${q.dateStr})</span>
                        </div>
                        <div class="quote-source">
                            <a href="#" onclick="event.stopPropagation(); openSourceLink('${q.documentUrl || q.companyUrl || '#'}')"
                                class="source-link">View source document</a>
                        </div>
                    </div>
                </div>`;
}).join('\n');

// ─── 3. GENERATE FULL MARKET QUOTES HTML CARDS ──────────────────────────────

const fullCardsHtml = quotes.map((q) => {
  // Make company name a functional link if URL is provided
  const companyLink = q.companyUrl
    ? `<a href="${q.companyUrl}" target="_blank" class="company-link" onclick="event.stopPropagation();">${q.company} ↗</a>`
    : q.company;

  // Make a beautiful source document button in the card footer if URL is provided
  const sourceButton = q.documentUrl
    ? `<a href="${q.documentUrl}" target="_blank" class="source-btn" onclick="event.stopPropagation();">View Source ↗</a>`
    : `<span class="quote-country">${q.country}</span>`;

  return `
                <!-- Quote ${q.id} -->
                <div class="quote-card" id="quote-${q.id}">
                    <div class="quote-header">
                        <h3 class="quote-title">${q.specificHeading}</h3>
                        <p class="quote-meta">${q.generalHeading}</p>
                    </div>
                    <div class="quote-content">
                        <p class="quote-text">"${q.quote}"</p>

                        <div class="quote-author-info">
                            <p class="quote-author">${q.author}</p>
                            <p class="quote-position">${q.jobTitle}</p>
                            <p class="quote-company">${companyLink}</p>
                        </div>
                    </div>
                    <div class="quote-footer">
                        <span class="quote-date">${q.dateFull}</span>
                        ${sourceButton}
                    </div>
                </div>`;
}).join('\n');

// ─── 4. INJECT INTO HOMEPAGE FILES (ROOT & PUBLIC) ──────────────────────────

const injectIntoIndex = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`Warning: File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const startTag = '<div class="market-quotes-container">';
  const endTag = '<!-- See More Button -->';
  
  const startIdx = content.indexOf(startTag);
  const endIdx = content.indexOf(endTag);
  
  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx + startTag.length);
    const after = content.substring(endIdx);
    fs.writeFileSync(filePath, before + '\n' + homePreviewsHtml + '\n                ' + after, 'utf8');
    console.log(`Successfully compiled and injected top 3 quotes preview into: ${filePath}`);
  } else {
    console.error(`Error: Could not locate injection markers in: ${filePath}`);
  }
};

injectIntoIndex(rootIndexPath);
injectIntoIndex(publicIndexPath);

// ─── 5. INJECT INTO FULL MARKET QUOTES FILE ─────────────────────────────────

if (fs.existsSync(quotesHtmlPath)) {
  let content = fs.readFileSync(quotesHtmlPath, 'utf8');
  const startTag = '<div class="quotes-grid">';
  const endTag = '</div>'; // find the closing div of quotes-grid
  
  const startIdx = content.indexOf(startTag);
  if (startIdx !== -1) {
    const endIdx = content.indexOf(endTag, startIdx + startTag.length);
    if (endIdx !== -1) {
      const before = content.substring(0, startIdx + startTag.length);
      const after = content.substring(endIdx);
      fs.writeFileSync(quotesHtmlPath, before + '\n' + fullCardsHtml + '\n            ' + after, 'utf8');
      console.log(`Successfully compiled and injected all ${quotes.length} quotes into: ${quotesHtmlPath}`);
    }
  } else {
    console.error('Error: Could not locate <div class="quotes-grid"> inside market-quotes.html');
  }
} else {
  console.log(`Warning: market-quotes.html not found at: ${quotesHtmlPath}`);
}

console.log('--- Compilation Complete ---');
