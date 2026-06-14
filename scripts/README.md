# Eines de refactorització i codemods

Aquest directori i els scripts associats faciliten la migració de "div soup" cap a elements semàntics i la comprovació automàtica del codi.

## Fitxers clau i ubicacions
- `src/scripts/find-div-soup.js`  
  Heurístic que detecta `<div>` sense atributs rellevants ni fills semàntics.
- `scripts/transform-div-title-subtitle.js`  
  Codemod jscodeshift que transforma:
  - `div` amb `className` que conté `title` → `h2`
  - `div` amb `className` que conté `subtitle` → `p`
- `scripts/transform-div-media-actions.js`  
  Codemod jscodeshift que transforma:
  - `div` amb `className` que conté `media` → `figure`
  - `div` amb `className` que conté `actions` → `footer`

## Instal·lació de dependències de desenvolupament
Instal·la les eines necessàries abans d'executar els scripts:

```bash
# Dependències per a l'script d'AST (find-div-soup)
npm install --save-dev @babel/parser @babel/traverse glob

# Opcional: instal·lar jscodeshift globalment o usar npx
npm install -g jscodeshift
# o usar npx sense instal·lar globalment
```

## Scripts disponibles a package.json
- `npm run lint:div-soup`  
  Executa l'heurístic que detecta possibles `div` inútils a `src/`.
- `npm run codemod:div-title-subtitle:dry`  
  Execució en mode dry per al codemod title/subtitle amb previsualització de diffs.
- `npm run codemod:div-title-subtitle`  
  Aplica el codemod title/subtitle.
- `npm run codemod:div-media-actions:dry`  
  Execució en mode dry per al codemod media/actions amb previsualització de diffs.
- `npm run codemod:div-media-actions`  
  Aplica el codemod media/actions.

## Flux de treball recomanat i segur
1. **Commit de seguretat**  
   ```bash
   git add .
   git commit -m "backup before codemods"
   ```
2. **Crear branca de treball**  
   ```bash
   git checkout -b refactor/div-to-semantic
   ```
3. **Prova en mode dry** per cada codemod i revisa diffs:
   ```bash
   npm run codemod:div-title-subtitle:dry
   npm run codemod:div-media-actions:dry
   ```
4. **Aplicar codemods** si els diffs són correctes:
   ```bash
   npm run codemod:div-title-subtitle
   npm run codemod:div-media-actions
   ```
5. **Executar l'heurístic** per detectar altres `div` sospitosos:
   ```bash
   npm run lint:div-soup
   ```
6. **Revisió manual i PR**  
   Obri un PR i revisa els canvis amb atenció. Busca casos on `title`, `subtitle`, `media` o `actions` s'usen per layout i no per semàntica.
7. **Rollback si cal**  
   ```bash
   git reset --hard HEAD~1
   # o revertir fitxers específics
   git checkout -- <files>
   ```

## Notes de seguretat i limitacions
- Els codemods són **conservadors**: només transformen `className` literals que contenen tokens específics. No transformen expressions dinàmiques a `className`.
- Els scripts eviten transformar nodes amb fills semàntics complexos per reduir falsos positius.
- Revisa manualment components complexos (formularis, layout avançat, elements amb scripts) abans d'acceptar els canvis.
- Després de la migració, actualitza els selectors CSS si cal (ex: `div.media` → `figure.media`) per mantenir l'estil.

## Exemples ràpids abans i després
**Title**
```jsx
// Abans
<div className="card title">Títol</div>

// Després
<h2 className="card title">Títol</h2>
```

**Subtitle**
```jsx
// Abans
<div className="card subtitle">Subtítol</div>

// Després
<p className="card subtitle">Subtítol</p>
```

**Media**
```jsx
// Abans
<div className="card media"><img src="/img.jpg" alt="imatge" /></div>

// Després
<figure className="card media"><img src="/img.jpg" alt="imatge" /></figure>
```

**Actions**
```jsx
// Abans
<div className="card actions"><button>OK</button></div>

// Després
<footer className="card actions"><button>OK</button></footer>
```

## Suggeriments postrefactor
- Mou les variables CSS i tokens a un fitxer global si encara no ho has fet.
- Executa proves visuals en dispositius objectiu com l'iPad A10.
- Integra `npm run lint:div-soup` al pipeline de CI per detectar regressions.

## Contacte i ampliacions
Per generar codemods addicionals (ex: `div.media` → `figure` amb conversió d'imatges responsives, `div.actions` → `nav` per navegacions), obri una issue o prepara una llista de patrons i els automatitze.
