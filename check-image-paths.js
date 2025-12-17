#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Diagnostic script to check image paths in HTML files
 * Scans all HTML files and reports broken vs working image paths
 */

const HTML_DIR = path.join(__dirname, 'public', 'html');
const INDEX_FILE = path.join(__dirname, 'public', 'index.html');
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Regex to find img tags and extract src attributes
const IMG_REGEX = /<img[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
const SRC_REGEX = /src\s*=\s*["']([^"']+)["']/i;

function getAllHtmlFiles() {
    const files = [];

    // Add index.html
    if (fs.existsSync(INDEX_FILE)) {
        files.push(INDEX_FILE);
    }

    // Add all HTML files in public/html/
    if (fs.existsSync(HTML_DIR)) {
        const htmlFiles = fs.readdirSync(HTML_DIR)
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(HTML_DIR, file));
        files.push(...htmlFiles);
    }

    return files;
}

function getAvailableImages() {
    if (!fs.existsSync(IMAGES_DIR)) {
        return new Set();
    }

    return new Set(
        fs.readdirSync(IMAGES_DIR)
            .filter(file => !fs.statSync(path.join(IMAGES_DIR, file)).isDirectory())
    );
}

function analyzeImagePath(src, filename) {
    // Skip external URLs (http/https)
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return {
            original: src,
            cleaned: src,
            isBroken: false,
            shouldBe: src,
            isExternal: true
        };
    }

    // Skip template variables
    if (src.includes('${') || src.includes('{{')) {
        return {
            original: src,
            cleaned: src,
            isBroken: false,
            shouldBe: src,
            isTemplate: true
        };
    }

    // Check if it's already correctly formatted for the new structure
    if (src.startsWith('/images/')) {
        const basename = path.basename(src);
        return {
            original: src,
            cleaned: basename,
            isBroken: !availableImages.has(basename),
            shouldBe: src,
            isExternal: false,
            isTemplate: false
        };
    }

    // For files in /public/html/, relative paths are now broken
    // They should be /images/filename
    const basename = path.basename(src);
    const isInHtmlDir = filename.includes('public\\html\\') || filename.includes('public/html/');
    const shouldBeFixed = isInHtmlDir && availableImages.has(basename) && !src.startsWith('/images/');

    return {
        original: src,
        cleaned: basename,
        isBroken: shouldBeFixed,
        shouldBe: `/images/${basename}`,
        isExternal: false,
        isTemplate: false
    };
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(__dirname, filePath);
    const issues = [];

    let match;
    let imgCount = 0;

    // Reset regex
    IMG_REGEX.lastIndex = 0;

    while ((match = IMG_REGEX.exec(content)) !== null) {
        imgCount++;
        const imgTag = match[0];
        const srcMatch = SRC_REGEX.exec(imgTag);

        if (srcMatch) {
            const src = srcMatch[1];
            const analysis = analyzeImagePath(src, relativePath);

            issues.push({
                line: content.substring(0, match.index).split('\n').length,
                original: analysis.original,
                cleaned: analysis.cleaned,
                isBroken: analysis.isBroken,
                shouldBe: analysis.shouldBe,
                imgTag: imgTag.substring(0, 100) + (imgTag.length > 100 ? '...' : '')
            });
        }
    }

    return {
        file: relativePath,
        totalImages: imgCount,
        issues: issues
    };
}

function printReport(results) {
    console.log('🔍 IMAGE PATH DIAGNOSTIC REPORT');
    console.log('================================\n');

    let totalFiles = 0;
    let totalImages = 0;
    let brokenImages = 0;

    results.forEach(result => {
        totalFiles++;
        totalImages += result.totalImages;

        console.log(`📄 ${result.file}`);
        console.log(`   Total images: ${result.totalImages}`);

        if (result.issues.length > 0) {
            const broken = result.issues.filter(i => i.isBroken);
            const working = result.issues.filter(i => !i.isBroken && !i.isExternal && !i.isTemplate);
            const external = result.issues.filter(i => i.isExternal);
            const templates = result.issues.filter(i => i.isTemplate);

            console.log(`   ✅ Working: ${working.length}`);
            console.log(`   ❌ Broken: ${broken.length}`);
            console.log(`   🌐 External: ${external.length}`);
            console.log(`   📝 Templates: ${templates.length}`);

            brokenImages += broken.length;

            if (broken.length > 0) {
                console.log('   BROKEN IMAGES:');
                broken.forEach((issue, idx) => {
                    console.log(`     ${idx + 1}. Line ${issue.line}: "${issue.original}" → should be "${issue.shouldBe}"`);
                });
            }

            if (working.length > 0) {
                console.log('   WORKING IMAGES:');
                working.forEach((issue, idx) => {
                    console.log(`     ${idx + 1}. "${issue.original}" ✓`);
                });
            }

            if (external.length > 0) {
                console.log('   EXTERNAL IMAGES:');
                external.forEach((issue, idx) => {
                    console.log(`     ${idx + 1}. "${issue.original}" (external URL)`);
                });
            }

            if (templates.length > 0) {
                console.log('   TEMPLATE VARIABLES:');
                templates.forEach((issue, idx) => {
                    console.log(`     ${idx + 1}. "${issue.original}" (template)`);
                });
            }
        } else {
            console.log('   ✅ All images OK');
        }

        console.log('');
    });

    console.log('📊 SUMMARY');
    console.log('==========');
    console.log(`Files scanned: ${totalFiles}`);
    console.log(`Total images found: ${totalImages}`);
    console.log(`Broken images: ${brokenImages}`);
    console.log(`Working images: ${totalImages - brokenImages}`);

    if (brokenImages > 0) {
        console.log(`\n⚠️  ACTION NEEDED: Run 'node fix-all-images.js' to fix ${brokenImages} broken image paths`);
    } else {
        console.log('\n✅ All local image paths are correct!');
    }
}

// Main execution
console.log('Scanning HTML files for image paths...\n');

const availableImages = getAvailableImages();
console.log(`Available images in /public/images/: ${Array.from(availableImages).join(', ')}\n`);

const htmlFiles = getAllHtmlFiles();
console.log(`Found ${htmlFiles.length} HTML files to scan\n`);

const results = htmlFiles.map(scanFile);
printReport(results);