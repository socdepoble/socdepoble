import React, { useRef, useState } from 'react';
import { X, Camera, Maximize, User, Loader2, Image as ImageIcon, Video, Smile } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import IconPicker from './IconPicker';
import CaptureStudio from './CaptureStudio';
import './ProfileStudioModal.css';

const ProfileStudioModal = ({
    isOpen,
    onClose,
    profile,
    isUploading,
    uploadType,
    onFileSelect,
    onReposition,
    onAlbumSelect,
    onCaptureComplete // Prop per a gestionar la captura
}) => {
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [captureTarget, setCaptureTarget] = useState(null); // 'avatar' | 'cover'

    if (!isOpen) return null;

    const handleCameraClick = (target) => {
        setCaptureTarget(target);
        setIsCaptureOpen(true);
    };

    const handleCapture = (media) => {
        if (onCaptureComplete) {
            onCaptureComplete(media, captureTarget);
        }
    };

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
                    <div className="studio-advice alzina-blindatge">
                        <p>🏺 <strong>Directiva Master:</strong> Utilitza imatges panoràmiques (16:9) per a la portada i quadrades (1:1) per al teu perfil.</p>
                    </div>

                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Identitat Visual (Icona / Noun Project)</h4>
                            <span className="aspect-badge">SOBIRANIA</span>
                        </div>
                        <IconPicker 
                            currentIcon={displayProfile.avatar_url} 
                            onSelect={(icon) => onFileSelect && onFileSelect({ target: { value: icon } }, 'icon')}
                        />
                    </div>

                    {/* Cover Section */}
                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Imatge de portada</h4>
                            <span className="aspect-badge">16:9</span>
                        </div>
                        <div className="cover-studio-section">
                            <div
                                className="studio-preview cover-preview"
                                onClick={() => !displayProfile.cover_url && coverInputRef.current.click()}
                                title={displayProfile.cover_url ? "Canviar o resituar portada" : "Afegir portada"}
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
                            </div>

                            <div className="studio-action-bar items-center">
                                <button
                                    className="studio-btn primary alzina-upload-btn"
                                    onClick={(e) => { e.stopPropagation(); coverInputRef.current.click(); }}
                                    disabled={isUploading}
                                    title="Pujar de l'arxiu"
                                >
                                    {isUploading && uploadType === 'cover' ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={20} />}
                                    <span>Pujar Fitxer</span>
                                </button>
                                <button
                                    className="studio-btn primary-batec"
                                    onClick={(e) => { e.stopPropagation(); handleCameraClick('cover'); }}
                                    disabled={isUploading}
                                >
                                    <Camera size={16} />
                                    <span>Càmera</span>
                                </button>
                                {displayProfile.cover_url && (
                                    <button
                                        className="studio-btn primary light"
                                        onClick={(e) => { e.stopPropagation(); onReposition('cover'); }}
                                        disabled={isUploading}
                                        title="Enquadrar o resituar la imatge actual"
                                    >
                                        <Maximize size={16} />
                                        <span>Resituar</span>
                                    </button>
                                )}
                                <button
                                    className="studio-btn primary light"
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
                            onChange={(e) => typeof onFileSelect === 'function' && onFileSelect(e, 'cover')}
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
                        <div className="avatar-studio-section">
                            <div
                                className="studio-preview avatar-studio-preview"
                                onClick={() => !displayProfile.avatar_url && avatarInputRef.current.click()}
                                title={displayProfile.avatar_url ? "Canviar o resituar foto" : "Afegir foto"}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="avatar-big-preview">
                                    {displayProfile.avatar_url ? (
                                        <img src={displayProfile.avatar_url} alt="Avatar Preview" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <User size={40} color="var(--text-muted)" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="studio-action-bar items-center">
                                <button
                                    className="studio-btn primary"
                                    onClick={(e) => { e.stopPropagation(); avatarInputRef.current.click(); }}
                                    disabled={isUploading}
                                >
                                    {isUploading && uploadType === 'avatar' ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                                    <span>Fitxer</span>
                                </button>
                                <button
                                    className="studio-btn primary-batec"
                                    onClick={(e) => { e.stopPropagation(); handleCameraClick('avatar'); }}
                                    disabled={isUploading}
                                >
                                    <Camera size={16} />
                                    <span>Càmera</span>
                                </button>
                                {displayProfile.avatar_url && (
                                    <button
                                        className="studio-btn primary light"
                                        onClick={(e) => { e.stopPropagation(); onReposition('avatar'); }}
                                        disabled={isUploading}
                                    >
                                        <Maximize size={16} />
                                        <span>Resituar</span>
                                    </button>
                                )}
                                <button
                                    className="studio-btn primary light"
                                    onClick={(e) => { e.stopPropagation(); onAlbumSelect('avatar'); }}
                                    disabled={isUploading}
                                >
                                    <ImageIcon size={16} />
                                    <span>Àlbum</span>
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={(e) => typeof onFileSelect === 'function' && onFileSelect(e, 'avatar')}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>
                </div>

                <footer className="studio-footer">
                    <button className="done-btn" onClick={onClose}>Fet</button>
                </footer>
            </div>

            <CaptureStudio
                isOpen={isCaptureOpen}
                onClose={() => setIsCaptureOpen(false)}
                onCapture={handleCapture}
                mode="photo"
            />
        </div>
    );
};

export default ProfileStudioModal;
