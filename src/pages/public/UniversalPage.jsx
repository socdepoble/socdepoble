import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const UniversalPage = ({ title, icon, htmlContent }) => {
  const containerRef = useRef(null);

  // Quan canvia el contingut, fem scroll a dalt de manera nativa
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [htmlContent]);

  return (
    <div className="w-full min-h-full bg-[#f3f4f6] text-gray-900">
      {/* Capçalera Universal */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-xl text-xl shrink-0">
          {icon || '📄'}
        </div>
        <h1 className="text-xl font-black tracking-tight m-0 text-gray-900 line-clamp-1">
          {title || 'Document'}
        </h1>
      </header>

      {/* Contingut Universal, on es llig el HTML/Markdown processat */}
      <div 
        ref={containerRef}
        className="w-full max-w-3xl mx-auto px-4 py-8 prose prose-orange prose-lg"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Footer net */}
      <div className="w-full max-w-3xl mx-auto px-4 py-8 mt-12 border-t border-gray-200 text-center">
        <NavLink to="/mur" className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-bold rounded-full shadow-md hover:bg-orange-600 active:scale-95 transition-all">
          Tornar a el Mas
        </NavLink>
      </div>
    </div>
  );
};

export default React.memo(UniversalPage);
