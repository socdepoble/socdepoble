import { buildSearchText, firstMediaSource, toFeedSummary } from '../../config/contentHelpers.js';
import { MOCK_FEED } from './feedSeed.js';

export const FEED_POSTS = MOCK_FEED.map((item) => {
  const imageSrc = firstMediaSource(item.image_url || item.image);
  const summary = item.post_subtitle || item.description || toFeedSummary(item.content);

  return {
    ...item,
    sectionId: 'mur',
    imageSrc,
    summary,
    searchText: buildSearchText([
      item.title,
      item.post_subtitle,
      item.description,
      item.content,
      item.author,
      item.author_name,
      item.town_name,
      item.type
    ])
  };
});
