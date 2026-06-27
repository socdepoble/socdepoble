import { useState } from 'react';
import { useAttribution } from '../hooks/useAttribution';
import './AttributionBadge.css';

const AttributionBadge = ({ filename, sourceType, sourceLabel, sourceUrl }) => {
    const hookAttribution = useAttribution(filename);
    const [isExpanded, setIsExpanded] = useState(false);

    // Prioritize explicit props over hook-based attribution
    const author = sourceLabel || hookAttribution?.author || 'Font Desconeguda';
    const license = hookAttribution?.license || 'Domini Públic / Arxiu';
    const url = sourceUrl || hookAttribution?.url;
    const type = sourceType || (hookAttribution ? 'official' : 'unknown');

    const cleanAuthor = author.replace(/<[^>]*>?/gm, '').trim();

    return (
        <div
            className={`attribution-badge-container type-${type} ${isExpanded ? 'expanded' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
            }}
        >
            <div className="badge-pill">
                {type === 'iaia' ? <Sparkles size={12} className="info-icon" /> :
                    type === 'official' ? <ShieldCheck size={12} className="info-icon" /> :
                        <Info size={12} className="info-icon" />}
                <span className="compact-author">{cleanAuthor}</span>
            </div>

            {isExpanded && (
                <div className="attribution-popover animate-in">
                    <div className="popover-content">
                        <p className="popover-line"><strong>Origen:</strong> {type.toUpperCase()}</p>
                        <p className="popover-line"><strong>Detall:</strong> {cleanAuthor}</p>
                        {license && <p className="popover-line"><strong>Llicència:</strong> {license}</p>}
                        {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="source-link"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Veure font original <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttributionBadge;
