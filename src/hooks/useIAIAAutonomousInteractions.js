import { useEffect, useRef } from 'react';
import { iaiaService } from '../services/iaiaService';

const IAIA_INITIAL_DELAY_MS = 10000;
const IAIA_INTERVAL_MS = 120000;

export const useIAIAAutonomousInteractions = ({ isPlayground, isSuperAdmin, setPosts }) => {
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (!isPlayground && !isSuperAdmin) return;

        const triggerAutonomousInteraction = async () => {
            const newPost = await iaiaService.generateAutonomousInteraction();
            if (newPost && isMounted.current) {
                setPosts(prev => [newPost, ...prev]);
            }
        };

        const initialTimer = setTimeout(triggerAutonomousInteraction, IAIA_INITIAL_DELAY_MS);
        const interval = setInterval(triggerAutonomousInteraction, IAIA_INTERVAL_MS);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isPlayground, isSuperAdmin, setPosts]);
};
