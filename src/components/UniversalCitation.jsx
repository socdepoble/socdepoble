import { useNavigate } from 'react-router-dom';
import { FileText, Image as ImageIcon, Music, Link, ExternalLink, Search, History } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { logger } from '../utils/logger';
import './UniversalCitation.css';

/**
 * UniversalCitation: El corazón de la VERDAD DE HIERRO.
 * Maneja navegación profunda basada en DIDs y anclajes semánticos.
 */
const UniversalCitation = ({ label, did, anchor }) => {
    const navigate = useNavigate();
    const { openViewer } = useUI();

    const handleClick = (e) => {
        e.stopPropagation();
        logger.info(`[Citation] Obrent Visor per a: ${did} [Anchor: ${anchor}]`);

        // Detección de tipo
        let type = 'DOC';
        if (anchor.includes('audit') || did.includes('audit')) type = 'COMPARISON';
        else if (anchor.includes('page=') || did.includes('doc:')) type = 'PDF';
        else if (anchor.includes('entity=') || did.includes('img:')) type = 'IMAGE';
        else if (anchor.includes('t=') || did.includes('aud:')) type = 'AUDIO';
        else if (anchor.includes('block=') || did.includes('note:')) type = 'TEXT';

        openViewer({ did, anchor, label, type });
    };

    const getIcon = () => {
        if (anchor.includes('audit') || did.includes('audit')) return <History size={12} />;
        if (anchor.includes('page=')) return <FileText size={12} />;
        if (anchor.includes('entity=')) return <ImageIcon size={12} />;
        if (anchor.includes('t=')) return <Music size={12} />;
        if (anchor.includes('search')) return <Search size={12} />;
        return <Link size={12} />;
    };

    return (
        <span className="universal-citation" onClick={handleClick} title={`Font: ${did}`}>
            {getIcon()}
            {label}
            <ExternalLink size={10} className="external-signal" />
        </span>
    );
};

export default UniversalCitation;
