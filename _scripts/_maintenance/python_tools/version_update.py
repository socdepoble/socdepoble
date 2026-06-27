import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

creation_date = "18 ABR 2026 05:47"
revision_date = "18 ABR 2026 07:44 (+2)"

version_html = f"""
      <div class="v-control" style="display: flex; flex-direction: column; align-items: flex-end; font-size: 6.5pt; font-family: monospace; color: var(--sosp-gray); text-transform: uppercase; line-height: 1.2; margin-left: auto; text-align: right;">
        <span>CREA: {creation_date}</span>
        <span>REV: {revision_date}</span>
      </div>"""

# Find <div class="meta">...</div> and append version_html
# The regex looks for <div class="meta"> followed by any characters until the closing </div>
# using non-greedy match.
html = re.sub(r'(<div class="meta">.*?</div>)', r'\1' + version_html, html, flags=re.DOTALL)

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated HTML with version control metadata!")
