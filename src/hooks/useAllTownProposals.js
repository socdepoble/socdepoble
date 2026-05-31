import { useMemo } from 'react';
import { useQuery } from '@powersync/react';

export const useAllTownProposals = () => {
    // Fetch all proposals
    const query = `
        SELECT * FROM posts 
        WHERE type = 'town_proposal'
    `;
    
    const { data: allProposals, isLoading } = useQuery(query);
    
    const winningProposalsMap = useMemo(() => {
        if (!allProposals) return {};
        
        // Group by town_uuid
        const grouped = allProposals.reduce((acc, p) => {
            if (!acc[p.town_uuid]) acc[p.town_uuid] = [];
            acc[p.town_uuid].push(p);
            return acc;
        }, {});
        
        // Find the winner for each town
        const winners = {};
        for (const townId in grouped) {
            const townProposals = grouped[townId];
            
            // Sort by bategats_count DESC, created_at DESC
            townProposals.sort((a, b) => {
                const bCount = b.bategats_count || 0;
                const aCount = a.bategats_count || 0;
                if (bCount !== aCount) return bCount - aCount;
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            });
            
            // Only consider it a winner if it has > 0 votes
            if (townProposals[0] && townProposals[0].bategats_count > 0) {
                const winner = townProposals[0];
                let contentObj = {};
                try {
                    contentObj = JSON.parse(winner.content);
                } catch (e) {
                    contentObj = { description: winner.content };
                }
                
                winners[townId] = {
                    ...winner,
                    lema: contentObj.lema || '',
                    description: contentObj.description || '',
                    image_url: winner.image_url || (winner.images ? JSON.parse(winner.images)[0] : null)
                };
            }
        }
        
        return winners;
    }, [allProposals]);

    return {
        winningProposalsMap,
        loading: isLoading
    };
};
