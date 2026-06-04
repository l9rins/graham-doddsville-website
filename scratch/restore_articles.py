import os
import glob
import subprocess
import re

def restore_article_content(filepath):
    try:
        old_content = subprocess.check_output(['git', 'show', f'15d2890:{filepath}']).decode('utf-8')
    except subprocess.CalledProcessError:
        print(f"Could not get history for {filepath}")
        return

    # Match `const articleContent` up to `};\s*` followed by a comment or function loadArticle
    match = re.search(r'(const\s+articleContent\s*=\s*\{[\s\S]*?\};\s*)(?=(?://|function\s+loadArticle))', old_content)
    if not match:
        print(f"Could not find articleContent block in old {filepath}")
        return
        
    extracted_block = match.group(1).strip() + "\n\n        "
    
    with open(filepath, 'r', encoding='utf-8') as f:
        current_content = f.read()
        
    if "const articleContent" in current_content:
        print(f"Content already exists in {filepath}")
        return
        
    # Inject it before the comment block preceding `function loadArticle`
    inject_pattern = r'(?:[ \t]*//[^\n]*\n)*[ \t]*function loadArticle\('
    match = re.search(inject_pattern, current_content)
    if match:
        new_content = current_content[:match.start()] + extracted_block + current_content[match.start():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Restored content in {filepath}")
    else:
        print(f"Could not find injection point in {filepath}")

def main():
    files = glob.glob('*.html') + glob.glob('public/*.html')
    for f in files:
        if 'scratch' in f:
            continue
        filepath = f.replace('\\', '/')
        if filepath == 'wealth-creation.html':
            continue
        restore_article_content(filepath)

if __name__ == '__main__':
    main()
