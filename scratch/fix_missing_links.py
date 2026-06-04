import re

filepath = 'financial-markets.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific links
content = content.replace("loadArticle('overview-of-the-fx-market')", "loadArticle('currency-market-overview')")
content = content.replace("loadArticle('what-is-the-stock-market')", "loadArticle('stockmarket')")
content = content.replace("loadArticle('australian-securities-exchange-asx')", "loadArticle('stockmarket')")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed links in financial-markets.html")
