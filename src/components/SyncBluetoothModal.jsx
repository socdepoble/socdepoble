import React, { useState } from 'react';
import * as Y from 'yjs';
import { Bluetooth, RefreshCw, CheckCircle2 } from 'lucide-react';
import { enviarDeltaBLE, rebreDeltaBLE } from '../services/bluetoothSync';

// UUIDs exclusius de l'ecosistema 'Sóc de Poble'
const RURAL_SERVICE_UUID = '0000cafe-0000-1000-8000-00805f9b34fb';
const YJS_SYNC_CHAR_UUID = '0000sync-0000-1000-8000-00805f9b34fb';

export default function SyncBluetoothModal({ ydoc, onClose }) {
  const hasBluetooth = typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  const [step, setStep] = useState(hasBluetooth ? 'idle' : 'no_support'); // idle, no_support, scanning, syncing, done, error
  const [log, setLog] = useState(hasBluetooth ? 'Acosta el telèfon a la Bústia o al veí i toca el botó.' : 'Navegador bloquejat');

  const iniciarXocDeTelefons = async () => {
    try {
      setStep('scanning');
      setLog('Buscant la bústia més propera...');

      // 1. EL GEST OBLIGATORI: El clic obre el selector natiu del SO
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [RURAL_SERVICE_UUID] }]
      });

      setStep('syncing');
      setLog(`Connectant amb: ${device.name || 'la Bústia del Poble'}...`);

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(RURAL_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(YJS_SYNC_CHAR_UUID);

      setLog('Passant les històries i records...');

      // 2. GOSSIP MANUAL (Dansa Yjs)
      // Extraiem el nostre estat per dir-li a la Bústia què sabem
      const localStateVector = Y.encodeStateVector(ydoc);
      
      // Enviem el nostre estat trossejat per la Muralla MTU (Límit de hardware)
      await enviarDeltaBLE(characteristic, localStateVector);

      // 3. RECEPCIÓ I FUSIÓ CRDT Asíncrona
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        rebreDeltaBLE(event, ydoc);
        setStep('done');
        setLog('Tot al dia! Heu compartit la memòria.');
      });
      await characteristic.startNotifications();

      
      // Feedback hàptic
      if (navigator.vibrate) vibrateSequence();

      server.disconnect();
      setTimeout(onClose, 3500); // Tanquem automàticament sense molestar

    } catch (err) {
      console.error('Fricció Bluetooth:', err);
      setStep('error');
      setLog('S\'ha perdut el fil. Apropa\'t una mica més i prova-ho de nou.');
    }
  };

  const vibrateSequence = () => {
    try {
        navigator.vibrate([100, 50, 100]);
    } catch {
        // Ignorar si no hi ha suport de vibració
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAF7F2] rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl border-4 border-[#8B5A2B]">
        <h2 className="text-4xl font-serif text-amber-950 mb-6 tracking-tight">Passar el Cabàs</h2>
        
        <p className="text-stone-700 mb-8 text-xl min-h-[4rem] font-medium leading-snug">{log}</p>

        {step === 'no_support' ? (
          <div className="w-full mx-auto rounded-3xl bg-red-100 border-2 border-red-500 p-6 shadow-inner text-red-900 mb-6 flex flex-col items-center">
            <h3 className="text-xl font-bold flex items-center justify-center gap-2 mb-3"><span className="text-2xl">🛡️</span> Escut Roig</h3>
            <p className="text-sm font-medium leading-relaxed">Apple bloqueja aquesta funcionalitat. Necessiteu Android, Chrome o Edge per emparellar.</p>
          </div>
        ) : step === 'idle' || step === 'error' ? (
          <button 
            onClick={iniciarXocDeTelefons}
            className="w-56 h-56 mx-auto rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center shadow-[0_10px_0_rgb(5,150,105)] active:shadow-[0_0px_0_rgb(5,150,105)] active:translate-y-2 transition-all"
          >
            <Bluetooth size={56} className="mb-3" />
            <span className="text-2xl font-bold">{step === 'error' ? 'Tornar a provar' : 'Connectar Ara'}</span>
          </button>
        ) : step === 'scanning' || step === 'syncing' ? (
          <div className="w-56 h-56 mx-auto rounded-full bg-amber-500 flex items-center justify-center shadow-inner">
            <RefreshCw size={72} className="text-white animate-spin-slow" />
          </div>
        ) : (
          <div className="w-56 h-56 mx-auto rounded-full bg-emerald-500 flex items-center justify-center shadow-inner animate-bounce">
            <CheckCircle2 size={88} className="text-white" />
          </div>
        )}

        <button onClick={onClose} className="mt-8 text-stone-500 font-bold underline text-lg p-2 active:text-stone-700">
          Ara no, gràcies
        </button>
      </div>
    </div>
  );
}
