import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find all <div class="meta">...</div>
metas = re.findall(r'<div class="meta">(.*?)</div>', html, re.DOTALL)
for i, m in enumerate(metas):
    print(f"Meta {i}: {m.strip()[:100]}")
