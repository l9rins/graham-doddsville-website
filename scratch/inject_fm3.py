import re

with open('financial-markets.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('scratch/fm_batch5.txt', 'r', encoding='utf-8') as f:
    batch5 = f.read()

if not batch5.endswith(','):
    batch5 = batch5.rstrip() + ','

target = 'const articleContent = {'
idx = html.find(target)

if idx != -1:
    idx += len(target)
    new_html = html[:idx] + '\n' + batch5 + '\n' + html[idx:]
    
    with open('financial-markets.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully injected Phase 3!")
else:
    print("Could not find articleContent dictionary.")
