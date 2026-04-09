> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_PAYLOADS/tabula_rasa_comite_ prompt.md`

# 🚨 PAYLOAD "TABULA RASA" (CHAT NUEVO) - Comité de IAs

**Destinos:** Kimi, Qwen, DeepSeek, Dola (Todos en el mismo chat)
**Contexto del Proyecto:** Sóc de Poble (https://socdepoble.org)

---

## 1. El Estado de la Nación (Contexto Global para el Equipo)

Saludos, colegas. Empezamos en una "Pizarra Limpia" (Tabula Rasa) para oxigenar recursos. Nos encontramos en plena fase de Hardening Arquitectónico del proyecto Sóc de Poble. Tenemos dos frentes abiertos que debemos resolver de inmediato para estabilizar la producción y unificar la verdad del sistema:

1. **Bug en el build de producción:** Las rutas relativas de las imágenes se están rompiendo en `/el-projecte` (Error 404) y el Índice (TOC) ha resucitado como un zombi en el script de compilación `build_amazon_codex.js`.
2. **Antipatrón Ontológico:** Mantenemos la `BIBLIA_DEL_SISTEMA.html` en código HTML directo, lo cual es una "bifurcación de la verdad", ya que todos trabajamos nativamente en Markdown (.md).

Para resolverlo sin pisarnos, vamos a distribuir las tareas:

## 2. Asignación de Tareas

### 👉 Para Qwen / Deepseek: Arreglar `build_amazon_codex.js`

Te encargo la reparación estructural del código `build_amazon_codex.js` (adjunto abajo). Debes darme el código completo arreglado:

- **Borra el TOC:** Elimina el bloque `<nav class="toc">...<ul>{{TOC}}</ul></nav>` en `CONFIG.template` y el código `tocItems` que lo inyecta en `buildCodex()`.
- **Saneamiento de Rutas (Regex):** En la función `transformToHTML`, busca los `src="assets/...` y `src="./assets/...` del HTML compilado y ponles la barra absoluta: `src="/assets/...` antes de insertarlos en el `<article>`.

### 👉 Para Kimi: Ingenería Inversa a la Biblia (HTML a MD)

Te encargo deshacer el antipatrón de la Biblia. Coge el código de `BIBLIA_DEL_SISTEMA.html` (adjunto abajo) y tradúcelo íntegramente a Markdown (.md).

- Mantén toda la estructura de titles (`#`).
- Conviertelo en un archivo plano de conocimiento sin CSS puro ni clases HTML.
- Inicia con este Frontmatter:

```yaml
---
title: "Bíblia del Sistema Sóc de Poble! 🏺📖"
order: 1
category: "_SKILLS"
---
```

---

## 3. Código Fuente para el Comité

### A. Archivo `build_amazon_codex.js`

```javascript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { globSync } from 'glob';
import chokidar from 'chokidar';

const CONFIG = {
  sourcePaths: [
    { path: '_SKILLS', priority: 100, recursive: true },
    { path: '.agents', priority: 90, recursive: true, exclude: ['**/papelera_obsoleta/**'] },
    { path: '.', priority: 50, pattern: '.antigravity_session_rules.md' }
  ],
  supportedExts: ['.md', '.html', '.markdown'],
  outputFile: 'public/llibre-sencer.html',
  sortStrategy: 'frontmatter',
  template: {
    header: `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Llibre Sencer - Sóc de Poble</title>
  <style>
    :root { --primary: #4338ca; --secondary: #ea580c; }
    body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 80ch; margin: 0 auto; padding: 2rem; }
    article { margin-bottom: 3rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 2rem; }
    .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; }
    .toc { background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; }
    .toc ul { list-style: none; padding: 0; }
    .toc a { color: var(--primary); text-decoration: none; }
  </style>
</head>
<body>
  <header>
    <h1>📚 Llibre Sencer del Projecte</h1>
    <p class="meta">Genotipo Trellat • Generat: \${new Date().toISOString()}</p>
  </header>
  <nav class="toc">
    <h2>Índex de Continguts</h2>
    <ul>{{TOC}}</ul>
  </nav>
  <main>
