const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const docxPath = path.join(__dirname, "..", "xlsx", "2026-07-08  Book cover images for secondary pages REVISED (1).docx");

mammoth.extractRawText({path: docxPath})
    .then(function(result){
        var text = result.value; // The raw text
        var messages = result.messages;
        fs.writeFileSync(path.join(__dirname, "docx_text.txt"), text);
        console.log("Extracted text successfully!");
    })
    .catch(function(error) {
        console.error(error);
    });
