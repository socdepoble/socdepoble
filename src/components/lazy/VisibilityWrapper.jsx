import { useRef, useState, useEffect } from 'react';

export default function VisibilityWrapper({ 
  children, 
  rootMargin = '800px 0px', 
  threshold = 0,
  minHeightClass = ''
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [cachedHeight, setCachedHeight] = useState(null);

  useEffect(() => {
    let active = true;
    const el = containerRef.current;
    if (!el) return;

    // Use a robust observer to prevent scroll jumping by caching exact pixel height
    const observer = new IntersectionObserver(([entry]) => {
      if (!active) return;

      if (entry.isIntersecting) {
        setIsVisible(true);
      } else {
        // Record precise height just before collapsing content
        const rect = el.getBoundingClientRect();
        if (rect.height > 50) {
           setCachedHeight(rect.height);
        }
        setIsVisible(false);
      }
    }, {
      rootMargin,
      threshold
    });

    observer.observe(el);

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  // If we have a cached height and not visible, preserve the vertical space 
  // via a specific data-attribute or style, but we use a CSS var to maintain purity.
  const wrapperStyle = (!isVisible && cachedHeight) 
    ? { '--cached-height': `${cachedHeight}px`, minHeight: 'var(--cached-height)' } 
    : undefined;

  return (
    <div 
      ref={containerRef} 
      className={`w-full ${minHeightClass} visibility-wrapper-safe`}
      style={wrapperStyle}
    >
      {isVisible ? children : null}
    </div>
  );
}
