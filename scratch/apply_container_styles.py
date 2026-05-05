import os

base_dir = r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite\public\html'
files_to_update = [
    'wealth-creation.html',
    'share-investing.html',
    'investment-analysis.html',
    'professional-advisers.html',
    'financial-products.html',
    'events.html'
]

style_override = """
        /* Local Override for Container Style */
        .container {
            background-color: #ffffff !important;
            border: 0px solid !important;
            box-shadow: none !important;
        }
"""

for filename in files_to_update:
    file_path = os.path.join(base_dir, filename)
    if not os.path.exists(file_path):
        print(f"Skipping missing file: {filename}")
        continue
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Inject the style override inside the <style> block
        if '</style>' in content:
            content = content.replace('</style>', style_override + '\n    </style>')
        else:
            # Fallback: inject before </head> if no <style> block exists
            content = content.replace('</head>', f'    <style>{style_override}</style>\n</head>')
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully updated {filename}")
    except Exception as e:
        print(f"Error updating {filename}: {e}")
