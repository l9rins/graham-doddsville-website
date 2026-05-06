const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'xlsx', '0.2  Value Investor Quotes 2026-05-05.xlsx');
const workbook = XLSX.readFile(excelPath, { cellDates: true });
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(sheet);

console.log('Total rows read:', rawData.length);

// Format date helper
const formatDateString = (dateVal) => {
  if (dateVal instanceof Date) {
    const day = dateVal.getDate();
    const month = dateVal.getMonth() + 1;
    const year = dateVal.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return dateVal;
};

const formatDateFull = (dateVal) => {
  if (dateVal instanceof Date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateVal.toLocaleDateString('en-US', options);
  }
  return dateVal;
};

// Clean strings to prevent HTML encoding issues
const cleanStr = (str) => {
  if (!str) return '';
  return str.toString()
    .replace(/Â¾/g, '¾')
    .replace(/Â/g, '')
    .trim();
};

// Map raw row data to uniform objects
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

console.log('\nSorted Quotes Sample (Top 3):');
quotes.slice(0, 3).forEach((q, i) => {
  console.log(`\n--- Sorted Position ${i + 1} ---`);
  console.log(`Original ID: ${q.id}`);
  console.log(`Date: ${q.dateFull} (${q.dateStr})`);
  console.log(`Heading: ${q.specificHeading}`);
  console.log(`Author: ${q.author} (${q.company})`);
  console.log(`Snippet: ${q.quote.substring(0, 100)}...`);
});
