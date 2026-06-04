import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = list(re.finditer(r'const articleContent\s*=\s*\{', content))
    if len(matches) > 1:
        start_remove = matches[1].start()
        end_match = re.search(r'(?:[ \t]*//[^\n]*\n)*[ \t]*function loadArticle\(', content[start_remove:])
        if end_match:
            end_remove = start_remove + end_match.start()
            new_content = content[:start_remove] + content[end_remove:]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed duplicate articleContent from {filepath}")
        else:
            print(f"Could not find end of duplicate block in {filepath}")
    else:
        # Check if there are no matches, which means it might be completely broken.
        if len(matches) == 0:
            pass

def main():
    files = glob.glob('*.html') + glob.glob('public/*.html')
    for f in files:
        if 'scratch' in f:
            continue
        process_file(f)

if __name__ == '__main__':
    main()
