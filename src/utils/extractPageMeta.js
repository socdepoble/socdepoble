/**
 * Extreu metadades HTML d'un string de contingut (comentaris <!-- CLAU: valor -->)
 * Retorna: { content: string, meta: { heroFormat, heroPosition, heroImage, logoLight, logoDark } }
 */
export function extractPageMeta(htmlString) {
  if (!htmlString) return {
    content: '',
    meta: {}
  };
  const meta = {};
  let content = htmlString;
  const extractors = [{
    key: 'heroFormat',
    regex: /<!-- HERO_FORMAT: (.*?) -->\n?/
  }, {
    key: 'heroPosition',
    regex: /<!-- HERO_POSITION: (.*?) -->\n?/
  }, {
    key: 'heroImage',
    regex: /<!-- HERO_IMAGE: (.*?) -->\n?/,
    transform: v => v.trim()
  }, {
    key: 'logoLight',
    regex: /<!-- LOGO_LIGHT: (.*?) -->\n?/,
    transform: v => v.trim() || null
  }, {
    key: 'logoDark',
    regex: /<!-- LOGO_DARK: (.*?) -->\n?/,
    transform: v => v.trim() || null
  }];
  extractors.forEach(({
    key,
    regex,
    transform
  }) => {
    const match = content.match(regex);
    if (match) {
      let value = match[1];
      if (transform) value = transform(value);
      // Netejar valors "nuls" en text
      if (value === 'null' || value === 'undefined' || value === '') value = null;
      meta[key] = value;
      content = content.replace(match[0], '');
    }
  });
  return {
    content,
    meta
  };
}