import os
import re

dir_path = r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite\public\html'

# Patterns to replace in navigation
# <li><a href="wealth-creation.html" class="nav-link">WEALTH CREATION</a></li>
# <li><a href="financial-markets.html" class="drawer-link">WEALTH CREATION</a></li>

patterns = [
    (r'(href="wealth-creation\.html"[^>]*>)\s*WEALTH CREATION\s*(</a>)', r'\1Wealth Creation\2'),
    (r'(href="financial-markets\.html"[^>]*>)\s*WEALTH CREATION\s*(</a>)', r'\1Financial Markets\2'),
    (r'(href="legal-taxation\.html"[^>]*>)\s*(</a>)', r'\1Legal & Taxation\2'),
    (r'(href="professional-advisers\.html"[^>]*>)\s*(</a>)', r'\1Professional Advisers\2'),
    # General text replacements (be careful with these)
    (r'\bWEALTH CREATION\b(?!\s*</a>)', 'financial markets'),
]

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in patterns:
            new_content = re.sub(pattern, replacement, new_content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
