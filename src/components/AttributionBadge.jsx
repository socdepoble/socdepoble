import { useState } from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { useAttribution } from '../hooks/useAttribution';
import './AttributionBadge.css';

const AttributionBadge = ({ filename }) => {
    const attribution = useAttribution(filename);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!attribution) return null;

    const { author, license, url } = attribution;

    // Clean up author name (remove HTML tags often present in Wikimedia metadata)
    const cleanAuthor = author.replace(/<[^>]*>?/gm, '').trim();

    return (
        <div
            className={`attribution-badge-container ${isExpanded ? 'expanded' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
            }}
        >
            <div className="badge-pill">
                <Info size={12} className="info-icon" />
                <span className="compact-author">© {cleanAuthor}</span>
            </div>

            {isExpanded && (
                <div className="attribution-popover animate-in">
                    <div className="popover-content">
                        <p className="popover-line"><strong>Autor:</strong> {cleanAuthor}</p>
                        <p className="popover-line"><strong>Llicència:</strong> {license}</p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="source-link"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Veure font original <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttributionBadge;
