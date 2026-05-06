const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(filePath));
      }
    } else {
      if (file.endsWith('.xlsx') || file.endsWith('.xls') || file.endsWith('.csv')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const allExcelFiles = walk('c:\\Users\\Mark Lorenz\\Desktop\\LibraryWebsite');
console.log('All Excel/CSV files found:', allExcelFiles);
