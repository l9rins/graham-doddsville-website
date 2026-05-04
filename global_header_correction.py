import os
import re

# Precise pattern to find the blue block (either on .header or .header-content)
PATTERN = r'(\.header|\.header-content)\s*\{\s*background:\s*#1e3a8a;\s*border-radius:\s*0;\s*box-shadow:\s*none;\s*padding:\s*0;\s*margin:\s*8px;.*?border:\s*1\.5px\s*solid\s*#e8e9ea;\s*position:\s*relative;\s*\}'

# The goal is to replace it with the standard white design
WHITE_HEADER_CSS = """        .header {
            background: #ffffff;
            border-bottom: 2px solid #d4af37;
            padding: 12px 0;
            transition: all 0.3s ease;
            overflow: visible;
        }

        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
        }"""

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the entire block (header and header-content combined into standard white)
        new_content = re.sub(PATTERN, WHITE_HEADER_CSS, content, flags=re.DOTALL)
        
        # Also clean up if it left a redundant .header or .header-content nearby
        # (This is just a safety measure for files that might have both separated)
        
        if new_content != content:
            # Fix logo if needed
            new_content = new_content.replace('G&D Logo (for black background).png', 'G&D Logo.png')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed blue design in: {file_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                process_file(os.path.join(root, file))
