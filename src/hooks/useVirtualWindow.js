import React from "react";

const OVERSCAN = 8;

export const useVirtualWindow = ({ itemCount, itemHeight, containerRef, overscan = OVERSCAN }) => {
  const [viewport, setViewport] = React.useState({ height: 0, scrollTop: 0 });

  React.useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const next = { height: node.clientHeight, scrollTop: node.scrollTop };
        setViewport((prev) => {
          if (prev.height === next.height && prev.scrollTop === next.scrollTop) return prev;
          return next;
        });
        rafId = null;
      });
    };

    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(onScroll);
    observer.observe(node);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      node.removeEventListener("scroll", onScroll);
    };
  }, [containerRef]);

  const totalHeight = itemCount * itemHeight;
  const visibleCount = Math.max(1, Math.ceil(viewport.height / itemHeight));
  const firstVisible = Math.max(0, Math.floor(viewport.scrollTop / itemHeight) - overscan);
  const lastVisible = Math.min(itemCount, firstVisible + visibleCount + overscan * 2);

  return {
    itemHeight,
    totalHeight,
    firstVisible,
    lastVisible,
    offsetY: firstVisible * itemHeight,
  };
};

export default useVirtualWindow;
