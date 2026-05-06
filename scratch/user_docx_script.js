<USER_REQUEST>
check please and thoroughly add smarttly: 

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, PageBreak, LevelFormat, ShadingType
} = require('docx');
const fs = require('fs');

// ─── HELPERS ────────────────────────────────────────────────────────────────

function sectionBanner(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 48, color: "FFFFFF", font: "Arial" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 40 },
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
<truncated 126040 bytes>