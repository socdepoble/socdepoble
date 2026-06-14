import React, { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export const FloatingScrollButton = React.memo(({ scrollContainerRef }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const btn = btnRef.current;
    if (!container || !btn) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (container.scrollTop > 300) {
          btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        } else {
          btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }
        ticking = false;
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Estat inicial
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  return (
    <button
      ref={btnRef}
      onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[5000] p-3 bg-sky-500 text-white rounded-full shadow-xl transition-all duration-300 opacity-0 pointer-events-none translate-y-4 hover:scale-110 active:scale-95"
      aria-label="Tornar a dalt"
    >
      <ArrowUp size={24} />
    </button>
  );
});

FloatingScrollButton.displayName = 'FloatingScrollButton';
