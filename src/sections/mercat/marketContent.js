import { buildSearchText, firstMediaSource } from '../../config/contentHelpers.js';
import { MOCK_MARKET_ITEMS } from './marketSeed.js';

export const MARKET_ITEMS = MOCK_MARKET_ITEMS.map((item) => {
  const imageSrc = firstMediaSource(item.image_url || item.image || item.avatar_url);

  return {
    ...item,
    sectionId: 'mercat',
    imageSrc,
    searchText: buildSearchText([
      item.title,
      item.description,
      item.seller,
      item.tag,
      item.category_slug
    ])
  };
});
