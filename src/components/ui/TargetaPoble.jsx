import React from 'react';

export default function TargetaPoble({ 
  id, 
  title, 
  author, 
  content, 
  category = 'mur',
  date
}) {
  return (
    <article 
      className="bg-white rounded-[14px] shadow-sm border border-black/5 overflow-hidden mx-[14px] my-[10px]"
      style={{ contain: 'layout style', contentVisibility: 'auto', containIntrinsicSize: '0 280px' }}
    >
      <header className="px-[16px] pt-[18px] pb-[8px] flex items-center gap-[12px]">
        {/* Square Rule Avatar (40x40px, borderRadius: 0) */}
        <div className="w-[40px] h-[40px] bg-[#e5e7eb] shrink-0 flex items-center justify-center font-bold text-gray-600">
          {author?.charAt(0)?.toUpperCase() || '?'}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-[#0a0a0a] leading-tight truncate">{author}</h3>
          {date && <span className="text-xs text-gray-500 mt-0.5 block">{date}</span>}
        </div>
      </header>

      <div className="px-[16px] py-[8px]">
        <h4 className="text-[18px] font-bold text-[#0a0a0a] mb-[8px] leading-tight">{title}</h4>
        <p className="text-[15px] text-gray-700 leading-relaxed line-clamp-3">
          {content}
        </p>
      </div>

      <footer className="px-[16px] pb-[18px] pt-[8px] flex justify-end">
        <button className="h-[36px] px-4 rounded-full bg-gray-100 text-[#f97316] font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all">
          Llegir més
        </button>
      </footer>
    </article>
  );
}
