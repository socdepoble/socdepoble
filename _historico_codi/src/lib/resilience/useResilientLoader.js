import { useState, useEffect, useCallback } from 'react';

/**
 * 🛡️ Anticòs: Càrrega de dades offline-first i resilient
 * Aquest hook prevé que l'extracció de dades col·lapse completament el component si cau la xarxa,
 * i permet injectar dades de recanvi per garantir la supervivència visual.
 */
export function useResilientLoader({ key, fetcher, staleTime = 300000, offlineFallback = null }) {
  const [data, setData] = useState(offlineFallback);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async () => {
    setStatus('loading');
    try {
      // Intentar extraure els donats (pot fallar en offline o rutes externes caigudes)
      const freshData = await fetcher();
      setData(freshData);
      setStatus('success');
      setError(null);
      // Aquí entraría lógica extra de "guardar a IndexedDB si freshData es un epub" per al cache (opcional/modular)
    } catch (err) {
      console.warn(`[useResilientLoader] Fallida de xarxa per la clau: ${key}`, err);
      // Fallback a l'estat offline
      if (offlineFallback) {
         setStatus('success'); // Fallback triomfa, no mostra error brut
      } else {
         setStatus('error');
         setError(err);
      }
    }
  }, [key, fetcher, offlineFallback]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    executeFetch();
  }, [executeFetch]);

  return {
    data,
    status,
    error,
    retry: executeFetch,
  };
}
