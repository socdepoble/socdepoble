import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to add footers to page-19, page-20, page-21
def add_footer_to_page(page_id, f1, f2):
    global text
    p_start = text.find(f'<div class="page" id="{page_id}">')
    if p_start == -1: return
    p_end = text.find('</div>', text.find('<div class="page"', p_start + 1)) if text.find('<div class="page"', p_start + 1) != -1 else text.rfind('</div>')
    
    content = text[p_start:p_end]
    
    # check if footer already exists
    if '<div class="doc-footer">' not in content:
        footer_html = f"""
    <div class="doc-footer">
      <div>{f1}</div>
      <div>{f2}</div>
    </div>
    <div class="page-num">PÀGINA 00 DE 22 | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a></div>
"""
        # insert before the last </div> of this page
        # wait, how to find the end of this page correctly?
        # a better way: replace the last </div> with footer + </div>? No, if we just split by page, the content doesn't include the final </div> of the page.
        # let's just append it to the content.
        pass

# The regex approach from earlier is much safer:
parts = re.split(r'(<div class="page"[^>]*>)', text)
for i in range(1, len(parts), 2):
    page_tag = parts[i]
    # we want to modify page-19, 20, 21
    if 'page-19' in page_tag or 'page-20' in page_tag or 'page-21' in page_tag:
        if '<div class="doc-footer">' not in parts[i+1]:
            # parts[i+1] ends with just \n\n, it doesn't include the closing </div> of the page?
            # actually our split splits on the NEXT page tag. So parts[i+1] contains the closing </div> of THIS page.
            # let's replace the LAST </div> with our footer + </div>
            last_div = parts[i+1].rfind('</div>')
            if last_div != -1:
                title = ""
                if 'page-19' in page_tag: title = "SISTEMA DE DISSENY: FASE 1"
                if 'page-20' in page_tag: title = "SISTEMA DE DISSENY: FASE 2"
                if 'page-21' in page_tag: title = "SISTEMA DE DISSENY: FASE 3"
                
                footer_html = f"""
    <div class="doc-footer">
      <div>{title}</div>
      <div>CLASSIFICACIÓ I MÒDULS</div>
    </div>
    <div class="page-num">PÀGINA 00 DE 22 | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a></div>
  </div>"""
                parts[i+1] = parts[i+1][:last_div] + footer_html + parts[i+1][last_div+6:]

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write("".join(parts))

print("Footers added")
