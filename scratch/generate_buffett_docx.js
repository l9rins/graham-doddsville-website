const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, PageBreak, LevelFormat, ShadingType
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── HELPERS ────────────────────────────────────────────────────────────────

function sectionBanner(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 36, color: "FFFFFF", font: "Georgia" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    shading: { type: ShadingType.CLEAR, fill: "1F3864" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 10, color: "C45911" },
      bottom: { style: BorderStyle.SINGLE, size: 10, color: "C45911" }
    }
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 28, color: "1F3864", font: "Georgia" })],
    spacing: { before: 160, after: 80 }
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 20, color: "C45911", font: "Arial" })],
    spacing: { before: 120, after: 60 }
  });
}

function bodyText(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: "333333", font: "Calibri" })],
    spacing: { before: 60, after: 60, line: 240 }
  });
}

function quoteText(text) {
  return new Paragraph({
    children: [new TextRun({ text, italic: true, size: 22, color: "1F3864", font: "Calibri" })],
    spacing: { before: 80, after: 80, line: 240 },
    indent: { left: 720, right: 720 }
  });
}

function quoteSource(text) {
  return new Paragraph({
    children: [new TextRun({ text, italic: true, bold: true, size: 18, color: "C45911", font: "Calibri" })],
    spacing: { before: 40, after: 80 },
    indent: { left: 720 }
  });
}

// Parse HTML string from data file into Paragraphs
function parseHtmlToDocx(html) {
  const paragraphs = [];
  // Clean up and split by tag boundaries
  const items = html.split(/<\/?(?:p|h3)[^>]*>/).map(item => item.trim()).filter(item => item.length > 0);
  
  for (const item of items) {
    const cleanText = item.replace(/<[^>]+>/g, '').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&ndash;/g, '-').replace(/&mdash;/g, '-');
    if (cleanText.startsWith('—') || cleanText.startsWith('-')) {
      paragraphs.push(quoteSource(cleanText));
    } else if (cleanText.startsWith('"') || cleanText.endsWith('"') || cleanText.length > 100 && (cleanText.includes('"') || cleanText.includes('“'))) {
      paragraphs.push(quoteText(cleanText));
    } else {
      paragraphs.push(bodyText(cleanText));
    }
  }
  return paragraphs;
}

// ─── MAIN BUILD ─────────────────────────────────────────────────────────────

try {
  const buffettDataPath = path.join(__dirname, 'buffett_data.json');
  if (!fs.existsSync(buffettDataPath)) {
    console.error('buffett_data.json not found!');
    process.exit(1);
  }
  
  const rawData = JSON.parse(fs.readFileSync(buffettDataPath, 'utf8'));
  
  // Create taxonomy grouping
  const docSections = [];
  
  // We define the key high-level categories
  const categories = {
    "Investment Philosophy & Concepts": [
      "Efficient Market Theory", "Modern Portfolio Theory", "Intrinsic Value", 
      "Wall Street and Mr. Market", "Circle of Competence", "Margin of Safety", 
      "Frictional Costs", "Capital Allocation", "Performance Measurement", 
      "Berkshire Disclosure", "Market Forecasting", "Market Timing", 
      "Value Investing", "Security Analyst", "Speculation", "Long-term Investing", 
      "The Superinvestors of Graham-and-Doddsville", "Index Funds", "Market Crashes"
    ],
    "Business Principles & Moats": [
      "The Ideal Business", "Moats", "Patience", "Owner-Oriented Management", 
      "The Institutional Imperative", "Board of Directors", "Acquisitions", 
      "Insurance Companies", "Audit Committee", "Executive Compensation", 
      "Stock Options", "Segment Reporting"
    ],
    "Financial & Accounting Evaluation": [
      "Owner Earnings", "Goodwill", "Intangible Assets", "Book Value", 
      "Earnings Quality", "Debt", "Leverage", "Junk Bonds", "Arbitrage", 
      "Derivatives", "Taxes", "Dividends", "Share Repurchases"
    ],
    "Economic Principles & Other Topics": [
      "Inflation", "Gold", "Productivity", "Foreign Currencies", "Philanthropy", 
      "Personal Habits", "Succession Planning", "Trust", "Risk", 
      "Retailing", "Textiles", "Small Caps vs. Large Caps", "Mistakes"
    ]
  };

  const docChildren = [];
  
  // Title Page
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: "WARREN BUFFETT WISDOM BOOK", bold: true, size: 56, color: "1F3864", font: "Georgia" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 200 }
  }));
  
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: "Curated Wisdom & Quotes from the Berkshire Hathaway Shareholder Letters", italic: true, size: 24, color: "C45911", font: "Calibri" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 800 }
  }));
  
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: "Graham & Doddsville Value Investing Education", bold: true, size: 20, color: "333333", font: "Calibri" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 100 }
  }));
  
  docChildren.push(new PageBreak());

  // Process sections
  for (const [catName, topicKeys] of Object.entries(categories)) {
    docChildren.push(sectionBanner(catName));
    docChildren.push(new Paragraph({ spacing: { before: 200, after: 200 } }));
    
    for (const topicKey of topicKeys) {
      // Find the key case-insensitively
      const matchingKey = Object.keys(rawData).find(k => k.toLowerCase().trim() === topicKey.toLowerCase().trim());
      if (matchingKey) {
        docChildren.push(h1(matchingKey));
        const htmlContent = rawData[matchingKey];
        const parsedParagraphs = parseHtmlToDocx(htmlContent);
        docChildren.push(...parsedParagraphs);
        docChildren.push(new Paragraph({ spacing: { before: 100, after: 100 } }));
      }
    }
    
    docChildren.push(new PageBreak());
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren
    }]
  });

  const outputDocxPath = path.join(__dirname, 'Warren_Buffett_Wisdom_Book.docx');
  
  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(outputDocxPath, buffer);
    console.log(`Successfully compiled stunning DOCX book to: ${outputDocxPath}`);
  }).catch(err => {
    console.error('Error generating docx:', err);
  });

} catch (e) {
  console.error('An error occurred:', e);
}
