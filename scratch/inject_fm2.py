import re

with open('financial-markets.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('scratch/fm_batch3.txt', 'r', encoding='utf-8') as f:
    batch3 = f.read()

with open('scratch/fm_batch4.txt', 'r', encoding='utf-8') as f:
    batch4 = f.read()

if not batch3.endswith(','):
    batch3 = batch3.rstrip() + ','

if not batch4.endswith(','):
    batch4 = batch4.rstrip() + ','

target = 'const articleContent = {'
idx = html.find(target)

if idx != -1:
    idx += len(target)
    new_html = html[:idx] + '\n' + batch3 + '\n' + batch4 + '\n' + html[idx:]
    
    with open('financial-markets.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully injected Phase 2!")
else:
    print("Could not find articleContent dictionary.")
