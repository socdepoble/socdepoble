import { useState, useRef, useCallback, useEffect } from 'react';

export function useEphemeralUI() {
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
  const [mediaViewerImages, setMediaViewerImages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const openMediaViewer = useCallback((src, images = []) => {
    setMediaViewerSrc(src);
    setMediaViewerImages(images);
  }, []);

  const closeMediaViewer = useCallback(() => {
    setMediaViewerSrc(null);
    setMediaViewerImages([]);
  }, []);

  return {
    scrollContainerRef,
    contentRef,
    mediaViewerSrc,
    mediaViewerImages,
    isFullscreen,
    toggleFullscreen,
    openMediaViewer,
    closeMediaViewer,
  };
}
