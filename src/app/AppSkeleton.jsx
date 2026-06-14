// src/app/AppSkeleton.jsx
// ==================================================
// 🎨 ESQUELET LCP PER A REBRE EL CRDT
// Autor: Claude · Integrat al Bàndol Fase 3
// ==================================================

import React from 'react';
export const AppSkeleton = () => <div id="app-skeleton" style={{
  contentVisibility: 'auto'
}}>
    {/* Barres de navegació (esquelet) */}
    <div style={{
    height: '48px',
    background: '#1a1a1a'
  }} />
    <div style={{
    height: '56px',
    background: '#0369A1'
  }} />
    <div style={{
    height: '56px',
    background: '#F97316'
  }} />
    
    {/* Àrea de contingut amb CSS Grid de targetes fantasma */}
    <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    padding: '16px',
    contain: 'layout style paint'
  }}>
      {Array.from({
      length: 6
    }).map((_, i) => <div key={i} className="skeleton-card" style={{
      height: '350px',
      background: 'var(--sdp-bg-surface, #e5e5e5)',
      borderRadius: '12px',
      animation: `pulse 1.5s infinite ${i * 0.15}s`
    }} />)}
    </div>
  </div>;