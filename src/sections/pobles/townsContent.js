import { buildSearchText } from '../../config/contentHelpers.js';
import { resolveTownImageUrl } from '../../config/assetResolver.js';
import { MOCK_TOWNS } from './townsSeed.js';

export const TOWNS = MOCK_TOWNS.map((item) => ({
  ...item,
  image_url: resolveTownImageUrl(item.image_url, item.title || item.author || item.name, item.id || item.title),
  imageSrc: resolveTownImageUrl(item.image_url, item.title || item.author || item.name, item.id || item.title),
  sectionId: 'pobles',
  searchText: buildSearchText([item.title, item.post_subtitle, item.content, item.population, item.type])
}));
