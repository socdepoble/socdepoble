import { useEffect } from 'react';
import { usePostsStore } from '../domain/posts/usePostsStore';
import { getChannel, TabMessage } from '../data/broadcast';

export function useMultiTabSync() {
  useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
          const msg = event.data as TabMessage;
          switch (msg.type) {
            case 'POST_CREATED':
              usePostsStore.getState().addOptimisticPost(msg.payload.post);
              break;
            case 'MUTATION_CONFIRMED':
              usePostsStore.getState().confirmPost(msg.payload.tempId, msg.payload.final);
              break;
            case 'POST_CONFLICT':
              usePostsStore.getState().markConflict(msg.payload.tempId);
              break;
          }
      };
      
      const channel = getChannel();
      channel.addEventListener('message', handleMessage);
      
      return () => {
          channel.removeEventListener('message', handleMessage);
      };
  }, []);
}
