import { useState, useEffect } from 'react';

/**
 * 🛡️ PREVENCIÓN DE MEMORY LEAK EN SAFARI
 * Obligatorio para renderizar previsualizaciones de archivos offline.
 * Garantiza la recolección de basura (Garbage Collection) en iOS.
 */
export function useSafeObjectUrl(blob) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!blob) return;

    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);

    // BARRERA CRÍTICA: Destruir el puntero en RAM al desmontar la vista de UI
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  return url;
}
