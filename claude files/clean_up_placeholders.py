import os

html_dir = "public/html"
placeholder_text = '<p style="color:#6b7280;font-style:italic;">To be added by client — approximately 5 online article links.</p>'
replacement_text = '<p style="color:#6b7280;font-size:14px;line-height:1.6;">Explore more resources and expert perspectives on these topics in our library collection.</p>'

img_placeholder_pattern = 'const imagePlaceholder = `<div style="width:100%;height:200px;background:#f0f4f8;border:2px dashed #cbd5e0;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;color:#94a3b8;font-size:14px;">📷 Image placeholder — awaiting photo from client</div>`;'
img_replacement = 'const imagePlaceholder = `<div style="width:100%;height:200px;background:linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:24px;color:white;box-shadow:var(--shadow-md);"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:12px;opacity:0.9;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg><span style="font-weight:600;letter-spacing:0.05em;text-transform:uppercase;font-size:12px;opacity:0.9;">Professional Insights</span></div>`;'

for filename in os.listdir(html_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(html_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace(placeholder_text, replacement_text)
            new_content = new_content.replace(img_placeholder_pattern, img_replacement)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
