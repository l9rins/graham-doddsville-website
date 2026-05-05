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
    print(f"Enhancing UI/UX and fixing styles in {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Scoped Styles for Blue Headers
    # We'll replace the existing style block between /* Scoped overrides... */ and the end of that style tag
    # or just look for the specific elements.
    
    # Define the new Premium Scoped Style
    premium_style = """
    <style>
        /* Premium UI/UX Design: Navy & Gold Theme */
        html, body {
            background-color: #ffffff !important;
            background: #ffffff !important;
            scroll-behavior: smooth;
        }

        /* Mobile Adjustments */
        @media (max-width: 1024px) {
            .container, .header, .header-content, .wealth-creation-page, .wealth-creation-page-content, .article-detail-header, .financial-analysis-page, .stock-valuation-page {
                background: #ffffff !important;
                border: 0px solid transparent !important;
                box-shadow: none !important;
            }
            .header {
                border-bottom: 2px solid #d4af37 !important;
            }
        }
        
        /* Drawer Header - Reverted to Blue */
        .drawer-header {
            background: #1e3a8a !important;
            background-color: #1e3a8a !important;
            color: #ffffff !important;
            border-bottom: 3px solid #d4af37 !important;
            padding: 20px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        
        .drawer-header h2 {
            color: #ffffff !important;
            margin: 0 !important;
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
        }

        .drawer-close {
            color: #ffffff !important;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .drawer-close:hover {
            opacity: 1;
        }

        /* Collapsible Headers - Reverted to Blue */
        .collapsible-header {
            background: #1e3a8a !important;
            background-color: #1e3a8a !important;
            border: 1px solid #1e3a8a !important;
            color: #ffffff !important;
            padding: 16px 20px !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            cursor: pointer !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        
        .collapsible-header:hover {
            background: #152e6d !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        
        .collapsible-header.active {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            margin-bottom: 0 !important;
            background: #1e3a8a !important;
        }

        .collapsible-title {
            color: #ffffff !important;
            font-weight: 600 !important;
            font-size: 1.1rem !important;
            margin: 0 !important;
        }
        
        .collapsible-arrow {
            color: #ffffff !important;
            transition: transform 0.3s ease !important;
        }
        
        /* Collapsible Content Area */
        .collapsible-content {
            background: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-top: none !important;
            border-bottom-left-radius: 8px !important;
            border-bottom-right-radius: 8px !important;
            margin-bottom: 16px !important;
        }

        /* Improved Article Links */
        .collapsible-link {
            padding: 12px 20px !important;
            border-left: 3px solid transparent !important;
            transition: all 0.2s !important;
            color: #4b5563 !important;
            text-decoration: none !important;
            display: block !important;
        }
        
        .collapsible-link:hover {
            background: #f3f4f6 !important;
            border-left-color: #d4af37 !important;
            color: #1e3a8a !important;
            padding-left: 25px !important;
        }

        /* Article Detail Panel UX */
        .article-detail-panel {
            background: rgba(0,0,0,0.5) !important;
            backdrop-filter: blur(4px);
        }
        
        .article-detail-content {
            border-radius: 12px !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            border: 1px solid #e5e7eb !important;
        }
        
        .article-detail-header {
            background: #ffffff !important;
            border-bottom: 2px solid #d4af37 !important;
            padding: 24px !important;
        }
        
        .article-detail-title {
            color: #1e3a8a !important;
            font-family: 'Georgia', serif !important;
            font-size: 1.75rem !important;
            line-height: 1.3 !important;
        }
        
        .article-detail-body {
            padding: 32px !important;
            font-family: 'Inter', -apple-system, sans-serif !important;
            line-height: 1.6 !important;
            color: #374151 !important;
        }
        
        .article-detail-body h3 {
            color: #1e3a8a !important;
            margin-top: 24px !important;
        }

        /* Remove blue glow and unwanted borders */
        * {
            box-shadow: none;
            -webkit-tap-highlight-color: transparent;
        }
    </style>
    """

    # Replace the existing style block or insert it after the head
    # We'll look for the first <style> tag that contains "Scoped overrides" or just replace the first style tag we find in head
    if "Scoped overrides for flat white design" in content:
        content = re.sub(r'<style>\s*/\* Scoped overrides for flat white design.*?</style>', premium_style, content, flags=re.DOTALL)
    elif "Premium UI/UX Design" in content:
         content = re.sub(r'<style>\s*/\* Premium UI/UX Design.*?</style>', premium_style, content, flags=re.DOTALL)
    else:
        # Fallback: insert before the closing </head>
        content = content.replace('</head>', premium_style + '</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  [+] Enhanced {filepath} successfully.")

for target in targets:
    path = os.path.join("public", target)
    if os.path.exists(path):
        repair_file(path)
    else:
        print(f"Skipping {path} - file not found")
