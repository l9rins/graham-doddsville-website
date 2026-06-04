import os
import re

dirs = ['.', 'public']

def process_file(filepath):
    try:
        with open(filepath, 'rb') as f:
            raw = f.read()
    except Exception as e:
        return
        
    try:
        content = raw.decode('utf-8')
    except:
        try:
            content = raw.decode('utf-16-le')
        except:
            content = raw.decode('latin-1')

    modified = False
    
    # regex to remove the white header block
    pattern1 = r'[ \t]*\.collapsible-header,\s*\.collapsible-header:hover\s*\{[\s\S]*?transform: none !important;\r?\n[ \t]*\}'
    if re.search(pattern1, content):
        content = re.sub(pattern1, '', content)
        modified = True

    pattern2 = r'[ \t]*\.collapsible-title,\s*\.collapsible-arrow,\s*\.article-detail-title,\s*\.article-detail-close\s*\{[\s\S]*?color: #[0-9a-fA-F]+ !important;\r?\n[ \t]*\}'
    if re.search(pattern2, content):
        content = re.sub(pattern2, '', content)
        modified = True

    if os.path.basename(filepath) == 'legal-taxation.html':
        if '</html>' not in content:
            content += '\n    </script>\n</body>\n</html>\n'
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed", filepath)

for d in dirs:
    if not os.path.exists(d): continue
    for f in os.listdir(d):
        if f.endswith('.html'):
            process_file(os.path.join(d, f))
