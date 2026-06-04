import os

function_str = """
        function toggleMobileMenu() {
            const mobileDrawer = document.getElementById('mobile-drawer');
            if (mobileDrawer) {
                if (mobileDrawer.classList.contains('open')) {
                    mobileDrawer.classList.remove('open');
                    document.body.style.overflow = '';
                } else {
                    mobileDrawer.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            }
        }
"""

def process_dir(directory):
    for root, dirs, files in os.walk(directory):
        if '.git' in root or 'node_modules' in root or 'scratch' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'function toggleMobileMenu' not in content:
                    print(f"Injecting into {filepath}")
                    # Find the last closing script tag
                    last_script_end = content.rfind('</script>')
                    if last_script_end != -1:
                        new_content = content[:last_script_end] + function_str + content[last_script_end:]
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                    else:
                        print(f"No <script> tag found in {filepath}")

process_dir('.')
