import os
import re

base_dir = r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite'
search_dirs = [base_dir, os.path.join(base_dir, 'public')]

# 1. Update Sidebar Links
# We want to catch both economics.html and sidebar-economics.html to standardize them
sidebar_pattern = re.compile(r'<li><a href="(?:sidebar-)?economics\.html"(.*?)>Economics</a></li>', re.IGNORECASE)
drawer_pattern = re.compile(r'<li><a href="(?:sidebar-)?economics\.html"(.*?)class="drawer-link"(.*?)>Economics</a></li>', re.IGNORECASE)
nav_pattern = re.compile(r'<a href="(?:sidebar-)?economics\.html" class="nav-link">Economics</a>', re.IGNORECASE)
placeholder_nav = re.compile(r'<li><a href="#" class="nav-link">Economics</a></li>', re.IGNORECASE)

def update_sidebar_links(content):
    new_content = sidebar_pattern.sub(r'<li><a href="sidebar-economics.html"\1>Economics</a></li>', content)
    new_content = drawer_pattern.sub(r'<li><a href="sidebar-economics.html"\1class="drawer-link"\2>Economics</a></li>', new_content)
    new_content = nav_pattern.sub(r'<a href="sidebar-economics.html" class="nav-link">Economics</a>', new_content)
    new_content = placeholder_nav.sub(r'<li><a href="sidebar-economics.html" class="nav-link">Economics</a></li>', new_content)
    # Also replace Greatest-Investors.html with Greatest-Investors.html (already correct but ensure case)
    new_content = new_content.replace('Greatest-Investors.html', 'Greatest-Investors.html')
    return new_content

# 2. Inject toggleCollapsible JavaScript if missing or update it
TOGGLE_JS = """
        function toggleCollapsible(sectionId) {
            const content = document.getElementById(sectionId + '-content');
            const arrow = document.getElementById(sectionId + '-arrow');
            if (!content) return;
            const section = content.closest('.collapsible-section');
            
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
            
            // Close all other open sections
            document.querySelectorAll('.collapsible-content').forEach(c => {
                c.style.maxHeight = null;
                c.classList.remove('expanded');
                c.classList.add('collapsed');
                const s = c.closest('.collapsible-section');
                if (s) s.classList.remove('active');
                const a = document.getElementById(c.id.replace('-content', '-arrow'));
                if (a) a.innerHTML = '▼';
            });

            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('expanded');
                content.classList.remove('collapsed');
                if (section) section.classList.add('active');
                if (arrow) arrow.innerHTML = '▲';
            }
        }
"""

def inject_toggle_js(content):
    # If it's already there, we might want to replace it to ensure it's the latest version
    # But for safety, we'll just check if it's there.
    if 'function toggleCollapsible' in content:
        # Try to replace the existing one with our better version
        pattern = re.compile(r'function toggleCollapsible\(sectionId\)\s*\{.*?\}', re.DOTALL)
        if pattern.search(content):
            return pattern.sub(TOGGLE_JS.strip(), content)
        return content
    
    # Try to find a good place to inject
    if '</script>' in content:
        # Inject before the first </script> tag or after the last one? 
        # Let's inject into the last script tag to be safe
        parts = content.rsplit('</script>', 1)
        return parts[0] + "\n" + TOGGLE_JS + "\n</script>" + parts[1]
    elif '</body>' in content:
        return content.replace('</body>', '<script>' + TOGGLE_JS + '</script>\n</body>')
    return content

# 3. Fix Logo Paths
logo_pattern = re.compile(r'src=["\'](?:images/)?G&amp;D Logo\.png["\']', re.IGNORECASE)
logo_bg_pattern = re.compile(r'src=["\'](?:images/)?G&amp;D Logo \(for black background\)\.png["\']', re.IGNORECASE)
logo_plain_pattern = re.compile(r'src=["\'](?:images/)?G&D Logo\.png["\']', re.IGNORECASE)
logo_bg_plain_pattern = re.compile(r'src=["\'](?:images/)?G&D Logo \(for black background\)\.png["\']', re.IGNORECASE)

def fix_logo_paths(content):
    new_content = logo_pattern.sub('src="images/G&amp;D Logo.png"', content)
    new_content = logo_bg_pattern.sub('src="images/G&amp;D Logo (for black background).png"', new_content)
    new_content = logo_plain_pattern.sub('src="images/G&D Logo.png"', new_content)
    new_content = logo_bg_plain_pattern.sub('src="images/G&D Logo (for black background).png"', new_content)
    return new_content

