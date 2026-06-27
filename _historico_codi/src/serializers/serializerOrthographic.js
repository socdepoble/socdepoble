/**
 * Motor tipogràfic ortogràfic.
 * Converteix blocs de UnifiedEditor en Nodes aptes 
 * per EPUB/Affinity injectant proteccions de vidues, orfes i hyphenation.
 */

export function serializeOrthographic(docBlocks, { language = "ca" } = {}) {
  // Retorna una representació JSON intermitja que el servidor MCP o el empaquetador EPUB llegiran
  return docBlocks.map((block) => {
    const isHeading = block.type === 'heading';
    const isLevel1Or2 = isHeading && (block.level === 1 || block.level === 2);
    const isBlockquote = block.type === 'quote';
    
    // Classes CSS semàntiques que l'EPUB o el transpilador Affinity reconeixeran
    const classes = [];
    const blockLang = language; 

    if (isLevel1Or2) {
      classes.push('page-break-force');
    }

    if (isBlockquote) {
      classes.push('break-avoid');
    }

    // Heurística de paràgraf curt (evitar particions sencer a final de pàgina)
    const content = block.text || block.value || '';
    if (block.type === 'paragraph' && content.length < 150) {
      classes.push('break-avoid');
    }
    
    return {
      id: block.id,
      type: block.type,
      content: content,
      level: block.level,
      src: block.src,
      alt: block.alt,
      lang: blockLang,
      classes: classes,
      styleName: mapAffinityStyle(block)
    };
  });
}

function mapAffinityStyle(block) {
  if (block.type === 'heading') return block.level === 1 ? 'SDP_Titol' : 'SDP_Subtitol';
  if (block.type === 'paragraph') return 'SDP_CosText';
  if (block.type === 'quote') return 'SDP_Quote';
  if (block.type === 'list') return 'SDP_Llista';
  return 'SDP_CosText';
}
