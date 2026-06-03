const fs = require('fs');
const cssToAdd = `

/* Article source inline styling */
.article-source-inline {
    color: #888888 !important;
    font-family: Arial, sans-serif !important;
    font-size: 0.85em !important;
    font-weight: normal !important;
}

/* Extra line space before recommended books */
#mobile-books {
    margin-top: 24px !important;
}
`;

['public/css/styles.css', 'css/styles.css'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('.article-source-inline {')) {
        fs.appendFileSync(file, cssToAdd);
        console.log('Appended to ' + file);
    }
});
