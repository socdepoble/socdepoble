import { useState, useEffect } from 'react';
import { generateSafetyPhrase, speakSafetyPhrase } from '../lib/plazaHandshake';

export function PlazaHandshake({ myPublicKey, theirPublicKey, onConfirmed, onRejected }) {
  const [phrase, setPhrase] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    generateSafetyPhrase(myPublicKey, theirPublicKey).then(result => {
      setPhrase(result)
      // Leer en voz alta automáticamente — sin que el vecino tenga que buscar el botón
      speakSafetyPhrase(result.words)
    })
  }, [myPublicKey, theirPublicKey])

  if (!phrase) return <div className="text-center text-2xl p-8">Generant codi de seguretat...</div>

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-theme-bg">
      
      {/* Código grande — visible al sol */}
      <div className="text-center">
        <p className="text-lg text-theme-text/60 mb-4">Digues en veu alta al teu veí:</p>
        <div className="flex gap-4 flex-wrap justify-center">
          {phrase.words.map((word, i) => (
            <span key={i} className="text-4xl font-black uppercase tracking-widest text-[#F97316]">
              {word}
            </span>
          ))}
        </div>
        <p className="text-6xl font-mono font-black mt-6 tracking-[0.5em] text-theme-text">
          {phrase.code}
        </p>
      </div>

      {/* Instrucción simple */}
      <p className="text-2xl text-center text-theme-text max-w-sm">
        Si el teu veí veu les mateixes paraules i números: 
      </p>

      {/* Botones grandes — táctiles para manos de labrador */}
      <div className="flex gap-4 w-full max-w-sm">
        <button
          disabled={confirmed}
          onClick={() => { setConfirmed(true); onConfirmed(phrase.raw) }}
          className={`flex-1 text-white text-3xl font-black py-6 rounded-2xl transition-transform ${confirmed ? 'bg-gray-500 opacity-50' : 'bg-green-600 active:scale-95'}`}
        >
          {confirmed ? '⏳ ESPERANT...' : '✅ SÍ, COINCIDEIX'}
        </button>
        <button
          onClick={onRejected}
          className="flex-1 bg-red-600 text-white text-3xl font-black py-6 rounded-2xl active:scale-95 transition-transform"
        >
          ❌ NO
        </button>
      </div>

      {/* Botón de releer — para los que no oyeron */}
      <button
        onClick={() => speakSafetyPhrase(phrase.words)}
        className="text-xl text-theme-text/60 underline py-4"
      >
        🔊 Repetir en veu alta
      </button>
    </div>
  )
}
