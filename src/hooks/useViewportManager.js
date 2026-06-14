import { useEffect } from 'react';

export function useViewportManager() {
  useEffect(() => {
    const updateViewport = (isAccessible) => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const content = isAccessible
        ? 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        : 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';

      if (viewport) {
        viewport.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    const isAccessible = localStorage.getItem('sp_accessibility') === 'true';
    updateViewport(isAccessible);

    const handler = (e) => updateViewport(e.detail.isAccessible);
    window.addEventListener('accessibilityChanged', handler);
    return () => window.removeEventListener('accessibilityChanged', handler);
  }, []);
}
