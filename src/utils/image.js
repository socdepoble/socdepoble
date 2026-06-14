// src/utils/image.js
// Utilitats d'imatge i Storage

export function normalizeStorageUrl(url) {
  if (!url) return null;
  // Normalization logic: ensure absolute URL or convert storage path to CDN path
  if (url.startsWith('/')) return url;
  try {
    const u = new URL(url);
    return u.toString();
  } catch (e) {
    return url;
  }
}