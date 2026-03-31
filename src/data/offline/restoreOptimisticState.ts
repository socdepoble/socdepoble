import { getPendingMutations } from './mutation-queue';
import { usePostsStore } from '../../domain/posts/usePostsStore';

export async function restoreOptimisticState() {
  try {
    const mutations = await getPendingMutations();
    const postMutations = mutations.filter(m => m.entity === 'posts' && m.action === 'CREATE');
    
    for (const mut of postMutations) {
      if (!usePostsStore.getState().posts.some(p => p.uuid === mut.payload.uuid)) {
          usePostsStore.getState().addOptimisticPost({ ...mut.payload, isOptimistic: true });
      }
    }
  } catch (err) {
    console.warn('Failed restoring pessimistic state:', err);
  }
}
