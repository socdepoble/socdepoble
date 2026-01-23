import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCcw } from 'lucide-react';
import './UnifiedStatus.css';

const UnifiedStatus = ({
    type = 'loading',
    message = '',
    onRetry = null,
    fullScreen = false,
    inline = false
}) => {
    const containerClass = `unified-status ${fullScreen ? 'full-screen' : ''} ${inline ? 'inline' : ''} ${type}`;

    const getIcon = () => {
        switch (type) {
            case 'loading': return <Loader2 className="spinner" size={fullScreen ? 48 : 32} />;
            case 'error': return <AlertCircle className="status-icon error" size={fullScreen ? 48 : 32} />;
            case 'empty': return <Inbox className="status-icon empty" size={fullScreen ? 48 : 32} />;
            default: return null;
        }
    };

    const getDefaultMessage = () => {
        switch (type) {
            case 'loading': return 'Carregant...';
            case 'error': return 'S\'ha produït un error en carregar les dades.';
            case 'empty': return 'No hi ha contingut disponible en aquest moment.';
            default: return '';
        }
    };

    return (
        <div className={containerClass}>
            <div className="status-content">
                {getIcon()}
                <p className="status-message">{message || getDefaultMessage()}</p>
                {type === 'error' && onRetry && (
                    <button onClick={onRetry} className="btn-retry">
                        <RefreshCcw size={16} />
                        <span>Tornar a intentar</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default UnifiedStatus;
