# 🚨 Payload de Emergencia: Bug de Imágenes e Índice (Para Kimi / Qwen / DeepSeek)
**Prioridad:** Crítica (Producción Rota)
**Destino:** Kimi o Qwen

---

## 1. Contexto del Problema y Tu Tarea
Empezamos desde cero en este chat. Tu tarea es arreglar el script `build_amazon_codex.js`. 
Te paso el código íntegro al final de este mensaje. Debes hacer dos cosas y darme el código completo arreglado:

### A. Eliminar el Índice (TOC)
- Busca en `CONFIG.template.header` el bloque `<nav class="toc">...<h2>Índex de Continguts</h2><ul>{{TOC}}</ul></nav>` y bórralo.
- Busca en la función `buildCodex()` el fragmento donde se genera el `const tocItems = pages.map(...)` y se inyecta con `.replace('{{TOC}}', tocItems)` y elimínalos para limpiar el código.

### B. Corregir Rutas de Imágenes (Regex de Saneamiento)
- Dentro de la fase de Transformación (`transformToHTML`), aplica un saneamiento al HTML compilado antes de insertarlo en el `<article>`.
- Crea una expresión regular que busque todos los `src="assets/...` o `src="./assets/...` (ya sea infografies, avatars, imagenes...).
- Reemplaza todas esas rutas por barras absolutas desde la raíz pública: `src="/assets/...`.

## 2. Código Original de `build_amazon_codex.js`
Por favor, analiza y corrige el siguiente código:

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
