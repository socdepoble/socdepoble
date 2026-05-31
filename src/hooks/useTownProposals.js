import { useQuery } from '@powersync/react';

export const useTownProposals = (townId) => {
    // Reactive Query via PowerSync (Offline First)
    const query = `
        SELECT * FROM posts 
        WHERE type LIKE 'town_proposal_%' AND town_uuid = ? 
        ORDER BY bategats_count DESC, created_at DESC
    `;
    
    // We pass the raw UUID of the town to PowerSync
    const { data: proposals, isLoading } = useQuery(query, [townId]);
    
    // Process the proposals
    const processedProposals = (proposals || []).map(p => {
        let contentObj = {};
        try {
            contentObj = JSON.parse(p.content);
        } catch (e) {
            contentObj = { text: p.content }; // fallback
        }
        
        return {
            ...p,
            contentObj,
            image_url: p.image_url || (p.images ? JSON.parse(p.images)[0] : null)
        };
    });

    const getWinner = (type) => {
        const categoryProposals = processedProposals.filter(p => p.type === type);
        return categoryProposals.length > 0 && categoryProposals[0].bategats_count >= 0 
            ? categoryProposals[0] 
            : null;
    };

    const winners = {
        avatar: getWinner('town_proposal_avatar'),
        cover: getWinner('town_proposal_cover'),
        lema: getWinner('town_proposal_lema'),
        text: getWinner('town_proposal_text'),
    };

    return {
        proposals: processedProposals,
        winners,
        loading: isLoading
    };
};
