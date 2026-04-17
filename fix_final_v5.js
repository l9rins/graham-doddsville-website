const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const publicDir = path.join(__dirname, 'public');
const htmlDir = path.join(publicDir, 'html');

function fixFinalIssues() {
    // 1. Fix public/index.html
    const indexPath = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        let indexHtml = fs.readFileSync(indexPath, 'utf-8');
        let indexDom = new JSDOM(indexHtml);
        let doc = indexDom.window.document;
        let indexModified = false;

        // Task 1: Warren Buffett "See more" removal
        // Specifically look for the one linking to warren-buffett-philosophy.html
        doc.querySelectorAll('a[href="warren-buffett-philosophy.html"]').forEach(el => {
            if (el.textContent.includes('See more')) {
                let current = el;
                // Walk up to find the div container
                while(current && current.tagName !== 'DIV') {
                    current = current.parentElement;
                }
                if (current && (current.getAttribute('style') || '').includes('text-align: center')) {
                    current.remove();
                    indexModified = true;
                }
            }
        });

        // Task 2: Fix headers with ######
        doc.querySelectorAll('h2').forEach(h2 => {
            if (h2.textContent.includes('######')) {
                h2.textContent = h2.textContent.replace(/######\s*/g, '');
                indexModified = true;
            }
        });

        // Task 4: Images for both category-heading and sub-category-title
        const categoryMap = {
            'Companies': 'images/image1.jpeg',
            'Markets': 'images/image2.jpeg',
            'Economy': 'images/image3.png',
            'Industry': 'images/image4.jpeg',
            'Guru Watch': 'images/image5.jpeg',
            'Regulatory': 'images/image6.jpeg',
            'North America': 'images/image7.jpeg',
            'Europe': 'images/image8.jpeg',
            'Asia': 'images/image9.jpeg',
            'Elsewhere': 'images/image10.jpeg'
        };

        // Query both types of headings
        doc.querySelectorAll('h3.category-heading, h3.sub-category-title').forEach(h3 => {
            let title = h3.textContent.trim();
            if (categoryMap[title]) {
                // Check if image already exists
                let sibling = h3.nextElementSibling;
                if (!sibling || sibling.tagName !== 'IMG') {
                    let img = doc.createElement('img');
                    img.src = categoryMap[title];
                    img.alt = title;
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    img.style.marginBottom = '12px';
                    img.style.borderRadius = '8px';
                    h3.insertAdjacentElement('afterend', img);
                    indexModified = true;
                }
            }
        });

        if (indexModified) {
            fs.writeFileSync(indexPath, indexDom.serialize(), 'utf-8');
            console.log('Fixed public/index.html (See more, Headers, Images)');
        }
    }

    // 2. Fix Author redundancy in all book pages
    let htmlFiles = fs.readdirSync(htmlDir);
    htmlFiles.forEach(f => {
        if (!f.endsWith('.html')) return;
        let filePath = path.join(htmlDir, f);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Check for book sort options
        if (content.includes('class="book-sort"') || content.includes('bookData')) {
            let dom = new JSDOM(content);
            let doc = dom.window.document;
            let modified = false;

            doc.querySelectorAll('.book-sort').forEach(select => {
                let options = Array.from(select.options);
                let firstAuthor = -1;
                // Find all Author options and remove duplicates
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === 'author' || options[i].textContent.trim() === 'Author') {
                        if (firstAuthor === -1) {
                            firstAuthor = i;
                        } else {
                            select.remove(i);
                            // refresh options list
                            options = Array.from(select.options);
                            i--; // retry index
                            modified = true;
                        }
                    }
                }
                
                // If Author doesn't exist at all, add it after Title
                if (firstAuthor === -1) {
                    let titleOptIndex = options.findIndex(o => o.value === 'title');
                    let authorOpt = doc.createElement('option');
                    authorOpt.value = 'author';
                    authorOpt.textContent = 'Author';
                    if (titleOptIndex !== -1) {
                        select.add(authorOpt, select.options[titleOptIndex + 1]);
                    } else {
                        select.add(authorOpt);
                    }
                    modified = true;
                }
            });

            // Also handle raw HTML/JS injected sort controls
            if (content.includes('buildSortControl()')) {
                // If it's a JS template string, regex is safer
                if ((content.match(/value="author"/g) || []).length > 1) {
                    content = content.replace(/(<option value="author">Author<\/option>\s*)+/g, '<option value="author">Author</option>\n    ');
                    fs.writeFileSync(filePath, content, 'utf-8');
                    modified = false;
                    console.log(`Cleaned duplicate Author via Regex in ${f}`);
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, dom.serialize(), 'utf-8');
                console.log(`Standardized Author sort in ${f}`);
            }
        }
    });

    // 3. Fix market-quotes.html script and corruption
    const quotesPath = path.join(htmlDir, 'market-quotes.html');
    if (fs.existsSync(quotesPath)) {
        let content = fs.readFileSync(quotesPath, 'utf-8');
        
        // Remove the corrupted parameter tag if present
        content = content.replace(/<parameter name="filePath">[\s\S]*?<\/parameter>/gi, '');
        
        // Ensure JS is correctly placed once
        if (!content.includes('id="quoteHighlightLogic"')) {
            let dom = new JSDOM(content);
            let doc = dom.window.document;
            let script = doc.createElement('script');
            script.id = 'quoteHighlightLogic';
            script.textContent = `
    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.hash) {
            setTimeout(() => {
                const el = document.querySelector(window.location.hash);
                if (el) {
                    el.scrollIntoView({behavior: 'smooth', block: 'center'});
                    el.style.transition = 'box-shadow 0.5s';
                    el.style.boxShadow = '0 0 15px 5px #1e3a8a';
                    setTimeout(() => el.style.boxShadow = '', 2000);
                }
            }, 500);
        }
    });
`;
            doc.body.appendChild(script);
            fs.writeFileSync(quotesPath, dom.serialize(), 'utf-8');
            console.log('Fixed market-quotes.html (Removed corruption, added JS)');
        } else {
            // Even if it exists, let's clean it up to be safe
            fs.writeFileSync(quotesPath, content, 'utf-8');
            console.log('Cleaned market-quotes.html corruption');
        }
    }
}

fixFinalIssues();
