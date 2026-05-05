import json
import re

# Load the scraped data
with open(r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite\scratch\buffett_data.json', 'r', encoding='utf-8') as f:
    buffett_data = json.load(f)

# Format the data into the JS object structure
js_object_lines = []
for topic, content in buffett_data.items():
    key = topic.lower().replace('and', 'and').strip()
    escaped_content = content.replace('`', '\\`').replace('${', '\\${')
    
    paragraphs = escaped_content.split('\n\n')
    formatted_html = f'<h3 style="font-family: \'Playfair Display\', serif; color: #1e3a8a; margin-bottom: 12px; font-size: 24px;">{topic}</h3>'
    for p in paragraphs:
        if p.strip():
            if '[' in p and ']' in p and ('Buffett' in p or 'Letter' in p):
                parts = p.rsplit('[', 1)
                if len(parts) > 1:
                    text = parts[0].strip()
                    citation = '[' + parts[1].strip()
                    formatted_html += f'<p>{text}</p>'
                    formatted_html += f'<p style="font-style: italic; color: #6b7280; margin-bottom: 16px;">— {citation}</p>'
                else:
                    formatted_html += f'<p>{p}</p>'
            else:
                formatted_html += f'<p>{p}</p>'
    
    js_object_lines.append(f'            "{key}": `{formatted_html}`')

js_object_content = "        const buffettTopicsData = {\n" + ",\n".join(js_object_lines) + "\n        };"

# Target files (Absolute Paths)
files_to_update = [
    r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite\index.html',
    r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite\public\html\index.html',
    r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite\public\philosophy.html',
    r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite\public\html\philosophy.html'
]

for file_path in files_to_update:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        pattern = r'const buffettTopicsData = \{.*?\};'
        new_content = re.sub(pattern, js_object_content, content, flags=re.DOTALL)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
