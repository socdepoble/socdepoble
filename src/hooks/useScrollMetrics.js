import { useRef, useEffect, useState } from 'react';

export function useScrollMetrics(scrollRef) {
  // Defecte 3: Utilitzem useState perquè UI s'actualitze (només dispara quan canvia)
  const [totalPages, setTotalPages] = useState(1);
  const pageNumberRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const updateMetrics = () => {
      if (rafIdRef.current) return;
      rafIdRef.current = requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        if (clientWidth <= 0) {
          rafIdRef.current = null;
          return;
        }

        const calculated = Math.max(1, Math.min(10000, Math.ceil(scrollWidth / clientWidth)));
        setTotalPages(prev => prev !== calculated ? calculated : prev);

        if (scrollWidth > clientWidth) {
          const percentage = scrollLeft / (scrollWidth - clientWidth);
          const current = Math.max(1, Math.min(calculated, Math.round(percentage * (calculated - 1)) + 1));
          if (pageNumberRef.current && pageNumberRef.current.textContent !== String(current)) {
            pageNumberRef.current.textContent = String(current);
          }
        } else if (pageNumberRef.current && pageNumberRef.current.textContent !== '1') {
          pageNumberRef.current.textContent = '1';
        }
        rafIdRef.current = null;
      });
    };

    const resizeObs = new ResizeObserver(updateMetrics);
    resizeObs.observe(scrollContainer);
    scrollContainer.addEventListener('scroll', updateMetrics, { passive: true });

    const t1 = setTimeout(updateMetrics, 500);
    const t2 = setTimeout(updateMetrics, 1500);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      resizeObs.disconnect();
      scrollContainer.removeEventListener('scroll', updateMetrics);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [scrollRef]);

  return {
    pageNumberRef,
    totalPages
  };
}