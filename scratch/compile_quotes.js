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

const getInitials = (name) => {
  if (!name) return 'GD';
  const words = name.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0].substring(0, 2).toUpperCase();
};

const quotes = rawData.map((row, idx) => {
  const company = cleanStr(row.Company);
  const author = cleanStr(row.Author);
  return {
    id: idx + 1,
    date: row.Date instanceof Date ? row.Date : new Date(row.Date),
    dateStr: formatDateString(row.Date),
    dateFull: formatDateFull(row.Date),
    country: cleanStr(row.Country),
    specificHeading: cleanStr(row['Specific Heading']),
    generalHeading: cleanStr(row['General Heading']),
    quote: cleanStr(row.Quote),
    author: author,
    jobTitle: cleanStr(row['Job Title']),
    company: company,
    avatarInitials: getInitials(company || author),
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

// ─── 3. GENERATE FULL MARKET QUOTES HTML CARDS (CLIENT SPECIFICATION) ────────

const fullCardsHtml = quotes.map((q) => {
  const companyLink = q.companyUrl
    ? `<a href="${q.companyUrl}" target="_blank" class="company-link" onclick="event.stopPropagation();">${q.company} ↗</a>`
    : q.company;

  const sourceButton = `
            <a href="${q.documentUrl || q.companyUrl || '#'}" target="_blank" class="source-btn" onclick="event.stopPropagation();">
                <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                View Source
            </a>`;

  return `
                <!-- Quote ${q.id} -->
                <div class="quote-card" id="quote-${q.id}" data-category="${q.generalHeading}">
                    <!-- Header Row: Category Badge & Date -->
                    <div class="card-top-row">
                        <span class="category-badge">${q.generalHeading}</span>
                        <span class="card-date">${q.dateFull}</span>
                    </div>

                    <!-- Title Row -->
                    <h2 class="card-title">${q.specificHeading}</h2>

                    <!-- Quote Block with warm background & gold left border -->
                    <div class="quote-text-block">
                        <p class="quote-para"><span class="quote-mark">“</span>${q.quote}</p>
                    </div>

                    <!-- Author Row with circular avatar initials -->
                    <div class="author-avatar-row">
                        <div class="author-avatar">${q.avatarInitials}</div>
                        <div class="author-details">
                            <h4 class="author-name">${companyLink}</h4>
                            <p class="author-subtitle">${q.author} • ${q.jobTitle}</p>
                        </div>
                    </div>

                    <!-- Action Row: Full-Width View Source -->
                    <div class="card-action-row">
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
