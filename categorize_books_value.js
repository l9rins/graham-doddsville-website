const fs = require('fs');

const books = JSON.parse(fs.readFileSync('books_value.json', 'utf8'));

const categories = {
  "Buffett, Munger & Berkshire": [],
  "Value Investing": [],
  "Share Investing & Stock Market": [],
  "Wealth Creation & Personal Finance": [],
  "Financial Analysis & Valuation": [],
  "Sales & Marketing": [],
  "Self-Improvement & Mindset": [],
  "Business & Management": [],
  "Miscellaneous / Biographies": []
};

// Function to categorize
function categorizeBook(title, author) {
  const lowerTitle = title.toLowerCase();
  const lowerAuthor = author.toLowerCase();

  if (lowerAuthor.includes('buffett') || lowerAuthor.includes('munger') || lowerAuthor.includes('berkshire') || lowerTitle.includes('buffett') || lowerTitle.includes('munger') || lowerTitle.includes('berkshire')) {
    return "Buffett, Munger & Berkshire";
  }
  if (lowerAuthor.includes('graham') || lowerAuthor.includes('klarman') || lowerTitle.includes('value investing') || lowerTitle.includes('margin of safety') || lowerTitle.includes('intelligent investor') || lowerTitle.includes('security analysis')) {
    return "Value Investing";
  }
  if (lowerAuthor.includes('lynch') || lowerAuthor.includes('bogle') || lowerAuthor.includes('malkiel') || lowerTitle.includes('stock') || lowerTitle.includes('investing') || lowerTitle.includes('market wizards') || lowerTitle.includes('reminsicences') || lowerTitle.includes('stocks for the long run')) {
    return "Share Investing & Stock Market";
  }
  if (lowerAuthor.includes('kiyosaki') || lowerAuthor.includes('ramsey') || lowerTitle.includes('rich dad') || lowerTitle.includes('millionaire') || lowerTitle.includes('wealth') || lowerTitle.includes('personal finance')) {
    return "Wealth Creation & Personal Finance";
  }
  if (lowerTitle.includes('financial') || lowerTitle.includes('valuation') || lowerTitle.includes('analysis') || lowerTitle.includes('shenanigans') || lowerTitle.includes('accounting')) {
    return "Financial Analysis & Valuation";
  }
  if (lowerTitle.includes('sales') || lowerTitle.includes('marketing') || lowerTitle.includes('influence') || lowerTitle.includes('sell') || lowerTitle.includes('dotcom')) {
    return "Sales & Marketing";
  }
  if (lowerTitle.includes('habits') || lowerTitle.includes('mindset') || lowerTitle.includes('thinking') || lowerTitle.includes('self') || lowerTitle.includes('motivation') || lowerAuthor.includes('carnegie') || lowerAuthor.includes('hill')) {
    return "Self-Improvement & Mindset";
  }
  if (lowerTitle.includes('business') || lowerTitle.includes('management') || lowerTitle.includes('leadership') || lowerTitle.includes('good to great') || lowerTitle.includes('shoe dog')) {
    return "Business & Management";
  }
  return "Miscellaneous / Biographies";
}

books.forEach(book => {
  const cat = categorizeBook(book.title, book.author);
  categories[cat].push(book);
});

fs.writeFileSync('categorized_books_value.json', JSON.stringify(categories, null, 2));