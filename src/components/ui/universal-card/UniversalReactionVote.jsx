import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { supabaseService } from '../../../core/services/supabaseService';
import { useAuth } from '../../../app/context/AuthContext';

export default function UniversalReactionVote({ targetId, targetType, initialVotes = 0, initialHasVoted = false, authorId }) {
    const { user } = useAuth();
    const [votes, setVotes] = useState(initialVotes);
    const [hasVoted, setHasVoted] = useState(initialHasVoted);
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async () => {
        if (!user) {
            alert("Has d'iniciar sessió per reaccionar.");
            return;
        }

        // Prevent multiple simultaneous clicks
        if (isVoting) return;
        
        setIsVoting(true);
        // Optimistic update
        setHasVoted(!hasVoted);
        setVotes(prev => hasVoted ? prev - 1 : prev + 1);

        try {
            await supabaseService.toggleVote(targetId, user.id);
        } catch (error) {
            console.error("Error voting:", error);
            // Revert optimistic update on error
            setHasVoted(hasVoted);
            setVotes(prev => hasVoted ? prev + 1 : prev - 1);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <button 
            onClick={handleVote}
            disabled={isVoting}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all transform active:scale-90
                ${hasVoted 
                    ? 'bg-[#FF6D23]/20 text-[#FF6D23] border border-[#FF6D23]/30' 
                    : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-transparent hover:bg-black/10 dark:hover:bg-white/10'
                }`}
            aria-label="Votar proposta"
        >
            <ThumbsUp size={16} className={hasVoted ? "fill-current" : ""} />
            <span>{votes > 0 ? votes : 'Votar'}</span>
        </button>
    );
}
