import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I will find the boundaries of page-02, page-03, page-04.
# Because I know exactly what they start with.
# Let's cleanly split the text by <div class="page" id="page-XX">
# Wait, let's use the exact string split to be 100% precise.
parts = re.split(r'(<div class="page" id="page-\d{2}">)', text)

# parts will be:
# parts[0]: up to end of page-01 (including its closing </div> and \n)
# parts[1]: '<div class="page" id="page-02">'
# parts[2]: content of page-02 ending just before page-03
# parts[3]: '<div class="page" id="page-03">'
# parts[4]: content of page-03
# parts[5]: '<div class="page" id="page-04">'
# parts[6]: content of page-04
# parts[7]: '<div class="page" id="page-05">'
# parts[8]: content of page-05... and so on

# Let's verify lengths
if parts[1] != '<div class="page" id="page-02">':
    print("Error finding page 2")
if parts[3] != '<div class="page" id="page-03">':
    print("Error finding page 3")
if parts[5] != '<div class="page" id="page-04">':
    print("Error finding page 4")

# P2 content: parts[2] -> Cromatisme
# P3 content: parts[4] -> Estil Ibañez
# P4 content: parts[6] -> Més que una app

# the new order:
# P2 becomes P4 content
# P3 becomes P2 content
# P4 becomes P3 content

new_parts = list(parts)

p2_content = parts[2]
p3_content = parts[4]
p4_content = parts[6]

# Add H1 to p2_content (which becomes page 3)
h1_insertion = '\n    <h1 style="margin-bottom: 20px;">Fonaments Visuals: Cromatisme i Construcció</h1>\n'
# Insert this right after the doc-header
# doc-header ends with </div>\n
doc_header_end_idx = p2_content.find('</div>', p2_content.find('doc-header')) + 6
if doc_header_end_idx != 5: # found
    p2_content = p2_content[:doc_header_end_idx] + h1_insertion + p2_content[doc_header_end_idx:]


new_parts[2] = p4_content
new_parts[4] = p2_content
new_parts[6] = p3_content

# Now we need to update the pagination footers specifically in these three blocks.
# The footer has text like `PÀG. 02 / 22`
# For new page 2 (parts[2]): REPLACE `PÀG. (\d{2})` with `PÀG. 02`
def fix_footer(idx, target_page_str):
    content = new_parts[idx]
    content = re.sub(r'PÀG\. \d{2} /', f'PÀG. {target_page_str} /', content)
    new_parts[idx] = content

fix_footer(2, '02')
fix_footer(4, '03')
fix_footer(6, '04')

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(''.join(new_parts))
    
print("Reordered successfully!")
