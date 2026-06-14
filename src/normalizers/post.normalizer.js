/**
 * post.normalizer.js
 * 
 * DeepSeek Audit Phase 12 Requirement: Adapter Layer.
 * Decouples business logic from UI components to ensure UniversalCard is purely presentational.
 */

export const normalizePostData = (rawItem, contextOverrides = {}) => {
  if (!rawItem) return null;

  // Adapter Logic: Determine if a post is considered 'official' 
  // without hardcoding business rules inside presentation layers.
  const isOfficial = contextOverrides.forcedOfficial || rawItem.author_role === 'official' || rawItem.author_role === 'oficial' || rawItem.type === 'oficial' || rawItem.type === 'system' || rawItem.type === 'bando' || rawItem.type === 'tramit' || rawItem.official === true;
  return {
    ...rawItem,
    isOfficial // Exposing the computed property for the UniversalCard
  };
};