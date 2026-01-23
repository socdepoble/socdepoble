import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Users, Save, X, File, Film, Image as ImageIcon } from 'lucide-react';
import './MediaDeduplicationModal.css';

const MediaDeduplicationModal = ({ isOpen, onClose, onConfirm, attributionData, pendingFile }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const mainSource = attributionData && attributionData.length > 0 ? attributionData[0] : null;
    const othersCount = attributionData ? attributionData.length - 1 : 0;

    const getFileIcon = () => {
        if (!pendingFile) return <Users size={24} color="var(--color-primary)" />;
        if (pendingFile.type.startsWith('image/')) return <ImageIcon size={24} color="var(--color-primary)" />;
        if (pendingFile.type.startsWith('video/')) return <Film size={24} color="var(--color-primary)" />;
        return <File size={24} color="var(--color-primary)" />;
    };

    const getFileTypeName = () => {
        if (!pendingFile) return t('media.type_file') || 'Fitxer';
        if (pendingFile.type.startsWith('image/')) return t('media.type_image') || 'Imatge';
        if (pendingFile.type.startsWith('video/')) return t('media.type_video') || 'Vídeo';
        return t('media.type_file') || 'Fitxer';
    };

    return (
        <div className="dedup-modal-overlay">
            <div className="dedup-modal-content">
                <button className="dedup-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="dedup-header">
                    <div className="dedup-icon-wrapper">
                        {getFileIcon()}
                    </div>
                    <h3>{getFileTypeName()} Compartit</h3>
                </div>

                <div className="dedup-body">
                    <p className="dedup-main-text">
                        {t('media.duplicate_desc_generic') || `Aquest ${getFileTypeName().toLowerCase()} ja és a la xarxa de Sóc de Poble. Per a estalviar espai i ser més sostenibles, compartirem l'asset original.`}
                    </p>

                    {mainSource && (
                        <div className="attribution-card">
                            <span className="attribution-label">Font original:</span>
                            <div className="attribution-user">
                                <span className="user-name">{mainSource.full_name}</span>
                                <span className="user-handle">@{mainSource.username}</span>
                            </div>
                            {othersCount > 0 && (
                                <p className="attribution-others">
                                    I compartit per {othersCount} {othersCount === 1 ? 'veí' : 'veïns'} més.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="dedup-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn-primary" onClick={onConfirm}>
                        <Save size={18} />
                        Usar versió compartida
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaDeduplicationModal;
