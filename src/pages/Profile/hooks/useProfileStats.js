import { useState, useEffect } from 'react';
import { supabaseService } from '../../../services/supabaseService';
import { logger } from '../../../utils/logger';

export const useProfileStats = (user) => {
    const [stats, setStats] = useState({ posts: 0, items: 0, connections: 0 });

    useEffect(() => {
        if (user?.id) {
            Promise.all([
                supabaseService.getUserPosts(user.id),
                supabaseService.getUserMarketItems(user.id),
                supabaseService.getFollowers(user.id)
            ]).then(([posts, items, followers]) => {
                setStats({
                    posts: posts?.length || 0,
                    items: items?.length || 0,
                    connections: followers?.length || 0
                });
            }).catch(err => {
                logger.error('Error fetching profile stats:', err);
                setStats({ posts: 0, items: 0, connections: 0 });
            });
        }
    }, [user?.id]);

    return stats;
};
