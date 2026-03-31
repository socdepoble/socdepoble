import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * EPUB Generator for Sóc de Poble (Amazon KDP Ready)
 * Generates an EPUB 3 file with complete backwards compatibility (EPUB 2 NCX).
 * 
 * @param {Object} options - Metadata and content for the EPUB
 * @param {string} options.title - Book title
 * @param {string} options.author - Book author
 * @param {string} options.language - Language code (e.g. 'ca' per a valencià)
 * @param {string} options.uuid - Unique identifier (e.g. UUID)
 * @param {Array<Object>} options.chapters - Array of chapters. { title: 'Chap 1', html: '<b>content</b>' }
 * @param {string} options.filename - Output filename, e.g. "Soc_de_Poble_El_Projecte.epub"
 */
export async function generateEpub(options) {
    const { 
        title = 'Sense Títol', 
        author = 'Archon', 
        language = 'ca', 
        uuid = crypto.randomUUID(), 
        chapters = [],
        filename = 'sdoc_export.epub'
    } = options;

    const zip = new JSZip();

    // 1. mimetype (Must be strictly uncompressed, first file. JSZip handles it if added first).
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // 2. META-INF/container.xml
    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    zip.folder('META-INF').file('container.xml', containerXml);

    const oebps = zip.folder('OEBPS');

    // Basic stylesheet
    const css = `
        body { font-family: sans-serif; line-height: 1.6; margin: 5%; color: #111; background-color: #fff; }
        h1, h2, h3 { color: #f97316; font-family: sans-serif; margin-top: 2em; }
        h1 { font-size: 2em; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 0.5em; }
        p { text-align: justify; margin-bottom: 1em; }
        blockquote { border-left: 4px solid #f97316; padding-left: 1em; margin-left: 0; font-style: italic; }
        .center { text-align: center; }
    `;
    oebps.file('style.css', css);

    // 3. Process Chapters
    let manifestItems = '';
    let spineItemrefs = '';
    let ncxNavPoints = '';
    let navLis = '';

    chapters.forEach((chapter, index) => {
        const id = `chapter_${index + 1}`;
        const href = `${id}.xhtml`;
        
        // Strict XHTML Cleaning
        // Convert <br> or <img...> lacking closure to <br/> <img.../>
        let cleanHtml = chapter.html
            .replace(/<br\s*>/g, "<br/>")
            .replace(/<hr\s*>/g, "<hr/>")
            .replace(/<img([^>]+[^/])>/g, "<img$1/>");

        // Amazon KDP strict requires pure XHTML 1.1 structure
        const chapterXHTML = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${language}">
<head>
  <title>${escapeXml(chapter.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
  <meta charset="utf-8"/>
</head>
<body>
  <h1>${escapeXml(chapter.title)}</h1>
  ${cleanHtml}
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

    // 4. OEBPS/toc.ncx (EPUB 2)
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

    // 5. OEBPS/nav.xhtml (EPUB 3 Navigation Document)
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

    // 6. OEBPS/content.opf
    const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator id="creator">${escapeXml(author)}</dc:creator>
    <dc:language>${language}</dc:language>
    <dc:identifier id="BookId">urn:uuid:${uuid}</dc:identifier>
    <dc:publisher>Sóc de Poble: El Projecte</dc:publisher>
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

    // Generate blob and trigger download
    const content = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
    saveAs(content, filename);
}

// Utility for escaping XML special characters
function escapeXml(unsafe) {
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
