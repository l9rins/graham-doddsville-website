import re
import difflib

with open('financial-markets.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('const articleContent = {')
articles = {}
matches = re.finditer(r'\'([a-z0-9\-]+)\':\s*\{\s*title:\s*\'([^\']+)\'', content[start_idx:])
for m in matches:
    key = m.group(1)
    title = m.group(2)
    articles[title.strip()] = key

links = re.findall(r'(onclick="loadArticle\(\'([^\']+)\'\)">(.*?)<)', content)
titles = list(articles.keys())

replacements = []
for full_match, old_id, text in links:
    text_clean = text.strip()
    best_key = old_id
    
    # Is old_id already a valid key?
    if old_id in articles.values():
        continue
        
    # Try exact match on title
    if text_clean in articles:
        best_key = articles[text_clean]
    else:
        # Try fuzzy match
        matches = difflib.get_close_matches(text_clean, titles, n=1, cutoff=0.5)
        if matches:
            best_key = articles[matches[0]]
            
    if best_key != old_id:
        new_match = full_match.replace(f"'{old_id}'", f"'{best_key}'")
        replacements.append((full_match, new_match, text_clean, matches[0] if matches else 'NONE'))

print(f"Found {len(replacements)} replacements out of {len(links)} links")
for old, new, txt, matched_title in replacements:
    print(f"Mapping '{txt}' -> {matched_title}")
    content = content.replace(old, new)

with open('financial-markets.html', 'w', encoding='utf-8') as f:
    f.write(content)
