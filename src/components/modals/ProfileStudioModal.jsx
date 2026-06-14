import { useRef, useState } from 'react';
import './ProfileStudioModal.css';
const ProfileStudioModal = ({
  isOpen,
  onClose,
  profile,
  isUploading,
  uploadType,
  onFileSelect,
  onReposition,
  onCaptureComplete // Prop per a gestionar la captura
}) => {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [captureTarget, setCaptureTarget] = useState(null); // 'avatar' | 'cover'

  if (!isOpen) return null;
  const handleCameraClick = target => {
    setCaptureTarget(target);
    setIsCaptureOpen(true);
  };
  const handleCapture = media => {
    if (onCaptureComplete) {
      onCaptureComplete(media, captureTarget);
    }
  };
  const displayProfile = profile || {};
  return <div className="studio-overlay">
            <div className="studio-content">
                <div role="region" aria-label="Capçalera de Secció" className="studio-header">
                    <div className="header-title">
                        <ImageIcon size={20} className="title-icon" />
                        <h3>Estudi de Perfil</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="studio-body">
                    <div className="studio-advice alzina-blindatge">
                        <p>🏺 <strong>Directiva Master:</strong> Utilitza imatges panoràmiques (16:9) per a la portada i quadrades (1:1) per al teu perfil.</p>
                    </div>

                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Identitat Visual (Icona / Noun Project)</h4>
                            <span className="aspect-badge">SOBIRANIA</span>
                        </div>
                        <IconPicker currentIcon={displayProfile.avatar_url} onSelect={icon => onFileSelect && onFileSelect({
            target: {
              value: icon
            }
          }, 'icon')} />
            
                    </div>

                    {/* Cover Section */}
                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Imatge de portada</h4>
                            <span className="aspect-badge">16:9</span>
                        </div>
                        <div className="cover-studio-section">
                            <div className="studio-preview cover-preview group/cover" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"} onClick={() => !displayProfile.cover_url && coverInputRef.current.click()} title={displayProfile.cover_url ? "Canviar portada" : "Afegir portada"} style={{
              cursor: 'pointer'
            }}>
                
                                {displayProfile.cover_url ? <img src={displayProfile.cover_url} alt="Cover Preview" style={{
                objectPosition: `50% ${displayProfile.cover_position_y ?? 50}%`
              }} /> : <div className="empty-preview">
                                        <ImageIcon size={32} style={{
                  marginBottom: 8,
                  opacity: 0.5
                }} />
                                        Premeu per a afegir portada
                                    </div>}

                                {/* Hover Adjust Hint per a la Portada */}
                                {displayProfile.cover_url && typeof onReposition === 'function' && <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity pointer-events-none z-dropdown bg-black/60" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                        <span className="bg-black/90 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[#F97316] shadow-xl backdrop-blur-sm border border-[#F97316]/50 mb-3">Ajusta l'Alt de Portada</span>
                                        <input type="range" min="0" max="100" value={displayProfile.cover_position_y ?? 50} onChange={e => onReposition(e.target.value)} className="w-48 h-2 rounded-xl accent-[#F97316] pointer-events-auto" title="Llisca per centrar la teua foto" />
                  
                                    </div>}
                            </div>

                            <div className="studio-action-bar items-center">
                                <button className="studio-btn primary alzina-upload-btn" onClick={e => {
                e.stopPropagation();
                coverInputRef.current.click();
              }} disabled={isUploading} title="Pujar de l'arxiu">
                  
                                    {isUploading && uploadType === 'cover' ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={20} />}
                                    Fitxer
                                </button>
                                <button className="studio-btn primary-batec" onClick={e => {
                e.stopPropagation();
                handleCameraClick('cover');
              }} disabled={isUploading}>
                  
                                    <Camera size={16} />
                                    Càmera
                                </button>
                                <button className="studio-btn primary light" onClick={e => {
                e.stopPropagation();
                coverInputRef.current.click();
              }} disabled={isUploading}>
                  
                                    <ImageIcon size={16} />
                                    Àlbum
                                </button>
                            </div>
                        </div>
                        <input type="file" ref={coverInputRef} onChange={e => typeof onFileSelect === 'function' && onFileSelect(e, 'cover')} style={{
            display: 'none'
          }} accept="image/jpeg, image/png, image/webp, image/*" />
            
                    </div>

                    {/* Avatar Section */}
                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Foto de perfil</h4>
                            <span className="aspect-badge">1:1</span>
                        </div>
                        <div className="avatar-studio-section">
                            <div className="avatar-studio-preview" onClick={() => !displayProfile.avatar_url && avatarInputRef.current.click()} title={displayProfile.avatar_url ? "Canviar foto" : "Afegir foto"} style={{
              cursor: 'pointer'
            }}>
                
                                <div className="avatar-big-preview">
                                    {displayProfile.avatar_url ? <img src={displayProfile.avatar_url} alt="Avatar Preview" /> : <div className="avatar-placeholder">
                                            <User size={40} color="var(--text-muted)" />
                                        </div>}
                                </div>
                            </div>

                            <div className="studio-action-bar items-center">
                                <button className="studio-btn primary alzina-upload-btn" onClick={e => {
                e.stopPropagation();
                avatarInputRef.current.click();
              }} disabled={isUploading}>
                  
                                    {isUploading && uploadType === 'avatar' ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                                    Fitxer
                                </button>
                                <button className="studio-btn primary-batec" onClick={e => {
                e.stopPropagation();
                handleCameraClick('avatar');
              }} disabled={isUploading}>
                  
                                    <Camera size={16} />
                                    Càmera
                                </button>
                                <button className="studio-btn primary light" onClick={e => {
                e.stopPropagation();
                avatarInputRef.current.click();
              }} disabled={isUploading}>
                  
                                    <ImageIcon size={16} />
                                    Àlbum
                                </button>
                            </div>
                        </div>
                        <input type="file" ref={avatarInputRef} onChange={e => typeof onFileSelect === 'function' && onFileSelect(e, 'avatar')} style={{
            display: 'none'
          }} accept="image/jpeg, image/png, image/webp, image/*" />
            
                    </div>
                </div>

                <footer className="studio-footer">
                    <button className="done-btn" onClick={onClose}>Fet</button>
                </footer>
            </div>

            <CaptureStudio isOpen={isCaptureOpen} onClose={() => setIsCaptureOpen(false)} onCapture={handleCapture} mode="photo" />
      
        </div>;
};
export default ProfileStudioModal;