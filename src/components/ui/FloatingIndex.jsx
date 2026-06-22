import React, { useState, useEffect, useRef } from 'react';
import { Book, ChevronUp } from 'lucide-react';
import { Button } from './Button/Button';
const FloatingIndex = ({
  scrollRef,
  contentSelector = '.app-cms-content',
  isOpen,
  onToggle,
  isPinned = false,
  onPinToggle,
  width,
  onDragStart
}) => {
  const [internalShowIndex, setInternalShowIndex] = useState(false);
  const showIndex = isOpen !== undefined ? isOpen : internalShowIndex;
  const setShowIndex = onToggle !== undefined ? onToggle : setInternalShowIndex;
  const [headings, setHeadings] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const indexRef = useRef(null);
  useEffect(() => {
    if (!showIndex) return;
    const contentDivs = document.querySelectorAll(contentSelector);
    if (!contentDivs || contentDivs.length === 0) return;
    const timer = setTimeout(() => {
      let hTags = [];
      contentDivs.forEach(div => {
        hTags = hTags.concat(Array.from(div.querySelectorAll('h1, h2, h3, h4, h5, h6')));
      });
      const hList = hTags.map((el, i) => {
        if (!el.id) {
          const text = el.innerText;
          const safeId = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h-${i}`;
          el.id = `${safeId}-${i}`;
        }
        return {
          id: el.id,
          text: el.innerText,
          tagName: el.tagName.toLowerCase(),
          element: el
        };
      }).filter(h => h.text.trim() !== '');
      setHeadings(hList);
    }, 500);
    return () => clearTimeout(timer);
  }, [showIndex, contentSelector]);
  useEffect(() => {
    const target = scrollRef?.current || window;
    const handleScroll = () => {
      if (scrollRef?.current) {
        setShowScrollTop(scrollRef.current.scrollTop > 300);
      }
      if (!showIndex || headings.length === 0) return;
      let currentActive = null;
      let minDistance = Infinity;
      headings.forEach(h => {
        if (!h.element) return;
        const rect = h.element.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          const distance = Math.abs(rect.top - 100);
          if (distance < minDistance) {
            minDistance = distance;
            currentActive = h.id;
          }
        }
      });
      if (currentActive) setActiveId(currentActive);
    };
    target.addEventListener('scroll', handleScroll, {
      passive: true
    });
    handleScroll();
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef, showIndex, headings]);
  useEffect(() => {
    const handleClickOutside = event => {
      if (isPinned) return; // No tancar si està fixat
      if (indexRef.current && !indexRef.current.contains(event.target)) {
        const isBookButton = event.target.closest('[aria-label="Obrir Índex"]');
        if (!isBookButton) {
          setShowIndex(false);
        }
      }
    };
    if (showIndex) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showIndex, setShowIndex, isPinned]);
  return (
    <>
              {showScrollTop && <div className="absolute bottom-6 right-6 z-[60]">
                      <Button intent="secondary" shape="pill" size="lg" className="shadow-lg !p-4" onClick={() => {
          if (scrollRef?.current) {
            scrollRef.current.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        }} title="Pujar a dalt" aria-label="Pujar a dalt">
                          <ChevronUp size={24} strokeWidth={2.5} />
                      </Button>
                  </div>}

              {showIndex && <div id="floating-index-wrapper" ref={indexRef} style={{
        width: width || 320
      }} className={`absolute top-[56px] left-0 bottom-0 max-w-[85vw] bg-white border-r border-black/10 shadow-2xl z-[900] p-6 overflow-y-auto custom-scrollbar animate-in slide-in-from-left duration-300 ${isPinned ? 'lg:shadow-none' : ''}`}>
                      {isPinned && onDragStart && <div className='w-2 cursor-col-resize absolute right-[-4px] top-0 h-full z-50 hover:bg-orange-500/20 hidden lg:block' onMouseDown={onDragStart} title="Arrossega per redimensionar" />}
                      <div className="flex items-center justify-between mb-6">
                          <h4 className='text-sm font-black uppercase tracking-widest text-orange-500 flex items-center gap-2'>
                              <Book size={20} />
                              Índex
                          </h4>
                          <div className="flex items-center gap-1">
                              {onPinToggle && <button onClick={() => onPinToggle(!isPinned)} className={`p-2 rounded-full transition-colors active:scale-95 hidden lg:flex ${isPinned ? 'bg-[#F97316]/10 text-[#F97316]' : 'hover:bg-black/5 text-stone-400'}`} title={isPinned ? "Desfixar índex" : "Fixar índex"}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isPinned ? "rotate-45 transition-transform" : "transition-transform"}><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                  </button>}
                              <button onClick={() => setShowIndex(false)} className={`p-2 hover:bg-black/5 rounded-full transition-colors active:scale-95 ${isPinned ? 'lg:hidden' : ''}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-500"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                              </button>
                          </div>
                      </div>
                      {headings.length === 0 ? <p className="text-sm text-gray-400">No hi ha cap títol en aquest document.</p> : <ul className="space-y-1">
                              {headings.map((h, i) => {
            const isActive = activeId === h.id;
            return <li key={`${h.id}-${i}`}>
                                      <button onClick={() => {
                h.element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
                if (window.innerWidth < 1024 && !isPinned) {
                  setShowIndex(false);
                }
              }} className={`text-left w-full px-3 py-2 rounded-xl transition-colors text-sm break-words leading-relaxed
                                              ${isActive ? 'bg-[#F97316]/10 text-[#F97316] font-bold shadow-sm border border-[#F97316]/20' : 'hover:bg-black/5 text-gray-900'}
                                              ${h.tagName === 'h1' ? 'font-black uppercase tracking-widest text-base mt-4 mb-1' : ''}
                                              ${h.tagName === 'h2' ? 'ml-2 font-bold mt-2' : ''}
                                              ${h.tagName === 'h3' ? 'ml-4 font-medium text-stone-600' : ''}
                                              ${h.tagName === 'h4' ? 'ml-6 text-stone-500 text-[11px] uppercase tracking-wider font-bold border-l-2 border-stone-300 pl-3 mt-1' : ''}
                                              ${h.tagName === 'h5' || h.tagName === 'h6' ? 'ml-8 text-stone-400 text-[11px] italic' : ''}
                                          `}>
                                          {h.text}
                                      </button>
                                  </li>;
          })}
                          </ul>}
                  </div>}
          </>
  );
};
export default FloatingIndex;