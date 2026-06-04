import re

with open('financial-markets.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('scratch/fm_batch1.txt', 'r', encoding='utf-8') as f:
    batch1 = f.read()

with open('scratch/fm_batch2.txt', 'r', encoding='utf-8') as f:
    batch2 = f.read()

# Make sure they end with a comma to not break syntax
if not batch1.endswith(','):
    batch1 = batch1.rstrip() + ','

if not batch2.endswith(','):
    batch2 = batch2.rstrip() + ','

# Inject right after "const articleContent = {"
target = 'const articleContent = {'
idx = html.find(target)

if idx != -1:
    idx += len(target)
    # Insert both batches
    new_html = html[:idx] + '\n' + batch1 + '\n' + batch2 + '\n' + html[idx:]
    
    with open('financial-markets.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully injected Phase 1!")
else:
    print("Could not find articleContent dictionary.")
