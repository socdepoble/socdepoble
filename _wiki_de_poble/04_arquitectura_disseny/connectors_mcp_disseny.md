# 04. Connectors MCP de Disseny (Arquitectura PWA i Visual)

Aquest document estableix la paret mestra per a la connexió bidireccional entre la **IAIA MarIA** (via MCP) i tot l'ecosistema d'entorns de disseny gràfic. L'objectiu d'aquest document unificat és evitar la duplicitat d'esforços i establir regles clares de com ens comuniquem visualment en el paradigma de la *Pedra Seca*.

---

## 1. Affinity (El Motor Vectorial i de Render)

Com que nosaltres treballem offline-first, l'ús d'Affinity es converteix en el nostre motor de renderitzat i manipulació vectorial per a dissenyar els elements de la PWA rural (iconografia, assets pesats).

### L'UUID com a Clau de Pas
Tot document obert a Affinity té un identificador únic de sessió (`document_session_uuid`). 
- **Regla d'Or Innegociable:** Abans de demanar cap renderitzat o modificació, és obligatori executar un script preliminar per a extraure l'UUID del document actiu (ex: `app.documents[0].uuid`). Sense aquesta clau mestra, la porta està tancada.

### Catàleg d'Eines Estandarditzades (Affinity)
1. **Motor de Renderitzat Visual (Els Ulls)**
   - `Affinity:render_spread`: Captura d'un plec sencer.
   - `Affinity:render_selection`: Captura únicament l'element seleccionat.
2. **Execució de Codi (Les Mans)**
   - `Affinity:execute_script`: Permet injectar JavaScript pur per manipular capes i colors.
3. **Sistema Nerviós i Memòria (La Biblioteca de Scripts)**
   - `Affinity:list_library_scripts` / `read_library_script`: Recupera codi guardat.
   - `Affinity:save_script_to_library`: Guarda procediments automatitzats.
4. **Intel·ligència Col·lectiva**
   - `Affinity:search_sdk_hints` / `add_sdk_hint`: Registre d'automillora visual.

---

## 2. StitchMCP (El Sistema de Disseny i UI)

Mentre que Affinity és la nostra eina de base vectorial, **Stitch** actua com el nostre pont estructural per a l'arquitectura de pantalles (UI/UX) de la PWA i la generació de sistemes de disseny automàtics.

### Flux de Treball (Stitch)
- **Sistemes de Disseny:** Usarem eines com `create_design_system` o `apply_design_system` per propagar els colors (tokens) i tipografies per tot el projecte.
- **Prototipatge de Pantalles:** A través de `generate_screen_from_text`, Stitch ens permetrà alçar pantalles o ginys HTML abans de picar codi en profunditat.
- **Auditoria de l'Estat:** El Mestre pot llistar i recuperar dissenys directament usant `list_screens` i `get_screen`.

---

## 3. Figma (El Llenç de Col·laboració i Interfície)

*(Reservat per a connexió)*. Si el projecte ho requereix, ací s'unificaran les capacitats d'exportació de components de Figma per assegurar que tant Affinity com Figma es regeixen pels mateixos tokens CSS globals sense duplicar el codi de la *Pedra Seca*.

---
