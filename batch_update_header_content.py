import os
import re

TARGET_PATTERN = r'\.header-content\s*\{\s*background:\s*#1e3a8a;\s*border-radius:\s*0;\s*box-shadow:\s*none;\s*padding:\s*0;\s*margin:\s*8px;\s*max-width:\s*none;\s*border:\s*1\.5px\s*solid\s*#e8e9ea;\s*position:\s*relative;\s*\}'

# The replacement should maintain the centering if it's the white design
REPLACEMENT = """        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #FFFFFF;
            border-radius: 0;
            box-shadow: none;
            padding: 10px 20px;
            margin: 0 auto;
            max-width: 1200px;
            border: 0px solid #e8e9ea;
            position: relative;
        }"""

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = re.sub(TARGET_PATTERN, REPLACEMENT, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def walk_and_update(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.html', '.css')):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    # Update both the root and public directory
    walk_and_update('.')
