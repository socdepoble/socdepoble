import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will use a robust regex to find the entire <div class="doc-header"> block
# until its closing </div>.

def replacer(match):
    header_inner = match.group(1)
    
    # 1. Grab image
    img_match = re.search(r'<img[^>]+>', header_inner)
    img_str = img_match.group(0) if img_match else '<img src="./public/assets/master/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble">'
    
    # 2. Grab meta spans
    meta_spans = re.findall(r'<span>(.*?)</span>', re.search(r'<div class="meta">(.*?)</div>', header_inner, re.DOTALL).group(1)) if re.search(r'<div class="meta">(.*?)</div>', header_inner, re.DOTALL) else []
    
    # 3. Grab v-control spans
    v_spans = re.findall(r'<span>(CREA:.*?)</span>', header_inner) + re.findall(r'<span>(REV:.*?)</span>', header_inner)
    if not v_spans:
        # fallback
        v_spans = ["CREA: 18 ABR 2026 05:47", "REV: 18 ABR 2026 07:44 (+2)"]
        
    line1_left = meta_spans[0].strip() if len(meta_spans) > 0 else ""
    line2_left = meta_spans[1].strip() if len(meta_spans) > 1 else ""
    
    line1_right = v_spans[0] if len(v_spans) > 0 else ""
    line2_right = v_spans[1] if len(v_spans) > 1 else ""
    
    if line2_left:
        l1 = f"{line1_left} <span style='color:#ccc'>|</span> {line1_right}"
        l2 = f"{line2_left} <span style='color:#ccc'>|</span> {line2_right}"
    else:
        l1 = f"{line1_left} <span style='color:#ccc'>|</span> {line1_right}"
        l2 = f"{line2_right}"

    new_header = f"""  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--sosp-black); padding-bottom: 10px; margin-bottom: 10mm;">
    {img_str}
    <div class="meta-right" style="text-align: right; font-size: 7.5pt; font-weight: 700; font-family: 'Noto Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; color: #444; line-height: 1.4;">
      <span style="display:block;">{l1}</span>
      <span style="display:block;">{l2}</span>
    </div>
  </div>"""

    return new_header

# Run replacement
new_html = re.sub(r'<div class="doc-header">(.*?)</div>\s*(?=<h|<div class="row"|<div class="page-num"|<img|<style[^>]*>|<\!|-)', replacer, html, flags=re.DOTALL)

# Let's use a simpler matching: match <div class="doc-header"> to its first closing </div> that is directly a child.
# Since doc-header has no nested divs other than <div class="meta"> and <div class="v-control"> we can carefully match.

def refactor_html(html_text):
    out = []
    # split by <div class="doc-header">
    parts = html_text.split('<div class="doc-header">')
    out.append(parts[0])
    
    for part in parts[1:]:
        # find the end of the doc-header
        # we know it ends with </div> and then usually \n
        # let's assume the doc-header block ends at the first </div> that is relatively isolated or just count divs
        
        div_count = 1
        pos = 0
        while div_count > 0 and pos < len(part):
            next_div_start = part.find('<div', pos)
            next_div_end = part.find('</div>', pos)
            
            if next_div_start != -1 and next_div_start < next_div_end:
                div_count += 1
                pos = next_div_start + 4
            elif next_div_end != -1:
                div_count -= 1
                pos = next_div_end + 6
            else:
                break
                
        header_block = part[:pos-6] # exclude the final </div>
        rest = part[pos:]
        
        # parse header_block
        img_match = re.search(r'<img[^>]+>', header_block)
        img_str = img_match.group(0) if img_match else '<img src="./public/assets/master/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble">'
        
        meta_match = re.search(r'<div class="meta">(.*?)</div>', header_block, re.DOTALL)
        meta_spans = re.findall(r'<span>(.*?)</span>', meta_match.group(1)) if meta_match else []
        
        crea_match = re.search(r'<span>(CREA:.*?)</span>', header_block)
        rev_match = re.search(r'<span>(REV:.*?)</span>', header_block)
        
        c_str = crea_match.group(1) if crea_match else "CREA: 18 ABR 2026 05:47"
        r_str = rev_match.group(1) if rev_match else "REV: 18 ABR 2026 07:44 (+2)"
        
        line1_left = meta_spans[0].strip() if len(meta_spans) > 0 else ""
        line2_left = meta_spans[1].strip() if len(meta_spans) > 1 else ""
        
        if line2_left:
            l1 = f"{line1_left} <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> {c_str}"
            l2 = f"{line2_left} <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> {r_str}"
        else:
            l1 = f"{line1_left} <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> {c_str}"
            l2 = f"{r_str}"
            
        new_header = f"""<div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--sosp-black); padding-bottom: 10px; margin-bottom: 10mm;">
      {img_str}
      <div class="meta-right" style="text-align: right; font-size: 7.5pt; font-weight: 700; font-family: 'Noto Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; color: #444; line-height: 1.5;">
        <span style="display:block;">{l1}</span>
        <span style="display:block;">{l2}</span>
      </div>
    </div>"""
        
        out.append(new_header + rest)
        
    return "".join(out)

new_html_content = refactor_html(html)

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(new_html_content)

print("Headers refactored.")
