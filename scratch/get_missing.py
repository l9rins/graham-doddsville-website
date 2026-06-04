import re
html = open('legal-taxation.html', encoding='utf-8').read()
links = re.findall(r'onclick="loadArticle\(\'(.*?)\'\)"', html)
keys = re.findall(r'\'([a-z0-9\-]+)\':\s*\{', html[html.find('const articleContent'):])
missing = [k for k in links if k not in keys]
print(missing)
