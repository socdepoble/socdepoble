// src/components/ClauerDeLaTerreta.jsx
import React, { useState } from 'react';
// Importa les icones des de lucide-react si s'utilitzen, cal instal·lar: npm i lucide-react
import { KeyRound, ShieldCheck, Tractor, AlertTriangle } from 'lucide-react';
// import { webCryptoService } from '../utils/webCryptoService';

export default function ClauerDeLaTerreta({
  onMasiaRessuscitada
}) {
  const [paraules, setParaules] = useState(Array(12).fill(''));
  const [error, setError] = useState(false);
  const [treballant, setTreballant] = useState(false);
  const intentarObrirForrellat = async () => {
    setTreballant(true);
    setError(false);
    try {
      const llavor = paraules.map(p => p.toLowerCase().trim()).join(' ');
      // La picardia matemàtica: Transformem les paraules nostrades en una clau AES-GCM mestra
      // const cryptoKey = await webCryptoService.derivarClau(llavor);

      // Feedback d'Optimisme Tàctil (Llei del Retorn Immediat)
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

      // Simulem el procés pesat per a donar Tancament Cognitiu
      setTimeout(() => {
        onMasiaRessuscitada(/* cryptoKey */);
        setTreballant(false);
      }, 1000);
    } catch (e) {
      setError(true);
      setTreballant(false);
      if (navigator.vibrate) navigator.vibrate([200]); // Vibració d'error (Pols llarg i sec)
    }
  };
  return (
    <div className="max-w-2xl mx-auto bg-amber-50 dark:bg-neutral-900 p-8 rounded-mestre shadow-2xl border border-amber-200 dark:border-neutral-800 isolate">
        <div className="flex items-center gap-4 mb-8">
          <div className='w-16 h-16 bg-amber-200 dark:bg-amber-900/30 text-amber-700 dark:text-sdp-sdp-taronja rounded-2xl flex items-center justify-center shadow-inner'>
            <KeyRound size={32} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-amber-900 dark:text-amber-500">Tens les claus?</h2>
            <p className="text-amber-700/80 dark:text-neutral-400 font-medium mt-1">Sense servidors ni núvols. Només tu i la teua llibreta.</p>
          </div>
        </div>

        {error && <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-start gap-3 mb-6 animate-in slide-in-from-top-2">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p className="font-bold text-sm">Eixa clau no gira, xic. Segur que has copiat bé les 12 paraules de la terreta? Torna a mirar el paper.</p>
          </div>}

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paraules.map((p, i) => <div key={i} className="relative">
                <span className="absolute -top-2 -left-2 w-5 h-5 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-black rounded-full flex items-center justify-center z-10 border-2 border-white dark:border-neutral-800">
                  {i + 1}
                </span>
                <input type="text" value={p} onChange={e => {
              const noves = [...paraules];
              // Només lletres, res de caràcters estranys
              noves[i] = e.target.value.replace(/[^a-zA-Zçñàèéíòóúüï]/gi, '');
              setParaules(noves);
              setError(false);
            }} className='w-full bg-neutral-50 dark:bg-neutral-900 border-none px-3 py-3 rounded-xl focus:ring-2 focus:ring-amber-500 dark:focus:ring-sdp-sdp-taronja transition-all text-center font-mono font-bold tracking-wider outline-none text-neutral-800 dark:text-neutral-200' placeholder="..." autoComplete="off" spellCheck="false" />
              </div>)}
          </div>
        </div>

        <button onClick={intentarObrirForrellat} disabled={treballant || paraules.some(p => p.length < 2)} className='w-full flex justify-center items-center gap-2 bg-amber-600 dark:bg-sdp-sdp-taronja text-white hover:bg-amber-700 disabled:opacity-50 disabled:grayscale py-4 rounded-xl font-black uppercase tracking-widest text-lg transition-all active:scale-95 shadow-lg'>
          {treballant ? <Tractor className="animate-pulse" /> : <ShieldCheck />}
          {treballant ? 'Forçant el pany...' : 'Obrir la Masia'}
        </button>
      </div>
  );
}