const fs = require('fs');

let html = fs.readFileSync('public/category.html', 'utf8');

// 1. Replace the CSS
const oldCssStart = html.indexOf('/* Reading Cards */');
const oldCssEnd = html.indexOf('/* Responsive Design */');

if (oldCssStart !== -1 && oldCssEnd !== -1) {
    const newCss = `/* Premium Reading Cards */
        .readings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 28px;
            margin-bottom: 40px;
        }

        .reading-card {
            position: relative;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--radius-lg);
            padding: 28px;
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            z-index: 1;
        }

        /* Subtle glowing border top based on category accent */
        .reading-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--card-accent, var(--primary-blue));
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }

        .reading-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.1), 0 0 20px -5px var(--card-accent, rgba(0,0,0,0));
            border-color: rgba(0,0,0,0.08);
        }

        .reading-card:hover::before {
            opacity: 1;
        }

        .reading-card-header {
            display: flex;
            gap: 20px;
            margin-bottom: 24px;
            align-items: flex-start;
        }

        /* Modern Number indicator (watermark style) */
        .reading-number-watermark {
            position: absolute;
            top: -15px;
            right: -10px;
            font-size: 120px;
            font-weight: 900;
            color: var(--card-accent, var(--primary-blue));
            opacity: 0.03;
            z-index: -1;
            font-family: 'Playfair Display', serif;
            pointer-events: none;
            transition: all 0.4s ease;
        }
        
        .reading-card:hover .reading-number-watermark {
            transform: scale(1.05) translate(-5px, 5px);
            opacity: 0.05;
        }

        .reading-number {
            background: var(--card-accent, var(--primary-blue));
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            flex-shrink: 0;
            box-shadow: 0 4px 10px -2px var(--card-accent, rgba(0,0,0,0.2));
        }

        .reading-content {
            flex: 1;
            z-index: 2;
        }

        .reading-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
            line-height: 1.35;
            display: block;
            margin-bottom: 12px;
            transition: color 0.2s ease;
        }

        .reading-title:hover {
            color: var(--card-accent, var(--primary-blue));
        }

        .reading-meta {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        /* Sleek Pill Badges */
        .reading-author, .reading-year {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 99px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .reading-author {
            background: rgba(0, 0, 0, 0.04);
            color: var(--text-primary);
            border: 1px solid rgba(0,0,0,0.05);
        }

        .reading-year {
            background: transparent;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .reading-actions {
            display: flex;
            justify-content: flex-start;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(0,0,0,0.04);
        }

        /* Modern CTA Button */
        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--card-accent, var(--primary-blue));
            color: white !important;
            padding: 8px 20px;
            border-radius: 99px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px -3px var(--card-accent, rgba(0,0,0,0.2));
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px -3px var(--card-accent, rgba(0,0,0,0.3));
            filter: brightness(1.1);
        }

        .btn-primary .arrow {
            transition: transform 0.3s ease;
        }

        .btn-primary:hover .arrow {
            transform: translateX(4px);
        }

        /* Gradient Divider for Archive Section */
        #archive-section {
            border-bottom: 1px solid transparent !important;
            border-image: linear-gradient(to right, transparent, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.1) 80%, transparent) 1 !important;
        }

        `;
    
    html = html.substring(0, oldCssStart) + newCss + html.substring(oldCssEnd);
}

// 2. Replace the Sources JS rendering
const sourcesJsOld = `            card.innerHTML =
                '<div class="reading-card-header">' +
                '  <span class="reading-number" style="background: ' + meta.accent + '">' + (index + 1) + '</span>' +
                '  <div class="reading-content">' +
                '    <span class="reading-title">' + escapeHtml(source.name) + '</span>' +
                '    <div class="reading-meta">' +
                '      <span class="reading-author ' + authorClass + '">' + escapeHtml(domain) + '</span>' +
                '    </div>' +
                '  </div>' +
                '</div>' +
                '<div class="reading-actions">' +
                '  <span class="btn-primary" style="background: ' + meta.accent + '">Visit Source</span>' +
                '</div>';`;

const sourcesJsNew = `            card.style.setProperty('--card-accent', meta.accent);
            card.innerHTML =
                '<div class="reading-number-watermark">' + (index + 1) + '</div>' +
                '<div class="reading-card-header">' +
                '  <span class="reading-number">' + (index + 1) + '</span>' +
                '  <div class="reading-content">' +
                '    <span class="reading-title">' + escapeHtml(source.name) + '</span>' +
                '    <div class="reading-meta">' +
                '      <span class="reading-author">' + escapeHtml(domain) + '</span>' +
                '    </div>' +
                '  </div>' +
                '</div>' +
                '<div class="reading-actions">' +
                '  <span class="btn-primary">Visit Source <span class="arrow">→</span></span>' +
                '</div>';`;

html = html.replace(sourcesJsOld, sourcesJsNew);


// 3. Replace the Archive JS rendering
const archiveJsOld = `                        card.innerHTML =
                            '<div class="reading-card-header">' +
                            '  <span class="reading-number" style="background: ' + meta.accent + '">' + (index + 6) + '</span>' +
                            '  <div class="reading-content">' +
                            '    <span class="reading-title" style="font-size: 1rem; line-height: 1.3;">' + escapeHtml(article.title) + '</span>' +
                            '    <div class="reading-meta" style="margin-top: 8px;">' +
                            '      <span class="reading-author ' + authorClass + '">' + escapeHtml(sourceName) + '</span>' +
                            '      <span class="reading-year">' + escapeHtml(dateStr) + '</span>' +
                            '    </div>' +
                            '  </div>' +
                            '</div>' +
                            '<div class="reading-actions">' +
                            '  <span class="btn-primary" style="background: ' + meta.accent + '; padding: 6px 12px; font-size: 13px;">Read Article</span>' +
                            '</div>';`;

const archiveJsNew = `                        card.style.setProperty('--card-accent', meta.accent);
                        card.innerHTML =
                            '<div class="reading-number-watermark">' + (index + 6) + '</div>' +
                            '<div class="reading-card-header">' +
                            '  <span class="reading-number">' + (index + 6) + '</span>' +
                            '  <div class="reading-content">' +
                            '    <span class="reading-title">' + escapeHtml(article.title) + '</span>' +
                            '    <div class="reading-meta">' +
                            '      <span class="reading-author">' + escapeHtml(sourceName) + '</span>' +
                            '      <span class="reading-year">' + escapeHtml(dateStr) + '</span>' +
                            '    </div>' +
                            '  </div>' +
                            '</div>' +
                            '<div class="reading-actions">' +
                            '  <span class="btn-primary">Read Article <span class="arrow">→</span></span>' +
                            '</div>';`;

html = html.replace(archiveJsOld, archiveJsNew);

fs.writeFileSync('public/category.html', html, 'utf8');
console.log('UI/UX successfully updated!');