# 4. Inject Scoped CSS for White Container, No Shadows, and Gold Header Border
SCOPED_STYLE = """
    <style>
        /* Scoped overrides for flat white design with gold header border */
        html, body {
            background-color: #ffffff !important;
            background: #ffffff !important;
        }

        @media (max-width: 1024px) {
            .container, .header, .header-content, .drawer-header, .wealth-creation-page, .wealth-creation-page-content, .article-detail-header, .financial-analysis-page, .stock-valuation-page {
                background: #ffffff !important;
                background-color: #ffffff !important;
                border: 0px solid transparent !important;
                box-shadow: none !important;
            }
            .header, .drawer-header {
                border-bottom: 2px solid #d4af37 !important;
            }
            /* Remove jagged notebook border/shadow effect */
            .container::before {
                display: none !important;
                content: none !important;
                box-shadow: none !important;
                filter: none !important;
            }
        }
        
        /* Apply to all viewports for specific elements */
        .container, .header, .header-content, .drawer-header, .page-title-section, .collapsible-section, .article-detail-header {
            background: #ffffff !important;
            background-color: #ffffff !important;
            box-shadow: none !important;
            border: 0px solid transparent !important;
        }
        
        .header, .drawer-header {
            border-bottom: 2px solid #d4af37 !important;
        }

        .collapsible-header, .collapsible-header:hover {
            background: #ffffff !important;
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            color: #1e3a8a !important;
            box-shadow: none !important;
            transform: none !important;
        }
        
        .collapsible-title, .collapsible-arrow, .article-detail-title, .article-detail-close {
            color: #1e3a8a !important;
        }
        
        /* Ensure the main page background is white */
        body, .wealth-creation-page, .wealth-creation-page-content, .financial-analysis-page, .stock-valuation-page, .professional-advisers-page, .financial-products-page, .resources-page {
            background: #ffffff !important;
            background-color: #ffffff !important;
        }
        
        /* Drawer close button visibility */
        .drawer-close {
            color: #1e3a8a !important;
        }
        .drawer-close::before {
            color: #1e3a8a !important;
        }
        
        /* Remove blue borders on links */
        .collapsible-link:hover {
            border-left-color: #1e3a8a !important;
            background: #f8f9fa !important;
        }
        
        /* Remove the blue glow from ALL elements */
        * {
            box-shadow: none !important;
            text-shadow: none !important;
        }

        /* Hamburger menu colors */
        .hamburger-line {
            background-color: #1e3a8a !important;
        }
        
        /* Footer disclaimer and other potential blue elements */
        footer, .footer, .disclaimer-section {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #666666 !important;
            border-top: 1px solid #e5e7eb !important;
        }
    </style>
"""

TARGET_FILES = [
    "wealth-creation.html",
    "share-investing.html",
    "investment-analysis.html",
    "professional-advisers.html",
    "financial-products.html",
    "financial-statement-analysis.html",
    "stock-valuation.html",
    "events.html",
    "sidebar-economics.html",
    "economics.html",
    "investing.html",
    "businesses.html",
    "governance.html",
    "accounting.html",
    "miscellaneous.html",
    "philosophy.html",
    "legal-taxation.html",
    "Greatest-Investors.html",
    "resources.html"
]

WHITE_STYLE_PATTERN = re.compile(r'\s*<style>\s*/\* Scoped overrides for flat white design.*?</style>', re.DOTALL)
OLD_WHITE_STYLE_PATTERN = re.compile(r'\s*<style>\s*/\* Scoped overrides to remove blue container.*?</style>', re.DOTALL)

for root_dir in search_dirs:
    if not os.path.exists(root_dir): continue
    for filename in os.listdir(root_dir):
        file_path = os.path.join(root_dir, filename)
        if os.path.isdir(file_path): continue
        if not filename.endswith(".html"): continue
        
        rel_path = os.path.relpath(file_path, base_dir).replace('\\', '/')
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update sidebar links in ALL files
        new_content = update_sidebar_links(content)
        
        # Apply scoped white style if it's one of the target files
        should_apply = False
        if filename in TARGET_FILES and rel_path != "public/index.html":
            should_apply = True
        
        if should_apply:
            # Fix logo paths
            new_content = fix_logo_paths(new_content)
            
            # Inject JS
            new_content = inject_toggle_js(new_content)
            
            # Inject/Update Style
            if '</head>' in new_content:
                if 'Scoped overrides for flat white design' in new_content:
                    new_content = WHITE_STYLE_PATTERN.sub('\n' + SCOPED_STYLE, new_content)
                elif 'Scoped overrides to remove blue container' in new_content:
                    new_content = OLD_WHITE_STYLE_PATTERN.sub('\n' + SCOPED_STYLE, new_content)
                else:
                    new_content = new_content.replace('</head>', SCOPED_STYLE + '\n</head>')
        
        # Explicitly remove from index.html (both root and public)
        if filename == "index.html":
            new_content = WHITE_STYLE_PATTERN.sub('', new_content)
            new_content = OLD_WHITE_STYLE_PATTERN.sub('', new_content)

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {rel_path}")

print("Done.")
