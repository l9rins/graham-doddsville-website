import os
import glob
import re

html_files = glob.glob('*.html') + glob.glob('public/html/*.html')
if 'public/index.html' in html_files:
    pass
else:
    html_files.append('public/index.html')

for filepath in html_files:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # 1. Remove Classical Readings nav link
    text = re.sub(r'<li><a href="classical-readings\.html"[^>]*>CLASSICAL READINGS</a></li>\s*', '', text)
    # 2. Remove Classical Readings drawer link
    text = re.sub(r'<li><a href="classical-readings\.html"[^>]*>Classical Readings</a></li>\s*', '', text)
    
    # 3. Fix Overlapping Heading CSS
    # Looking for .page-title { font-size: 2rem; } inside @media (max-width: 768px)
    # Actually, we can just find any `.page-title { font-size: 2rem; }` or `.page-title\s*{\s*font-size:\s*2rem;\s*}`
    # wait, the page title on mobile is usually inside @media (max-width: 768px) for some files.
    # Let's write a targeted regex that matches font-size: 2rem inside .page-title
    text = re.sub(r'(\.page-title\s*\{[^}]*?)font-size:\s*2rem;', r'\1font-size: 1.25rem;', text)
    
    # 4. Bug #6: Fix Legal & Taxation body text
    if 'legal-taxation' in filepath:
        old_text = "Building wealth is a journey that requires knowledge, discipline, and the right tools. This collection of provides everything you need to start and maintain your wealth creation journey."
        new_text = "Understanding Legal and Taxation frameworks is essential for protecting your assets and optimizing your financial position. This collection provides comprehensive coverage of all major legal structures and tax strategies."
        text = text.replace(old_text, new_text)
    
    # 5. Bug #7: Change CGT in index.html dropdown
    if filepath.endswith('index.html'):
        text = text.replace('<li><a href="#capital-gains-tax">Capital Gains Tax</a></li>', '<li><a href="#capital-gains-tax">Capital Gains Tax (CGT)</a></li>')
        text = text.replace('<li><a href="#cgt">Capital Gains Tax</a></li>', '<li><a href="#cgt">Capital Gains Tax (CGT)</a></li>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("Fixes applied successfully to all files.")
