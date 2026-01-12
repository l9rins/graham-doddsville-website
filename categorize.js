const fs = require('fs');

const books = JSON.parse(fs.readFileSync('books_clean.json', 'utf8'));

const categories = {
  "Buffett/Munger/Berkshire": [],
  "Value Investing": [],
  "Share Investing": [],
  "Wealth Creation": [],
  "Financial Analysis": [],
  "Sales & Marketing": [],
  "Self-Improvement": [],
  "Business & Management": [],
  "Miscellaneous": []
};

function categorize(book) {
  const title = book.title.toLowerCase();
  const author = book.author.toLowerCase();

  if (title.includes('buffett') || title.includes('munger') || title.includes('berkshire') || author.includes('buffett') || author.includes('munger')) {
    return "Buffett/Munger/Berkshire";
  }
  if (title.includes('value investing') || title.includes('graham') || title.includes('dodd') || title.includes('security analysis') || author.includes('graham') || author.includes('dodd')) {
    return "Value Investing";
  }
  if (title.includes('share') || title.includes('stock') || title.includes('investing') && !title.includes('value')) {
    return "Share Investing";
  }
  if (title.includes('wealth') || title.includes('rich') || title.includes('money') || title.includes('millionaire')) {
    return "Wealth Creation";
  }
  if (title.includes('financial analysis') || title.includes('analysis')) {
    return "Financial Analysis";
  }
  if (title.includes('sales') || title.includes('marketing')) {
    return "Sales & Marketing";
  }
  if (title.includes('self') || title.includes('improvement') || title.includes('mindset') || title.includes('success') || title.includes('miracle morning') || title.includes('badass')) {
    return "Self-Improvement";
  }
  if (title.includes('business') || title.includes('management') || title.includes('ceo') || title.includes('principles')) {
    return "Business & Management";
  }
  return "Miscellaneous";
}

books.forEach(book => {
  const cat = categorize(book);
  categories[cat].push(book);
});

console.log(JSON.stringify(categories, null, 2));