import { useState, useEffect } from 'react';
import { OfflineDocManager } from '../utils/offlineStorage';

export function useEpubOffline(epubUrl) {
  const [epubData, setEpubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const loadEpub = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Intenta recuperar d'IndexedDB (magatzem secundari OPFS/IDB)
        const cachedBlob = await OfflineDocManager.retrieve(epubUrl);
        if (cachedBlob) {
          const arrayBuffer = await cachedBlob.arrayBuffer();
          if (!cancelled) {
            setEpubData(arrayBuffer);
            setLoading(false);
          }
          return;
        }
        
        // 2. Fallback: fetch i emmagatzema per a pròximes vegades
        console.log(`[useEpubOffline] Descarregant EPUB per primera vegada: ${epubUrl}`);
        const response = await fetch(epubUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        if (!cancelled) {
          // Desarmar asíncronament a memòria (array buffer per al ReactReader d'aquesta sessió)
          const arrayBuffer = await blob.arrayBuffer();
          setEpubData(arrayBuffer);
          setLoading(false);
          
          // Esvair a IDB per a offline. Això es fa en background per no bloquejar.
          OfflineDocManager.store(epubUrl, blob, { title: epubUrl.split('/').pop() })
            .catch(err => console.warn('[useEpubOffline] Error emmagatzemant asíncronament:', err));
        }
      } catch (err) {
        console.error('[useEpubOffline] Error carregant ePub:', err);
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    };
    
    if (epubUrl) {
      loadEpub();
    } else {
      setLoading(false);
    }
    
    return () => { cancelled = true; };
  }, [epubUrl]);

  return { epubData, loading, error };
}
