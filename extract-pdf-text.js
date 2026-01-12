const fs = require('fs');
const path = require('path');
const { default: pdfParse } = require('pdf-parse');

async function extractText() {
  const pdfDir = path.join(__dirname, 'pdfs', 'annual-letters-to-berkshire-hathaway-shareholders');
  const files = fs.readdirSync(pdfDir);
  for (const file of files) {
    if (path.extname(file) === '.pdf') {
      const filePath = path.join(pdfDir, file);
      const dataBuffer = fs.readFileSync(filePath);
      try {
        const data = await pdfParse(dataBuffer);
        const textFile = path.join(pdfDir, file.replace('.pdf', '.txt'));
        fs.writeFileSync(textFile, data.text);
        console.log(`Extracted text from ${file}`);
      } catch (err) {
        console.error(`Error parsing ${file}:`, err);
      }
    }
  }
}

extractText();