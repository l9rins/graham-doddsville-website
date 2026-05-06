const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'xlsx', '0.2  Value Investor Quotes 2026-05-05.xlsx');
const workbook = XLSX.readFile(excelPath, { cellDates: true, cellNF: true, cellText: true });
const firstSheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[firstSheetName];

// Convert to json, but let's inspect the actual cells to see dates
const range = XLSX.utils.decode_range(sheet['!ref']);
console.log('Date column sample values (formatted vs raw):');

for (let r = 1; r <= 5; r++) {
  const cellRef = XLSX.utils.encode_cell({ r, c: 0 }); // Column A (index 0) is Date
  const cell = sheet[cellRef];
  if (cell) {
    console.log(`Row ${r}: v = ${cell.v}, t = ${cell.t}, w = ${cell.w}`);
  }
}
