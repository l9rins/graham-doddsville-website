const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'buffett_data.json'), 'utf8'));
const keys = Object.keys(data);
console.log('Total keys in buffett_data.json:', keys.length);
console.log(JSON.stringify(keys, null, 2));
