const fs = require('fs');

const file = 'public/index.html';
let html = fs.readFileSync(file, 'utf8');

const mapping = {
    'philosophy': 'philosophy.html',
    'investing': 'investing.html',
    'businesses': 'businesses.html',
    'governance': 'governance.html',
    'accounting': 'accounting.html',
    'economics': 'economics.html',
    'miscellaneous': 'miscellaneous.html'
};

// Replace mobile links
for (const [key, val] of Object.entries(mapping)) {
    // Look for <div class="buffett-tab" id="[key]-tab-mobile" data-tab="[key]"> and replace the first warren-buffett-topics.html inside it
    const regex = new RegExp(`(<div class="buffett-tab"[^>]*data-tab="${key}"[\\s\\S]*?)href="warren-buffett-topics\\.html"`, 'g');
    html = html.replace(regex, `$1href="${val}"`);
}

// Replace desktop links
for (const [key, val] of Object.entries(mapping)) {
    // Look for <div class="tab-content" id="[key]-tab"> and replace the first warren-buffett-topics.html inside it
    const regex = new RegExp(`(<div class="tab-content"[^>]*id="${key}-tab"[\\s\\S]*?)href="warren-buffett-topics\\.html"`, 'g');
    html = html.replace(regex, `$1href="${val}"`);
}

fs.writeFileSync(file, html, 'utf8');
console.log('Fixed links successfully!');
