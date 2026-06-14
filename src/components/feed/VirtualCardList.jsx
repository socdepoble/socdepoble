// src/components/feed/VirtualCardList.jsx
// content-visibility: auto per a llistes llargues.
// IMPORTANT: el primer element NO porta content-visibility
// perquè és l'element LCP. Aplicar-lo al LCP element oculta
// el contingut al PerformanceObserver i dispara un LCP tardà.

import React, { memo, useCallback, useRef } from 'react';
// import { UniversalCard } from '../cards/UniversalCard';

// Dummy UniversalCard per ara si no existeix
const UniversalCard = ({
  item
}) => <div style={{
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '14px',
  margin: '10px 14px',
  background: 'white'
}}>
    <h3>{item.title || 'Sense Títol'}</h3>
    <p>{item.excerpt || 'Sense contingut'}</p>
  </div>;

// Altura estimada de cada targeta. Ha de correspondre amb el skeleton.
// Usar la mediana de les targetes reals (no el màxim ni el mínim).
const CARD_HEIGHT_ESTIMATE = 280;
const CardWrapper = memo(function CardWrapper({
  item,
  index
}) {
  // El primer element: sense content-visibility (és el LCP element)
  // La resta: amb content-visibility per a skip de layout/paint fora del viewport
  const style = index === 0 ? {
    // Sense content-visibility: el navegador sempre el renderitza
    // Afegim LCP hint explícit per a browsers que ho suporten
    fetchPriority: 'high'
  } : {
    contentVisibility: 'auto',
    // contain-intrinsic-size: el navegador reserva aquest espai
    // quan la targeta no és visible, evitant layout shift al scroll
    containIntrinsicSize: `0 ${CARD_HEIGHT_ESTIMATE}px`
  };
  return <div style={style}>
      <UniversalCard item={item} />
    </div>;
});
export const VirtualCardList = memo(function VirtualCardList({
  items = []
}) {
  const listRef = useRef(null);

  // Intersection Observer per a prefetch de targetes properes al viewport
  // (útil per a imatges d'avatar que no estan en el viewport inicial)
  const observerCallback = useCallback(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.dispatchEvent(new CustomEvent('sdp:card-visible'));
      }
    });
  }, []);
  return <div ref={listRef} role="feed" aria-label="Mur de Sóc de Poble" aria-busy={items.length === 0} style={{
    paddingTop: 'var(--sp-shell-offset)',
    paddingBottom: 'env(safe-area-inset-bottom, 16px)',
    minHeight: '100svh',
    // overscroll-behavior: evita el bounce d'iOS que mostra el fons del body
    overscrollBehavior: 'contain'
  }}>
      {items.length === 0 ?
    // L'Uelo no veu "no results": veu que la Masia s'està despertant
    <p style={{
      padding: '3rem 1.5rem',
      textAlign: 'center',
      opacity: 0.4,
      fontWeight: 700
    }}>
          La Masia s'està despertant…
        </p> : items.map((item, i) => <CardWrapper key={item.id ?? item.uuid ?? i} item={item} index={i} />)}
    </div>;
});