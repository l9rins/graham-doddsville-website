/**
 * Detailed diagnostic: For each FAILED article, show the closest image match
 * from the index so we can build an explicit mapping.
 */

const fs = require('fs');
const path = require('path');

const resolverSrc = fs.readFileSync(
  path.join(__dirname, 'js', 'article-image-resolver.js'),
  'utf-8'
);
const arrStart = resolverSrc.indexOf('[');
const arrEnd = resolverSrc.indexOf('];', arrStart);
const ARTICLE_IMAGE_INDEX = JSON.parse(resolverSrc.slice(arrStart, arrEnd + 1));

function normalizeText(input) {
  return (input || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function cleanTitle(title) {
  if (!title) return '';
  const firstPart = title.split(':')[0].split(' - ')[0];
  return firstPart.replace(/^the\s+/i, '').trim();
}

function parseEntry(fileName) {
  const noExt = fileName.replace(/\.[a-z0-9]+$/i, '');
  const idMatch = noExt.match(/^(\d+(?:\.\d+)+)\s+/);
  const idPrefix = idMatch ? idMatch[1] : '';
  const labelRaw = idMatch ? noExt.slice(idMatch[0].length) : noExt;
  return { fileName, idPrefix, labelRaw, labelNorm: normalizeText(labelRaw) };
}

const entries = ARTICLE_IMAGE_INDEX.map(parseEntry);

function findImage(articleId, articleData) {
  const id = (articleId || '').toString().trim();
  const idNorm = normalizeText(id.replace(/[-_]+/g, ' '));
  const title = cleanTitle(articleData && articleData.title ? articleData.title : '');
  const titleNorm = normalizeText(title);

  if (/^\d+(?:\.\d+)+$/.test(id)) {
    const numericHit = entries.find((e) => e.idPrefix === id || e.idPrefix.startsWith(id + '.'));
    if (numericHit) return numericHit;
  }

  if (titleNorm) {
    const byTitleExact = entries.find((e) => e.labelNorm === titleNorm);
    if (byTitleExact) return byTitleExact;
    const byTitleIncludes = entries.find(
      (e) => e.labelNorm.includes(titleNorm) || titleNorm.includes(e.labelNorm)
    );
    if (byTitleIncludes) return byTitleIncludes;
  }

  if (idNorm) {
    const byIdExact = entries.find((e) => e.labelNorm === idNorm);
    if (byIdExact) return byIdExact;
    const byIdIncludes = entries.find(
      (e) => e.labelNorm.includes(idNorm) || idNorm.includes(e.labelNorm)
    );
    if (byIdIncludes) return byIdIncludes;
  }

  return null;
}

// Token-based scoring
function tokenScore(queryTokens, targetTokens) {
  if (!queryTokens.length || !targetTokens.length) return 0;
  let matches = 0;
  for (const qt of queryTokens) {
    if (qt.length < 3) continue;
    for (const tt of targetTokens) {
      if (tt === qt || tt.includes(qt) || qt.includes(tt)) {
        matches++;
        break;
      }
    }
  }
  return matches / Math.max(queryTokens.length, targetTokens.length);
}

function findBestMatch(articleId, articleData) {
  const id = (articleId || '').toString().trim();
  const idNorm = normalizeText(id.replace(/[-_]+/g, ' '));
  const title = cleanTitle(articleData && articleData.title ? articleData.title : '');
  const titleNorm = normalizeText(title);
  const fullTitleNorm = normalizeText(articleData && articleData.title ? articleData.title : '');

  const queryTokens = (fullTitleNorm || idNorm).split(' ').filter(t => t.length >= 3);
  const idTokens = idNorm.split(' ').filter(t => t.length >= 3);

  let bestScore = 0;
  let bestEntry = null;

  for (const entry of entries) {
    const entryTokens = entry.labelNorm.split(' ').filter(t => t.length >= 3);
    const s1 = tokenScore(queryTokens, entryTokens);
    const s2 = tokenScore(idTokens, entryTokens);
    const score = Math.max(s1, s2);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return { entry: bestEntry, score: bestScore };
}

// Scrape articles
const htmlDir = __dirname;
const pages = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const output = [];

for (const page of pages) {
  const html = fs.readFileSync(path.join(htmlDir, page), 'utf-8');
  if (!html.includes('buildArticleImageHtml') && !html.includes('article-image-resolver')) continue;

  const re = /'([a-zA-Z0-9_-]+)':\s*\{\s*title:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const articleId = m[1];
    const title = m[2];
    const result = findImage(articleId, { title });
    if (!result) {
      const best = findBestMatch(articleId, { title });
      output.push({
        page,
        articleId,
        title,
        bestMatch: best.entry ? best.entry.fileName : 'NONE',
        bestLabel: best.entry ? best.entry.labelNorm : '',
        score: best.score.toFixed(2),
      });
    }
  }
}

// Print as TSV for easy analysis
console.log('page\tarticleId\ttitle\tbestMatch\tscore');
for (const o of output) {
  console.log(`${o.page}\t${o.articleId}\t${o.title}\t${o.bestMatch}\t${o.score}`);
}
