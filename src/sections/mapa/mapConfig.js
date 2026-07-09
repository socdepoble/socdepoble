export const MAP_BBOX = '-0.61,38.50,-0.22,38.71';
export const MAP_CENTER = '38.5919,-0.4184';

export function buildMapEmbedUrl() {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik&marker=${MAP_CENTER}`;
}
