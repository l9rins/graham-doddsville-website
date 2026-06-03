const fs = require('fs');
let css = fs.readFileSync('public/css/styles.css', 'utf8');

css = css.replace('.comma-separated-list a::before {\n    content: ", ";\n    color: #333;\n    pointer-events: none;\n}\n\n.comma-separated-list a:first-child::before {\n    content: "";\n}', '.comma-separated-list a:not(:last-child)::after {\n    content: ", ";\n    color: #333;\n    pointer-events: none;\n}');

fs.writeFileSync('public/css/styles.css', css, 'utf8');
console.log('Fixed CSS');
