import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@powersync/react';
import { logger } from '../utils/logger';
import { MOCK_FEED } from '../data';

export const useFeedData = ({ activeTown, townName, customPosts, isPlayground, user, iaiaLevel, selectedRole }) => {
    // If customPosts are provided (like from Profile or Town specific views), prioritize them.
    const [postsState, setPostsState] = useState(customPosts || []);

    // Reactive Query via PowerSync (Offline First)
    // LWW and CRDT automatic sync managed by PowerSync internal workers.
    const query = activeTown && activeTown !== 'global' 
        ? 'SELECT * FROM posts WHERE town_uuid = ? ORDER BY created_at DESC'
        : 'SELECT * FROM posts ORDER BY created_at DESC';
    
    const params = activeTown && activeTown !== 'global' ? [activeTown] : [];
    
    // PowerSync reacts to local and remote changes via WebWorkers automatically.
    const { data: psPosts, isLoading } = useQuery(query, params);

    useEffect(() => {
        if (!customPosts) {
            // Mix the MOCK_FEED (Lore) with the dynamic DB posts so the wall is never empty
            const dbPosts = psPosts || [];
            
            const mixedPosts = [...MOCK_FEED, ...dbPosts];
            
            // Remove duplicates by ID (just in case)
            const uniquePosts = mixedPosts.reduce((acc, current) => {
                const x = acc.find(item => (item.uuid || item.id) === (current.uuid || current.id));
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            setPostsState(uniquePosts);
        }
    }, [psPosts, customPosts]);

    const fetchPosts = useCallback(async () => {
       // Fetch logic is moot with PowerSync reactive queries but kept for interface compatibility
       // if there are manual reload triggers.
       logger.info('Manual fetch request ignored. PowerSync streams changes automatically.');
    }, []);

    return {
        posts: postsState,
        setPosts: setPostsState,
        userConnections: [], // Simplify connections / bategats to rely on relations directly in the future
        loading: isLoading && !customPosts,
        error: null,
        page: 0,
        hasMore: false, // Infinite list managed by TanStack virtualizer rather than chunked API paginations
        loadingMore: false,
        fetchPosts
    };
};

