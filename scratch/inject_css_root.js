const fs = require('fs');

const cssBlock = `
        /* Article Detail Panel */
        .article-detail-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: none;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .article-detail-panel.active {
            display: flex;
        }

        .article-detail-content {
            background: white;
            border-radius: 12px;
            max-width: 800px;
            max-height: 90vh;
            width: 100%;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .article-detail-header {
            padding: 24px;
            border-bottom: 1px solid var(--border-light);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--primary-blue);
            color: white;
            border-radius: 12px 12px 0 0;
        }

        .article-detail-title {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
        }

        .article-detail-close {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .article-detail-close:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .article-detail-body {
            padding: 24px;
            line-height: 1.7;
        }

        .article-detail-body h3 {
            color: var(--primary-blue);
            margin-top: 24px;
            margin-bottom: 12px;
        }

        .article-detail-body p {
            margin-bottom: 16px;
        }

        .article-loading {
            text-align: center;
            padding: 40px;
            color: var(--text-secondary);
        }
`;

const files = ['financial-statement-analysis.html', 'stock-valuation.html'];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('.article-detail-panel {')) {
        content = content.replace('        /* Page Title Section */', cssBlock + '\n        /* Page Title Section */');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Fixed ' + f);
    } else {
        console.log('Already fixed ' + f);
    }
});
