import { useState, useEffect, useRef, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { generateEpub } from '../utils/epubExporter';

export const useUnifiedDocumentStore = (postId = 'draft', initialData = null) => {
  const [document, setDocument] = useState(initialData || {
    id: postId,
    title: '',
    content: '',
    lastSaved: null
  });
  
  const saveDebounce = useRef(null);
  
  const saveDocument = useCallback(async (docData) => {
    await set(`doc-${postId}`, docData);
  }, [postId]);

  useEffect(() => {
    let mounted = true;
    if (!initialData) {
      get(`doc-${postId}`).then(doc => {
        if (mounted && doc) setDocument(doc);
      });
    }
    return () => { mounted = false; };
  }, [postId, initialData]);

  const updateDocument = useCallback((patch) => {
    setDocument(prev => {
      const next = { ...prev, ...patch, lastSaved: Date.now() };
      
      // Auto-save debounce (8s) segons ISO Arquitecte
      clearTimeout(saveDebounce.current);
      saveDebounce.current = setTimeout(() => {
        saveDocument(next);
        
        // Auto-export silenciat mitjançant requestIdleCallback
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            // No cridem generateEpub de manera forçada aquí sense desig de descarregar
            // però el mecanisme queda parat pel flux "background"
          });
        }
      }, 8000);
      
      return next;
    });
  }, [saveDocument]);

  const triggerManualExport = async () => {
    const mdText = document.content;
    const blob = await generateEpub(document.title || 'Export', mdText, 'blob');
    const url = URL.createObjectURL(blob);
    return { url, filename: `${(document.title || 'Document').replace(/\s+/g, '_')}.epub` };
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveDocument(document);
    };
    const handleVisibilityChange = () => {
      if (window.document.visibilityState === 'hidden') saveDocument(document);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [document, saveDocument]);

  return { document, updateDocument, triggerManualExport, lastSaved: document.lastSaved, saveDocument };
};
