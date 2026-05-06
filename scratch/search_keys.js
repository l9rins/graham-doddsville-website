const fs = require('fs');
const path = require('path');

const data = require(path.join(__dirname, 'buffett_data.json'));

const searchTerms = ['philosophy', 'objectives', 'successful', 'conservatism', 'advice', 'strategy', 'risk', 'volatility', 'rumours'];

console.log('--- Searching keys for similar terms ---');
Object.keys(data).forEach(key => {
    searchTerms.forEach(term => {
        if (key.toLowerCase().includes(term)) {
            console.log(`Matched Key: "${key}" for term "${term}"`);
        }
    });
});
