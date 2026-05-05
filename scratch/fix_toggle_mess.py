import os
import re

base_dir = r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite'
search_dirs = [base_dir, os.path.join(base_dir, 'public')]

TOGGLE_JS = """
        function toggleCollapsible(sectionId) {
            const content = document.getElementById(sectionId + '-content');
            const arrow = document.getElementById(sectionId + '-arrow');
            if (!content) return;
            const section = content.closest('.collapsible-section');
            
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px' && content.style.maxHeight !== 'none';
            
            // Close all other open sections
            document.querySelectorAll('.collapsible-content').forEach(c => {
                c.style.maxHeight = null;
                c.classList.remove('expanded');
                c.classList.add('collapsed');
                const s = c.closest('.collapsible-section');
                if (s) s.classList.remove('active');
                const a = document.getElementById(c.id.replace('-content', '-arrow'));
                if (a) a.innerHTML = '▼';
            });

            if (!isOpen) {
                if(sectionId === 'events-seminars') {
                    content.style.maxHeight = 'none';
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
                content.classList.add('expanded');
                content.classList.remove('collapsed');
                if (section) section.classList.add('active');
                if (arrow) arrow.innerHTML = '▲';
            }
        }
"""

# This pattern tries to catch the mess created by the previous script
# It looks for the function start and then aggressively looks for the following broken bits
BROKEN_PATTERN = re.compile(r'function toggleCollapsible\(sectionId\)\s*\{.*?-content`\);.*?\n\s*\}', re.DOTALL)

for root_dir in search_dirs:
    if not os.path.exists(root_dir): continue
    for filename in os.listdir(root_dir):
        file_path = os.path.join(root_dir, filename)
        if os.path.isdir(file_path): continue
        if not filename.endswith(".html"): continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if it has the broken pattern
        if 'toggleCollapsible' in content:
            # First, let's try to remove any existing toggleCollapsible function
            # We'll use a more aggressive approach: find the start and find the "last" } that seems to belong to it
            
            new_content = content
            
            # Simple replacement if we can find the start and a good end point
            # Most broken ones look like:
            # function toggleCollapsible(sectionId) { ... }-content`); ... }
            
            # Let's just replace everything from 'function toggleCollapsible' until the next significant block or end of script
            # Actually, let's use a very specific pattern for the mess
            mess_pattern = re.compile(r'function toggleCollapsible\(sectionId\)\s*\{.*?\}\s*\}\s*', re.DOTALL)
            # Wait, that might be too broad.
            
            # Let's try to find the start and then find the end of the script block if necessary, 
            # or just replace the whole function.
            
            # I'll use a trick: search for the start, and then find the first occurrence of 
            # "Mobile drawer functionality" or "Event listeners" or something that comes after it.
            
            if 'function toggleCollapsible' in new_content:
                parts = re.split(r'function toggleCollapsible\(sectionId\)\s*\{', new_content)
                if len(parts) > 1:
                    # We have at least one. The first part is before the function.
                    # The second part starts with the function body.
                    # We need to find where it ends.
                    
                    # Since we know the mess ends with a } followed by some other code,
                    # and our TOGGLE_JS is clean.
                    
                    # Let's look for the next function definition or major comment
                    next_part = re.split(r'(// Article panel functionality|// Mobile drawer functionality|// Event listeners|function |</script>)', parts[1], 1)
                    
                    if len(next_part) > 1:
                        # next_part[0] is the body of the broken function
                        # next_part[1] is the delimiter
                        # next_part[2] is the rest of the file
                        new_content = parts[0] + TOGGLE_JS.strip() + "\n\n        " + next_part[1] + next_part[2]
                        print(f"Fixed {os.path.relpath(file_path, base_dir)}")

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print("Done.")
