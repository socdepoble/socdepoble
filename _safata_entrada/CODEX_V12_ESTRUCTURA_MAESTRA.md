# 📖 CÒDEX SÓC DE POBLE: ESTRUCTURA MESTRA (V12)

*Aquest document s'expandeix com el nucli del coneixement centralitzat. És el "Llibre de Petre" de l'arquitectura de la Masia. Totes les IA han de consumir aquest Còdex per entendre l'ànima i el cos del projecte abans d'escriure ni una línia.*

## 1. ÀNIMA GRÀFICA: FARMPUNK I GLASSMORPHISM M3
L'estètica de Sóc de Poble no és una elecció arbitrària, és una declaració d'intencions.
- **Farmpunk:** Connectem l'essència rural mil·lenària de l'Horta amb el futur digital descentralitzat. Materials francs, colors terra, verds argila, taronges apacibles. La tecnologia no ha d'ocultar la terra, n'ha de ser el reg.
- **Glassmorphism (M3):** La interfície no pesa. S'utilitzen translúcids precisos sense gastar GPU (cap excés de `backdrop-filter`). Superfícies elevades basades en les regles de Material Design 3, creant jerarquies mitjançant ombres matemàticament calculades.

## 2. TAXONOMIA SEMÀNTICA DEL CÒDEX (EPUB / PDF)
Aquest llibre no només es llig, es **parseja**. Està dissenyat per a ser consumit de forma òptima tant pel cervell humà (el Mestre) com per futurs Agents d'IA.

### A. Format Bi-Capa (Slide + Text)
Cada concepte es presenta en dues mirades simultànies (Format A4 apaïsat per a e-readers i pantalles):
- **La Finestra Esquerra (Nano Banana):** Una infografia SVG / Gràfic conceptual, cru, net i esquemàtic. 
- **La Finestra Dreta (Mestre/Cronista):** Text dens, curat, sense "palla". Només la informació vital (150-180 paraules màxim per slide).

### B. Indexació per a Màquines (JSON-LD & ARIA)
Cada secció portarà injeccions de metadades estructurades.
```html
<section aria-labelledby="chapter-2" data-ai-context="architecture-calendar">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Optimizació del MasterCalendar amb Paginació en Paral·lel",
    "about": "Desplegament d'un sistema de Promise.all amb pageTokens per evitar els referents massius al main thread."
  }
  </script>
  <!-- Contingut Humà aquí -->
</section>
```

## 3. PRINCIPIS DE DESENVOLUPAMENT (El "Trellat")
Les lleis innegociables per a qualsevol IA que propose codi:
1. **OOM Preventiu:** Ni un sol array infinit carregat del servidor. Paginació sempre.
2. **Secrets Hermètics:** Tot token viatja directament a IndexedDB. El `localStorage` només és per a preferències estètiques menors.
3. **Renders Defensius:** React Compiler no us salvarà de la incompetència. Dependències netes en els `useEffect` i callbacks memoritzats amb propòsit, no per inèrcia.
4. **Sobirania Translativa:** Omega Translate (el mòdul de l'idioma) comprova de forma autàrquica les estructures JSON. Si falta la variable `{{name}}` en la traducció, es fa saltar l'Error Boundary. No hi ha marge per a IA's que "s'inventen" el format.

*-- El Cronista, Registrat en la Base de Dades Central. V12 Permanent.*