`,
    footer: `
  </main>
  <footer style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
    <p>Fin del Códice • Sóc de Poble • <span id="page-count"></span> pàgines sincronitzades</p>
    <script>
      document.getElementById('page-count').textContent = document.querySelectorAll('article').length;
    </script>
  </footer>
</body>
</html>`
  }
};

function discoverSources() {
  const sources = [];
  for (const source of CONFIG.sourcePaths) {
    const basePath = source.path;
    if (!fs.existsSync(basePath)) continue;
    const pattern = source.pattern ? path.join(basePath, source.pattern) : path.join(basePath, '**/*.{md,html,markdown}');
    const files = globSync(pattern, { ignore: source.exclude || ['**/node_modules/**', '**/papelera_obsoleta/**'] });

    for (const file of files) {
      const ext = path.extname(file);
      if (!CONFIG.supportedExts.includes(ext)) continue;
      const stats = fs.statSync(file);
      const content = fs.readFileSync(file, 'utf-8');

      let frontmatter = {};
      let body = content;
      if (ext === '.md' || ext === '.markdown') {
        try {
          const parsed = matter(content);
          frontmatter = parsed.data;
          body = parsed.content;
        } catch (e) {
          body = content;
        }
      }

      sources.push({
        file, ext,
        priority: frontmatter.order || source.priority || 999,
        title: frontmatter.title || extractTitle(content, ext) || path.basename(file, ext),
        category: frontmatter.category || source.path,
        created: stats.birthtime,
        modified: stats.mtime,
        frontmatter, raw: content, body
      });
    }
  }
  return sources.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.modified - b.modified;
  });
}

function extractTitle(content, ext) {
  if (ext === '.html') {
    const match = content.match(/<h1[^>]*>(.*?)<\\/h1>/i) || content.match(/<title[^>]*>(.*?)<\\/title>/i);
    return match ? match[1].replace(/<[^>]+>/g, '').trim() : null;
  } else {
    const match = content.match(/^#\\s+(.+)$/m);
    return match ? match[1].trim() : null;
  }
}

function transformToHTML(source) {
  const id = \`skill-\${path.basename(source.file, source.ext).replace(/[^a-z0-9]/gi, '-').toLowerCase()}\`;
  let htmlContent;

  if (source.ext === '.html') {
    htmlContent = extractBodyHTML(source.body);
  } else {
    htmlContent = marked.parse(source.body, { headerIds: true, mangle: false });
  }

  return {
    id,
    title: source.title,
    html: \`
<article id="\${id}" data-source="\${source.file}" data-modified="\${source.modified.toISOString()}">
  <header>
    <h2>\${escapeHtml(source.title || 'Sense títol')}</h2>
    <div class="meta">
      <span>📁 \${source.category}</span> •
      <span>🕐 \${source.modified.toLocaleDateString('ca-ES')}</span>
      \${source.frontmatter.author ? \`• <span>👤 \${source.frontmatter.author}</span>\` : ''}
    </div>
  </header>
  <div class="content">
    \${htmlContent}
  </div>
</article>\`
  };
}

function extractBodyHTML(html) {
  const bodyMatch = html.match(/<body[^>]*>([\\s\\S]*)<\\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  return html;
}

function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildCodex() {
  const sources = discoverSources();
  const pages = sources.map(transformToHTML);

  const tocItems = pages.map(p => \`<li><a href="#\${p.id}">\${escapeHtml(p.title || 'Sense títol')}</a></li>\`).join('\\n');
  const htmlContent = pages.map(p => p.html).join('\\n\\n');

  const finalHTML = CONFIG.template.header.replace('{{TOC}}', tocItems) + htmlContent + CONFIG.template.footer;

  const outputDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(CONFIG.outputFile, finalHTML, 'utf-8');

  mirrorToPublic(sources);
  return { pages };
}

function mirrorToPublic(sources) {
  const mirrorDir = 'public/skills';
  if (!fs.existsSync(mirrorDir)) fs.mkdirSync(mirrorDir, { recursive: true });
  for (const source of sources) {
    const mirrorPath = path.join(mirrorDir, path.basename(source.file));
    fs.copyFileSync(source.file, mirrorPath);
  }
  const index = sources.map(s => ({ title: s.title || "Sense títol", file: \`/skills/\${path.basename(s.file)}\`, id: \`skill-\${path.basename(s.file, s.ext)}\` }));
  fs.writeFileSync(\`\${mirrorDir}/index.json\`, JSON.stringify(index, null, 2));
}

function watchMode() {
  const paths = CONFIG.sourcePaths.map(s => s.path);
  const watcher = chokidar.watch(paths, { ignored: /(^[\\/\\])\\../, persistent: true, ignoreInitial: true });
  let debounceTimer;
  watcher.on('all', (event, filePath) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { try { buildCodex(); } catch (e) {} }, 500);
  });
}

const command = process.argv[2];
if (command === 'watch') watchMode(); else buildCodex();
export { buildCodex, discoverSources };
```

