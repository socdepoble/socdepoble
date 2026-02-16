import React from 'react';
import { ExternalLink, Share2, Lock, Unlock, Hash, Calendar } from 'lucide-react';
import UniversalCard from './UniversalCard';
import './ResourceCard.css';

/**
 * ResourceCard - Component per visualitzar recursos del Directori
 */
const ResourceCard = ({
    resource,
    onShare,
    showActions = true
}) => {
    const {
        title,
        description,
        type,
        privacy,
        url,
        tags = [],
        author,
        created_at
    } = resource;

    const getIconForType = (type) => {
        switch (type?.toLowerCase()) {
            case 'enllaç': return <ExternalLink size={18} />;
            case 'esdeveniment': return <Calendar size={18} />;
            default: return <Hash size={18} />;
        }
    };

    return (
        <UniversalCard 
            className="resource-card-modern"
            cardVariant="mercat"
        >
            <div className="resource-header flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="resource-type-icon p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                        {getIconForType(type)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary)] opacity-60">
                        {type || 'Recurs'}
                    </span>
                </div>
                <div className="resource-privacy-badge">
                    {privacy === 'privat' ? <Lock size={14} className="text-red-400" /> : <Unlock size={14} className="text-green-400" />}
                </div>
            </div>

            <h3 className="resource-title text-xl font-black text-white mb-2 leading-tight">
                {title}
            </h3>
            
            <p className="resource-description text-sm text-gray-400 mb-4 line-clamp-2">
                {description}
            </p>

            <div className="resource-tags flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => (
                    <span key={i} className="text-[9px] px-2 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5 uppercase font-black">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="resource-footer flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <div className="resource-author flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold">
                        {author || 'Anònim'} • {created_at ? new Date(created_at).toLocaleDateString() : 'Recent'}
                    </span>
                </div>
                
                {showActions && (
                    <div className="flex items-center gap-2">
                        {url && (
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-[var(--color-primary)] hover:text-white transition-all text-gray-400 rounded-lg"
                            >
                                <ExternalLink size={18} />
                            </a>
                        )}
                        <button 
                            onClick={() => onShare && onShare(resource)}
                            className="p-2 hover:bg-white/10 transition-all text-gray-400 rounded-lg"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                )}
            </div>
        </UniversalCard>
    );
};

export default ResourceCard;
