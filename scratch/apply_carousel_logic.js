const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'xlsx', '0.2  Value Investor Quotes 2026-05-05.xlsx');
const quotesHtmlPath = path.join(__dirname, '..', 'market-quotes.html');

console.log('--- Injecting Carousel and Filter Logic ---');

if (!fs.existsSync(excelPath)) {
  console.error('Spreadsheet not found');
  process.exit(1);
}

// Read sheet categories
const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet);

const cleanStr = (str) => {
  if (!str) return '';
  return str.toString().trim();
};

const categories = Array.from(new Set(rawData.map(row => cleanStr(row['General Heading'])))).filter(Boolean);
console.log('Categories extracted from Excel:', categories);

let content = fs.readFileSync(quotesHtmlPath, 'utf8');

// 1. Generate Carousel HTML
const carouselHtml = `
            <!-- Category Carousel Filter -->
            <div class="category-carousel-container">
                <div class="category-carousel">
                    <button class="category-btn active" data-filter="all">All</button>
                    ${categories.map(cat => `<button class="category-btn" data-filter="${cat}">${cat}</button>`).join('\n                    ')}
                </div>
            </div>`;

// Inject Carousel HTML right above quotes-grid
const oldGridTag = '<div class="quotes-grid">';
if (content.indexOf('<!-- Category Carousel Filter -->') === -1) {
  const gridIndex = content.indexOf(oldGridTag);
  if (gridIndex !== -1) {
    const before = content.substring(0, gridIndex);
    const after = content.substring(gridIndex);
    content = before + carouselHtml + '\n\n            ' + after;
    console.log('Successfully injected Carousel HTML!');
  }
} else {
  // Replace existing carousel in case of re-run
  const startTag = '<!-- Category Carousel Filter -->';
  const endTag = '<div class="quotes-grid">';
  const startIdx = content.indexOf(startTag);
  const endIdx = content.indexOf(endTag);
  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + carouselHtml.trim() + '\n\n            ' + after;
    console.log('Successfully updated Carousel HTML!');
  }
}

// 2. Generate and inject interactive scripts before </body> tag (excluding bookmark logic)
const jsCode = `
<script id="quoteFilterAndBookmarkLogic">
document.addEventListener('DOMContentLoaded', function() {
    // 1. Category Filtering
    const filterButtons = document.querySelectorAll('.category-btn');
    const cards = document.querySelectorAll('.quote-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-filter');
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
</script>
</body>`;

if (content.indexOf('id="quoteFilterAndBookmarkLogic"') === -1) {
  content = content.replace('</body>', jsCode);
  console.log('Successfully injected Interactive Carousel JavaScript!');
} else {
  // Replace existing JS block in case of re-run
  const startIdx = content.indexOf('<script id="quoteFilterAndBookmarkLogic"');
  const endIdx = content.indexOf('</body>');
  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + jsCode;
    console.log('Successfully updated Interactive Carousel JavaScript!');
  }
}

fs.writeFileSync(quotesHtmlPath, content, 'utf8');
