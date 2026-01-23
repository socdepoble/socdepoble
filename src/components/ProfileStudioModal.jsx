import React, { useRef } from 'react';
import { X, Camera, Maximize, User, Loader2, Image as ImageIcon } from 'lucide-react';
import './ProfileStudioModal.css';

const ProfileStudioModal = ({
    isOpen,
    onClose,
    profile,
    isUploading,
    uploadType,
    onFileSelect,
    onReposition,
    onAlbumSelect
}) => {
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    if (!isOpen) return null;

    const displayProfile = profile || {};

    return (
        <div className="studio-overlay">
            <div className="studio-content">
                <header className="studio-header">
                    <div className="header-title">
                        <ImageIcon size={20} className="title-icon" />
                        <h3>Estudi de Perfil</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </header>

                <div className="studio-body">
                    <div className="studio-advice">
                        <p>💡 <strong>Consell:</strong> Per a millors resultats, utilitza imatges panoràmiques per a la portada i quadrades per al perfil.</p>
                    </div>

                    {/* Cover Section */}
                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Imatge de portada</h4>
                            <span className="aspect-badge">16:9</span>
                        </div>
                        <div
                            className="studio-preview cover-preview"
                            onClick={() => !displayProfile.cover_url && coverInputRef.current.click()}
                            title={displayProfile.cover_url ? "Resituar o canviar portada" : "Afegir portada"}
                            style={{ cursor: 'pointer' }}
                        >
                            {displayProfile.cover_url ? (
                                <img src={displayProfile.cover_url} alt="Cover Preview" />
                            ) : (
                                <div className="empty-preview">
                                    <ImageIcon size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                                    <span>Premeu per a afegir portada</span>
                                </div>
                            )}
                            <div className="preview-overlay">
                                <button
                                    className="studio-btn primary"
                                    onClick={() => coverInputRef.current.click()}
                                    disabled={isUploading}
                                    title="Pujar nova imatge"
                                >
                                    {isUploading && uploadType === 'cover' ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                                    <span>Nova Portada</span>
                                </button>
                                {displayProfile.cover_url && (
                                    <button
                                        className="studio-btn secondary highlight"
                                        onClick={(e) => { e.stopPropagation(); onReposition('cover'); }}
                                        disabled={isUploading}
                                        title="Enquadrar o resituar la imatge actual"
                                    >
                                        <Maximize size={16} />
                                        <span>Resituar</span>
                                    </button>
                                )}
                                <button
                                    className="studio-btn secondary"
                                    onClick={(e) => { e.stopPropagation(); onAlbumSelect('cover'); }}
                                    disabled={isUploading}
                                >
                                    <ImageIcon size={16} />
                                    <span>Àlbum</span>
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={(e) => onFileSelect(e, 'cover')}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>

                    {/* Avatar Section */}
                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Foto de perfil</h4>
                            <span className="aspect-badge">1:1</span>
                        </div>
                        <div className="studio-preview avatar-studio-preview">
                            <div
                                className="avatar-big-preview"
                                onClick={() => avatarInputRef.current.click()}
                                title="Canviar foto de perfil"
                                style={{ cursor: 'pointer' }}
                            >
                                {displayProfile.avatar_url ? (
                                    <img src={displayProfile.avatar_url} alt="Avatar Preview" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <User size={40} color="var(--text-muted)" />
                                        <div className="add-overlay"><Camera size={16} /></div>
                                    </div>
                                )}
                            </div>
                            <div className="preview-actions">
                                <button
                                    className="studio-btn primary"
                                    onClick={() => avatarInputRef.current.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading && uploadType === 'avatar' ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                                    <span>Canviar foto</span>
                                </button>
                                <div className="action-row">
                                    <button
                                        className="studio-btn secondary"
                                        onClick={() => onAlbumSelect('avatar')}
                                        disabled={isUploading}
                                    >
                                        <ImageIcon size={16} />
                                        <span>Álbum</span>
                                    </button>
                                    {displayProfile.avatar_url && (
                                        <button
                                            className="studio-btn secondary"
                                            onClick={() => onReposition('avatar')}
                                            disabled={isUploading}
                                        >
                                            <Maximize size={16} />
                                            <span>Resituar</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={(e) => onFileSelect(e, 'avatar')}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>
                </div>

                <footer className="studio-footer">
                    <button className="done-btn" onClick={onClose}>Fet</button>
                </footer>
            </div>
        </div>
    );
};

export default ProfileStudioModal;
