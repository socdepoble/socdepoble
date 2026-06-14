// src/config/nav.js
import React from 'react';

// Fent servir Emojis per màxima puresa termodinàmica, tal com s'ha acordat en les auditories (Zero dependències innecessàries per ara).
// Si després volem passar a Lucide, només cal canviar-ho ací.

export const NAV_ITEMS = [
  { to: '/mur', icon: '🏠', label: 'El Mur', labelCurt: 'Mur' },
  { to: '/mercat', icon: '🏪', label: 'Mercat', labelCurt: 'Mercat' },
  { to: '/xat', icon: '💬', label: 'Xat', labelCurt: 'Xat' },
  { to: '/genoma', icon: '🧬', label: 'Genoma (Iaia)', labelCurt: 'Genoma' },
  { to: '/notes', icon: '📓', label: 'Quadern', labelCurt: 'Quadern' },
];
