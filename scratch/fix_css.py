import os
import glob
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return
        
    original = content
    # Look for the two rules that force background white
    # .container, .header, .header-content, .drawer-header, .wealth-creation-page, .wealth-creation-page-content, .article-detail-header, .financial-analysis-page, .stock-valuation-page
    # and
    # .container, .header, .header-content, .drawer-header, .page-title-section, .collapsible-section, .article-detail-header
    
    # We can just replace ', .article-detail-header' with '' if it's in a selector block that has background: #ffffff !important
    # Actually, the safest way is just `content.replace(', .article-detail-header', '')`. 
    # Is there any other place where `.article-detail-header` is legitimately grouped with a comma?
    # Usually we don't want to break other rules. Let's do a more targeted regex.
    
    pattern1 = r'(\.container,.*?)(, \.article-detail-header)(.*?[ \t]*\{[ \t]*\r?\n[ \t]*background: #ffffff !important;)'
    # The actual text is: 
    # .container, .header, .header-content, .drawer-header, .page-title-section, .collapsible-section, .article-detail-header {
    #     background: #ffffff !important;
    
    # Let's just do a simple replacement of the exact substrings we know:
    content = content.replace(', .article-detail-header {', ' {')
    
    # And for the one with stuff after it:
    # .container, .header, .header-content, .drawer-header, .wealth-creation-page, .wealth-creation-page-content, .article-detail-header, .financial-analysis-page, .stock-valuation-page {
    content = content.replace(', .article-detail-header,', ',')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

def main():
    files = glob.glob('*.html') + glob.glob('public/*.html')
    for f in files:
        if 'scratch' in f:
            continue
        process_file(f)

if __name__ == '__main__':
    main()
