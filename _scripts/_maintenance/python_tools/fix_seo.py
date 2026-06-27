import re

with open('./index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract the kill-switch script
kill_switch_match = re.search(r'(<!-- 🚨 EMERGENCY PWA KILL-SWITCH.*?</script>)', html, re.DOTALL)
if not kill_switch_match:
    print("Kill switch not found")
    exit(1)
kill_switch_script = kill_switch_match.group(1)

# Extract SEO metas
seo_match = re.search(r'(<meta charset="UTF-8" />.*?<meta\s+name="twitter:image"[^>]*>)', html, re.DOTALL)
if not seo_match:
    print("SEO tags not found")
    exit(1)
seo_metas = seo_match.group(1)

# Remove both from HTML
html_cleaned = html.replace(kill_switch_script, '').replace(seo_metas, '')

# Re-insert in correct order right after <head>
replacement = f"{seo_metas}\n\n    {kill_switch_script}"
html_fixed = re.sub(r'(<head>\s*)', r'\1' + replacement.replace('\\', '\\\\') + '\n', html_cleaned, count=1)

with open('./index.html', 'w', encoding='utf-8') as f:
    f.write(html_fixed)

print("SEO fixed!")
