import re

with open("Manual_Identitat_Extens.html", "r") as f:
    html = f.read()

# 1. Page 01 processing
page_01_pattern = r'(<div class="page" id="page-01">.*?)(<div class="page" id="page-02">)'
m01 = re.search(page_01_pattern, html, re.DOTALL)
if m01:
    p01 = m01.group(1)
    # Hide doc-header
    p01 = p01.replace('<div class="doc-header">', '<div class="doc-header" style="opacity:0; pointer-events:none; visibility:hidden;">')
    # Hide doc-footer
    p01 = p01.replace('<div class="doc-footer">', '<div class="doc-footer" style="opacity:0; pointer-events:none; visibility:hidden;">')
    # Hide page-num
    p01 = p01.replace('<div class="page-num">', '<div class="page-num" style="opacity:0; pointer-events:none; visibility:hidden;">')
    
    html = html[:m01.start()] + p01 + html[m01.end(1):]

# 2. Page 16 processing
page_16_pattern = r'(<div class="page" id="page-16".*?>)(.*?)</body>'
m16 = re.search(page_16_pattern, html, re.DOTALL)
if m16:
    p16 = m16.group(2)
    # Hide doc-footer
    p16 = p16.replace('<div class="doc-footer" style="border-top-color:#444; border-bottom:none;">', '<div class="doc-footer" style="border-top-color:#444; border-bottom:none; opacity:0; pointer-events:none; visibility:hidden;">')
    # Hide page-num (Page 16 has a color:white inline style maybe from my previous fix, Let's use regex for page-num)
    p16 = re.sub(r'<div class="page-num"(.*?)>', r'<div class="page-num"\1 style="opacity:0; pointer-events:none; visibility:hidden;">', p16)
    
    html = html[:m16.start(2)] + p16 + html[m16.start(2)+len(p16):]

with open("Manual_Identitat_Extens.html", "w") as f:
    f.write(html)
