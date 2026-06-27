import re

with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# First get all pages
pages = re.split(r'(<div class="page"[^>]*>)', html)

# We have pairs: non-page content, then page tag.
# Let's cleanly find all '<div class="page"' tags.
# Better approach:
# Loop through the DOM using simple string matching.
out = ""
page_idx = 1

parts = html.split('<div class="page"')
out += parts[0]

# Total regular pages (excluding the ones that are styled differently maybe)
# We will just sequentially number them 1 to len(parts)-1
total_pages = len(parts) - 1

for i in range(1, len(parts)):
    part = parts[i]
    
    # We remove the old id if it exists at the start of part
    part = re.sub(r'^ id="[^"]+"', '', part)
    part = re.sub(r'^>', '', part)
    # also it could be  id="..." > or > directly
    
    # Let's insert the new ID
    out += f'<div class="page" id="page-{page_idx}">'
    
    # Now we need to fix the page footers inside 'part'
    # Find '<div class="page-num">...</div>'
    
    # Actually, for the master page, we don't want "Pàgina 19 de 51" overlaying the layout
    # if it has "style=\"opacity:0;\"", we keep it.
    
    new_footer = f'PÀGINA {page_idx} DE {total_pages} | SOCDEPOBLE.ORG'
    
    # We replace <div class="page-num">...</div>
    part = re.sub(r'(<div class="page-num"[^>]*>)[^<]*(</div>)', r'\g<1>' + new_footer + r'\g<2>', part)
    
    out += part
    page_idx += 1

with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(out)

print(f"Reindexed {total_pages} pages successfully.")
