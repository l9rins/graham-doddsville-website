import json
import os
import re

base_dir = r'c:\Users\Mark Lorenz\Desktop\LibraryWebsite'
json_path = os.path.join(base_dir, 'scratch', 'buffett_data.json')

with open(json_path, 'r', encoding='utf-8') as f:
    buffett_data = json.load(f)

# Categorize the 63 topics
CATEGORIES = {
    "philosophy": [
        "Efficient Market Theory", "Modern Portfolio Theory", "Intrinsic Value", 
        "Wall Street and Mr. Market", "Circle of Competence", "Margin of Safety", 
        "Frictional Costs", "Value Investing", "Security Analyst", "Speculation", 
        "Long-term Investing", "Patience", "The Superinvestors of Graham-and-Doddsville",
        "Risk", "Personal Habits"
    ],
    "investing": [
        "Capital Allocation", "Performance Measurement", "Market Forecasting", 
        "Market Timing", "Diversification", "Leverage", "Junk Bonds", "Arbitrage", 
        "Derivatives", "Index Funds", "Market Crashes", "Small Caps vs. Large Caps", "Gold"
    ],
    "businesses": [
        "Insurance Companies", "The Beginning", "The Ideal Business", "Moats", 
        "Owner-Oriented Management", "Acquisitions", "Productivity", "Retailing", "Textiles"
    ],
    "governance": [
        "Berkshire Disclosure", "Audit Committee", "Executive Compensation", 
        "Stock Options", "Board of Directors", "Succession Planning", "Trust", 
        "The Institutional Imperative"
    ],
    "accounting": [
        "Segment Reporting", "Owner Earnings", "Goodwill", "Intangible Assets", 
        "Book Value", "Earnings Quality"
    ],
    "economics": [
        "Inflation", "Foreign Currencies", "Taxes", "Debt"
    ],
    "miscellaneous": [
        "Philanthropy", "Mistakes", "Dividends", "Share Repurchases"
    ]
}

def get_topics_html(category):
    topics = CATEGORIES.get(category, [])
    html = '<div class="topics-grid">\n'
    for topic in topics:
        html += f'                <a href="#" class="topic-card">\n'
        html += f'                    <span>{topic}</span>\n'
        html += f'                </a>\n'
    html += '            </div>'
    return html

# Files to update
TARGET_FILES = {
    "philosophy": ["public/philosophy.html", "public/html/philosophy.html"],
    "investing": ["public/investing.html", "public/html/investing.html"],
    "businesses": ["public/businesses.html", "public/html/businesses.html"],
    "governance": ["public/governance.html", "public/html/governance.html"],
    "accounting": ["public/accounting.html", "public/html/accounting.html"],
    "economics": ["public/economics.html", "public/html/economics.html"],
    "miscellaneous": ["public/miscellaneous.html", "public/html/miscellaneous.html"]
}

# Modal and Logic Templates
MODAL_HTML = """
    <!-- Topic Modal -->
    <div id="topicModal" class="topic-modal" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(4px);">
        <div class="topic-modal-content" style="background-color: #fefefe; margin: 8% auto; padding: 32px; border-radius: 12px; max-width: 750px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; max-height: 80vh; overflow-y: auto; position: relative;">
            <span class="topic-modal-close" style="color: #6b7280; position: absolute; right: 24px; top: 16px; font-size: 28px; font-weight: bold; cursor: pointer; transition: color 0.2s;" onclick="closeTopicModal()">&times;</span>
            <div id="topicModalBody" style="font-family: 'Inter', system-ui, sans-serif; color: #1f2937; line-height: 1.7; font-size: 15px;">
            </div>
        </div>
    </div>
"""

# Format Data for JS
js_object_lines = []
for topic, content in buffett_data.items():
    key = topic.lower().strip()
    escaped_content = content.replace('`', '\\`').replace('${', '\\${')
    paragraphs = escaped_content.split('\n\n')
    formatted_html = f'<h3 style="font-family: \'Playfair Display\', serif; color: #1e3a8a; margin-bottom: 12px; font-size: 24px;">{topic}</h3>'
    for p in paragraphs:
        if p.strip():
            if '[' in p and ']' in p and ('Buffett' in p or 'Letter' in p):
                parts = p.rsplit('[', 1)
                if len(parts) > 1:
                    text = parts[0].strip()
                    citation = '[' + parts[1].strip()
                    formatted_html += f'<p>{text}</p>'
                    formatted_html += f'<p style="font-style: italic; color: #6b7280; margin-bottom: 16px;">— {citation}</p>'
                else: formatted_html += f'<p>{p}</p>'
            else: formatted_html += f'<p>{p}</p>'
    js_object_lines.append(f'            "{key}": `{formatted_html}`')

js_object_content = "        const buffettTopicsData = {\n" + ",\n".join(js_object_lines) + "\n        };"

for cat, file_list in TARGET_FILES.items():
    new_grid = get_topics_html(cat)
    for rel_path in file_list:
        file_path = os.path.join(base_dir, rel_path)
        if not os.path.exists(file_path): continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Replace Grid
        # Look for the main container or specific sections and replace grids
        content = re.sub(r'<div class="topics-grid">.*?</div>', new_grid, content, flags=re.DOTALL)
        # Remove empty subcategory sections if they were emptied by grid replacement
        content = re.sub(r'<section class="subcategory-section">\s*<h2 class="subcategory-title">.*?</h2>\s*</section>', '', content, flags=re.DOTALL)
        
        # 2. Ensure Modal
        if 'id="topicModal"' not in content:
            content = content.replace('</body>', MODAL_HTML + '\n</body>')
            
        # 3. Update/Inject Script
        if 'const buffettTopicsData' in content:
            content = re.sub(r'const buffettTopicsData = \{.*?\};', js_object_content, content, flags=re.DOTALL)
        else:
            logic_js = f"""
    <script>
        {js_object_content}
        function openTopicModal(topicTitle) {{
            const modal = document.getElementById('topicModal');
            const modalBody = document.getElementById('topicModalBody');
            if (!modal || !modalBody) return;
            const normalizedTitle = topicTitle.trim().toLowerCase().replace(/\s+/g, ' ');
            const content = buffettTopicsData[normalizedTitle] || `
                <h3 style="font-family: 'Playfair Display', serif; color: #1e3a8a; margin-bottom: 12px; font-size: 24px;">${{topicTitle}}</h3>
                <p>Information about <strong>${{topicTitle}}</strong> from Warren Buffett's letters and essays is coming soon.</p>
            `;
            modalBody.innerHTML = content;
            modal.style.display = 'block';
        }}
        function closeTopicModal() {{
            const modal = document.getElementById('topicModal');
            if (modal) modal.style.display = 'none';
        }}
        document.addEventListener('DOMContentLoaded', () => {{
            document.querySelectorAll('.topic-card').forEach(link => {{
                link.addEventListener('click', (e) => {{
                    e.preventDefault();
                    const title = link.querySelector('span').innerText;
                    openTopicModal(title);
                }});
            }});
        }});
        window.onclick = (e) => {{ if (e.target === document.getElementById('topicModal')) closeTopicModal(); }}
    </script>
"""
            content = content.replace('</body>', logic_js + '\n</body>')
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {rel_path}")
