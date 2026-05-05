import os
import re

targets = [
    "wealth-creation.html",
    "legal-taxation.html",
    "financial-markets.html",
    "share-investing.html",
    "Greatest-Investors.html",
    "investment-analysis.html",
    "financial-statement-analysis.html",
    "stock-valuation.html",
    "professional-advisers.html",
    "financial-products.html",
    "resources.html",
    "sidebar-economics.html",
    "events.html"
]

def repair_file(filepath):
    print(f"Repairing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Extract articleContent
    start_match = re.search(r'const articleContent = \{', content)
    if not start_match:
        print(f"  [!] Could not find start of articleContent in {filepath}")
        return
    
    end_script_pos = content.find('</script>', start_match.start())
    if end_script_pos == -1:
        last_brace_pos = content.rfind('};')
        if last_brace_pos < start_match.start():
            print(f"  [!] Could not find end of articleContent in {filepath}")
            return
        article_content_raw = content[start_match.start():last_brace_pos+2]
    else:
        last_brace_pos = content.rfind('};', start_match.start(), end_script_pos)
        if last_brace_pos == -1:
            article_content_raw = content[start_match.start():end_script_pos].strip()
            if not article_content_raw.endswith('};'):
                article_content_raw += '};'
        else:
            article_content_raw = content[start_match.start():last_brace_pos+2]

    # 2. Find the header and body
    script_start = content.rfind('<script>', 0, start_match.start())
    if script_start == -1:
        print(f"  [!] Could not find start script tag in {filepath}")
        return
        
    header_and_body = content[:script_start]
    
    # 3. Reconstruct the file with FIX for scrollHeight
    fixed_js = f"""
    <script src="js/article-image-resolver.js?v=3"></script>
    <script>
        // Collapsible functionality
        function toggleCollapsible(sectionId) {{
            const content = document.getElementById(sectionId + '-content');
            const arrow = document.getElementById(sectionId + '-arrow');
            if (!content) return;
            
            const section = content.closest('.collapsible-section');
            const isCurrentlyOpen = content.classList.contains('expanded');
            
            // Close all other open sections
            document.querySelectorAll('.collapsible-content').forEach(c => {{
                if (c.id !== sectionId + '-content' && (c.classList.contains('expanded') || c.style.maxHeight)) {{
                    c.style.maxHeight = null;
                    c.classList.remove('expanded');
                    c.classList.add('collapsed');
                    const s = c.closest('.collapsible-section');
                    if (s) s.classList.remove('active');
                    const a = document.getElementById(c.id.replace('-content', '-arrow'));
                    if (a) a.innerHTML = '▼';
                }}
            }});

            if (!isCurrentlyOpen) {{
                // OPENING
                // First, remove collapsed and add expanded to ensure it's visible for scrollHeight calculation
                content.classList.add('expanded');
                content.classList.remove('collapsed');
                
                if(sectionId === 'events-seminars') {{
                    content.style.maxHeight = 'none';
                }} else {{
                    // Now measure scrollHeight
                    const height = content.scrollHeight;
                    content.style.maxHeight = height + "px";
                }}
                
                if (section) section.classList.add('active');
                if (arrow) arrow.innerHTML = '▲';
            }} else {{
                // CLOSING
                content.style.maxHeight = null;
                content.classList.remove('expanded');
                content.classList.add('collapsed');
                if (section) section.classList.remove('active');
                if (arrow) arrow.innerHTML = '▼';
            }}
        }}

        // Mobile drawer functionality
        function toggleMobileMenu() {{
            const mobileDrawer = document.getElementById('mobile-drawer');
            if (mobileDrawer) {{
                if (mobileDrawer.classList.contains('open')) {{
                    mobileDrawer.classList.remove('open');
                    document.body.style.overflow = '';
                }} else {{
                    mobileDrawer.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }}
            }}
        }}

        function closeMobileMenu() {{
            const mobileDrawer = document.getElementById('mobile-drawer');
            if (mobileDrawer) {{
                mobileDrawer.classList.remove('open');
                document.body.style.overflow = '';
            }}
        }}

        // Article loading functionality
        function loadArticle(articleId) {{
            const panel = document.getElementById('article-detail-panel');
            const title = document.getElementById('article-detail-title');
            const body = document.getElementById('article-detail-body');
            
            if (!panel || !title || !body) return;

            if (typeof articleContent !== 'undefined' && articleContent[articleId]) {{
                const article = articleContent[articleId];
                title.textContent = article.title;
                
                let imageHtml = '';
                if (typeof window.buildArticleImageHtml === 'function') {{
                    imageHtml = window.buildArticleImageHtml(articleId, article);
                }}
                
                body.innerHTML = imageHtml + article.content;
                panel.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                const contentContainer = panel.querySelector('.article-detail-content');
                if (contentContainer) contentContainer.scrollTop = 0;
            }}
        }}

        function closeArticlePanel() {{
            const panel = document.getElementById('article-detail-panel');
            if (panel) {{
                panel.classList.remove('active');
                document.body.style.overflow = '';
            }}
        }}

        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {{
            const mobileToggle = document.getElementById('mobile-toggle');
            const mobileDrawer = document.getElementById('mobile-drawer');
            const drawerClose = document.getElementById('drawer-close');
            
            if (mobileToggle) {{
                mobileToggle.addEventListener('click', (e) => {{
                    e.preventDefault();
                    toggleMobileMenu();
                }});
            }}
            
            if (drawerClose) {{
                drawerClose.addEventListener('click', closeMobileMenu);
            }}
            
            if (mobileDrawer) {{
                mobileDrawer.addEventListener('click', (e) => {{
                    if (e.target === mobileDrawer) closeMobileMenu();
                }});
            }}

            const articlePanel = document.getElementById('article-detail-panel');
            if (articlePanel) {{
                articlePanel.addEventListener('click', (e) => {{
                    if (e.target === articlePanel) closeArticlePanel();
                }});
            }}
            
            const closeBtn = document.getElementById('article-detail-close');
            if (closeBtn) {{
                closeBtn.addEventListener('click', closeArticlePanel);
            }}
        }});

        // Data from file
        {article_content_raw}
    </script>
    </body>
    </html>
    """
    
    new_content = header_and_body + fixed_js
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  [+] Repaired {filepath} successfully.")

for target in targets:
    path = os.path.join("public", target)
    if os.path.exists(path):
        repair_file(path)
    else:
        print(f"Skipping {path} - file not found")
