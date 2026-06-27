import JSZip from 'jszip';
import { parseSimpleMarkdown } from '../../utils/markdownParser';

const IDML_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<idml:IDML xmlns:idml="http://www.idmlschema.com/2009/idml">
  <idml:Package>
    <idml:Resources>
      <idml:ParagraphStyle id="Body" name="Body" fontFamily="Noto Sans" fontStyle="Regular" pointSize="18" leading="1.75" fillColor="#111827"/>
      <idml:ParagraphStyle id="Title" name="Title" fontFamily="Noto Sans" fontStyle="Black" pointSize="30" leading="1.2" fillColor="#FF6D23"/>
      <idml:CharacterStyle id="Default" name="Default"/>
    </idml:Resources>
    <idml:Spread id="spread1">
      <idml:TextFrame id="frame1" geometricBounds="20mm 20mm 277mm 190mm" parentInterface="spread1">
        <idml:Story id="story1" parentInterface="frame1"/>
      </idml:TextFrame>
    </idml:Spread>
  </idml:Package>
</idml:IDML>`;

export const exportToIDML = async (document) => {
  const html = parseSimpleMarkdown(document.content || '');
  const zip = new JSZip();

  // 1. MIMETYPE + META-INF (IDML és un ZIP)
  zip.file('mimetype', 'application/x-indesign');
  zip.folder('META-INF').file('container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="designmap.xml" media-type="application/vnd.adobe.idml+xml"/></rootfiles>
</container>`);

  // 2. designmap.xml (entrada principal)
  const designmap = `<?xml version="1.0" encoding="UTF-8"?>
<DesignMap xmlns="http://ns.adobe.com/2009/idml">
  <MasterSpread id="master1"/>
  <Spread id="spread1"/>
</DesignMap>`;
  zip.file('designmap.xml', designmap);

  // 3. Stories + TextFrames amb les nostres sections
  let storyXml = `<Story Self="story1" ParagraphStyleRange="Body">`;
  const sections = html.split(/<section id="([^"]+)">/).filter(Boolean);
  sections.forEach((sec, i) => {
    if (i % 2 === 1) { // title (assumpció de la IA: tags senars)
      storyXml += `<ParagraphStyleRange AppliedParagraphStyle="Title"><Content>${sec.replace(/<[^>]+>/g, '')}</Content></ParagraphStyleRange>`;
    } else {
      storyXml += `<ParagraphStyleRange AppliedParagraphStyle="Body"><Content>${sec.replace(/<[^>]+>/g, '')}</Content></ParagraphStyleRange>`;
    }
  });
  storyXml += `</Story>`;
  zip.file('Stories/Story1.xml', storyXml);

  // 4. Genera el fitxer .idml
  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/x-indesign' });
  const url = URL.createObjectURL(blob);

  // Auto clean-up
  setTimeout(() => URL.revokeObjectURL(url), 60000);

  return {
    url,
    filename: `${document.slug || document.id}.idml`,
    size: blob.size
  };
};

export const sendToAffinityMCP = async (document) => {
  try {
    const mcpPayload = {
      protocol: "mcp/1.0",
      command: "createDocument",
      params: {
        preset: "A4",
        margins: { top: "20mm", left: "20mm", bottom: "19mm", right: "20mm" },
        masterStyles: {
          body: { font: "Noto Sans Condensed", size: 18, color: "#111827", leading: "1.75" },
          title: { font: "Noto Sans Black", size: 30, color: "#FF6D23" }
        },
        content: document.content,
        autoApply: true,
        paperRustic: "#FDFCF9"
      }
    };
    const ws = new window.WebSocket('ws://localhost:8765/mcp');
    ws.onopen = () => ws.send(JSON.stringify(mcpPayload));
    ws.onmessage = (e) => console.log('Affinity MCP Server confirmat:', e.data);
  } catch(e) {
    console.error("Error MCP", e);
  }
};
