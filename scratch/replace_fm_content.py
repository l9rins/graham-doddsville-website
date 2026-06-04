import re

with open('financial-markets.html', 'r', encoding='utf-8') as f:
    html_content = f.read()
    
with open('scratch/articleContent_fm.js', 'r', encoding='utf-8') as f:
    new_article_content = f.read()

# First, remove ALL occurrences of const articleContent in html_content
matches = list(re.finditer(r'const articleContent\s*=\s*\{', html_content))

# We will just replace from the FIRST match up to the end (before function loadArticle or toggleCollapsible)
# Actually, the easiest way is to find the FIRST match, and find the last `function loadArticle(` or `function toggleCollapsible(`
start_idx = html_content.find('const articleContent = {')
end_idx = html_content.rfind('function loadArticle(')
if end_idx == -1:
    end_idx = html_content.rfind('function toggleCollapsible(')

if start_idx != -1 and end_idx != -1:
    # We want to replace from start_idx up to the line before end_idx
    # Let's find the `// Article panel functionality` or just inject before end_idx
    # But wait, there might be TWO articleContent blocks, so this deletes everything between the first one and the last loadArticle
    final_html = html_content[:start_idx] + new_article_content + "\n\n        " + html_content[end_idx:]
    with open('financial-markets.html', 'w', encoding='utf-8') as f:
        f.write(final_html)
    print("Replaced articleContent successfully!")
else:
    print("Could not find bounds")
