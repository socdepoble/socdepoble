/**
 * 🧠 TOC Parser Asíncrono - Trellat Compliant
 * Pre-procesa HTML de Supabase/Tiptap asíncronamente en JS.
 * Extrae encabezados, inyecta IDs y devuelve (htmlProcessed, tocElements)
 */

export const processContentForToc = html => {
  if (!html) return {
    processedHtml: '',
    tocElements: []
  };
  const toc = [];
  let counter = 0;

  // Slugify robusto para IDs
  const slugify = text => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Regex no-greedy para capturar h2 y h3 con sus atributos existentes
  const processedHtml = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, existingAttrs, content) => {
    // Extraer texto plano para el ID (eliminar tags HTML internos)
    const textOnly = content.replace(/<[^>]+>/g, '').trim();
    const baseId = slugify(textOnly) || `section`;
    const uniqueId = `${baseId}-${counter++}`;

    // Trellat: Respetar IDs existentes para no romper enlaces y fusionar clases correctamente
    let finalId = uniqueId;
    let attrs = existingAttrs;
    const idMatch = existingAttrs.match(/id=(['"])(.*?)\1/);
    if (idMatch && idMatch[2]) {
      finalId = idMatch[2]; // Conservar ID original si existe
    } else {
      attrs = `id="${finalId}" ${existingAttrs}`;
    }
    toc.push({
      id: finalId,
      text: textOnly,
      level: tag.toLowerCase()
    });

    // Inyectar clases de scroll sin duplicar el atributo class
    const scrollClasses = "scroll-mt-[180px] sm:scroll-mt-[140px]";
    let finalTag = '';
    if (attrs.match(/class=(['"])(.*?)\1/)) {
      finalTag = `<${tag} ${attrs.replace(/class=(['"])(.*?)\1/, `class=$1$2 ${scrollClasses}$1`)}>${content}</${tag}>`;
    } else {
      finalTag = `<${tag} ${attrs} class="${scrollClasses}">${content}</${tag}>`;
    }
    return finalTag;
  });
  return {
    processedHtml,
    tocElements: toc
  };
};