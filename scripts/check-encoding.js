#!/usr/bin/env node
// Fails if any site file contains text that was mis-decoded as Windows-1252
// ("mojibake", e.g. "â€™" instead of "’"), stray C1 control characters,
// U+FFFD replacement characters, or a UTF-8 byte-order mark.
//
// Usage: node scripts/check-encoding.js [files...]   (default: all of public/)
//
// Root cause of the 2026 mojibake: files were read with Windows PowerShell 5.1
// defaults (Get-Content decodes UTF-8 without a BOM as Windows-1252) and written
// back as UTF-8 with a BOM. See .agents/AGENTS.md "Text encoding".

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXTENSIONS = /\.(html|js|css|json|md|txt|xml)$/;

// A UTF-8 lead byte (as a Latin-1 char) followed by characters that Windows-1252
// maps continuation bytes 0x80-0xBF to.
const MOJIBAKE = /[Â-ô][\u0080-¿€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/;
const C1_CONTROL = /[\u0080-\u009F]/;

function listFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : listFiles(full);
        return EXTENSIONS.test(entry.name) ? [full] : [];
    });
}

// Large generated data files are checked too, but only report the first hits.
const files = process.argv.length > 2
    ? process.argv.slice(2).filter(f => EXTENSIONS.test(f) && fs.existsSync(f))
    : listFiles(path.join(ROOT, 'public'));

let problems = 0;
for (const file of files) {
    const buf = fs.readFileSync(file);
    const rel = path.relative(ROOT, file);
    if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        console.log(`${rel}: starts with a UTF-8 byte-order mark`);
        problems++;
    }
    const lines = buf.toString('utf8').split('\n');
    let reported = 0;
    lines.forEach((line, i) => {
        const hit = line.match(MOJIBAKE) || line.match(C1_CONTROL) || (line.includes('�') && ['�']);
        if (!hit) return;
        problems++;
        if (reported++ < 5) {
            const at = line.indexOf(hit[0]);
            console.log(`${rel}:${i + 1}: suspicious text ${JSON.stringify(line.slice(Math.max(0, at - 20), at + 20))}`);
        }
    });
    if (reported > 5) console.log(`${rel}: ... ${reported - 5} more`);
}

if (problems) {
    console.log(`\n${problems} encoding problem(s). Save files as UTF-8 without a BOM.`);
    process.exit(1);
}
console.log(`Encoding OK (${files.length} files checked).`);
