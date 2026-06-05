import glob

files = glob.glob('**/*.html', recursive=True)

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        if 'sidebar-economics.html' in content:
            content = content.replace('sidebar-economics.html', 'economics.html')
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed {f}")
    except Exception as e:
        print(f"Failed {f}: {e}")
