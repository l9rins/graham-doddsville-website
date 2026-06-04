import re

with open('scratch/articleContent_fm.js', 'r', encoding='utf-8') as f:
    raw_js = f.read()

match = re.search(r'(const\s+articleContent\s*=\s*\{[\s\S]*?\};\s*)(?=(?://|function\s+loadArticle|function\s+toggleCollapsible|</script>))', raw_js)
if match:
    clean_article_content = match.group(1).strip()
else:
    # If not matched, maybe there's nothing after it. We can just take everything up to the last `};`
    last_brace = raw_js.rfind('};')
    if last_brace != -1:
        clean_article_content = raw_js[:last_brace+2].strip()
    else:
        print("Could not extract clean articleContent")
        exit(1)

with open('financial-markets.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove ALL existing articleContent blocks
# Since regex might be tricky with massive blocks, let's just find them and slice them out
while True:
    start_idx = html.find('const articleContent = {')
    if start_idx == -1:
        break
    # Find the end by looking for the next function loadArticle or function toggleCollapsible
    end_idx = html.find('function loadArticle(', start_idx)
    if end_idx == -1:
        end_idx = html.find('function toggleCollapsible(', start_idx)
    if end_idx == -1:
        end_idx = html.rfind('</script>', start_idx)
        
    # We might have grabbed comments before the function. Let's step back
    # Actually, simpler:
    html = html[:start_idx] + html[end_idx:]

inject_pattern = r'(?:[ \t]*//[^\n]*\n)*[ \t]*function loadArticle\('
match = re.search(inject_pattern, html)
if match:
    new_html = html[:match.start()] + clean_article_content + "\n\n        " + html[match.start():]
    with open('financial-markets.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully injected clean articleContent into financial-markets.html")
else:
    print("Could not find injection point")
