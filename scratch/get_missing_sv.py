import re

html = open('stock-valuation.html', encoding='utf-8').read()

links = re.findall(r'onclick="loadArticle\(\'(.*?)\'\)"', html)

idx = html.find('const articleContent')
if idx == -1:
    print("Could not find articleContent dictionary!")
else:
    dict_content = html[idx:]
    keys = re.findall(r'\'([a-z0-9\-]+)\':\s*\{', dict_content)
    
    missing = [k for k in links if k not in keys]
    
    print('Total sidebar links:', len(links))
    print('Total article keys:', len(keys))
    print('Missing:', len(missing))
    
    if missing:
        print(missing)
