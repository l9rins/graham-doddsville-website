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
    
    # We want to replace this:
    #             if (typeof articleContent !== 'undefined' && articleContent[articleId]) {
    #                 title.textContent = articleContent[articleId].title;
    #                 const imagePlaceholder = window.buildArticleImageHtml ? window.buildArticleImageHtml(articleId, articleContent[articleId]) : '';
    #                 body.innerHTML = imagePlaceholder + articleContent[articleId].content;
    #                 panel.classList.add('active');
    #                 document.body.style.overflow = 'hidden';
    #             }
    #         }
    
    # With this:
    #             if (typeof articleContent !== 'undefined' && articleContent[articleId]) {
    #                 title.textContent = articleContent[articleId].title;
    #                 const imagePlaceholder = window.buildArticleImageHtml ? window.buildArticleImageHtml(articleId, articleContent[articleId]) : '';
    #                 body.innerHTML = imagePlaceholder + articleContent[articleId].content;
    #                 panel.classList.add('active');
    #                 document.body.style.overflow = 'hidden';
    #             } else {
    #                 title.textContent = 'Article Not Found';
    #                 body.innerHTML = '<p style="padding: 20px;">Sorry, the content for this article ("' + articleId + '") could not be found or has not been added yet.</p>';
    #                 panel.classList.add('active');
    #                 document.body.style.overflow = 'hidden';
    #                 console.error('Article not found:', articleId);
    #             }
    #         }
    
    pattern = r'(if \(typeof articleContent !== \'undefined\' && articleContent\[articleId\]\) \{[\s\S]*?document\.body\.style\.overflow = \'hidden\';\s*\})'
    
    replacement = r'''\1 else {
                title.textContent = 'Article Not Found';
                body.innerHTML = '<p style="padding: 20px; color: #6b7280;">Sorry, the content for this article ("' + articleId + '") could not be found or has not been added yet.</p>';
                panel.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.error('Article not found:', articleId);
            }'''
            
    content = re.sub(pattern, replacement, content)
    
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
