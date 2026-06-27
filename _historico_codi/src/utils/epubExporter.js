import JSZip from 'jszip';
import { parseSimpleMarkdown, generateNavXHTML } from './markdownParser.js';

/**
 * EPUB3 Exporter - Filosofia Bancal
 * Unificador lleuger i compatible amb A10 i Calibre
 */
export const generateEpub = async (title, markdownText, outputType = 'blob') => {
    const zip = new JSZip();
    
    // 1. mimetype obligatori sense compressió per EPUB3
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
    
    // 2. META-INF/container.xml
    const containerXml = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    zip.file("META-INF/container.xml", containerXml);
    
    // 3. Contingut i parseig
    const navXhtml = generateNavXHTML(markdownText);
    const contentHtml = parseSimpleMarkdown(markdownText);
    
    const fullContentXhtml = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>${title}</title>
  <meta charset="utf-8" />
  <style>
    body { font-family: sans-serif; line-height: 1.5; padding: 1em; }
    h1, h2, h3 { color: #333; }
    img { max-width: 100%; page-break-inside: avoid; }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`;

    // Data per al timestamp modificat ISO8601 (dcterms:modified)
    const modifiedDate = new Date().toISOString().split('.')[0] + 'Z';
    // UUID basic 
    const randomId = 'sosp-' + Math.random().toString(36).substring(2, 9);

    const manifestOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:${randomId}</dc:identifier>
    <dc:title>${title}</dc:title>
    <dc:language>ca</dc:language>
    <meta property="dcterms:modified">${modifiedDate}</meta>
  </metadata>
  <manifest>
    ${navXhtml ? '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>' : ''}
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="content"/>
  </spine>
</package>`;

    zip.folder("OEBPS").file("content.opf", manifestOpf);
    
    if (navXhtml) {
      zip.folder("OEBPS").file("nav.xhtml", navXhtml);
    }
    zip.folder("OEBPS").file("content.xhtml", fullContentXhtml);

    // type: "blob" per al domini Web, "nodebuffer" per CLI Node.js
    const output = await zip.generateAsync({ type: outputType, compression: "DEFLATE" });
    return output;
};
