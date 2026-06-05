import re

html = open('stock-valuation.html', encoding='utf-8').read()
links = re.findall(r'onclick="loadArticle\(\'(.*?)\'\)"', html)
idx = html.find('const articleContent')
dict_content = html[idx:]
keys = re.findall(r'\'([a-z0-9\-]+)\':\s*\{', dict_content)

missing = [k for k in links if k not in keys]

# Remove duplicates while preserving order
seen = set()
unique_missing = []
for m in missing:
    if m not in seen:
        unique_missing.append(m)
        seen.add(m)

print("Unique missing count:", len(unique_missing))
print(unique_missing)
