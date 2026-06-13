import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

const extractYouTubeId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (videoId, quality = 'maxresdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

const UniversalVideo = ({ videoUrl, title = 'Vídeo', className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [videoId, setVideoId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const id = extractYouTubeId(videoUrl);
    setVideoId(id);
    if (id) {
      setThumbnail(getYouTubeThumbnail(id));
    }
  }, [videoUrl]);

  if (!videoId) return null;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full rounded-genesis overflow-hidden bg-theme-panel border border-border-master shadow-sm group ${className}`}
    >
      {!isLoaded ? (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => setIsLoaded(true)}
          role="button"
          aria-label={`Reproduir vídeo: ${title}`}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsLoaded(true); }}
        >
          {thumbnail && (
            <img
              src={thumbnail}
              alt={`Miniatura del vídeo: ${title}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
              loading="lazy"
            />
          )}
          {/* Overlay subtil per donar contrast al botó de play */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-brand-orange/90 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <Play size={32} className="text-white ml-2" fill="currentColor" />
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="absolute inset-0 w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};

export default React.memo(UniversalVideo);
