import re

with open('legal-taxation.html', 'r', encoding='utf-8') as f:
    html = f.read()

links = re.findall(r'onclick="loadArticle\(\'(.*?)\'\)">(.*?)<', html)
keys = re.findall(r'\'([a-z0-9\-]+)\':\s*\{', html[html.find('const articleContent'):])

missing = [(k, text) for k, text in links if k not in keys]

print(f'Total links: {len(links)}')
print(f'Total keys: {len(keys)}')
print(f'Missing keys: {len(missing)} out of {len(links)} links.')
for m in missing:
    print(f'Missing: ID: {m[0]}, Text: {m[1]}')
