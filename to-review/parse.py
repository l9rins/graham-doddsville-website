import re
import json

with open('C:/Users/Mark Lorenz/Desktop/LibraryWebsite/to-review/april24_comments.txt', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'\d+\.\d+\s*x\s*\d+\.\d+', ' ', text)
text = re.sub(r'[\f\n\t\r\/]+', ' ', text)

number_pattern = r'(\b\d+\.\d+(?:\.\d+)*\.?|\b\d+\.)'
items = re.findall(f'{number_pattern}\\s+([A-Za-z].*?)(?=\\s+(?:\\b\\d+\\.\\d+(?:\\.\\d+)*\\.?|\\b\\d+\\.)\\s+[A-Za-z]|$)', text)

structure = {}
current_cat = None
current_tab = None

for num, name in items:
    name = re.sub(r'\s+', ' ', name).strip()
    name = name.replace('\u2019', "'").replace('\u2018', "'").replace('\ufffd', "'")

    dots = num.count('.')
    if num.endswith('.'): dots -= 1
    
    if dots == 0:
        current_cat = {'name': name, 'tabs': []}
        structure[num.replace('.','')] = current_cat
    elif dots == 1 and current_cat:
        current_tab = {'name': name, 'topics': []}
        current_cat['tabs'].append(current_tab)
    elif dots >= 2 and current_tab:
        current_tab['topics'].append(name)

with open('C:/Users/Mark Lorenz/Desktop/LibraryWebsite/to-review/parsed_structure.json', 'w', encoding='utf-8') as f:
    json.dump(structure, f, indent=2)

print("Parsed categories:", len(structure))
