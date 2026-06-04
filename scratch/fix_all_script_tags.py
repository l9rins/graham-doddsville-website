import os, re

files = [f for f in os.listdir('.') if f.endswith('.html')]
files += [os.path.join('public', f) for f in os.listdir('public') if f.endswith('.html')]

fixed = 0
for filepath in files:
    html = open(filepath, 'r', encoding='utf-8').read()
    
    # Find <script src="...">...inline code...</script> patterns
    pattern = r'(<script\s+src="[^"]+">)([\s\S]+?)(</script>)'
    
    def fix_match(m):
        global fixed
        open_tag = m.group(1)
        inline = m.group(2).strip()
        close_tag = m.group(3)
        
        if not inline:
            return m.group(0)  # No inline content, leave as is
        
        fixed_count = 1
        # Split into: src-only tag + separate inline script
        return open_tag + close_tag + '\n    <script>\n' + inline + '\n    </script>'
    
    new_html = re.sub(pattern, fix_match, html)
    
    if new_html != html:
        open(filepath, 'w', encoding='utf-8').write(new_html)
        fixed += 1
        print(f"Fixed: {filepath}")

print(f"\nTotal files fixed: {fixed}")
