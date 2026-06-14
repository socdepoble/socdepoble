// src/app/Masia.jsx
// ==================================================
// 🚀 COMPONENT BASE LCP — Porta Oberta
// Dissenyat per rebre dades de RhizomeManager
// ==================================================
import React, { useDeferredValue, Suspense } from 'react';
import { AppSkeleton as MasiaEsquelet } from './AppSkeleton';

// Component dummy per al MurDeTargetes si no existeix
const MurDeTargetes = ({
  dades
}) => <div style={{
  padding: '2rem'
}}>
    <h2>Les teues dades:</h2>
    <pre>{JSON.stringify(dades, null, 2)}</pre>
  </div>;

// 📌 ESTRATÈGIA: El que es veu primer, es pinta ja.
export const Masia = ({
  rhizome
}) => {
  // Diferim el valor real perquè no bloquege la pintura inicial
  const dadesReals = useDeferredValue(rhizome?.estat || null, {
    timeoutMs: 1500
  });
  return <div className="masia-contenidor" style={{
    contain: 'layout size paint'
  }}>
      {/* 🏗️ MARC VISUAL: Sempre present, sense esperar dades */}
      <header className="capcalera-masia" style={{
      contentVisibility: 'visible'
    }}>
        <h1>🌾 Sóc de Poble</h1>
        <div className="estat-connexio">{rhizome?.estatXarxa || 'Connectant...'}</div>
      </header>

      {/* 📦 ZONA PRINCIPAL: Esquelet mentre carrega, després contingut */}
      <main style={{
      contentVisibility: 'auto',
      minHeight: '80vh'
    }}>
        <Suspense fallback={<MasiaEsquelet />}>
          <MurDeTargetes dades={dadesReals} />
        </Suspense>
      </main>
    </div>;
};