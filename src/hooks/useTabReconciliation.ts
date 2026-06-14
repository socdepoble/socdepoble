import { useEffect } from 'react';
import { usePostsStore } from '../domain/posts/usePostsStore';
import { getPendingMutations } from '../data/offline/mutation-queue';
export function useTabReconciliation() {
  useEffect(() => {
    const handleWakeUp = async () => {
      // Cuando el OS despierta la pestaña, NO confiamos en la RAM para los optimistas.
      if (document.visibilityState === 'visible') {
        const pendingQueue = await getPendingMutations();
        const pendingIds = new Set(pendingQueue.map(m => m.id));
        const store = usePostsStore.getState();

        // Limpiamos posts optimistas que el SW procesó mientras el OS tenía la pestaña suspendida (BFCache).
        let stateChanged = false;
        const reconciledPosts = store.posts.map(post => {
          if (post.isOptimistic && !pendingIds.has(post.uuid)) {
            stateChanged = true;
            return {
              ...post,
              isOptimistic: false,
              hasConflict: false
            };
          }
          return post;
        });
        if (stateChanged) {
          store.setPosts(reconciledPosts);
        }
      }
    };
    document.addEventListener('visibilitychange', handleWakeUp);
    return () => document.removeEventListener('visibilitychange', handleWakeUp);
  }, []);
}