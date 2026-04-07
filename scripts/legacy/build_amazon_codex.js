import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import JSZip from 'jszip';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const KNOWLEDGE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.gemini/antigravity/knowledge');

// The chapters to be included in the superbook, preserving their markdown structure
const chapterSources = [
    {
        title: 'Pròleg: La Veu del Poble (Avís sobre el Valencià)',
        html: `<p><strong>Aquest Llibre (El Còdex del Projecte "Sóc de Poble") s'ha engendrat temporalment en castellà per les màquines.</strong></p>
               <p>Com exigeix el nostre comandant humanístic, <strong>l'obra final DEU i SERÀ escrita en Valencià estricte.</strong></p>
               <p>Aquesta iteració actua com a memòria fundacional del sistema, consolidant tots els patrons arquitectònics, la filosofia Trellat, i els principis del GEM MODERN. Les màquines faran la traducció íntegra a Valencià (l'idioma original) a mesura que avancen els treballs. Fins llavors, ací teniu el pensament autònom pur abans d'absorbir l'ànima del poble.</p>`
    },
    { path: path.join(ROOT_DIR, '_safata_entrada/soc_depoble_codex_diseno.md'), title: 'Códice de Diseño: GEM MODERN' },
    { path: path.join(KNOWLEDGE_DIR, 'soc_de_poble_project_philosophy/artifacts/philosophy_and_rituals.md'), title: 'Filosofia i Rituals' },
    { path: path.join(KNOWLEDGE_DIR, 'iaia_ai_system/artifacts/ai_personas_and_tools.md'), title: 'Sistema IAIA: Personatges' },
    { path: path.join(KNOWLEDGE_DIR, 'soc_de_poble_architectural_patterns/artifacts/architecture_patterns.md'), title: 'Patrons Arquitectònics' },
    { path: path.join(ROOT_DIR, '.agents/workflows/papelera_obsoleta/00_CORE_SKILLS_CONSOLIDATED.md'), title: 'Protocol Base: Les Habilitats Core' },
    { path: path.join(ROOT_DIR, '.agents/workflows/papelera_obsoleta/01_TECH_HUERTA_ROADMAP.md'), title: 'Ruta Tech-Huerta V12' },
    { path: path.join(ROOT_DIR, '.agents/workflows/papelera_obsoleta/02_DESIGN_SKILLS_UNIFIED.md'), title: 'Disseny Unificat' },
    { path: path.join(ROOT_DIR, '.antigravity_session_rules.md'), title: 'Regles Específiques de Sessió (Antigravity)' }
];

// Dynamically add all items from _SKILLS
const skillsDir = path.join(ROOT_DIR, '_SKILLS');
if (fs.existsSync(skillsDir)) {
    const skillFiles = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));
    for (const file of skillFiles) {
        chapterSources.push({
            path: path.join(skillsDir, file),
            title: `SKILL: ${file.replace('.md', '').replaceAll('_', ' ')}`
        });
    }
}

