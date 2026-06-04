import re

with open('financial-markets.html', 'r', encoding='utf-8') as f:
    content = f.read()

links = re.findall(r'onclick="loadArticle\(\'(.*?)\'\)">(.*?)<', content)
print("=== HTML LINKS ===")
for i, (a, b) in enumerate(links):
    print(f'{i+1}. ID: {a}, Text: {b}')

print("\n=== ARTICLE KEYS ===")
keys = re.findall(r'\'([a-z0-9\-]+)\': \{', content[content.find('const articleContent'):])
for i, k in enumerate(keys):
    print(f'{i+1}. {k}')
