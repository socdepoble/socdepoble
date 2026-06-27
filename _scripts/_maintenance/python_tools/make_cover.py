import re

def main():
    file_path = "Manual_Identitat_Extens.html"
    with open(file_path, "r") as f:
        content = f.read()

    # 1. Update total pages
    content = content.replace("DE 17", "DE 18")
    
    # 2. Shift IDs and "PÀGINA X" texts starting from highest to lowest
    for i in range(17, 0, -1):
        old_id = f'id="page-{i:02d}"'
        new_id = f'id="page-{i+1:02d}"'
        content = content.replace(old_id, new_id)
        
        old_text = f'PÀGINA {i:02d} DE'
        new_text = f'PÀGINA {i+1:02d} DE'
        content = content.replace(old_text, new_text)

    # 3. Create NEW Page 01 Content
    page_01_html = """  <div class="page" id="page-01" style="padding: 0; background-color: var(--sosp-black);">
    <div style="position: relative; width: 100%; height: 100%;">
      <img src="./public/assets/infographics/cover_nano_comic.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Portada Nano">
      
      <div style="position: absolute; top: 7%; left: 0; width: 100%; text-align: center; padding: 0 40px; transform: rotate(-1deg);">
         <div style="font-family: 'Noto Sans', sans-serif; font-weight: 900; font-size: 44pt; color: #E52B1E; -webkit-text-stroke: 2px black; text-shadow: 4px 4px 0px #000; letter-spacing: -1px; line-height: 1.1; margin-bottom: 5px; text-transform:uppercase;">Sóc de Poble</div>
         <div style="font-family: 'Noto Sans', sans-serif; font-weight: 900; font-size: 26pt; color: white; -webkit-text-stroke: 1.5px black; text-shadow: 3px 3px 0px #000; letter-spacing: -0.5px;">MANUAL D'IDENTITAT</div>
         <div style="font-family: 'Noto Sans', sans-serif; font-weight: 800; font-size: 16pt; color: var(--sosp-black); margin-top: 8px; text-transform: uppercase;">Àtom Modular ISO 1.4.1</div>
      </div>
    </div>
  </div>
"""

    # Inject Page 01 right after `<div class="a4-container">`
    content = content.replace('<div class="a4-container">', '<div class="a4-container">\n' + page_01_html)

    with open(file_path, "w") as f:
        f.write(content)

if __name__ == "__main__":
    main()
