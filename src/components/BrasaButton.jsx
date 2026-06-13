import React, { useRef, useEffect } from "react";
import useSpriteAnimator from "../hooks/useSpriteAnimator";

const sequences = {
  overload: [
    { selector: '[data-part="spark"]', className: "anim-spark", delay: 0, duration: 900 },
    { selector: '[data-part="smoke"]', className: "anim-smoke", delay: 200, duration: 1600 },
    { selector: '[data-part="led"]', className: "anim-led", delay: 300, duration: 1200 },
    { selector: '[data-part="text"]', className: "anim-pop", delay: 600, duration: 1200 }
  ],
  success: [
    { selector: '[data-part="led"]', className: "anim-led", delay: 0, duration: 900 },
    { selector: '[data-part="bits"]', className: "anim-bits", delay: 120, duration: 1400 }
  ],
  playful: [
    { selector: '[data-part="tail"]', className: "anim-tail", delay: 0, duration: 900 },
    { selector: '[data-part="pendrive"]', className: "anim-pendrive", delay: 80, duration: 900 }
  ]
};

export default function BrasaButton({ children }) {
  const ref = useRef(null);
  const { trigger } = useSpriteAnimator(ref, sequences);

  useEffect(() => {
    // optional: start idle micro-animation when visible
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) el.classList.add("sprite-visible");
        else el.classList.remove("sprite-visible");
      });
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="inline-block group" role="region" aria-label="Brasa control">
      <button
        onClick={() => trigger("overload")}
        onMouseEnter={() => trigger("playful")}
        className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
      >
        {children}
      </button>
    </div>
  );
}
