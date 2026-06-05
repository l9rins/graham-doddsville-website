import re

with open('share-investing.html', 'r', encoding='utf-8') as f:
    html = f.read()

batch1 = open('scratch/si_batch1.txt', 'r', encoding='utf-8').read().strip()
batch2 = open('scratch/si_batch2.txt', 'r', encoding='utf-8').read().strip()
batch3 = open('scratch/si_batch3.txt', 'r', encoding='utf-8').read().strip()

if not batch1.endswith(','): batch1 += ','
if not batch2.endswith(','): batch2 += ','
if not batch3.endswith(','): batch3 += ','

target = 'const articleContent = {'
idx = html.find(target)

if idx != -1:
    idx += len(target)
    # Inject all batches right after the opening brace
    injection = '\n' + batch1 + '\n' + batch2 + '\n' + batch3 + '\n'
    new_html = html[:idx] + injection + html[idx:]
    
    with open('share-investing.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully injected all 73 articles!")
else:
    print("Could not find articleContent dictionary.")
