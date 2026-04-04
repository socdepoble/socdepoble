import React from 'react';

export const TrustBadge = ({ trustScore }) => {
  const getTrustLevel = (score) => {
    if (score >= 100) return { label: '🌟 Leyenda', color: 'bg-yellow-500/20 text-yellow-500' };
    if (score >= 75) return { label: '⭐ Confiable', color: 'bg-green-500/20 text-green-500' };
    if (score >= 50) return { label: '⚠️ Novato', color: 'bg-blue-500/20 text-blue-500' };
    return { label: '❌ Nuevo', color: 'bg-red-500/20 text-red-500' };
  };

  const { label, color } = getTrustLevel(trustScore || 0);

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${color}`}>
      {label} ({trustScore || 0}/100)
    </span>
  );
};
