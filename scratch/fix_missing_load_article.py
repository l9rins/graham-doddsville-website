import glob

files_to_fix = [
    'economics.html',
    'financial-products.html',
    'financial-statement-analysis.html',
    'professional-advisers.html',
    'resources.html'
]

new_script = open('scratch/si_full_script_top.txt', encoding='utf-8').read()

for f in files_to_fix:
    html = open(f, encoding='utf-8', errors='ignore').read()
    idx = html.find('<script>')
    end = html.find('const articleContent = {')
    if idx != -1 and end != -1:
        html = html[:idx] + new_script + html[end:]
        with open(f, 'w', encoding='utf-8') as out:
            out.write(html)
        print(f"Fixed {f}")
    else:
        print(f"Could not fix {f}")

