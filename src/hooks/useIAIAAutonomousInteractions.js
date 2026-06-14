import { useEffect, useRef } from 'react';
import { iaiaService } from '../core/services/iaiaService';
const IAIA_INITIAL_DELAY_MS = 10000;
const IAIA_INTERVAL_MS = 120000;
export const useIAIAAutonomousInteractions = ({
  isPlayground,
  isSuperAdmin,
  setPosts
}) => {
  const onInteractRef = useRef(null);
  
  // Per ara simularem que setPosts és el callback. Guardem en ref.
  useEffect(() => {
    onInteractRef.current = setPosts;
  }, [setPosts]);

  useEffect(() => {
    if (!isPlayground && !isSuperAdmin) return;
    
    let isMountedLocal = true;

    const triggerAutonomousInteraction = async () => {
      if (!isMountedLocal) return;
      const newPost = await iaiaService.generateAutonomousInteraction();
      if (newPost && isMountedLocal && onInteractRef.current) {
         onInteractRef.current(prev => [newPost, ...prev]);
      }
    };

    const initialTimer = setTimeout(triggerAutonomousInteraction, IAIA_INITIAL_DELAY_MS);
    const interval = setInterval(triggerAutonomousInteraction, IAIA_INTERVAL_MS);

    return () => {
      isMountedLocal = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isPlayground, isSuperAdmin]); // <-- Només el necessari. setPosts està en ref.
};