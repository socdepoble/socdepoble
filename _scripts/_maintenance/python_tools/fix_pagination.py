import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Split by the class="page" tag, being careful that some are class="page doc-ds" etc.
# Actually, let's use a regex to find all start tags of pages.
parts = re.split(r'(<div class="page"[^>]*>)', text)

# The parts list will alternate between text and <div class="page"...>
out_parts = []
out_parts.append(parts[0])

page_index = 1
total_pages = 22 # we know the target is 22

for i in range(1, len(parts), 2):
    page_tag = parts[i]
    page_content = parts[i+1]
    
    # 1. Ensure the id is page-XX
    # remove existing id
    page_tag = re.sub(r'\s*id="page-\d{2}"', '', page_tag)
    # insert new id before the closing angle bracket
    page_tag_clean = page_tag[:-1] + f' id="page-{page_index:02d}">'
    
    # 2. Fix the pagination in the doc-footer/page-num
    # find `<div class="page-num"...>PÀGINA XX DE YY`
    # We can just run a regex on page_content
    # wait, the page-num class string might be like `<div class="page-num">PÀGINA 18 DE 22 | ...`
    # replace 'PÀGINA \d+ DE \d+' with 'PÀGINA XX DE 22'
    page_content = re.sub(r'PÀGINA \d+ DE \d+', f'PÀGINA {page_index:02d} DE {total_pages}', page_content)
    # some might just say `PÀG. 02 / 22`
    page_content = re.sub(r'PÀG\. \d{2} / \d{2}', f'PÀG. {page_index:02d} / {total_pages}', page_content)
    
    out_parts.append(page_tag_clean)
    out_parts.append(page_content)
    
    page_index += 1

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write("".join(out_parts))
    
print(f"Pagination fixed. Total pages: {page_index-1}")
