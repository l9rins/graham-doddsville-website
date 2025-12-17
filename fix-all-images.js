#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fix all broken image paths in HTML files
 * Automatically scans and fixes all <img> src attributes to use /images/ paths
 */

const HTML_DIR = path.join(__dirname, 'public', 'html');
const INDEX_FILE = path.join(__dirname, 'public', 'index.html');
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Regex patterns
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
        console.error('❌ Error: /public/images/ directory not found!');
        process.exit(1);
    }

    return new Set(
        fs.readdirSync(IMAGES_DIR)
            .filter(file => !fs.statSync(path.join(IMAGES_DIR, file)).isDirectory())
    );
}

function fixImagePath(src) {
    // Handle various broken path formats and normalize to /images/FILENAME

    // Remove leading slashes
    let cleanSrc = src.replace(/^\/+/, '');

    // Handle different broken formats
    if (cleanSrc.startsWith('./images/')) {
        cleanSrc = cleanSrc.replace('./images/', '');
    } else if (cleanSrc.startsWith('../images/')) {
        cleanSrc = cleanSrc.replace('../images/', '');
    } else if (cleanSrc.startsWith('images/')) {
        cleanSrc = cleanSrc.replace('images/', '');
    }

    // Extract just the filename (handles any remaining path components)
    const filename = path.basename(cleanSrc);

    // Return the fixed path
    return `/images/${filename}`;
}

function fixFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(__dirname, filePath);
    let modifiedContent = content;
    let fixCount = 0;
    const fixes = [];

    // Find all img tags
    let match;
    IMG_REGEX.lastIndex = 0;

    while ((match = IMG_REGEX.exec(content)) !== null) {
        const imgTag = match[0];
        const srcMatch = SRC_REGEX.exec(imgTag);

        if (srcMatch) {
            const originalSrc = srcMatch[1];

            // Skip external URLs and template variables
            if (originalSrc.startsWith('http://') || originalSrc.startsWith('https://') ||
                originalSrc.includes('${') || originalSrc.includes('{{')) {
                continue;
            }

            const fixedSrc = fixImagePath(originalSrc);

            // Only fix if it's actually different
            if (originalSrc !== fixedSrc) {
                // Create the fixed img tag
                const fixedImgTag = imgTag.replace(
                    /src\s*=\s*["']([^"']+)["']/,
                    `src="${fixedSrc}"`
                );

                // Replace in content
                modifiedContent = modifiedContent.replace(imgTag, fixedImgTag);

                fixCount++;
                fixes.push({
                    line: content.substring(0, match.index).split('\n').length,
                    original: originalSrc,
                    fixed: fixedSrc
                });
            }
        }
    }

    // Write back if changes were made
    if (fixCount > 0) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
    }

    return {
        file: relativePath,
        fixesApplied: fixCount,
        fixes: fixes
    };
}

function printResults(results) {
    console.log('🔧 IMAGE PATH FIX RESULTS');
    console.log('=========================\n');

    let totalFiles = 0;
    let totalFixes = 0;

    results.forEach(result => {
        totalFiles++;
        totalFixes += result.fixesApplied;

        console.log(`📄 ${result.file}`);
        console.log(`   Fixes applied: ${result.fixesApplied}`);

        if (result.fixes.length > 0) {
            console.log('   CHANGES:');
            result.fixes.forEach((fix, idx) => {
                console.log(`     ${idx + 1}. Line ${fix.line}: "${fix.original}" → "${fix.fixed}"`);
            });
        } else {
            console.log('   ✅ No changes needed');
        }

        console.log('');
    });

    console.log('📊 SUMMARY');
    console.log('==========');
    console.log(`Files processed: ${totalFiles}`);
    console.log(`Total fixes applied: ${totalFixes}`);

    if (totalFixes > 0) {
        console.log(`\n✅ Successfully fixed ${totalFixes} broken image paths!`);
        console.log('💡 Tip: Run "node check-image-paths.js" to verify all paths are now correct.');
    } else {
        console.log('\n✅ All image paths were already correct!');
    }
}

// Main execution
console.log('🔧 Starting image path fix process...\n');

// Check if images directory exists
const availableImages = getAvailableImages();
console.log(`Available images in /public/images/: ${Array.from(availableImages).join(', ')}\n`);

const htmlFiles = getAllHtmlFiles();
console.log(`Found ${htmlFiles.length} HTML files to process\n`);

console.log('Processing files...\n');

const results = htmlFiles.map(fixFile);
printResults(results);

console.log('\n🎉 Image path fix process complete!');