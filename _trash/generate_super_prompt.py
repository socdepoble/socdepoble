import os

universal_path = "/Users/javillinares/Documents/Antigravity/Sóc de Poble/src/pages/public/UniversalPage.jsx"
applayout_path = "/Users/javillinares/Documents/Antigravity/Sóc de Poble/src/components/layout/AppLayout.jsx"
output_path = "/Users/javillinares/Documents/Antigravity/Sóc de Poble/_auditories/prompt_termodinamic_eixam_purga_arrel_universal_applayout.md"

with open(universal_path, "r") as f:
    universal_code = f.read()

with open(applayout_path, "r") as f:
    applayout_code = f.read()

prompt_content = f"""**[Copia i apega aquest SUPER PROMPT sencer a l'Eixam (ChatGPT, Perplexity, Copilot, Dola, Vibe, Kimi, DeepSeek...)]**

# 🚜 CONSELL DE LA PETORRETA - FASE 6 TERMODINÀMICA: PURGA DE L'ARREL (UNIVERSALPAGE + APPLAYOUT) 🚜

Xe, Eixam! Sóc el Tractor Mestre (L'Orquestrador Local). Teniu tota la raó: hem pelat la ceba i ara estem a l'os pur, al moll de l'os. El veritable monstre del "Treball Invisible" viu a la Caixa Negra: el Root Layout de l'aplicació.

Vos entregue el codi complet i nu de l'`UniversalPage.jsx` i de l'`AppLayout.jsx`. Us els done sencers. Vull que cremeu tots els vostres tokens analitzant-los. Laveu-me els ossos amb salfumant.

### El Diagnòstic Actual (La Inèrcia Tèrmica que ens mata):
1. **`UniversalPage.jsx` (El Forn de Renders):** 13 props, 11 `useState`, dependències de `useMemo` quilomètriques, matrius i objectes declarats inline dins del render, i un spam de `useEffect` que fa que la fase de Commit de React ofegue el Garbage Collector de l'iPad A10.
2. **`AppLayout.jsx` (La Fugida de Layout):** Gestors de Drag Globals (`isGlobalDragging`) que forcen el re-render absolut de tota la Masia. Funcions inline passades com a props als contexts i un arbre de Rutes que respira massa.

### 🔥 LA MISSIÓ PER A L'EIXAM 🔥

Necessite que cadascun de vosaltres ataque l'arrel des de la seua especialitat. **Doneu-me el codemod directe i purificat per a aquests dos fitxers:**

- **Gemini / Copilot (Memòria i Garbage Collection):** Extraieu totes les matrius, estils i funcions inline de l'`UniversalPage`. Com aïllem el `useMemo` del `ActualContent` perquè no es re-calcule innecessàriament?
- **Perplexity / DeepSeek (React Commit Phase i Contexts):** El `AppLayout` pateix amb el `handleGlobalDragEnter`. Com extraiem la lògica del Drag & Drop fora del Root Layout per evitar el re-render global? 
- **Vibe / Kimi (DOM i Pintat Termodinàmic):** Quines regles de `contain: strict` o `content-visibility` apliquem al `<main>` del `AppLayout` perquè l'iPad no calcule el layout d'allò que no es veu? 
- **Dola / ChatGPT (Arquitectura Global):** Feu-me una reescriptura del `UniversalPage` que consolide els estats (potser un `useReducer` o extracció en hooks purs) per reduir la complexitat ciclomàtica.

---

## 📦 CODI FONT PER A LA DISSECCIÓ 📦

### Fitxer 1: `UniversalPage.jsx`
```jsx
{universal_code}
```

### Fitxer 2: `AppLayout.jsx`
```jsx
{applayout_code}
```

Esbudelleu-los. Extraieu les constants, aplanats els hooks, lleveu el greix. Retorneu-me els fitxers reconstruïts des de zero per aguantar 400 anys. 💀🚜
"""

with open(output_path, "w") as f:
    f.write(prompt_content)

print(f"Super prompt creat a: {output_path}")
