import re

with open('stock-valuation.html', 'r', encoding='utf-8') as f:
    html = f.read()

batch1 = open('scratch/sv_batch1.txt', 'r', encoding='utf-8').read().strip()
batch2 = open('scratch/sv_batch2.txt', 'r', encoding='utf-8').read().strip()
batch3 = open('scratch/sv_batch3.txt', 'r', encoding='utf-8').read().strip()

if not batch1.endswith(','): batch1 += ','
if not batch2.endswith(','): batch2 += ','
if not batch3.endswith(','): batch3 += ','

target = 'const articleContent = {'
idx = html.find(target)

if idx != -1:
    idx += len(target)
    injection = '\n' + batch1 + '\n' + batch2 + '\n' + batch3 + '\n'
    new_html = html[:idx] + injection + html[idx:]
    
    with open('stock-valuation.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully injected all 67 articles!")
else:
    print("Could not find articleContent dictionary.")
