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
    
    # Let's do this robustly.
    # We want to replace `const imagePlaceholder = window.buildArticleImageHtml(articleId, articleContent[articleId]);`
    # with `const imagePlaceholder = typeof window.buildArticleImageHtml === 'function' ? window.buildArticleImageHtml(articleId, articleContent[articleId]) : '';`
    
    content = re.sub(
        r'const imagePlaceholder\s*=\s*window\.buildArticleImageHtml\(articleId,\s*articleContent\[articleId\]\);',
        r"const imagePlaceholder = typeof window.buildArticleImageHtml === 'function' ? window.buildArticleImageHtml(articleId, articleContent[articleId]) : '';",
        content
    )
    
    # We also want to add the `else` fallback.
    # The `if` block ends with `document.body.style.overflow = 'hidden';` and then some spaces and `}`
    # Wait, some files have `if (typeof articleContent !== 'undefined' && articleContent[articleId])`, some just have `if (articleContent[articleId])`
    # Let's just find `document.body.style.overflow = 'hidden';\s*\}` that is inside `loadArticle`.
    # Wait, it's safer to just look for the end of the `if` block.
    # `document.body.style.overflow = 'hidden';` followed by `\s*\}`. Let's replace that.
    
    # To avoid matching the `else` block we already added, check if it's already there
    if 'Article Not Found' not in content:
        # Find the loadArticle function
        load_start = content.find('function loadArticle')
        if load_start != -1:
            # Find the end of the if block inside it
            # It usually ends with `document.body.style.overflow = 'hidden';` and then `}`
            pattern = r"(document\.body\.style\.overflow\s*=\s*['\"]hidden['\"];\s*\})"
            # Only replace the FIRST occurrence after load_start
            
            replacement = r'''\1 else {
                title.textContent = 'Article Not Found';
                body.innerHTML = '<p style="padding: 20px; color: #6b7280;">Sorry, the content for this article ("' + articleId + '") could not be found or has not been added yet.</p>';
                panel.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.error('Article not found:', articleId);
            }'''
            
            # Use regex sub but with count=1, and we need to do it only in the loadArticle section
            # Let's just replace all occurrences of `document.body.style.overflow = 'hidden';\n            }` ?
            # Actually, we can just use re.sub on the whole file, it's fine, as long as 'Article Not Found' is not in the file
            content = re.sub(pattern, replacement, content, count=1)
            
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
