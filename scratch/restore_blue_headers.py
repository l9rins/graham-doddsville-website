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
    print(f"Applying surgical Blue Header fix to {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Surgical Style Block - ONLY the requested blue headers
    surgical_style = """
    <style>
        /* Scoped overrides for Blue Headers (Surgical Fix) */
        .drawer-header {
            background: #1e3a8a !important;
            background-color: #1e3a8a !important;
            color: #ffffff !important;
        }
        .drawer-header h2, .drawer-close {
            color: #ffffff !important;
        }
        
        .collapsible-header {
            background: #1e3a8a !important;
            background-color: #1e3a8a !important;
            color: #ffffff !important;
        }
        .collapsible-title, .collapsible-arrow {
            color: #ffffff !important;
        }
        
        /* Keep everything else as per the white theme requirements */
        html, body, .container, .header, .header-content, .page-title-section, .collapsible-content, .article-detail-header {
            background: #ffffff !important;
            background-color: #ffffff !important;
        }
        .header {
            border-bottom: 2px solid #d4af37 !important;
        }
    </style>
    """

    # We want to replace any previous "Premium UI/UX" or "Scoped overrides" block with this minimal one
    content = re.sub(r'<style>\s*/\* Premium UI/UX Design.*?</style>', surgical_style, content, flags=re.DOTALL)
    content = re.sub(r'<style>\s*/\* Scoped overrides for flat white design.*?</style>', surgical_style, content, flags=re.DOTALL)
    
    # If neither found (unexpected), insert it
    if "/* Scoped overrides for Blue Headers" not in content:
        content = content.replace('</head>', surgical_style + '</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  [+] Surgical fix applied to {filepath}.")

for target in targets:
    path = os.path.join("public", target)
    if os.path.exists(path):
        repair_file(path)
    else:
        print(f"Skipping {path} - file not found")
