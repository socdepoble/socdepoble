import { supabaseService } from '../core/services/supabaseService';

const PENDING_BATEGATS_KEY = 'sdp_pending_bategats';

export const savePendingBategatToQueue = (postId, userId, tags) => {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_BATEGATS_KEY) || '[]');
    pending.push({ postId, userId, tags, timestamp: Date.now() });
    localStorage.setItem(PENDING_BATEGATS_KEY, JSON.stringify(pending));
  } catch (e) {
    console.error('Failed to add bategat to offline queue', e);
  }
};

export const getPendingBategats = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_BATEGATS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const clearPendingBategats = () => {
  localStorage.removeItem(PENDING_BATEGATS_KEY);
};

export const syncPendingBategatsOnce = async () => {
  const pending = getPendingBategats();
  if (pending.length === 0) return;

  console.log(`[Offline Sync] Sincronitzant ${pending.length} bategats pendents...`);
  
  for (const item of pending) {
    try {
      await supabaseService.togglePostConnection(item.postId, item.userId, item.tags || []);
    } catch (e) {
      console.error('[Offline Sync] Error syncing bategat', item, e);
    }
  }
  
  clearPendingBategats();
};
