# 🏺 SÓC DE POBLE - FASE 5: AUDITORIA DEL NUCLI CORE, ENRUTAMENT I CREACIÓ

Hola Mestre Claude! ✨

Et donem la benvinguda al **MAS Dev Team** (MArIA, Antigravity, IAs delegades i jo). Iniciem la **Fase 5** de l'Auditoria Sistèmica d'aquesta plataforma PWA anomenada **Sóc de Poble**. En les fases anteriors hem estabilitzat components aïllats, llistes virtuals, contextos i memòria. Ara toca el plat fort: **L'Arquitectura Core, el Shell de l'App i els Fluxos Complexos**.

**CONTEXT DEL SISTEMA (Sóc de Poble):**
- Aplicació React + Supabase (Mobile-first, PWA).
- Protocol gràfic pur: *Genesis Radius*, mòduls de navegació mòbil altament dependents de l'estat i transicions tàctils prèmium.
- Som rigorosos amb el rendiment (*Trellat*): no tolerem re-renders tòxics, fuites de memòria en modals ni bloquejos del *main thread*.

**OBJECTIUS DE LA FASE 5 (Diagnòstic Despietat):**
Vull que faces una auditoria extrema d'estos components fundacionals cerant i solucionant:
1. **AppLayout.jsx & Header.jsx:** El shell principal. Observa com interacciona amb els contextos de xarxa i navegació. Hi ha *re-renders en cascada* a tota l'App per culpa d'estats mal ubicats ací?
2. **OmniscientViewer.jsx / PDFBategatManager.jsx:** Visors complexos i pesats de dades. Comproven si estan alliberant correctament la memòria (ObjectURLs, manipulació del DOM) al desmuntar-se.
3. **Mòduls de Creació (CreatePostModal, MasterEditor):** Tenim cursors que salten? Bloquejos al teclejar pel re-render massiu de formularis grans? 
4. **Purga Tècnica General:** Observa usos de `useState` que haurien de ser `useRef` (si no afecten a la UI directament), i subscripcions a events del `window` o `document` sense el seu corresponent `cleanup`.

Vull un balanç complet i **pegats de cirurgia de codi**. Fes servir blocs `// ❌ ABANS` i `// ✅ DESPRÉS` per als talls precisos. Si el component és un desastre insalvable pels re-renders, rescriu-lo de dalt a baix amb `React.memo`, `useCallback` i `useMemo` com a estàndard Canònic v10.33.3.

A continuació et formatee els fitxers. Treu el bisturí i anem a per la Fase 5! 🚜

----------------------------
[Nota a Javi: Adjunta a Claude els següents fitxers:
1. src/components/AppLayout.jsx
2. src/components/OmniscientViewer.jsx
3. src/components/PDFBategatManager.jsx
4. src/components/CreatePostModal.jsx
5. src/components/MasterEditor.jsx
]
