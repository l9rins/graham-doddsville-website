const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const match = content.match(/const\s+buffettTopicsData\s*=\s*(\{[\s\S]*?\});/);
if (match) {
    try {
        // Evaluate the object or extract its keys
        const keys = [];
        const lines = match[1].split('\n');
        lines.forEach(line => {
            const keyMatch = line.match(/^\s*['"]?([^'"]+)['"]?\s*:/);
            if (keyMatch) {
                keys.push(keyMatch[1]);
            }
        });
        console.log('Found keys in buffettTopicsData in index.html:', keys);
        console.log('Total keys:', keys.length);
    } catch (e) {
        console.log('Failed to parse:', e.message);
    }
} else {
    console.log('buffettTopicsData not found in index.html');
}
