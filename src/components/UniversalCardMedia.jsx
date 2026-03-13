import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import Watermark from './Watermark';

const UniversalCardMedia = ({ 
    item, 
    cardVariant, 
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer, 
    navigate 
}) => {
    const { t } = useTranslation();
    const [hasImageError, setHasImageError] = useState(false);

    const handleMediaClick = (e) => {
        e.stopPropagation();
        if (cardVariant === 'pobles') {
            const townId = item?.uuid || item?.id;
            navigate(`/pobles/${townId || 'de-la-torre'}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            const id = item?.uuid || item?.id;
            if(id) navigate(`/mercat/${id}`);
        } else if (mediaList && mediaList.length > 0) {
            openViewer(mediaList, 0);
        } else if (displayImage) {
            openViewer({ src: displayImage, title: displayTitle, type: 'image' });
        }
    };

    return (
        <div className="card-media-wrapper" onClick={handleMediaClick}>
            {mediaList && mediaList.length > 1 ? (
                <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
            ) : (
                <div className="w-full h-full relative group">
                    {(!displayImage || hasImageError) ? (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px', color: '#94a3b8' }}></div>
                            <div className="z-10 bg-white/10 backdrop-blur-sm p-4 rounded-[28px] mb-2 group-hover:scale-110 transition-transform duration-500">
                                <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 z-10">
                                {t('common.image') || "Imatge"}
                            </span>
                        </div>
                    ) : (
                        <Watermark variant={item?.theme === 'solemne' ? 'white' : 'white'} opacity={0.7}>
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="universal-card-media" 
                                loading="lazy" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openViewer({ src: displayImage, title: displayTitle, type: 'image' });
                                }}
                                style={{ cursor: 'zoom-in' }}
                                onError={() => setHasImageError(true)}
                            />
                            <div className="image-overlay-credits">
                                © SÓC DE POBLE / IAIA GENERATED
                            </div>
                        </Watermark>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversalCardMedia;
