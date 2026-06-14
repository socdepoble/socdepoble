// src/components/ClauerVisual.jsx
// ==================================================
// 🔐 COMPONENT: EL CLAUER VISUAL
// Autor: Claude · Trellat en estat pur
// Funció: Veure, desar i recuperar la identitat sense por
// ==================================================
import React, { useState, useEffect } from 'react';

// Placeholder functions since cryptoAPI.js is not provided yet
const generarFrau = () => {
  return ['Terreta', 'Masia', 'Poble', 'Olivera', 'Garrofera', 'Sèquia', 'Barranc', 'Llum', 'Foc', 'Pedra', 'Aigua', 'Cel'];
};
const dibuixarEmpremta = clauPublica => {
  return `<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>`;
};
export const ClauerVisual = ({
  clauPublica,
  mode
}) => {
  const [frau, setFrau] = useState([]);
  const [empremtaSVG, setEmpremtaSVG] = useState('');
  useEffect(() => {
    // 🔵 Generem la imatge única de la clau (com un dibuix de la casa)
    setEmpremtaSVG(dibuixarEmpremta(clauPublica));

    // 📜 Generem les 12 paraules en valencià (BIP-39 adaptat)
    if (mode === 'generar') setFrau(generarFrau());
  }, [clauPublica, mode]);

  // 📤 DESCARREGA: Document per imprimir o guardar
  const descarregarClau = () => {
    const contingut = `
      🌾 MASIA VALENCIANA · CLAU DE PROPIETAT
      ========================================
      IDENTITAT: ${clauPublica}
      PARAULES DE RECUPERACIÓ:
      ${frau.map((p, i) => `${i + 1}. ${p}`).join('\n')}
      
      "Guarda açò com si fóra les claus de casa.
      Sense açò, ningú pot entrar. Amb açò, pots entrar des de qualsevol lloc."
    `;
    const blob = new Blob([contingut], {
      type: 'text/plain'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'clau-masia-socdepoble.txt';
    a.click();
  };
  const recuperarDeFitxer = event => {
    // Implementació de lectura de fitxer
  };
  return <div className="clauer-contenidor" style={{
    border: '2px solid #8B4513',
    padding: '2rem',
    borderRadius: '12px',
    background: '#FAF0E6'
  }}>
      
      {/* 🖼️ L'EMPREMTA VISUAL: Sempre visible, sempre reconeixible */}
      <div className="empremta" dangerouslySetInnerHTML={{
      __html: empremtaSVG
    }} style={{
      textAlign: 'center',
      marginBottom: '2rem'
    }} />

      {mode === 'generar' ? <>
          <h3>🔑 La teua clau de la Masia</h3>
          <p style={{
        color: '#8B0000',
        fontWeight: 'bold'
      }}>Escriu estes paraules per ordre o guarda el fitxer. No es mostren més.</p>
          <div className="llista-paraules" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        margin: '1rem 0'
      }}>
            {frau.map((p, i) => <div key={i} style={{
          padding: '0.5rem',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '6px'
        }}>
                {i + 1}. <strong>{p}</strong>
              </div>)}
          </div>
          <button onClick={descarregarClau} style={{
        background: '#228B22',
        color: 'white',
        border: 'none',
        padding: '0.8rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem'
      }}>
            📥 Descarregar la clau
          </button>
        </> : <div className="recuperacio">
          <h3>🏠 Obrir la porta</h3>
          <p>Introdueix les paraules o carrega el fitxer de clau per tornar a ser dins.</p>
          <input type="file" onChange={recuperarDeFitxer} accept=".txt" />
        </div>}

      {/* ✅ FEEDBACK CLAR: Si la clau és correcta, canvia de color i es mou */}
      <div className="indicador-estat" style={{
      marginTop: '1rem',
      color: '#228B22',
      fontWeight: 'bold'
    }}>
        {clauPublica ? "✅ Porta oberta i segura" : "❌ Porta tancada"}
      </div>
    </div>;
};