import os
import shutil
import re

root_dir = r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite'
public_dir = os.path.join(root_dir, 'public')
html_dir = os.path.join(public_dir, 'html')
public_css_dir = os.path.join(public_dir, 'css')
public_images_dir = os.path.join(public_dir, 'images')

def migrate_books():
    print("Starting migration of book pages...")
    
    # 1. Move CSS
    src_css = os.path.join(html_dir, 'css', 'books-unified.css')
    dest_css = os.path.join(public_css_dir, 'books-unified.css')
    if os.path.exists(src_css):
        print(f"Moving CSS from {src_css} to {dest_css}")
        shutil.copy2(src_css, dest_css)
    
    # 2. Move Placeholder Image
    src_placeholder = os.path.join(html_dir, 'cover-placeholder.jpg')
    dest_placeholder = os.path.join(public_dir, 'cover-placeholder.jpg')
    if os.path.exists(src_placeholder):
        print(f"Moving placeholder from {src_placeholder} to {dest_placeholder}")
        shutil.copy2(src_placeholder, dest_placeholder)

    # 3. Process HTML files
    book_files = [f for f in os.listdir(html_dir) if f.endswith('-books.html')]
    
    for filename in book_files:
        src_path = os.path.join(html_dir, filename)
        dest_path = os.path.join(public_dir, filename)
        
        print(f"Processing {filename}...")
        
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Update logo paths
        content = content.replace('src="G&D Logo.png"', 'src="images/G&D Logo.png"')
        content = content.replace('src="G&D Logo (for black background).png"', 'src="images/G&D Logo (for black background).png"')
        
        # Write to public/
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        # 4. Remove old one from ROOT if it exists
        root_legacy_path = os.path.join(root_dir, filename)
        if os.path.exists(root_legacy_path):
            print(f"Removing legacy file from root: {root_legacy_path}")
            os.remove(root_legacy_path)
            
    print("Migration complete!")

if __name__ == "__main__":
    migrate_books()
