import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState('up');

  useEffect(() => {
    const getScrollTarget = () => document.getElementById('main-content') || window;
    const getScrollY = (target) => target === window ? window.scrollY : target.scrollTop;

    let lastScrollY = getScrollY(getScrollTarget());
    let ticking = false;

    const updateScrollDir = () => {
      const target = getScrollTarget();
      const currentScrollY = getScrollY(target);
      
      // Marge de "trellat" (10px) per a evitar tremolors a les pantalles tàctils
      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }
      setScrollDir(currentScrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    const target = getScrollTarget();
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, []);

  return scrollDir;
};
