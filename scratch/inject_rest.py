import json

filepath = 'legal-taxation.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Load the batches
b2 = open('scratch/batch2.txt', encoding='utf-8').read()
b3 = open('scratch/batch3.txt', encoding='utf-8').read()
b4 = open('scratch/batch4.txt', encoding='utf-8').read()

new_articles = b2 + "\n" + b3 + "\n" + b4

# Find the insertion point: right after 'what-are-directors-duties'
anchor = "'what-are-directors-duties': {"
start_idx = content.find(anchor)
if start_idx != -1:
    # Find the closing brace of 'what-are-directors-duties'
    end_idx = content.find('},', start_idx) + 2
    
    # Inject the new articles
    new_content = content[:end_idx] + "\n" + new_articles + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected all 47 articles into legal-taxation.html!")
else:
    print("Could not find insertion anchor!")
