import os
import glob
import re

func_code = """
        function closeMobileMenu() {
            const mobileDrawer = document.getElementById('mobile-drawer');
            if (mobileDrawer) {
                mobileDrawer.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'function closeMobileMenu' in content:
        return

    # Find the last <script> tag
    idx = content.rfind('<script>')
    if idx == -1:
        # If no script tag at all, this is weird, but skip
        return
        
    # Inject it right after <script>
    new_content = content[:idx+8] + func_code + content[idx+8:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Added closeMobileMenu to {filepath}")

def main():
    files = glob.glob('*.html') + glob.glob('public/*.html')
    for f in files:
        if 'scratch' in f:
            continue
        process_file(f)

if __name__ == '__main__':
    main()
