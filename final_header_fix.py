import os
import re

# Regex to find the blue header-content block exactly as the user provided
TARGET_PATTERN = r'\.header-content\s*\{\s*background:\s*#1e3a8a;\s*border-radius:\s*0;\s*box-shadow:\s*none;\s*padding:\s*0;\s*margin:\s*8px;.*?border:\s*1\.5px\s*solid\s*#e8e9ea;\s*position:\s*relative;\s*\}'

# Standardized White Header-Content Style
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
        
        # Also handle variants with comments
        pattern = re.compile(TARGET_PATTERN, re.DOTALL)
        new_content = pattern.sub(REPLACEMENT, content)
        
        if new_content != content:
            # Also fix the logo path if it's blue-logo variant
            new_content = new_content.replace('G&D Logo (for black background).png', 'G&D Logo.png')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed blue header-content in: {file_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                process_file(os.path.join(root, file))
