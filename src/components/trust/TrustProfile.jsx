import React, { useState } from 'react';
import { TrustBadge } from './TrustBadge';

export const TrustProfile = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback para datos de usuario
  const { 
    name = 'Vecino Anónimo',
    trustScore = 0,
    skills = [],
    memberSince = new Date().getFullYear(),
    positiveReviews = 0,
    activeLoans = 0
  } = user || {};

  return (
    <div className="bg-[#141414] border border-[#2e2e2e] rounded-[28px] p-6 text-white overflow-hidden transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xl font-bold font-serif">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
            <p className="text-sm text-gray-400">Vecino desde {memberSince}</p>
          </div>
        </div>
        <div className="text-right">
          <TrustBadge trustScore={trustScore} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 mb-4">
        <div className="bg-[#0e0e0e] rounded-[18px] p-4 text-center">
          <p className="text-3xl font-bold text-green-500 mb-1">{positiveReviews}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reseñas +</p>
        </div>
        <div className="bg-[#0e0e0e] rounded-[18px] p-4 text-center">
          <p className="text-3xl font-bold text-blue-500 mb-1">{activeLoans}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Préstamos Activos</p>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-center py-2 text-sm text-orange-500 font-semibold hover:text-orange-400 transition-colors"
      >
        {isExpanded ? 'Ocultar Detalles' : 'Ver Habilidades y Reseñas'}
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#2e2e2e] animate-fade-in">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Habilidades Ofrecidas</h4>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-[#2e2e2e] text-gray-200 px-3 py-1 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No ha especificado habilidades aún.</p>
          )}
        </div>
      )}
    </div>
  );
};
