/**
 * RecuperacioDelMas.jsx
 * 
 * La Porta de la Resurrecció.
 * Quan Safari traïciona, quan el mòbil es trenca, quan la memòria s'esvaeix...
 * ací l'Uelo torna a casa.
 * 
 * Pedra Seca: zero dependències, zero frameworks CSS.
 * Dissenyat per a iPad A10, visió reduïda, dits que tremolen.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { StoneQR } from './StoneQR';
// import { SovereignShare } from './SovereignShare';
// import { MnemonicKey } from './MnemonicKey';

// === PALETA DE LA TERRA ===
// Colors extrets de la pedra seca valenciana: ocre, terracota, verd garrofer, blau celàtic
const PALETA = {
  pedra: '#C4A77D',
  // Pedra seca en sec
  pedraHumida: '#8B7355',
  // Pedra després de la pluja
  terra: '#B85450',
  // Terracota, el cor del Mas
  terraFosc: '#8B3A3A',
  // Terra trepitjada
  garrofer: '#4A6741',
  // Fulla de garrofer
  garroferFosc: '#2D4A2B',
  // Ombra sota el garrofer
  cel: '#E8F4F8',
  // Cel valencià a l'hivern
  llum: '#FFF8E7',
  // Llum de gas, paper envejecit
  fosc: '#2C2416',
  // Foscor de la cambra sense llum
  perill: '#D4A017',
  // Groc de l'alerta, no vermell (l'avi no ha de patir)
  exit: '#5A8F4E' // Verd de l'esperança, suau
};

// === CONSTANTS D'ACCESSIBILITAT ===
const MIDA_LLETRA = {
  normal: '1.5rem',
  // 24px base
  gran: '2rem',
  // 32px per a títols
  enorme: '2.5rem',
  // 40px per a números del PIN
  menuda: '1.125rem' // 18px mínim legal
};
const MIDA_BOTONS = {
  alt: '80px',
  ample: '100%',
  ampleMax: '400px',
  radi: '16px'
};

// === ESTILS EN LÍNIA (Pedra Seca: cap CSS extern) ===
const estils = {
  pantalla: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${PALETA.cel} 0%, ${PALETA.llum} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '24px',
    fontFamily: '"Georgia", "Times New Roman", serif',
    // Serif per a llegibilitat
    color: PALETA.fosc,
    boxSizing: 'border-box'
  },
  capcalera: {
    textAlign: 'center',
    marginBottom: '32px',
    maxWidth: '600px'
  },
  titol: {
    fontSize: MIDA_LLETRA.enorme,
    fontWeight: '700',
    color: PALETA.terra,
    margin: '0 0 12px 0',
    lineHeight: '1.2',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },
  subtitol: {
    fontSize: MIDA_LLETRA.normal,
    color: PALETA.pedraHumida,
    margin: 0,
    lineHeight: '1.5',
    fontStyle: 'italic'
  },
  tarja: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(8px)',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 8px 32px rgba(44,36,22,0.12)',
    border: `3px solid ${PALETA.pedra}`,
    marginBottom: '24px',
    transition: 'all 0.3s ease'
  },
  boto: {
    width: MIDA_BOTONS.ample,
    maxWidth: MIDA_BOTONS.ampleMax,
    height: MIDA_BOTONS.alt,
    fontSize: MIDA_LLETRA.gran,
    fontWeight: '600',
    borderRadius: MIDA_BOTONS.radi,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'transform 0.1s, box-shadow 0.2s',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'hidden'
  },
  botoPrimari: {
    background: `linear-gradient(135deg, ${PALETA.garrofer} 0%, ${PALETA.garroferFosc} 100%)`,
    color: '#FFFFFF',
    boxShadow: '0 4px 16px rgba(74,103,65,0.3)'
  },
  botoSecundari: {
    background: PALETA.pedra,
    color: PALETA.fosc,
    boxShadow: '0 2px 8px rgba(139,115,85,0.3)'
  },
  botoPerill: {
    background: PALETA.perill,
    color: PALETA.fosc,
    boxShadow: '0 2px 8px rgba(212,160,23,0.3)'
  },
  botoDeshabilitat: {
    opacity: '0.5',
    cursor: 'not-allowed',
    transform: 'none !important'
  },
  inputPIN: {
    width: '70px',
    height: '90px',
    fontSize: MIDA_LLETRA.enorme,
    textAlign: 'center',
    border: `3px solid ${PALETA.pedra}`,
    borderRadius: '12px',
    background: PALETA.llum,
    color: PALETA.fosc,
    fontWeight: '700',
    margin: '0 6px',
    caretColor: PALETA.terra,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  inputFocus: {
    borderColor: PALETA.garrofer,
    boxShadow: '0 0 0 4px rgba(74,103,65,0.2)'
  },
  indicadorPas: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  cerclePas: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: `3px solid ${PALETA.pedra}`,
    transition: 'all 0.3s ease'
  },
  cercleActiu: {
    background: PALETA.garrofer,
    borderColor: PALETA.garrofer,
    transform: 'scale(1.2)'
  },
  cercleCompletat: {
    background: PALETA.pedra,
    borderColor: PALETA.pedra
  },
  missatgeEstat: {
    padding: '20px',
    borderRadius: '12px',
    fontSize: MIDA_LLETRA.normal,
    textAlign: 'center',
    lineHeight: '1.6',
    marginTop: '16px',
    border: `2px solid transparent`
  },
  missatgeExit: {
    background: 'rgba(90,143,78,0.1)',
    borderColor: PALETA.exit,
    color: PALETA.garroferFosc
  },
  missatgeError: {
    background: 'rgba(184,84,80,0.1)',
    borderColor: PALETA.terra,
    color: PALETA.terraFosc
  },
  missatgeInfo: {
    background: 'rgba(196,167,125,0.2)',
    borderColor: PALETA.pedra,
    color: PALETA.pedraHumida
  },
  confeti: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1000,
    overflow: 'hidden'
  },
  confetiParticula: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    animation: 'caida 3s ease-out forwards'
  },
  videoQR: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    borderRadius: '16px',
    border: `4px solid ${PALETA.garrofer}`,
    objectFit: 'cover',
    background: PALETA.fosc
  },
  gridAmics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    width: '100%',
    marginTop: '16px'
  },
  tarjaAmic: {
    padding: '16px',
    borderRadius: '12px',
    border: `3px solid ${PALETA.pedra}`,
    textAlign: 'center',
    background: PALETA.llum,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tarjaAmicSeleccionat: {
    borderColor: PALETA.garrofer,
    background: 'rgba(74,103,65,0.1)',
    transform: 'scale(1.05)'
  },
  lletraAmic: {
    fontSize: MIDA_LLETRA.enorme,
    fontWeight: '700',
    color: PALETA.terra
  },
  nomAmic: {
    fontSize: MIDA_LLETRA.menuda,
    color: PALETA.pedraHumida,
    marginTop: '8px'
  }
};

// === ANIMACIONS CSS INJECTADES ===
const AnimacionsCSS = () => <style>{`
    @keyframes caida {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
    @keyframes pols {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes apareixer {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .anim-apareixer {
      animation: apareixer 0.5s ease-out;
    }
    .boto-pols:hover:not(:disabled) {
      animation: pols 2s infinite;
    }
    .boto-pols:active:not(:disabled) {
      transform: scale(0.96) !important;
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  `}</style>;

// === COMPONENT CONFETI DE PEDRA SECA ===
const ConfetiResurreccio = ({
  actiu
}) => {
  if (!actiu) return null;
  const particules = Array.from({
    length: 30
  }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    durada: `${2 + Math.random() * 2}s`,
    color: [PALETA.pedra, PALETA.terra, PALETA.garrofer, PALETA.perill, PALETA.cel][Math.floor(Math.random() * 5)],
    rotacio: Math.random() * 360
  }));
  return <div style={estils.confeti} aria-hidden="true">
      {particules.map(p => <div key={p.id} style={{
      ...estils.confetiParticula,
      left: p.left,
      animationDelay: p.delay,
      animationDuration: p.durada,
      background: p.color,
      transform: `rotate(${p.rotacio}deg)`
    }} />)}
    </div>;
};

// === COMPONENT INDICADOR DE PASSOS ===
const IndicadorPassos = ({
  total,
  actual,
  completats
}) => <div style={estils.indicadorPas} role="progressbar" aria-valuenow={actual} aria-valuemax={total} aria-label="Progrés de la recuperació">
    {Array.from({
    length: total
  }, (_, i) => {
    let estil = estils.cerclePas;
    if (i === actual) estil = {
      ...estil,
      ...estils.cercleActiu
    };else if (completats.has(i)) estil = {
      ...estil,
      ...estils.cercleCompletat
    };
    return <div key={i} style={estil} aria-label={`Pas ${i + 1}${completats.has(i) ? ' completat' : i === actual ? ' actiu' : ''}`} />;
  })}
  </div>;

// === COMPONENT ENTRADA PIN ===
const EntradaPIN = ({
  longitud = 6,
  onComplet,
  etiqueta
}) => {
  const [digits, setDigits] = useState(Array(longitud).fill(''));
  const inputsRef = useRef([]);
  const handleChange = (index, valor) => {
    if (!/^\d*$/.test(valor)) return; // Només números

    const nousDigits = [...digits];
    nousDigits[index] = valor.slice(-1); // Només un dígit
    setDigits(nousDigits);

    // Feedback hàptic per cada tecla
    if (navigator.vibrate && valor) navigator.vibrate(15);

    // Mou al següent o crida onComplet
    if (valor && index < longitud - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (index === longitud - 1 && valor) {
      const pin = [...nousDigits.slice(0, -1), valor].join('');
      if (pin.length === longitud) {
        setTimeout(() => onComplet(pin), 150); // Pausa dramàtica
      }
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const handlePaste = e => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, longitud);
    if (text.length === longitud) {
      const nousDigits = text.split('');
      setDigits(nousDigits);
      onComplet(text);
      if (navigator.vibrate) navigator.vibrate(30);
    }
  };
  return <div style={{
    textAlign: 'center',
    margin: '24px 0'
  }}>
      <p style={{
      fontSize: MIDA_LLETRA.menuda,
      color: PALETA.pedraHumida,
      marginBottom: '16px'
    }}>
        {etiqueta || 'Introdueix el PIN de la teua pedra'}
      </p>
      <div role="group" aria-label="Entrada de PIN de 6 dígits">
        {digits.map((digit, i) => <input key={i} ref={el => inputsRef.current[i] = el} type="number" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} onPaste={handlePaste} style={{
        ...estils.inputPIN,
        ...(document.activeElement === inputsRef.current[i] ? estils.inputFocus : {})
      }} aria-label={`Dígit ${i + 1} del PIN`} autoFocus={i === 0} />)}
      </div>
    </div>;
};

// === COMPONENT PRINCIPAL: RECUPERACIÓ DEL MAS ===
export default function RecuperacioDelMas({
  onRecuperat,
  onCancelar
}) {
  // === ESTATS ===
  const [pas, setPas] = useState(0); // 0: benvinguda, 1: escanejar, 2: pin, 3: amics, 4: processant, 5: exit, 6: error
  const [completats, setCompletats] = useState(new Set());
  const [dadesQR, setDadesQR] = useState(null);
  const [pin, setPin] = useState(null);
  const [amicsSeleccionats, setAmicsSeleccionats] = useState([]);
  const [missatge, setMissatge] = useState(null);
  const [processant, setProcessant] = useState(false);
  const [exit, setExit] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const PASSES_TOTALS = 5;

  // === HÀPTICS ===
  const vibrar = useCallback(patro => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(patro);
      } catch (e) {}
    }
  }, []);
  const vibrarExit = useCallback(() => {
    vibrar([50, 100, 50, 100, 200]); // Ritme de "benvingut a casa"
  }, [vibrar]);
  const vibrarError = useCallback(() => {
    vibrar([100, 50, 100]); // Ritme d'alerta suau, no agressiu
  }, [vibrar]);

  // === TRANSICIONS DE PAS ===
  const avançarPas = useCallback(nouPas => {
    setCompletats(prev => new Set([...prev, pas]));
    setPas(nouPas);
    vibrar(30);
  }, [pas, vibrar]);

  // === PAS 1: ESCANEIG QR ===
  const iniciarEscaneig = useCallback(async () => {
    avançarPas(1);
    setMissatge({
      tipus: 'info',
      text: 'Acosta el QR a la càmera. No fa falta que toque l\'iPad, només que es veja bé.'
    });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: {
            ideal: 1280
          }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulació de detecció QR (en producció: usar biblioteca QR nativa)
      setTimeout(() => {
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        }
        // Mock de dades QR xifrat
        setDadesQR({
          payload: 'XIFRAT_MOCK_12345',
          versio: 3
        });
        setMissatge({
          tipus: 'exit',
          text: 'QR llegit correctament! La pedra parla.'
        });
        vibrar([50, 30, 50]);
        setTimeout(() => avançarPas(2), 1000);
      }, 3000);
    } catch (err) {
      setMissatge({
        tipus: 'error',
        text: 'No puc accedir a la càmera. Comprova els permisos o tria l\'opció de PIN manual.'
      });
      vibrarError();
    }
  }, [avançarPas, vibrar, vibrarError]);

  // === PAS 2: ENTRADA PIN ===
  const handlePIN = useCallback(pinIntroduit => {
    setPin(pinIntroduit);
    setMissatge({
      tipus: 'info',
      text: 'PIN rebut. Desxifrant la pedra...'
    });
    avançarPas(3);
  }, [avançarPas]);

  // === PAS 3: SOVEREIGN SHARE (AMICS) ===
  const toggleAmic = useCallback(id => {
    setAmicsSeleccionats(prev => {
      const nous = prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id];
      if (nous.length > prev.length) vibrar(20);
      return nous;
    });
  }, [vibrar]);
  const amicsMock = [{
    id: 'joan',
    nom: 'Joan el Fuster',
    inicial: 'J',
    color: PALETA.terra
  }, {
    id: 'maria',
    nom: 'Maria la Fornera',
    inicial: 'M',
    color: PALETA.garrofer
  }, {
    id: 'pere',
    nom: 'Pere el Pages',
    inicial: 'P',
    color: PALETA.pedraHumida
  }, {
    id: 'anna',
    nom: 'Anna la Curandera',
    inicial: 'A',
    color: PALETA.perill
  }];

  // === PAS 4: PROCESSAMENT ===
  const processarRecuperacio = useCallback(async () => {
    avançarPas(4);
    setProcessant(true);
    setMissatge({
      tipus: 'info',
      text: 'Reconstruint la clau mestra... Això pot tardar un moment. La pedra seca necessita temps.'
    });
    try {
      // Simulació de derivació PBKDF2 + desxifratge
      await new Promise(r => setTimeout(r, 2500));

      // En producció: MnemonicKey.deriveFromPIN(pin, dadesQR.salt)
      // + StoneQR.decrypt(dadesQR.payload, derivedKey)
      // + SovereignShare.reconstruct(amicsSeleccionats)

      setProcessant(false);
      setExit(true);
      avançarPas(5);
      setMissatge({
        tipus: 'exit',
        text: 'Estat restaurat! Totes les teues dades estan a salvo. Benvingut a casa, Uelo.'
      });
      vibrarExit();

      // Notifica al pare
      setTimeout(() => onRecuperat?.({
        cryptoKey: 'MOCK_KEY_RECONSTRUCTED',
        timestamp: Date.now(),
        metode: amicsSeleccionats.length > 0 ? 'qr+amics' : 'qr+pin'
      }), 1500);
    } catch (err) {
      setProcessant(false);
      setError(err);
      avançarPas(6);
      setMissatge({
        tipus: 'error',
        text: 'Algo ha fallat. No et preocupes, la pedra roman intacta. Tornem-ho a provar?'
      });
      vibrarError();
    }
  }, [avançarPas, pin, dadesQR, amicsSeleccionats, onRecuperat, vibrarExit, vibrarError]);

  // === NETEJA ===
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // === RENDERITZACIÓ PER PASSOS ===
  const renderPas = () => {
    switch (pas) {
      case 0:
        // BENVINGUDA
        return <div className="anim-apareixer" style={{
          textAlign: 'center'
        }}>
            <div style={{
            fontSize: '4rem',
            marginBottom: '16px'
          }} aria-hidden="true">🏡</div>
            <h2 style={{
            ...estils.titol,
            fontSize: MIDA_LLETRA.enorme
          }}>
              Has perdut les claus del Mas?
            </h2>
            <p style={{
            ...estils.subtitol,
            marginBottom: '32px'
          }}>
              No et preocupes, Uelo. Amb la teua pedra de paper i el PIN, tornarem a obrir la porta. Ningú es queda fora de la Masia.
            </p>
            
            <button onClick={iniciarEscaneig} style={{
            ...estils.boto,
            ...estils.botoPrimari
          }} className="boto-pols" aria-label="Començar recuperació escanejant el codi QR">
              <span style={{
              fontSize: '2rem'
            }}>📷</span>
              Escanejar la meua Pedra
            </button>
            
            <button onClick={() => avançarPas(2)} style={{
            ...estils.boto,
            ...estils.botoSecundari
          }} className="boto-pols" aria-label="Introduir el PIN manualment sense escanejar">
              <span style={{
              fontSize: '2rem'
            }}>⌨️</span>
              Tinc el PIN, però no el QR
            </button>
            
            <button onClick={() => avançarPas(3)} style={{
            ...estils.boto,
            ...estils.botoSecundari,
            opacity: 0.7
          }} className="boto-pols" aria-label="Recuperar amb l'ajuda d'amics">
              <span style={{
              fontSize: '2rem'
            }}>👥</span>
              Els meus amics tenen parts de la clau
            </button>
          </div>;
      case 1:
        // ESCANEIG
        return <div className="anim-apareixer" style={{
          textAlign: 'center'
        }}>
            <h2 style={estils.titol}>Acosta la Pedra Paper</h2>
            <p style={estils.subtitol}>La càmera llegirà el codi automàticament</p>
            
            <video ref={videoRef} style={estils.videoQR} autoPlay playsInline muted aria-label="Vista prèvia de la càmera per a escanejar QR" />
            
            <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
              <button onClick={() => {
              if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
              setPas(0);
            }} style={{
              ...estils.boto,
              ...estils.botoSecundari,
              height: '60px',
              fontSize: MIDA_LLETRA.normal
            }}>
                ← Tornar
              </button>
              <button onClick={() => {
              if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
              setDadesQR({
                payload: 'MOCK_MANUAL',
                versio: 3
              });
              avançarPas(2);
            }} style={{
              ...estils.boto,
              ...estils.botoPrimari,
              height: '60px',
              fontSize: MIDA_LLETRA.normal
            }}>
                Simular QR llegit →
              </button>
            </div>
          </div>;
      case 2:
        // PIN
        return <div className="anim-apareixer" style={{
          textAlign: 'center'
        }}>
            <h2 style={estils.titol}>La Paraula Secreta</h2>
            <p style={estils.subtitol}>
              {dadesQR ? 'QR llegit correctament. Ara el PIN desbloqueja la pedra.' : 'Sense QR? Introdueix el PIN i després tria els amics que tenen parts.'}
            </p>
            
            <EntradaPIN onComplet={handlePIN} etiqueta="El PIN que vas apuntar quan vas crear la còpia" />
            
            <button onClick={() => setPas(0)} style={{
            ...estils.boto,
            ...estils.botoSecundari,
            height: '60px',
            fontSize: MIDA_LLETRA.normal,
            marginTop: '16px'
          }}>
              ← Tornar enrere
            </button>
          </div>;
      case 3:
        // AMICS (SOVEREIGN SHARE)
        return <div className="anim-apareixer">
            <h2 style={{
            ...estils.titol,
            textAlign: 'center'
          }}>El Consell de la Petorreta</h2>
            <p style={{
            ...estils.subtitol,
            textAlign: 'center',
            marginBottom: '24px'
          }}>
              {dadesQR ? 'Amb el QR i el PIN, potser no calen amics. Però si vols més seguretat, tria\'ls.' : 'Sense QR complet, necessites que els teus amics aporten les seues parts. Tria almenys 2.'}
            </p>
            
            <div style={estils.gridAmics} role="group" aria-label="Selecció d'amics per a reconstrucció de clau">
              {amicsMock.map(amic => <button key={amic.id} onClick={() => toggleAmic(amic.id)} style={{
              ...estils.tarjaAmic,
              ...(amicsSeleccionats.includes(amic.id) ? estils.tarjaAmicSeleccionat : {})
            }} aria-pressed={amicsSeleccionats.includes(amic.id)} aria-label={`${amic.nom}${amicsSeleccionats.includes(amic.id) ? ', seleccionat' : ''}`}>
                  <div style={{
                ...estils.lletraAmic,
                color: amic.color
              }}>{amic.inicial}</div>
                  <div style={estils.nomAmic}>{amic.nom}</div>
                  {amicsSeleccionats.includes(amic.id) && <div style={{
                fontSize: '1.5rem',
                marginTop: '8px'
              }} aria-hidden="true">✓</div>}
                </button>)}
            </div>
            
            <div style={{
            textAlign: 'center',
            marginTop: '24px'
          }}>
              <p style={{
              fontSize: MIDA_LLETRA.menuda,
              color: PALETA.pedraHumida
            }}>
                {amicsSeleccionats.length} de 2 necessaris seleccionats
              </p>
              
              <button onClick={processarRecuperacio} disabled={!dadesQR && amicsSeleccionats.length < 2} style={{
              ...estils.boto,
              ...estils.botoPrimari,
              ...(!dadesQR && amicsSeleccionats.length < 2 ? estils.botoDeshabilitat : {}),
              marginTop: '16px'
            }} className="boto-pols" aria-label="Reconstruir la clau i recuperar l'estat">
                <span style={{
                fontSize: '2rem'
              }}>🔑</span>
                {dadesQR ? 'Desxifrar amb QR + PIN' : 'Reconstruir amb Amics + PIN'}
              </button>
              
              <button onClick={() => setPas(2)} style={{
              ...estils.boto,
              ...estils.botoSecundari,
              height: '60px',
              fontSize: MIDA_LLETRA.normal,
              marginTop: '12px'
            }}>
                ← Tornar al PIN
              </button>
            </div>
          </div>;
      case 4:
        // PROCESSANT
        return <div className="anim-apareixer" style={{
          textAlign: 'center',
          padding: '40px 20px'
        }}>
            <div style={{
            width: '80px',
            height: '80px',
            border: `6px solid ${PALETA.pedra}`,
            borderTop: `6px solid ${PALETA.garrofer}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} aria-hidden="true" />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={estils.titol}>Reconstruint la pedra...</h2>
            <p style={estils.subtitol}>
              Això és com esperar que l'arròs estiga al punt. No es pot córrer.
            </p>
            {missatge && <div style={{
            ...estils.missatgeEstat,
            ...estils.missatgeInfo,
            marginTop: '24px'
          }}>
                {missatge.text}
              </div>}
          </div>;
      case 5:
        // ÈXIT
        return <div className="anim-apareixer" style={{
          textAlign: 'center'
        }}>
            <ConfetiResurreccio actiu={true} />
            <div style={{
            fontSize: '5rem',
            marginBottom: '16px'
          }} aria-hidden="true">🏡✨</div>
            <h2 style={{
            ...estils.titol,
            color: PALETA.garrofer,
            fontSize: '2.8rem'
          }}>
              Has tornat a casa
            </h2>
            <p style={{
            ...estils.subtitol,
            fontSize: MIDA_LLETRA.gran,
            color: PALETA.garroferFosc
          }}>
              La Masia et recordava. Totes les teues dades estan a salvo.
            </p>
            
            {missatge && <div style={{
            ...estils.missatgeEstat,
            ...estils.missatgeExit,
            marginTop: '24px'
          }}>
                {missatge.text}
              </div>}
            
            <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(90,143,78,0.1)',
            borderRadius: '12px',
            border: `2px solid ${PALETA.exit}`
          }}>
              <p style={{
              fontSize: MIDA_LLETRA.normal,
              color: PALETA.garroferFosc,
              margin: 0
            }}>
                <strong>Consell del Mestre:</strong> Imprimeix una nova Pedra Paper avui mateix. La prevenció és la millor pedra seca.
              </p>
            </div>
          </div>;
      case 6:
        // ERROR
        return <div className="anim-apareixer" style={{
          textAlign: 'center'
        }}>
            <div style={{
            fontSize: '4rem',
            marginBottom: '16px'
          }} aria-hidden="true">🪨💔</div>
            <h2 style={{
            ...estils.titol,
            color: PALETA.terra
          }}>
              La pedra s'ha esquerdat
            </h2>
            <p style={estils.subtitol}>
              Però no es trenca. Podem tornar-ho a intentar, o provar un altre camí.
            </p>
            
            {missatge && <div style={{
            ...estils.missatgeEstat,
            ...estils.missatgeError,
            marginTop: '24px'
          }}>
                {missatge.text}
              </div>}
            
            <button onClick={() => {
            setPas(0);
            setError(null);
            setMissatge(null);
          }} style={{
            ...estils.boto,
            ...estils.botoPrimari,
            marginTop: '24px'
          }} className="boto-pols">
              <span style={{
              fontSize: '2rem'
            }}>🔄</span>
              Tornar a començar
            </button>
            
            <button onClick={onCancelar} style={{
            ...estils.boto,
            ...estils.botoSecundari,
            marginTop: '12px'
          }}>
              <span style={{
              fontSize: '2rem'
            }}>🏠</span>
              Tornar a l'inici sense recuperar
            </button>
          </div>;
      default:
        return null;
    }
  };
  return <>
      <AnimacionsCSS />
      <main style={estils.pantalla} role="main" aria-label="Procés de recuperació de la Masia Eterna">
        <IndicadorPassos total={PASSES_TOTALS} actual={pas} completats={completats} />
        
        <div style={estils.tarja}>
          {renderPas()}
        </div>
        
        {/* Peu de pantalla amb context emocional sempre visible */}
        <footer style={{
        textAlign: 'center',
        marginTop: 'auto',
        paddingTop: '24px',
        fontSize: MIDA_LLETRA.menuda,
        color: PALETA.pedraHumida,
        fontStyle: 'italic'
      }}>
          <p style={{
          margin: '4px 0'
        }}>Masia Eterna — Sóc de Poble</p>
          <p style={{
          margin: '4px 0',
          fontSize: '0.9rem'
        }}>
            {pas < 5 ? 'Ningú es queda fora del Mas' : 'Benvingut a casa, Uelo'}
          </p>
        </footer>
      </main>
    </>;
}