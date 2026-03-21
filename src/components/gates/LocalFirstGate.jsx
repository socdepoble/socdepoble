import BrandLogo from "../BrandLogo";

import React, { useState, useEffect } from "react";
import { PowerSyncContext } from '@powersync/react';
import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from '../../powersync/schema';
import { SupabaseConnector } from '../../powersync/connector';

const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'socdepoble.db',
    vfs: 'OPFSCoopSyncVFS', 
  },
  flags: { enableMultiTabs: false }
});

const connector = new SupabaseConnector();

export default function LocalFirstGate({ children }) {
  const [isDbReady, setIsDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initWithTimeout = async () => {
      try {
        // En localhost OPFS es pot bloquejar si hi ha més d'una pestanya o RhizomeDB té el WriteLock
        const initPromise = db.init();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('TIMEOUT_OPFS')), 3500)
        );
        
        await Promise.race([initPromise, timeoutPromise]);
        await db.connect(connector);
        
        if (isMounted) setIsDbReady(true);
      } catch (err) {
        // Fallback resilient: si dóna timeout OPFS en dev, obrim portes igual per no bloquejar l'UI
        if (err.message === 'TIMEOUT_OPFS' || String(err).includes('OPFS')) {
             console.warn("⚠️ Bypass d'Emergència: OPFS bloquejat. Obrint portes sense persistència rica.");
             // No posem l'error per a que isDbReady tire cap avant
             if (isMounted) setIsDbReady(true);
        } else {
             console.error("Failed to initialize PowerSync:", err);
             if (isMounted) setError(err.message);
        }
      }
    };

    initWithTimeout();

    const handleOnline = () => {
      console.log('🧢 Tornem a tindre cobertura al Mas! Forçant sincronització PowerSync...');
      if (isMounted && db) {
        // Retry connection to ensure everything gets flushed immediately when online
        db.connect(connector).catch(console.error);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (error) {
    return (
      <div className="bg-[#111827] text-white min-h-screen flex items-center justify-center flex-col p-6 text-center">
        <h2 className="text-[#F97316] font-black text-2xl mb-4">
          Error Crític d'Emmagatzematge (PowerSync)
        </h2>
        <p className="mb-4">No hem pogut Muntar l'Arxiu Local.</p>
        <code className="text-sm bg-black p-3 rounded-[20px] mb-6">
          {error}
        </code>
        <button
          onClick={async () => {
            await db.disconnectAndClear();
            window.location.reload();
          }}
          className="bg-[#F97316] text-white font-bold py-3 px-6 rounded-[28px]"
        >
          Re-bategar el Sistema
        </button>
      </div>
    );
  }

  if (!isDbReady) {
    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col relative overflow-hidden"
        style={{ background: "#0b0b0b" }}
      >
        {/* Fons subtil abstracte */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00f2ff] opacity-[0.03] blur-[60px] rounded-full pointer-events-none"></div>

        <img
          src="/assets/master/logo-socdepoble-rect.svg"
          alt="Sóc de Poble"
          className="h-10 w-auto mb-8 opacity-80 animate-pulse"
          style={{ filter: "drop-shadow(0 0 10px rgba(0,242,255,0.3))" }}
        />

        <div className="flex justify-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80"></div>
          <div
            className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        <p className="font-['Inter_Tight',sans-serif] text-[#00f2ff] text-[12px] font-black uppercase tracking-[0.2em] opacity-70">
          Connectant...
        </p>
      </div>
    );
  }

  // Si no passem la DB, qualsevol component que cride a `usePowerSync()` petarà i llançarà
  // una pantalla negra a l'usuari. Sempre passem l'objecte, estiga actiu o siga un "dummy".
  return (
    <PowerSyncContext.Provider value={db}>
      {children}
    </PowerSyncContext.Provider>
  );
}
