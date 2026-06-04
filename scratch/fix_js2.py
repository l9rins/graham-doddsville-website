import os
import glob
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return
        
    if 'article-image-resolver.js' not in content:
        # Find the script tag that contains toggleCollapsible
        pattern = r'(<script>)(?=[\s\S]*?function toggleCollapsible)'
        if re.search(pattern, content):
            new_content = re.sub(pattern, r'<script src="js/article-image-resolver.js?v=3"></script>\n    \1', content, count=1)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filepath}")
        else:
            # Maybe it doesn't have toggleCollapsible, check for loadArticle
            pattern2 = r'(<script>)(?=[\s\S]*?function loadArticle)'
            if re.search(pattern2, content):
                new_content = re.sub(pattern2, r'<script src="js/article-image-resolver.js?v=3"></script>\n    \1', content, count=1)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath} (pattern 2)")
            else:
                print(f"Could not find injection point for {filepath}")
    else:
        # If it has it multiple times, we might want to clean it up, but let's just leave it if it works.
        pass

def main():
    files = glob.glob('*.html') + glob.glob('public/*.html')
    for f in files:
        if 'scratch' in f:
            continue
        process_file(f)

if __name__ == '__main__':
    main()
