// src/shared/serializers/affinitySerializer.js
// ⚠️ REGLA: Aquest mòdul NO toca el DOM. Treballa només amb l'estat pur de blocs.

export const SDP_TO_AFFINITY_MAP = {
  // Text Styles d'Affinity (definits prèviament al document plantilla)
  'heading-1': { style: 'SDP_TitolPrincipal', level: 1, pageBreakBefore: true },
  'heading-2': { style: 'SDP_Subtitol', level: 2, pageBreakBefore: false },
  'heading-3': { style: 'SDP_SubtitolMenor', level: 3, pageBreakBefore: false },
  'paragraph': { style: 'SDP_CosText', level: 0, pageBreakBefore: false },
  'quote': { style: 'SDP_Cita', level: 0, pageBreakBefore: false, indent: '20mm' },
  'list-item': { style: 'SDP_Llista', level: 0, bullet: '•' },
  'image': { style: 'SDP_ImatgeFrame', type: 'picture', anchor: 'inline' },
  'caption': { style: 'SDP_PeuImatge', level: 0, align: 'center' }
};

// Funció pura de serialització (A10-optimized: sense regex massius)
export const serializeBlocksForAffinity = (blocks, metadata = {}) => {
  const timestamp = new Date().toISOString().replace('Z', '+02:00');
  
  return {
    // Capçalera MCP obligatòria
    mcp: {
      version: '1.0',
      protocol: 'affinity-publisher',
      action: 'import-document',
      requestId: crypto.randomUUID?.() || `sdp-${Date.now()}`,
      timestamp: timestamp,
      source: 'soc-de-poble@1.4.0'
    },
    
    // Metadades del document Affinity
    document: {
      name: metadata.title || 'Document SDP',
      template: 'SDP_Master_A4_v2.afpub', // Plantilla amb estils predefinits
      pageSize: { width: '210mm', height: '297mm' },
      margins: { top: '20mm', right: '20mm', bottom: '19mm', left: '20mm' },
      columns: { count: 1, gap: '6mm' },
      language: metadata.language || 'ca-ES',
      utcOffset: '+02:00' // Blindatge horari
    },
    
    // Cos del document: blocs mapejats
    content: blocks.map((block, index) => {
      const mapping = SDP_TO_AFFINITY_MAP[block.type] || SDP_TO_AFFINITY_MAP['paragraph'];
      
      return {
        id: block.id,
        order: index,
        type: mapping.type || 'text-frame',
        style: mapping.style,
        
        // Contingut textual
        text: block.type === 'image' ? undefined : sanitizeForAffinity(block.content),
        
        // Metadades d'imatge (si aplica, extraurà el cid via regex limitat)
        image: extractImageMeta(block),
        
        // Propietats d'estil específiques
        properties: {
          pageBreakBefore: mapping.pageBreakBefore || false,
          indent: mapping.indent,
          bullet: mapping.bullet,
          align: mapping.align
        },
        
        // Traçabilitat SDP → Affinity
        provenance: {
          blockId: block.id,
          updatedAt: block.updatedAt || timestamp,
          author: metadata.author?.id || 'unknown'
        }
      };
    }),
    
    // Índex per a ToC automàtic en Affinity
    toc: blocks
      .filter(b => b.type && b.type.startsWith('heading'))
      .map((h, i) => ({
        label: sanitizeForAffinity(h.content),
        targetBlockId: h.id,
        level: SDP_TO_AFFINITY_MAP[h.type]?.level || 1
      }))
  };
};

const extractImageMeta = (block) => {
  // Aca estem llegint el markdown buscant el cid si el tipus genèric no s'ha especificat en estructura
  if (!block.content) return undefined;
  
  const m = /!\[([^\]]*?)\]\(\s*cid:([a-zA-Z0-9\-_:.]+)\s*\)/.exec(block.content);
  if (m) {
    return {
      blobRef: m[2], // cid extracted from markdown string
      alt: m[1] || '',
      caption: '',
      frame: {
        width: '100%',
        height: 'auto',
        anchor: 'inline',
        border: { width: 0 }
      }
    };
  }
  return undefined;
};

// Sanitització mínima per a Affinity (evita caràcters que trenquen XML/IDML)
const sanitizeForAffinity = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r\n/g, '\n') // Normalitzar salts de línia
    .trim();
};

// Exportació IDML fallback (només si MCP no està disponible)
export const serializeToIDMLSnippet = (blocks) => {
  // Açò genera un fragment <Story> injectable.
  const stories = blocks.map((block, i) => {
    const style = SDP_TO_AFFINITY_MAP[block.type]?.style || 'SDP_CosText';
    const content = sanitizeForAffinity(block.content);
    
    return `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle:${style}">
      <Content>${content}</Content>
    </ParagraphStyleRange>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Story xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="17.0">
  <Story>
    ${stories}
  </Story>
</idPkg:Story>`;
};
