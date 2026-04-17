const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const EXCEPTIONS = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'in', 'on', 'at', 'to', 'by', 'of', 'is', 'as', 'with']);
function titleCase(text) {
    if (!text) return text;
    let words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return text;
    let res = [words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()];
    for (let i = 1; i < words.length; i++) {
        let w = words[i].toLowerCase();
        if (EXCEPTIONS.has(w)) {
            res.push(w);
        } else {
            res.push(w.charAt(0).toUpperCase() + w.slice(1));
        }
    }
    return res.join(' ');
}

function processHtmlFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let rawHtml = fs.readFileSync(filePath, 'utf-8');
    let dom = new JSDOM(rawHtml);
    let doc = dom.window.document;
    let modified = false;

    // Task 5: Title Case in <h5><a>
    doc.querySelectorAll('h5 a').forEach(el => {
        let text = el.textContent;
        if (text) {
            let tc = titleCase(text.trim());
            if (tc !== text.trim()) {
                el.textContent = tc;
                modified = true;
            }
        }
    });

    // Task 6 (inline styles context): change background to white
    // we iterate all elements with a style attribute
    doc.querySelectorAll('[style]').forEach(el => {
        let bg = el.style.backgroundColor || el.style.background || '';
        if (bg && /(#(f5f5f5|f0f0f0|efefef|fafafa|e0e0e0)|lightgr[ae]y|rgb\(24\d,\s*24\d,\s*24\d\))/i.test(bg)) {
            if (el.style.backgroundColor) el.style.backgroundColor = '#ffffff';
            if (el.style.background) el.style.background = '#ffffff';
            modified = true;
        }
    });

    // Task 9: Events table
    if (filePath.endsWith('events.html')) {
        doc.querySelectorAll('table').forEach(table => {
            let parent = table.parentElement;
            if (parent && (!parent.hasAttribute('style') || !parent.getAttribute('style').includes('overflow-x'))) {
                let wrapper = doc.createElement('div');
                wrapper.setAttribute('style', 'overflow-x: auto; -webkit-overflow-scrolling: touch;');
                parent.insertBefore(wrapper, table);
                wrapper.appendChild(table);
                modified = true;
            }
        });
    }

    // Task 7 & 8: Book cards
    let bookCards = doc.querySelectorAll('.book-card');
    if (bookCards.length > 0) {
        // Task 8: Insert Sort Control before the FIRST .book-card
        let firstCard = bookCards[0];
        if (!doc.querySelector('.book-sort-controls')) {
            let dummy = doc.createElement('div');
            dummy.innerHTML = `<div class="book-sort-controls" style="margin-bottom:12px;">
  <label for="book-sort" style="font-size:13px; margin-right:6px;">Sort by:</label>
  <select id="book-sort" onchange="sortBooks(this.value)" style="font-size:13px; padding:4px 8px; border-radius:4px; border:1px solid #ccc;">
    <option value="default">Default</option>
    <option value="rating">Rating</option>
    <option value="title">Title</option>
    <option value="author">Author</option>
    <option value="date">Date</option>
    <option value="price">Price</option>
  </select>
</div>`;
            firstCard.parentElement.insertBefore(dummy.firstElementChild, firstCard);
            modified = true;
        }

        // Task 7: Update Book Cards
        bookCards.forEach(card => {
            // Remove the author name entirely
            let authors = card.querySelectorAll('.author, .book-author, p');
            authors.forEach(p => {
                if (p.textContent.toLowerCase().includes('author:') || p.classList.contains('author') || p.classList.contains('book-author')) {
                    p.remove();
                }
            });

            // Remove the "Book title:" label (it might be text nodes or strong tags)
            let inner = card.innerHTML;
            if (inner.toLowerCase().includes('book title:')) {
                inner = inner.replace(/<strong[^>]*>\s*Book title:\s*<\/strong>\s*/gi, '');
                inner = inner.replace(/Book title:\s*/gi, '');
                card.innerHTML = inner;
            }

            // Change View/link button text to BUY NOW
            card.querySelectorAll('a, button').forEach(btn => {
                let txt = btn.textContent.trim().toLowerCase();
                if (txt === 'view' || txt === 'link') {
                    btn.textContent = 'BUY NOW';
                }
            });

            // Add placeholder img at top
            if (!card.querySelector('.book-cover')) {
                let img = doc.createElement('img');
                img.src = 'cover-placeholder.jpg';
                img.alt = 'Book cover';
                img.className = 'book-cover';
                card.insertBefore(img, card.firstChild);
            }

            // Add Brief description below title
            let title = card.querySelector('h1, h2, h3, h4, h5');
            if (title && !card.querySelector('.book-summary')) {
                let summary = doc.createElement('p');
                summary.className = 'book-summary';
                summary.textContent = 'Brief description here.';
                title.insertAdjacentElement('afterend', summary);
            }

            // Add price above BUY NOW button
            card.querySelectorAll('a, button').forEach(btn => {
                if (btn.textContent.trim() === 'BUY NOW') {
                    let prev = btn.previousElementSibling;
                    if (!prev || !prev.classList.contains('book-price')) {
                        let span = doc.createElement('span');
                        span.className = 'book-price';
                        span.textContent = '$XX.XX';
                        btn.insertAdjacentElement('beforebegin', span);
                    }
                }
            });
        });
        modified = true;
    }

    if (modified) {
        // Output raw DOM cleanly
        fs.writeFileSync(filePath, dom.serialize(), 'utf-8');
        console.log('Fixed', filePath);
    }
}

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    let files = fs.readdirSync(dirPath);
    for (let file of files) {
        let fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Traverse
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.html')) {
            processHtmlFile(fullPath);
        }
    }
}

const htmlDir = path.join(__dirname, 'public', 'html');
processDirectory(htmlDir);
processHtmlFile(path.join(__dirname, 'public', 'index.html'));

console.log("Cleanup script finished.");
