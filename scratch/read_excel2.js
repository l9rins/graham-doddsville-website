const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'xlsx', '2026-05-22  Latest News - Sources - Updated (1).xlsx');
const wb = xlsx.readFile(filePath);

const output = {};

wb.SheetNames.forEach(name => {
    const ws = wb.Sheets[name];
    const data = xlsx.utils.sheet_to_json(ws, { header: 1 }); // raw array format
    output[name] = data;
});

fs.writeFileSync(path.join(__dirname, 'excel_data.json'), JSON.stringify(output, null, 2));
console.log('Saved to excel_data.json');
