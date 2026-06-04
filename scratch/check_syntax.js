const fs = require('fs');
let html = fs.readFileSync('legal-taxation.html', 'utf8');
let scriptMatches = html.matchAll(/<script>([\s\S]*?)<\/script>/g);

let i = 0;
for (const match of scriptMatches) {
    let script = match[1];
    fs.writeFileSync(`scratch/test-script-${i}.js`, script);
    try {
        require("vm").Script(script);
        console.log(`Script ${i} OK`);
    } catch (e) {
        console.log(`Script ${i} ERROR:`, e);
    }
    i++;
}
