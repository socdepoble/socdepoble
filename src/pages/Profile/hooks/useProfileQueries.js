import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '../../../services/supabaseService';

/**
 * useProfileQueries
 * Specialized React Query hooks for Profile data management.
 * Eliminates waterfalls and provides system-wide caching.
 */

export const useProfileQueries = (userId) => {
    // 1. User Stats Query
    const statsQuery = useQuery({
        queryKey: ['profile-stats', userId],
        queryFn: async () => {
            const [posts, items, followers] = await Promise.all([
                supabaseService.getUserPosts(userId),
                supabaseService.getUserMarketItems(userId),
                supabaseService.getFollowers(userId)
            ]);
            return {
                posts: posts?.length || 0,
                items: items?.length || 0,
                connections: followers?.length || 0
            };
        },
        enabled: !!userId,
    });

    // 2. Profile Details Query
    const profileQuery = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => supabaseService.getProfile(userId),
        enabled: !!userId,
    });

    // 3. User Entities Query
    const entitiesQuery = useQuery({
        queryKey: ['user-entities', userId],
        queryFn: () => supabaseService.getUserEntities(userId),
        enabled: !!userId,
    });

    return {
        stats: statsQuery.data || { posts: 0, items: 0, connections: 0 },
        isLoadingStats: statsQuery.isLoading,
        profile: profileQuery.data,
        isLoadingProfile: profileQuery.isLoading,
        entities: entitiesQuery.data || [],
        isLoadingEntities: entitiesQuery.isLoading,
        // Combined loading state
        isLoading: statsQuery.isLoading || profileQuery.isLoading
    };
};
