import React from 'react';
import { ExternalLink, Share2, Lock, Unlock, Hash, Calendar, Globe } from 'lucide-react';
import UniversalCard from './UniversalCard';
import './ResourceCard.css';

/**
 * ResourceCard [SQR-RAINDROP STYLE]
 * Adapta l'estètica Raindrop a les Directives Master (rectes i contrast).
 */
const ResourceCard = ({
    resource,
    onShare,
    onDelete,
    showActions = true
}) => {
    const {
        title,
        description,
        url,
        thumbnail_url,
        semantic_tags = [],
        scope,
        is_public,
        created_at
    } = resource;

    const domain = new URL(url).hostname;
    const date = new Date(created_at).toLocaleDateString();

    const headerAction = showActions && (
        <div className="resource-actions">
            {!is_public && (
                <button
                    className="btn-share-resource"
                    onClick={() => onShare(resource)}
                    title="Trastombar al Poble (Compartir)"
                >
                    <Share2 size={16} />
                </button>
            )}
            <div className={`privacy-indicator ${scope}`}>
                {is_public ? <Unlock size={14} /> : <Lock size={14} />}
            </div>
        </div>
    );

    return (
        <UniversalCard
            title={title}
            subtitle={domain}
            image={thumbnail_url || `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`}
            headerAction={headerAction}
            className={`resource-card-modern ${is_public ? 'is-public' : 'is-private'}`}
        >
            <div className="resource-content">
                {description && <p className="resource-desc">{description}</p>}

                <div className="resource-tags">
                    {semantic_tags.map((tag, i) => (
                        <span key={i} className="resource-tag">
                            <Hash size={10} /> {tag}
                        </span>
                    ))}
                </div>

                <div className="resource-meta">
                    <span className="resource-date">
                        <Calendar size={12} /> {date}
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-external-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Visitar <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </UniversalCard>
    );
};

export default ResourceCard;
