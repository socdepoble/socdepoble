import re

def main():
    file_path = "Manual_Identitat_Extens.html"
    with open(file_path, "r") as f:
        content = f.read()

    # Split the document exactly into preamble, pages, and postamble
    # Finding where pages start
    start_pages_marker = "<body>"
    end_pages_marker = "</body>"
    
    preamble_idx = content.find(start_pages_marker) + len(start_pages_marker)
    postamble_idx = content.rfind(end_pages_marker)
    
    preamble = content[:preamble_idx]
    postamble = content[postamble_idx:]
    body_content = content[preamble_idx:postamble_idx]

    # Split body into individual pages. Each page starts with <div class="page"
    page_splits = body_content.split('<div class="page"')
    
    pages = []
    # page_splits[0] is random whitespace/comments before the first page
    before_pages = page_splits[0]
    
    for p in page_splits[1:]:
        pages.append('<div class="page"' + p)
        
    # Now `pages` contains all the page HTML blocks.
    # Currently we have pages with mixed contents.
    
    # 1. Replace the very FIRST page (which is the old minimalist cover) with the New Comic Cover
    cover_html = """<div class="page" id="page-01" style="padding: 0; background-color: var(--sosp-black);">
    <div style="position: relative; width: 100%; height: 100%;">
      <img src="./public/assets/infographics/cover_nano_comic.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Portada Nano">
      <div style="position: absolute; top: 8%; left: 0; width: 100%; text-align: center; padding: 0 40px; transform: rotate(-1deg);">
         <div style="font-family: 'Noto Sans', sans-serif; font-weight: 900; font-size: 38pt; color: #E52B1E; -webkit-text-stroke: 2px black; text-shadow: 4px 4px 0px #000; line-height: 1.1; margin-bottom: 5px; text-transform:uppercase;">Sóc de Poble</div>
         <div style="font-family: 'Noto Sans', sans-serif; font-weight: 900; font-size: 22pt; color: white; -webkit-text-stroke: 1.5px black; text-shadow: 3px 3px 0px #000; letter-spacing: -0.5px;">MANUAL D'IDENTITAT</div>
      </div>
    </div>
  </div>"""
    
    # Check if there is an empty page inserted by my previous broken script `<div class="a4-container">` which I injected inside the body.
    # Let's just remove the first page which was page-00 and replace it.
    # Also I injected another broken cover if you remember! Let's just filter out broken ones.
    
    valid_pages = []
    for p in pages:
        if 'id="page-00"' in p:
            continue # Remove old cover
        if 'cover_nano_comic' in p:
            continue # Remove broken injected cover
        valid_pages.append(p)

    # valid_pages now has the synthesis page as index 0.
    # Let's create the Bruguera Page
    
    bruguera_html = """<div class="page" id="page-TEMP">
    <div class="doc-header">
      <img src="./docs/Identitat/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble Logo">
      <div class="meta">
        <span>Sistema Operatiu Rural</span>
        <span>LLENGUATGE VISUAL I HUMOR</span>
      </div>
    </div>

    <h2>Estil Ibàñez i L'Ànima de Bruguera</h2>
    <p>La comunicació gràfica de Sóc de Poble transcendeix el simple elitisme modernista; empra l'autèntica onomatopeia ibèrica. S'inspira profundament en l'esperit de la <strong>Editorial Bruguera</strong> i els traços mestres de <strong>Francisco Ibáñez</strong> (l'ADN de <i>Mortadelo y Filemón</i>). Aquest és el nostre vehicle universal.</p>
    
    <div class="grid-2" style="margin-top:20px;">
      <div class="card" style="box-shadow: none;">
        <h3 style="font-size:12pt;">Humor Àcid, Crític i Valencià</h3>
        <p style="font-size:9.5pt;">Necessitem retratar l'esperit d'un poble, on res és tan sagrat com la sàtira al bar a l'hora de l'esmorzar. Les línies cinètiques, les onomatopeies explosives (¡ZAS!, ¡CHOF!) i el dinamisme estripat reflecteixen la complexitat tecnològica de la "Rhizome DB" convertint-la en una anècdota còmica i accessible per al llaurador i el jove.</p>
        <p style="font-size:9.5pt; font-weight:700;">Tot es pot digerir amb l'humor mordaç del Nano.</p>
      </div>
      
      <div style="width: 100%; height: 260px; border-radius: var(--gem-radius); overflow: hidden; border: 4px solid var(--sosp-black);">
        <img src="./public/assets/infographics/cover_nano_comic.png" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;" alt="Exemple Estil Bruguera">
      </div>
    </div>

    <div class="card" style="margin-top: 15px;">
      <h3 style="font-size:10pt;">Regles de la Il·lustració Narrativa</h3>
      <ul style="font-size:9pt; color:#444; margin-bottom:0;">
        <li><strong style="color:var(--sosp-orange);">Dinamisme Físic:</strong> Les escenes han de mostrar desordre harmònic (p. ex., tecnologia volant, galls i caixes desordenant el camp).</li>
        <li><strong style="color:var(--sosp-orange);">Línia Clara:</strong> Tintes negres dures, colors plans radiants o lleugerament ombrejats, i sense degradats fotorealistes que empastifen l'art.</li>
        <li><strong style="color:var(--sosp-orange);">Absurdisme Quotidià:</strong> La tecnologia (un Apple Watch, un dron d'agricultura) empeltada en indumentària d'etnografia valenciana per maximitzar l'efecte del <i>Trellat</i> irreverent.</li>
      </ul>
    </div>

    <div class="doc-footer">
      <div>LLENGUATGE VISUAL</div>
      <div>BRUGUERA I SÀTIRA IBÈRICA</div>
    </div>
    <div class="page-num">PÀGINA TEMP</div>
  </div>"""

    # Assemble the final page set:
    # [0] Cover
    # [1] Synthesis (valid_pages[0])
    # [2] Bruguera Page (new)
    # [3...] Rest of the pages
    final_pages = [cover_html, valid_pages[0], bruguera_html] + valid_pages[1:]
    
    total_pages = len(final_pages)
    
    # Now process each page to ensure ID & Footer are correct
    for i in range(total_pages):
        page = final_pages[i]
        
        # Replace ID
        # Finding current id="page-..."
        page = re.sub(r'id="page-[0-9A-Z]+"', f'id="page-{i+1:02d}"', page)
        
        # Replace Footer PÀGINA ... DE ... 
        # But wait, cover page has no footer, or its hidden. Actually cover_html has NO page-num div.
        
        # Safely replace matching "PÀGINA XX DE YY"
        # Since earlier scripts might have left strange strings, just use regex to replace `<div class="page-num".*?</div>` contents 
        # Actually simplest:
        page = re.sub(r'PÀGINA \d+ DE \d+', f'PÀGINA {i+1:02d} DE {total_pages:02d}', page)
        page = re.sub(r'PÀGINA TEMP', f'PÀGINA {i+1:02d} DE {total_pages:02d} | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a>', page)
        
        final_pages[i] = page

    # Also we must fix the specific anchor on the UX Mercat Card (which should now point to UX Prototype Article)
    # Let's find UX Prototype Article. It has title "Component Pàgina (Article Complet)"
    target_page_idx = -1
    for i, p in enumerate(final_pages):
        if "Component Pàgina (Article Complet)" in p:
            target_page_idx = i + 1
            break
            
    if target_page_idx != -1:
        # Loop through pages to find the card in UX Mercat (which has "ux-card-mercat") and point to target_page_idx
        for i in range(total_pages):
            if "ux-card-mercat" in final_pages[i] and "CARD PROTOTYPE" in final_pages[i]:
                # replace href="#page-XX" with href="#page-{target_page_idx:02d}"
                final_pages[i] = re.sub(r'href="#page-\d+"', f'href="#page-{target_page_idx:02d}"', final_pages[i])

    # Join and write
    new_html = preamble + before_pages + "\n".join(final_pages) + postamble

    with open(file_path, "w") as f:
        f.write(new_html)

if __name__ == "__main__":
    main()
