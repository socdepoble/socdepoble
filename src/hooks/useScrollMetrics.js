import { useState, useEffect, useRef } from 'react';

export function useScrollMetrics(scrollRef) {
    const pageNumberRef = useRef(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let rafId = null;
        let resizeObs = null;

        const updateMetrics = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
                if (clientWidth <= 0) return;

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
            });
        };

        resizeObs = new ResizeObserver(updateMetrics);
        resizeObs.observe(scrollContainer);
        scrollContainer.addEventListener('scroll', updateMetrics, { passive: true });

        // Delay per a esperar que carreguen fonts i imatges
        const t1 = setTimeout(updateMetrics, 500);
        const t2 = setTimeout(updateMetrics, 1500);

        return () => {
            cancelAnimationFrame(rafId);
            resizeObs?.disconnect();
            scrollContainer.removeEventListener('scroll', updateMetrics);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [scrollRef]);

    return { pageNumberRef, totalPages };
}