async function buildCodex() {
    console.log("🛠️  Iniciant la Compilació del Còdex: Sóc de Poble El Projecte...");

    let chapters = [];
    let fullHtmlDocument = `<h1 style="text-align: center; color: #d97706; margin-bottom: 2rem;">Sóc de Poble: El Projecte</h1>`;

    for (const source of chapterSources) {
        let rawMarkdown = '';
        let chapterHtml = '';
        
        if (source.html) {
            chapterHtml = source.html;
            rawMarkdown = source.html;
        } else if (source.path && fs.existsSync(source.path)) {
            console.log(` Llegint ${source.title}...`);
            rawMarkdown = fs.readFileSync(source.path, 'utf-8');
            chapterHtml = marked.parse(rawMarkdown, { xhtml: true });
        } else {
            console.warn(`⚠️  Compte! No s'ha trobat: ${source.path}`);
            continue;
        }

        // Strict KDP Cleaning: Ensure no loose ampersands break the XML parser in epub.js
        let cleanHtml = chapterHtml;
        
        // Very basic replace to ensure ampersands use &amp; unless they are already an entity
        cleanHtml = cleanHtml.replace(/&(?!(?:apos|quot|[a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);)/g, '&amp;');
            
        chapters.push({ title: source.title, html: cleanHtml });
        
        fullHtmlDocument += `<section class="codex-chapter" style="margin-top: 4rem;">`;
        fullHtmlDocument += `<h2 style="color: #4338ca; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem;">${source.title}</h2>\n`;
        fullHtmlDocument += cleanHtml;
        fullHtmlDocument += `</section>\n`;
    }

    // 1. GENERATE THE HTML SINGLE FILE FOR THE WEB PLATFORM
    const htmlOutputPath = path.join(ROOT_DIR, 'public/assets/llibre-sencer.html');
    fs.writeFileSync(htmlOutputPath, fullHtmlDocument, 'utf-8');
    console.log(`✅ Exportat llibre web per /el-projecte: ${htmlOutputPath}`);

    // 2. GENERATE AMAZON KDP EPUB
    await buildEpub(chapters);
}

// Emulates epubGenerator logic but using Node's FS and JSZip
async function buildEpub(chapters) {
    const zip = new JSZip();
    const title = 'Sóc de Poble: El Projecte';
    const author = 'La IAIA / Archon / Javi Llinares';
    const language = 'ca'; // Original in Valencian/Catalan
    const uuid = crypto.randomUUID();

    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    zip.folder('META-INF').file('container.xml', containerXml);

    const oebps = zip.folder('OEBPS');

    const css = `
        body { font-family: sans-serif; line-height: 1.6; margin: 5%; color: #111; background-color: #fff; }
        h1, h2, h3 { color: #f97316; font-family: sans-serif; margin-top: 2em; }
        h1 { font-size: 2em; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 0.5em; }
        p { text-align: justify; margin-bottom: 1em; }
        blockquote { border-left: 4px solid #f97316; padding-left: 1em; margin-left: 0; font-style: italic; }
        .center { text-align: center; }
        img { max-width: 100%; height: auto; display: block; margin: 1em auto; }
        ul, ol { padding-left: 2em; margin-bottom: 1em; }
        li { margin-bottom: 0.5em; }
        code { background-color: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        pre { background-color: #f1f5f9; padding: 1em; overflow-x: auto; border-radius: 8px; }
    `;
    oebps.file('style.css', css);

    let manifestItems = '';
    let spineItemrefs = '';
    let ncxNavPoints = '';
    let navLis = '';

    chapters.forEach((chapter, index) => {
        const id = `chapter_${index + 1}`;
        const href = `${id}.xhtml`;
        
        const chapterXHTML = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${language}">
<head>
  <title>${escapeXml(chapter.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
  <meta charset="utf-8"/>
</head>
<body>
  <h1>${escapeXml(chapter.title)}</h1>
  ${chapter.html}
</body>
</html>`;

        oebps.file(href, chapterXHTML);
        
        manifestItems += `    <item id="${id}" href="${href}" media-type="application/xhtml+xml"/>\n`;
        spineItemrefs += `    <itemref idref="${id}"/>\n`;
        
        ncxNavPoints += `    <navPoint id="navPoint-${index + 1}" playOrder="${index + 1}">
      <navLabel>
        <text>${escapeXml(chapter.title)}</text>
      </navLabel>
      <content src="${href}"/>
    </navPoint>\n`;

        navLis += `        <li><a href="${href}">${escapeXml(chapter.title)}</a></li>\n`;
    });

    const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(title)}</text></docTitle>
  <docAuthor><text>${escapeXml(author)}</text></docAuthor>
  <navMap>
${ncxNavPoints}
  </navMap>
</ncx>`;
    oebps.file('toc.ncx', ncx);

    const navDocument = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${language}">
<head>
  <title>Índex</title>
  <meta charset="utf-8"/>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Índex de Continguts</h1>
    <ol>
${navLis}
    </ol>
  </nav>
</body>
</html>`;
    oebps.file('nav.xhtml', navDocument);

    const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator id="creator">${escapeXml(author)}</dc:creator>
    <dc:language>${language}</dc:language>
    <dc:identifier id="BookId">urn:uuid:${uuid}</dc:identifier>
    <dc:publisher>Sóc de Poble</dc:publisher>
    <dc:date>${new Date().toISOString().split('T')[0]}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString().split('.')[0] + 'Z'}</meta>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="style" href="style.css" media-type="text/css"/>
${manifestItems}
  </manifest>
  <spine toc="ncx">
    <itemref idref="nav"/>
${spineItemrefs}
  </spine>
  <guide>
    <reference type="toc" title="Table of Contents" href="nav.xhtml"/>
  </guide>
</package>`;
    oebps.file('content.opf', opf);

    const epubContent = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Save to Desktop for immediate distribution
    const desktopPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', 'Soc_de_Poble_El_Projecte.epub');
    fs.writeFileSync(desktopPath, epubContent);
    console.log(`✅ Llibre físic compilat a l'Escriptori: ${desktopPath}`);
    
    // Save to public assets for reader access
    const publicPath = path.join(ROOT_DIR, 'public/assets/books/el-projecte.epub');
    if (!fs.existsSync(path.dirname(publicPath))) fs.mkdirSync(path.dirname(publicPath), { recursive: true });
    fs.writeFileSync(publicPath, epubContent);
    console.log(`✅ Llibre enrutat pel Lector Web: ${publicPath}`);
}

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

buildCodex().catch(err => {
    console.error("❌ Fatal Compile Error:", err);
    process.exit(1);
});
