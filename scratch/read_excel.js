const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'xlsx', '2026-05-22  Latest News - Sources - Updated (1).xlsx');
const wb = xlsx.readFile(filePath);

console.log('Sheet names:', wb.SheetNames);

wb.SheetNames.forEach(name => {
    const ws = wb.Sheets[name];
    const data = xlsx.utils.sheet_to_json(ws);
    console.log(`\n=== Sheet: ${name} (${data.length} rows) ===`);
    if (data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    }
    // Print all rows
    data.forEach((r, i) => console.log(`Row ${i}:`, JSON.stringify(r)));
});
