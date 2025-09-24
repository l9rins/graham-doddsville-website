// Performance Optimization Script
// This script removes unused CSS and optimizes the site

const fs = require('fs');
const path = require('path');

// Read the CSS file
const cssPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Remove unused CSS rules (basic optimization)
const unusedRules = [
    // Add patterns of unused CSS here
    /\.unused-class\s*{[^}]*}/g,
    /\.debug\s*{[^}]*}/g,
    /\/\*.*?\*\//gs, // Remove comments
];

unusedRules.forEach(rule => {
    css = css.replace(rule, '');
});

// Minify CSS (basic minification)
css = css
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
    .replace(/{\s*/g, '{') // Remove spaces after opening braces
    .replace(/;\s*/g, ';') // Remove spaces after semicolons
    .replace(/,\s*/g, ',') // Remove spaces after commas
    .trim();

// Write optimized CSS
fs.writeFileSync(cssPath.replace('.css', '.min.css'), css);

console.log('CSS optimized and minified!');
