const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const TOWN_FALLBACK_IMAGES = [
  '/assets/uploads/poble/la-torre-de-les-macanes/img-la-torre-de-les-ma-anes-main.jpg',
  '/assets/uploads/poble/penaguila/img-pen-guila-main.jpg',
  '/assets/uploads/poble/benimassot/img-benimassot-main.jpg',
  '/assets/uploads/poble/la-torre-de-les-macanes/P_20161028_153325_SRES.jpg',
  '/assets/uploads/poble/la-torre-de-les-macanes/P_20161028_150735.jpg',
  '/assets/uploads/poble/la-torre-de-les-macanes/toponim-la-torre-de-les-macanes-2048px.jpg',
  '/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png',
  '/assets/uploads/brain/hero_panoramic_rural_view_1774720664221.png',
  '/assets/uploads/brain/art_trellat_farmer_1774708525806.png',
  '/assets/uploads/brain/nano_mercat_llaurador_1774197050578.png',
  '/assets/uploads/brain/aplec_danses_1774952191348.png',
  '/assets/uploads/brain/nano_mel_font_roja_1774216345755.png',
  '/assets/uploads/brain/art_trellat_v2_1774708257858.png',
  '/assets/uploads/brain/hero_serrella_comic_1774709602282.png',
  '/assets/uploads/brain/nano_oli_oliva_1774198089084.png'
];

function pickDeterministicImage(seed, options) {
  const list = options.filter(Boolean);
  if (list.length === 0) return TOWN_FALLBACK_IMAGES[0];

  const text = String(seed || '');
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return list[hash % list.length];
}

function resolveTownImageUrl(value, context = '', seed = '') {
  const raw = String(value || '').trim();
  const text = normalizeText(`${raw} ${context}`);

  if (/^https?:\/\//i.test(raw)) return raw;
  if (
    raw &&
    !raw.startsWith('/assets/uploads/poble/') &&
    !raw.startsWith('/assets/uploads/brain/') &&
    !raw.startsWith('/assets/images/towns/')
  ) {
    return raw;
  }

  if (text.includes('penaguila')) return '/assets/uploads/poble/penaguila/img-pen-guila-main.jpg';
  if (text.includes('benimassot')) return '/assets/uploads/poble/benimassot/img-benimassot-main.jpg';
  if (text.includes('la torre') || text.includes('torre de les macanes')) return '/assets/uploads/poble/la-torre-de-les-macanes/img-la-torre-de-les-ma-anes-main.jpg';
  if (text.includes('benifallim')) return '/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png';
  if (text.includes('sella')) return '/assets/uploads/brain/nano_mercat_llaurador_1774197050578.png';
  if (text.includes('orxeta')) return '/assets/uploads/brain/aplec_danses_1774952191348.png';
  if (text.includes('relleu')) return '/assets/uploads/brain/nano_mel_font_roja_1774216345755.png';
  if (text.includes('alcoleja')) return '/assets/uploads/brain/art_trellat_v2_1774708257858.png';
  if (text.includes('xixona')) return '/assets/uploads/brain/hero_serrella_comic_1774709602282.png';
  if (text.includes('tibi')) return '/assets/uploads/brain/nano_oli_oliva_1774198089084.png';
  if (raw.startsWith('/assets/images/towns/')) return pickDeterministicImage(seed || text, TOWN_FALLBACK_IMAGES);

  return pickDeterministicImage(seed || text, TOWN_FALLBACK_IMAGES);
}

export { resolveTownImageUrl, TOWN_FALLBACK_IMAGES };
