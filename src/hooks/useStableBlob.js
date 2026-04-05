import { useState, useEffect, useRef } from 'react';

export function useStableBlob(blobPromise) {
  const [url, setUrl] = useState(null);
  const currentUrlRef = useRef(null);

  useEffect(() => {
    let active = true;

    if (!blobPromise) {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
        setTimeout(() => {
          if (active) setUrl(null);
        }, 0);
      }
      return;
    }

    blobPromise.then(blob => {
      if (!active || !blob) return;

      const objectUrl = URL.createObjectURL(blob);

      // Truc per precargar abans de pintar i evitar el FOUC
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        if (active) {
          if (currentUrlRef.current && currentUrlRef.current !== objectUrl) {
            URL.revokeObjectURL(currentUrlRef.current);
          }
          currentUrlRef.current = objectUrl;
          setUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      };
      
      img.onerror = () => {
        if (!active) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    });

    return () => {
      active = false;
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
    };
  }, [blobPromise]);

  return url;
}
