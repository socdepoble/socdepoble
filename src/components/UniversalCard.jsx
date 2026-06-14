// src/components/UniversalCard.jsx
import React from 'react';
const UniversalCard = ({
  item,
  variant,
  onLike,
  onComment,
  onContact
}) => {
  return <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
          {item.authorName ? item.authorName[0] : '?'}
        </div>
        <div>
          <div className="font-semibold">{item.authorName || 'Anònim'}</div>
          <div className="text-xs text-slate-400">{item.townId || 'El Mas'}</div>
        </div>
      </div>
      
      {variant === 'market' && item.title && <h3 className="text-lg font-bold mb-2">{item.title}</h3>}

      <p className="text-slate-700 mb-4 whitespace-pre-line">
        {item.content || item.description}
      </p>

      {variant === 'market' && <div className="mb-4 text-orange-600 font-bold text-xl">
          {item.price ? `${item.price} €` : 'Intercanvi'}
        </div>}

      <div className="flex gap-2 text-sm border-t pt-3 mt-2 border-slate-100">
        {variant === 'feed' && <>
            <button onClick={onLike} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-medium">❤️ {item.likes || 0}</button>
            <button onClick={onComment} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-medium">💬 Comentar</button>
          </>}
        {variant === 'market' && <button onClick={onContact} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-bold w-full">
            Contactar
          </button>}
      </div>
    </div>;
};
export default UniversalCard;