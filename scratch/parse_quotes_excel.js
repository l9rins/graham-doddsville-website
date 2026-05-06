const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'xlsx', '0.2  Value Investor Quotes 2026-05-05.xlsx');
console.log('Reading Excel file from:', excelPath);

const workbook = XLSX.readFile(excelPath);
const sheetNames = workbook.SheetNames;
console.log('Sheets inside workbook:', sheetNames);

// Let's read the first sheet
const firstSheetName = sheetNames[0];
const sheet = workbook.Sheets[firstSheetName];

// Convert to JSON array of objects
const data = XLSX.utils.sheet_to_json(sheet);
console.log(`Total rows read from ${firstSheetName}: ${data.length}`);

if (data.length > 0) {
  console.log('\n--- First 3 Rows ---');
  console.log(JSON.stringify(data.slice(0, 3), null, 2));
  
  console.log('\n--- All Columns ---');
  console.log(Object.keys(data[0]));
}