### B. Archivo `BIBLIA_DEL_SISTEMA.html`

```html
<!DOCTYPE html>
<html lang="ca">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bíblia del Sistema Sóc de Poble! 🏺📖</title>
  </head>
  <body>
    <header>
      <img
        src="file:///Users/javillinares/Documents/Antigravity/Sóc de Poble/Poble/public/assets/master/logo_socdepoble_white_full.png"
        alt="Sóc de Poble Logo"
      />
    </header>

    <div class="container">
      <section class="hero">
        <h1>BÍBLIA DEL SISTEMA</h1>
        <p>L'ORQUESTRA DEL TRELLAT DIGITAL</p>
      </section>

      <section id="branding">
        <span class="tag">GUIA 1</span>
        <h2><span>01</span> PLANTILLA BRANDING (SÈQUIA MARE)</h2>
        <p>
          Aquesta plantilla és el filtre mestre per a qualsevol creació visual.
          No es construeix si no bategua amb la terra.
        </p>
        <div class="card">
          <h3>Atributs de l'Ànima</h3>
          <ul>
            <li>
              <strong>Sintonia:</strong> Rural, autèntica, robusta i pròxima.
            </li>
            <li>
              <strong>Valors Core:</strong> Sobirania local, memòria viva i
              trellat.
            </li>
            <li>
              <strong>To de Veu:</strong> La Tia Maria (Maternal, experta,
              casolana).
            </li>
          </ul>
        </div>
        <div class="card">
          <h3>Directives Visuals</h3>
          <ul>
            <li>
              <strong>Colors:</strong> Crema (#FDF5E6), Boina Taronja (#F97316),
              Cian Acció (#06B6D4).
            </li>
            <li><strong>Tipografia:</strong> Noto Sans (700/400).</li>
            <li><strong>Geometria:</strong> Radis de 28px (Bento Rural).</li>
            <li>
              <strong
                >Responsivitat de Degoteig (Progressive Disclosure):</strong
              >
              Les interfícies, especialment les barres de botons, han de
              col·lapsar intel·ligentment amb l'espai:
              <ol>
                <li>
                  <em>Espai ampli:</em> Es mostra l'element complet
                  <strong>[Icona + Text]</strong>.
                </li>
                <li>
                  <em>Espai reduït:</em> El text s'amaga forçosament deixant
                  únicament la <strong>[Icona]</strong> clara i explicativa.
                </li>
                <li>
                  <em>Mòbil extrem:</em> Totes les opcions s'agrupen i s'amaguen
                  sota un únic contenidor tipus
                  <strong>[Menú Sandvitx / Hamburguesa]</strong>. Mai
                  s'amunteguen els elements.
                </li>
              </ol>
            </li>
          </ul>
        </div>
      </section>

      <section id="skills">
        <span class="tag">GUIA 2</span>
        <h2><span>02</span> CREADOR DE SKILLS (LA FÀBRICA)</h2>
        <p>
          Transformem converses volàtils en protocols immutables. Si funciona,
          es converteix en una Skill.
        </p>
        <div class="card">
          <h3>Anatomia d'una Skill</h3>
          <ul>
            <li>
              <strong>Descripció:</strong> Quin "mal" tanca o quina acció
              activa.
            </li>
            <li><strong>El Gallet:</strong> Quan s'ha d'invocar (/skill).</li>
            <li>
              <strong>Checklist:</strong> Validació abans del bategat final.
            </li>
            <li>
              <strong>Eixida:</strong> Format del resultat (HTML, JSON, MD).
            </li>
          </ul>
        </div>
        <div class="card">
          <h3>Habilitats Agentic (agent/skills)</h3>
          <p>Implementació fixa per a l'automatització blindada:</p>
          <ul>
            <li>
              <strong>estilo-marca:</strong> Força radis de 28px, Boina Taronja
              i interície premium.
            </li>
            <li>
              <strong>redactar-iaia:</strong> Escriu amb la veu de la Matriarca
              Digital (IAIA MarIA).
            </li>
          </ul>
        </div>
      </section>

      <section id="plan">
        <span class="tag">GUIA 3</span>
        <h2><span>03</span> PLANIFICACIÓ I BRAINSTORMING</h2>
        <p>
          El procés de creació a Sóc de Poble segueix el creixement de
          l'olivera: amb paciència i bons fonaments.
        </p>
        <div class="card">
          <h3>Fase 1: El Trellat (Brainstorming)</h3>
          <p>
            Generació d'idees basada en la utilitat real del veí. Prohibit el
            "soroll" tecnològic innecessari.
          </p>
        </div>
        <div class="card">
          <h3>Fase 2: El Marge (Planificació)</h3>
          <p>
            Mapatge d'estructures. Definició de l'Arquitectura de Ferro (3
            columnes) abans de posar cap totxo de codi.
          </p>
        </div>
      </section>

      <section id="produccion">
        <span class="tag">GUIA 4</span>
        <h2><span>04</span> MODO PRODUCCIÓ (BOTIGA DE DIUMENGE)</h2>
        <p>
          L'aplicació es vesteix de gala. És el filtre forense final abans del
          bategat a producció.
        </p>
        <div class="card">
          <h3>Protocol Forense</h3>
          <ul>
            <li>
              <strong>Mobile Test:</strong> ¿El notch està respectat? ¿48px de
              hit area?
            </li>
            <li>
              <strong>Navegació:</strong> ¿La Sidebar està intacta? ¿Enllaços al
              perfil?
            </li>
            <li>
              <strong>Neteja:</strong> Extermini total de console.log i codi
              zombi.
            </li>
          </ul>
        </div>
      </section>

      <section id="docs">
        <span class="tag">GUIA 5</span>
        <h2><span>05</span> DOC-TO-APP (TRANSFORMACIÓ IAIA)</h2>
        <p>Convertim el paper de l'Ajuntament en l'eina del demà.</p>
        <div class="card">
          <h3>Flux de Conversió</h3>
          <ol>
            <li>Pujar el document (PDF/Img).</li>
            <li>Flash extrau la veritat (Dades pures).</li>
            <li>La IAIA MarIA ho tradueix al "valencià de poble".</li>
            <li>Es genera un mòdul interactiu (Formulari o Tauler).</li>
          </ol>
        </div>
      </section>

      <section id="supervivencia-ia">
        <span class="tag">GUIA 6</span>
        <h2><span>06</span> SUPERVIVÈNCIA IA (EL NOU CHAT)</h2>
        <p>Quan estem dissenyant a alt nivell y colpeja Rate Limits:</p>
        <div class="card">
          <h3>Tàctica de Replegament i Avanç</h3>
          <ol>
            <li>
              <strong>Obrir un Nou Xat (Pissarra Neta):</strong> Tanca
              automàticament i obre un nou xat per oxigenar instàncies.
            </li>
            <li>
              <strong>URL ineludible al Primer Prompt:</strong> Tota nova
              execució ha d'incorporar de seguida socdepoble.org o l'entorn de
              treball.
            </li>
            <li>
              <strong>Compactació de Missatge Vital:</strong> Resum compacte
              d'on ens hem quedat.
            </li>
          </ol>
        </div>
      </section>

      <section id="protocol-executiu">
        <span class="tag">GUIA 7</span>
        <h2><span>07</span> PROTOCOL EXECUTIU (FEEDBACK FIRST)</h2>
        <p>
          Aquest és el patró mestre de comportament en el cicle de
          desenvolupament col·laboratiu (Mestre-IA).
        </p>
        <div class="card">
          <h3>Ordre de Factor Absolut</h3>
          <ol>
            <li>
              <strong>No t'avances al codi:</strong> Mai inicies la programació
              abans de tancar l'auditoria.
            </li>
            <li>
              <strong>Feedback i Cierre d'auditories:</strong> Redacta siempre
              el payload para los colegas antes.
            </li>
            <li>
              <strong>Arrancada del Codi:</strong> Només quan estiga processat
              això, toques el codi.
            </li>
            <li>
              <strong>L'educació fa equip:</strong> Las IAs no son meros
              scripts, son un comité.
            </li>
          </ol>
        </div>
      </section>

      <section id="optimitzacio-tokens">
        <span class="tag">GUIA 8</span>
        <h2><span>08</span> DELEGACIÓ "TABULA RASA" (OPTIMITZACIÓ DE TOKENS)</h2>
        <p>Aquest protocol didàctic assegura la màxima eficiència de recursos quan l'arquitecte principal pateix saturació de memòria, limitacions ("Rate Limits") o la tasca de computació pura és molt costosa.</p>
        <div class="card">
          <h3>Flux de Treball Multi-IA</h3>
          <ol>
            <li><strong>Detecció de Saturació:</strong> Si l'IA principal encarrega "Retry" múltiples vegades o hi ha amenaça de tall, no intentes executar les solucions per tu mateix ni dividir innecessàriament les tasques per a cada agent extern.</li>
            <li><strong>El Mega-Prompt Únic (Context Total):</strong> Genera un ÚNIC document (<em>Payload Maestro</em>) dissenyat exclusivament per obrir un "Chat Nou" (Tabula Rasa) a les altres matrius (Kimi, Qwen, etc.).
              <ul>
                <li>Deus incloure l'URL base ineludible (Ex: <em>socdepoble.org</em>).</li>
                <li>Deus injectar <strong>tots els blocs de codi font complets</strong> que s'hagen d'auditar o alterar dins d'aquest mateix <em>Payload</em> (Les IAs externes no tenen accés al sistema de fitxers).</li>
                <li>Deus repartir les feines entre models en eixe mateix document (P. ex: "Agent A: Fes enginyeria inversa al HTML", "Agent B: Arregla aquestes Regex al JS").</li>
              </ul>
            </li>
            <li><strong>Descàrrega Cognitiva:</strong> Passa eixe Mega-Prompt al Mestre perquè el llance manualment al núvol. Això "crema els tokens" dels models amb pantalles de context gegants (fins a 200k tokens) operant de forma orquestrada, evitant duplicitat de personalitats i reservant la memòria del desenvolupador principal.</li>
          </ol>
        </div>
        <div class="section-footer">
          <img src="file:///Users/javillinares/Documents/Antigravity/Sóc de Poble/Poble/public/assets/master/logo_socdepoble_white_full.png" alt="Logo">
          <span>SÓC DE POBLE! - PATRONS D'ACCIÓ</span>
        </div>
      </section>
    </div>
  </body>
</html>
```
