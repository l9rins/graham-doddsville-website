import os
import re
import glob

# The good toggleCollapsible script from wealth-creation.html
GOOD_SCRIPT = """        // Collapsible functionality
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
        }"""

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(filepath, 'r', encoding='utf-16le') as f:
                content = f.read()
        except:
            return

    # Regular expression to find the old toggleCollapsible function
    # It might have various forms, so we use a permissive regex
    pattern = r'[ \t]*// Collapsible functionality\s*function toggleCollapsible.*?if \(arrow\) arrow\.innerHTML = \'▲\';\r?\n\s*\}(?:\r?\n\s*else\s*\{.*?\})?\r?\n\s*\}'
    
    # Alternatively, just replace anything from "// Collapsible functionality" up to the end of the function.
    # Let's match from "function toggleCollapsible(" to the closing brace before "// Mobile drawer functionality" or the end of script.
    pattern = r'[ \t]*// Collapsible functionality\s*function toggleCollapsible\([\s\S]*?(?=[ \t]*// Mobile drawer functionality|<\/script>|[ \t]*// Dynamic article loading)'
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, GOOD_SCRIPT + "\n\n", content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filepath}")
    else:
        # Try finding just the function without the comment
        pattern2 = r'[ \t]*function toggleCollapsible\([\s\S]*?(?=[ \t]*// Mobile drawer functionality|<\/script>|[ \t]*// Dynamic article loading)'
        if re.search(pattern2, content):
            new_content = re.sub(pattern2, GOOD_SCRIPT + "\n\n", content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath} (pattern 2)")

def main():
    files = glob.glob('*.html') + glob.glob('public/*.html')
    for f in files:
        if f.endswith('index.html') or 'scratch' in f:
            pass # Index might be different, let's process it anyway if it has toggleCollapsible
        process_file(f)

if __name__ == '__main__':
    main()
