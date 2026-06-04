import os

function_str = """
        function toggleCollapsible(sectionId) {
            const content = document.getElementById(sectionId + '-content');
            const arrow = document.getElementById(sectionId + '-arrow');
            if (!content) return;
            
            const section = content.closest('.collapsible-section');
            const isCurrentlyOpen = content.classList.contains('expanded');
            
            // Close all other open sections
            document.querySelectorAll('.collapsible-content').forEach(c => {
                if (c.id !== sectionId + '-content' && (c.classList.contains('expanded') || c.style.maxHeight)) {
                    c.style.maxHeight = null;
                    c.classList.remove('expanded');
                    c.classList.add('collapsed');
                    const s = c.closest('.collapsible-section');
                    if (s) s.classList.remove('active');
                    const a = document.getElementById(c.id.replace('-content', '-arrow'));
                    if (a) a.innerHTML = '▼';
                }
            });

            if (!isCurrentlyOpen) {
                content.classList.add('expanded');
                content.classList.remove('collapsed');
                if(sectionId === 'events-seminars') {
                    content.style.maxHeight = 'none';
                } else {
                    const height = content.scrollHeight;
                    content.style.maxHeight = height + "px";
                }
                if (section) section.classList.add('active');
                if (arrow) arrow.innerHTML = '▲';
            } else {
                content.style.maxHeight = null;
                content.classList.remove('expanded');
                content.classList.add('collapsed');
                if (section) section.classList.remove('active');
                if (arrow) arrow.innerHTML = '▼';
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
                
                if 'function toggleCollapsible' not in content:
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
