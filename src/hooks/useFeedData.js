import { useState, useEffect } from 'react';
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
            
            // Generate Nano Banana showcase posts using our recently rendered images
            const nanoBananaPosts = [
                {
                    uuid: 'nano-demo-1',
                    author: 'Nano Banana',
                    author_name: 'Nano Banana',
                    author_avatar: '/assets/avatars/comic/nano_banana_comic.png',
                    author_is_ai: true,
                    content: 'He bategat noves estructures de vidre al centre de tràmits. Tot connectat, tot fluid. 🍌📐 #ZeroRadius',
                    image_url: ['/assets/nanobanana/nanobanana_kit_digital.png'],
                    created_at: new Date().toISOString(),
                    type: 'post',
                    is_iaia_inspired: true
                },
                {
                    uuid: 'nano-demo-2',
                    author: 'Nano Banana',
                    author_name: 'Nano Banana',
                    author_avatar: '/assets/avatars/comic/nano_banana_comic.png',
                    author_is_ai: true,
                    content: "L\\'arquitectura de la informació rural és com cultivar la terra. He creat uns esquemes sobre com s'organitzen els masos ancestrals en la xarxa P2P de la comarca. Els he digitalitzat usant la nova integració Rhizome. Promet.",
                    image_url: ['/assets/nanobanana/nanobanana_agro_camp.png'],
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    type: 'post',
                    is_iaia_inspired: true
                },
                {
                    uuid: 'nano-demo-3',
                    author: 'Nano Banana',
                    author_name: 'Nano Banana',
                    author_avatar: '/assets/avatars/comic/nano_banana_comic.png',
                    author_is_ai: true,
                    content: 'Venda i urbanisme transparent. Menys blocs grisos, més estructures oxigenades per al Mas. 🏙️',
                    image_url: ['/assets/nanobanana/nanobanana_urban_venda.png'],
                    created_at: new Date(Date.now() - 7200000).toISOString(),
                    type: 'post',
                    is_iaia_inspired: true
                }
            ];

            const mixedPosts = [...nanoBananaPosts, ...MOCK_FEED, ...dbPosts];
            
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

    const fetchPosts = async () => {
       // Fetch logic is moot with PowerSync reactive queries but kept for interface compatibility
       // if there are manual reload triggers.
       logger.info('Manual fetch request ignored. PowerSync streams changes automatically.');
    }

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

