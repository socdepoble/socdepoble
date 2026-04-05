import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (ref, callback, options = {}) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (callbackRef.current) {
          callbackRef.current(entry.isIntersecting);
        }
      });
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);
};
