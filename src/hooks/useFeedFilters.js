import { useMemo } from 'react';
import { getVisibilityForLevel } from '../domain/iaiaDomain';
import { rhizomeManager } from '../core/services/rhizomeManager';

export const useFeedFilters = ({
    posts,
    contentMode,
    iaiaLevel,
    enabledAgentIds,
    selectedTag,
    contextualSearchTerm,
    isIAIAFiltering,
    activeTown,
    userConnections
}) => {
    return useMemo(() => {
        let filtered = posts;

        // 1. Content Mode Filter (Ara vs Arrel)
        filtered = filtered.filter(post => {
            const isArchive = post.metadata?.is_archive_debate || post.type === 'book' || post.category === 'Heritage';
            if (contentMode === 'batec' && isArchive) return false;
            if (contentMode === 'arrel' && !isArchive) return false;
            return true;
        });

        // 2. IAIA Level Filter
        filtered = filtered.filter(post => getVisibilityForLevel(iaiaLevel, post, enabledAgentIds));

        // 3. Tag Filter
        if (selectedTag) {
            filtered = filtered.filter(post => {
                const connection = userConnections.find(c => c.post_uuid === (post.uuid || post.id));
                return connection && connection.tags && connection.tags.includes(selectedTag);
            });
        }

        // 4. Contextual Search Filter
        if (contextualSearchTerm) {
            const normalized = contextualSearchTerm.toLowerCase();
            filtered = filtered.filter(post => 
                post.content?.toLowerCase().includes(normalized) ||
                post.author_name?.toLowerCase().includes(normalized) ||
                post.author?.toLowerCase().includes(normalized) ||
                post.excerpt?.toLowerCase().includes(normalized)
            );
        }

        // 5. IAIA Portera (Cognitive Filter Km 0)
        if (isIAIAFiltering) {
            const userPrefs = {
                primary_town_id: activeTown || 1, // Default to current town
                anchors: ['mel', 'poma', 'fusta', 'tradició', 'IAIA', 'Master']
            };
            filtered = rhizomeManager.cognitiveFilter(filtered, userPrefs);
        }

        // 6. Sorting logic
        return [...filtered].sort((a, b) => {
            const aPinned = a.is_pinned || a.metadata?.is_pinned || (typeof a.pinned_position !== 'undefined' && a.pinned_position !== null);
            const bPinned = b.is_pinned || b.metadata?.is_pinned || (typeof b.pinned_position !== 'undefined' && b.pinned_position !== null);
            
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            
            if (aPinned && bPinned) {
                const posA = a.pinned_position || a.metadata?.pinned_position || Infinity;
                const posB = b.pinned_position || b.metadata?.pinned_position || Infinity;
                if (posA !== posB) return posA - posB;
            }

            return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
        });
    }, [posts, selectedTag, isIAIAFiltering, activeTown, userConnections, contentMode, iaiaLevel, contextualSearchTerm, enabledAgentIds]);
};
