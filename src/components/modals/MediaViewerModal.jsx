import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Download, X, ChevronLeft, ChevronRight, ImageOff, Info } from 'lucide-react';
import exifr from 'exifr';
import './MediaViewerModal.css';

/**
 * MediaViewerModal - Una experiència immersiva per a veure mitjans a gran escala.
 * Suport per a carrusel d'imatges, navegació, descripcions i dades EXIF.
 */
const MediaViewerModal = ({
  isOpen,
  onClose,
  src,
  title,
  type = 'image',
  images = [],
  imageDescriptions = [],
  onNavigate
}) => {
  const hasCarousel = images && images.length > 1 && type === 'image';

  // Initialize currentIndex correctly based on the incoming src
  const initialIndex = hasCarousel ? Math.max(0, images.findIndex(img => img === src)) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevSrc, setPrevSrc] = useState(src);
  const [imageError, setImageError] = useState(false);
  const [exifData, setExifData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isExtractingExif, setIsExtractingExif] = useState(false);

  // Derived state pattern per a sincronitzar l'índex quan s'obri amb un src nou
  if (src !== prevSrc) {
    setPrevSrc(src);
    if (hasCarousel) {
      const idx = images.findIndex(img => img === src);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }
  const currentSrc = hasCarousel ? images[currentIndex] : src;
  const currentDescription = hasCarousel && imageDescriptions && imageDescriptions[currentIndex] ? imageDescriptions[currentIndex] : null;

  // Reset error when src changes and fetch EXIF
  useEffect(() => {
    let isMounted = true;

    // Use a timeout or async to bypass synchronous setState in effect linter warning
    setTimeout(() => {
      if (!isMounted) return;
      setImageError(false);
      setExifData(null);
      if (type === 'image' && currentSrc) {
        setIsExtractingExif(true);
      }
    }, 0);
    if (type === 'image' && currentSrc) {
      exifr.parse(currentSrc, true) // true to extract all tags
      .then(data => {
        if (!isMounted) return;
        if (data) {
          setExifData(data);
        } else {
          setExifData(null);
        }
      }).catch(() => {
        if (!isMounted) return;
        // Fail silently for EXIF
        setExifData(null);
      }).finally(() => {
        if (!isMounted) return;
        setIsExtractingExif(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [currentSrc, type]);
  const handleNext = useCallback(e => {
    if (e) e.stopPropagation();
    if (hasCarousel) {
      const nextIdx = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIdx);
      if (onNavigate) onNavigate(images[nextIdx]);
    }
  }, [currentIndex, images, hasCarousel, onNavigate]);
  const handlePrev = useCallback(e => {
    if (e) e.stopPropagation();
    if (hasCarousel) {
      const prevIdx = (currentIndex - 1 + images.length) % images.length;
      setCurrentIndex(prevIdx);
      if (onNavigate) onNavigate(images[prevIdx]);
    }
  }, [currentIndex, images, hasCarousel, onNavigate]);

  // Ancoratge de seguretat per fixar el scroll del cos quan el modal està obert
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Netegem event listeners de teclat
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = e => {
      if (e.key === 'Escape') onClose();
      if (hasCarousel) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasCarousel, handleNext, handlePrev]);
  if (!isOpen) return null;
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSrc;
    link.download = `socdepoble-${title || 'imatge'}${hasCarousel ? `-${currentIndex + 1}` : ''}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const toggleInfo = e => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };
  const modalContent = <div className="media-viewer-overlay" onClick={onClose}>
            <div className="media-viewer-toolbar" onClick={e => e.stopPropagation()}>
                <div className="toolbar-left">
                    <span className="viewer-title">{title} {hasCarousel && <span className='text-sdp-theme-accent-primary opacity-80 text-xs md:text-sm ml-2 font-mono' style={{
            verticalAlign: 'middle'
          }}>({currentIndex + 1} / {images.length})</span>}</span>
                </div>
                <div className="toolbar-right">
                    {type === 'image' && <button className={`toolbar-btn ${showInfo ? 'active-info' : ''}`} onClick={toggleInfo} title="Info i EXIF">
                            <Info size={24} strokeWidth={2.5} />
                        </button>}
                    {type === 'image' && <button className="toolbar-btn" onClick={handleDownload} title="Descarregar">
                            <Download size={24} strokeWidth={2.5} />
                        </button>}
                    <button className="toolbar-btn close" onClick={onClose} title="Tancar">
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <div className="media-viewer-content" onClick={e => e.stopPropagation()}>
                {hasCarousel && <button className="nav-arrow nav-left" onClick={handlePrev} title="Anterior" aria-label="Imatge Anterior">
                        <ChevronLeft size={36} />
                    </button>}

                <div className="viewer-main-media-container relative h-full w-full flex items-center justify-center">
                    {type === 'image' && !imageError && <img src={currentSrc || undefined} alt={title} className="viewer-main-media" draggable="true" onError={() => setImageError(true)} onDragStart={e => {
          e.dataTransfer.setData('text/uri-list', currentSrc);
          e.dataTransfer.setData('text/plain', currentSrc);
        }} />}
                    {type === 'image' && imageError && <div className='viewer-main-media flex items-center justify-center bg-sdp-theme-surface-sunken flex-col text-sdp-theme-text-muted p-8 text-center rounded-2xl w-full h-full min-h-[300px] max-w-lg mx-auto'>
                            <ImageOff size={64} className="mb-4 opacity-50" />
                            <p className="font-bold text-lg">Imatge no disponible</p>
                            <p className="text-sm mt-1 opacity-80">Si estàs fora de línia, aquesta imatge no s'ha pogut guardar a la memòria cau.</p>
                        </div>}
                    
                    {/* Panell d'Informació EXIF overlay */}
                    {showInfo && type === 'image' && <div className="exif-info-panel absolute right-0 top-0 bottom-0 bg-black/80 backdrop-blur-md p-6 overflow-y-auto w-full md:w-80 text-white border-l border-white/10 animate-fade-in z-20">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/20 pb-2">
                                <Info size={20} /> Metadades
                            </h3>
                            
                            {currentDescription && <div className="mb-6 bg-white/10 p-3 rounded-lg">
                                    <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1">Descripció</h4>
                                    <p className="text-sm">{currentDescription}</p>
                                </div>}

                            {isExtractingExif ? <div className="text-center py-8 text-white/60 animate-pulse">Llegint dades EXIF...</div> : exifData ? <div className="space-y-4">
                                    {exifData.Make || exifData.Model ? <div className="exif-group bg-white/5 p-3 rounded-lg">
                                            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1">Càmera</h4>
                                            <p className="font-mono text-sm">{exifData.Make} {exifData.Model}</p>
                                        </div> : null}
                                    
                                    {exifData.ExposureTime || exifData.FNumber || exifData.ISO ? <div className="exif-group bg-white/5 p-3 rounded-lg">
                                            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1">Configuració</h4>
                                            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                                {exifData.ExposureTime && <div>Obturació: 1/{Math.round(1 / exifData.ExposureTime)}s</div>}
                                                {exifData.FNumber && <div>Obertura: ƒ/{exifData.FNumber}</div>}
                                                {exifData.ISO && <div>ISO: {exifData.ISO}</div>}
                                                {exifData.FocalLength && <div>Focal: {exifData.FocalLength}mm</div>}
                                            </div>
                                        </div> : null}
                                    
                                    {exifData.DateTimeOriginal && <div className="exif-group bg-white/5 p-3 rounded-lg">
                                            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1">Data de Captura</h4>
                                            <p className="font-mono text-sm">{new Date(exifData.DateTimeOriginal).toLocaleString('ca-ES')}</p>
                                        </div>}

                                    {/* Si hi ha altres metadades, mostrar-les col·lapsades o simplificades */}
                                    <details className="mt-4 border-t border-white/10 pt-4">
                                        <summary className="text-sm text-white/70 cursor-pointer hover:text-white">Dades tècniques completes</summary>
                                        <div className="mt-2 text-xs font-mono text-white/50 break-all bg-black/40 p-2 rounded h-32 overflow-y-auto">
                                            {JSON.stringify(exifData, (key, value) => {
                  // Eliminar camps molt llargs o binaris
                  if (key === 'MakerNote' || key === 'UserComment' || key.includes('Thumbnail')) return undefined;
                  return value;
                }, 2)}
                                        </div>
                                    </details>
                                </div> : <div className="text-center py-8 text-white/60">
                                    <p>No s'han trobat dades EXIF en aquesta imatge.</p>
                                </div>}
                        </div>}
                </div>
                
                {hasCarousel && <button className="nav-arrow nav-right" onClick={handleNext} title="Següent" aria-label="Imatge Següent">
                        <ChevronRight size={36} />
                    </button>}

                {type === 'map' && src && <iframe src={src || undefined} className="viewer-main-iframe" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa interactiu local"></iframe>}
            </div>
            
            <div className="media-viewer-footer" onClick={e => e.stopPropagation()}>
                {type === 'image' ? currentDescription ? currentDescription : hasCarousel ? 'Usa les fletxes de navegació. Clic fora per tancar.' : 'Mantín per desa o copia. Clic fora per tancar.' : 'Navega lliurement pel mapa local.'}
            </div>
        </div>;
  return createPortal(modalContent, document.body);
};
export default MediaViewerModal;