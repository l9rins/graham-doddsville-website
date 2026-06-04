import re

html = open('financial-markets.html', 'r', encoding='utf-8').read()

# Find the <script src="js/article-image-resolver.js?v=3"> tag that has inline code inside it
# The browser ignores inline code when src is present
# We need to split it into: <script src="..."></script> + <script>...inline code...</script>

pattern = r'<script src="js/article-image-resolver\.js\?v=3">'
match = re.search(pattern, html)

if match:
    start = match.start()
    end_tag = html.find('</script>', start)
    
    # Get the inline content between the opening tag and </script>
    open_tag_end = match.end()
    inline_content = html[open_tag_end:end_tag].strip()
    
    if inline_content:
        # Replace with: proper src tag + separate inline script
        replacement = '<script src="js/article-image-resolver.js?v=3"></script>\n    <script>\n' + inline_content + '\n    </script>'
        old_block = html[start:end_tag + len('</script>')]
        html = html.replace(old_block, replacement)
        
        open('financial-markets.html', 'w', encoding='utf-8').write(html)
        print("Fixed! Split the script tag into src + inline blocks.")
    else:
        print("No inline content found inside the src script tag.")
else:
    print("Could not find the script tag.")
