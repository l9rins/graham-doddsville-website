import os
import re

def repair_mangled_plus(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                if 'node_modules' in root or '.git' in root:
                    continue
                    
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # 1. Fix ++ operator
                    content = content.replace('←←', '++')
                    
                    # 2. Fix + in JavaScript blocks
                    # We look for scripts and replace ← with +
                    def fix_script(match):
                        script_content = match.group(0)
                        return script_content.replace('←', '+')
                    
                    content = re.sub(r'<script.*?>.*?</script>', fix_script, content, flags=re.DOTALL)
                    
                    # 3. Fix + in URLs (often found in feed URLs)
                    # e.g. search?q=ASX←200
                    def fix_urls(match):
                        url_attr = match.group(0)
                        return url_attr.replace('←', '+')
                    
                    content = re.sub(r'href="[^"]*←[^"]*"', fix_urls, content)
                    content = re.sub(r'src="[^"]*←[^"]*"', fix_urls, content)
                    content = re.sub(r"url\('[^']*←[^']*'\)", fix_urls, content)

                    # 4. Check for any remaining suspicious ←
                    # If it's not preceded by a tag and followed by a space + uppercase, it's likely mangled
                    # But the script fix and URL fix should cover 99% of regressions.
                    
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Repaired mangled + in {file_path}")
                except Exception as e:
                    print(f"Error in {file_path}: {e}")

if __name__ == "__main__":
    repair_mangled_plus('.')
